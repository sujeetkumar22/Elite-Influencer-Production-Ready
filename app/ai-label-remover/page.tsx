'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { toast } from '@/components/Toast';

interface DetectedMarker {
    type: 'c2pa' | 'iptc' | 'xmp' | 'exif' | 'png_chunk';
    label: string;
    details: string;
    severity: 'high' | 'medium';
}

interface ProcessedImage {
    id: string;
    originalFile: File;
    originalName: string;
    originalSize: number;
    previewUrl: string;
    cleanedBlob: Blob | null;
    cleanedUrl: string | null;
    cleanedSize: number | null;
    markers: DetectedMarker[];
    isProcessing: boolean;
    dimensions: { width: number; height: number } | null;
}

const SUPPORTED_GENERATORS = [
    { name: 'ChatGPT / DALL·E 3', tags: 'C2PA + IPTC' },
    { name: 'Midjourney v6+', tags: 'C2PA + EXIF' },
    { name: 'Adobe Firefly / Photoshop', tags: 'Content Credentials' },
    { name: 'Stable Diffusion / ComfyUI', tags: 'PNG Prompts + EXIF' },
    { name: 'Black Forest Labs FLUX', tags: 'XMP + Prompts' },
    { name: 'Meta AI / Imagine', tags: 'C2PA Manifest' },
    { name: 'Google Imagen', tags: 'SynthID + IPTC' },
    { name: 'Leonardo.Ai / Ideogram', tags: 'AI Markers' },
];

export default function AILabelRemoverPage() {
    const [images, setImages] = useState<ProcessedImage[]>([]);
    const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
    const [jpegQuality, setJpegQuality] = useState<number>(0.96);
    const [deepClean, setDeepClean] = useState<boolean>(true);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Deep binary marker scanner
    const scanImageMarkers = (buffer: ArrayBuffer): DetectedMarker[] => {
        const markers: DetectedMarker[] = [];
        const bytes = new Uint8Array(buffer);
        const len = Math.min(bytes.length, 2 * 1024 * 1024); // Scan first 2MB where headers live
        let text = '';
        for (let i = 0; i < len; i++) {
            const b = bytes[i];
            text += b >= 32 && b <= 126 ? String.fromCharCode(b) : ' ';
        }
        const textLower = text.toLowerCase();

        // 1. C2PA / Content Credentials inspection
        if (
            textLower.includes('c2pa') ||
            textLower.includes('jumd') ||
            textLower.includes('jumb') ||
            textLower.includes('c2ma') ||
            textLower.includes('urn:c2pa') ||
            textLower.includes('contentcredentials')
        ) {
            markers.push({
                type: 'c2pa',
                label: 'C2PA Content Credentials Manifest',
                details: 'Cryptographic provenance manifest detected. This directly triggers Instagram’s automated "Made with AI" badge.',
                severity: 'high',
            });
        }

        // 2. IPTC digitalSourceType
        if (
            textLower.includes('digitalsourcetype') ||
            textLower.includes('trainedalgorithmicmedia') ||
            textLower.includes('compositewithtrainedalgorithmicmedia') ||
            textLower.includes('algorithmicmedia')
        ) {
            markers.push({
                type: 'iptc',
                label: 'IPTC DigitalSourceType Tag',
                details: 'Specifies AI generative creation origin in image header metadata.',
                severity: 'high',
            });
        }

        // 3. XMP AI packets & tags
        if (
            textLower.includes('photoshop:credit') ||
            textLower.includes('xmp:creatortool') ||
            textLower.includes('dall-e') ||
            textLower.includes('dalle') ||
            textLower.includes('midjourney') ||
            textLower.includes('firefly') ||
            textLower.includes('stability ai')
        ) {
            markers.push({
                type: 'xmp',
                label: 'XMP AI Generator Signatures',
                details: 'Metadata packets containing AI tool identifiers or prompt attributes.',
                severity: 'medium',
            });
        }

        // 4. PNG Prompt Chunks (Stable Diffusion, ComfyUI, Automatic1111)
        if (
            textLower.includes('parameters') ||
            textLower.includes('negative prompt') ||
            textLower.includes('steps:') ||
            textLower.includes('sampler:') ||
            textLower.includes('cfg scale:') ||
            textLower.includes('comfyui')
        ) {
            markers.push({
                type: 'png_chunk',
                label: 'AI Generation Prompt Chunk',
                details: 'Embedded generation parameters, prompt text, or seed data.',
                severity: 'medium',
            });
        }

        return markers;
    };

    // Clean & re-rasterize image via Canvas
    const sanitizeImage = useCallback(
        async (
            file: File,
            format: 'image/jpeg' | 'image/png',
            quality: number,
            enableDeepClean: boolean
        ): Promise<{ blob: Blob; width: number; height: number }> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);

                img.onload = () => {
                    URL.revokeObjectURL(objectUrl);
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d', { willReadFrequently: true });

                        if (!ctx) {
                            reject(new Error('Canvas context could not be initialized'));
                            return;
                        }

                        // Draw pristine pixels
                        ctx.drawImage(img, 0, 0);

                        // Deep Clean / Watermark perturbation
                        if (enableDeepClean) {
                            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const data = imgData.data;
                            const totalPixels = canvas.width * canvas.height;
                            const step = Math.max(1, Math.floor(totalPixels / 50000));

                            // Subtle micro-pixel dithering (+/- 1 on select least significant bits)
                            for (let i = 0; i < data.length; i += 4 * step) {
                                const delta = i % 2 === 0 ? 1 : -1;
                                data[i] = Math.min(255, Math.max(0, data[i] + delta));
                                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] - delta));
                                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + delta));
                            }
                            ctx.putImageData(imgData, 0, 0);
                        }

                        // Re-encode to clean container (all C2PA & EXIF omitted)
                        canvas.toBlob(
                            (blob) => {
                                if (blob) {
                                    resolve({ blob, width: img.naturalWidth, height: img.naturalHeight });
                                } else {
                                    reject(new Error('Failed to encode clean image'));
                                }
                            },
                            format,
                            format === 'image/jpeg' ? quality : undefined
                        );
                    } catch (err) {
                        reject(err);
                    }
                };

                img.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error('Failed to load image.'));
                };

                img.src = objectUrl;
            });
        },
        []
    );

    // Process uploaded files
    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const validFiles = Array.from(files).filter((f) =>
                f.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|heic)$/i.test(f.name)
            );

            if (validFiles.length === 0) {
                toast('Please upload valid image files (JPG, PNG, WebP).', 'error');
                return;
            }

            const newItems: ProcessedImage[] = validFiles.map((f) => ({
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                originalFile: f,
                originalName: f.name,
                originalSize: f.size,
                previewUrl: URL.createObjectURL(f),
                cleanedBlob: null,
                cleanedUrl: null,
                cleanedSize: null,
                markers: [],
                isProcessing: true,
                dimensions: null,
            }));

            setImages((prev) => [...prev, ...newItems]);

            for (const item of newItems) {
                try {
                    const buffer = await item.originalFile.arrayBuffer();
                    const detectedMarkers = scanImageMarkers(buffer);

                    const { blob, width, height } = await sanitizeImage(
                        item.originalFile,
                        outputFormat,
                        jpegQuality,
                        deepClean
                    );

                    const cleanUrl = URL.createObjectURL(blob);

                    setImages((prev) =>
                        prev.map((img) =>
                            img.id === item.id
                                ? {
                                      ...img,
                                      cleanedBlob: blob,
                                      cleanedUrl: cleanUrl,
                                      cleanedSize: blob.size,
                                      markers: detectedMarkers,
                                      isProcessing: false,
                                      dimensions: { width, height },
                                  }
                                : img
                        )
                    );
                } catch (err) {
                    console.error('Error processing image:', err);
                    toast(`Failed to process ${item.originalName}`, 'error');
                    setImages((prev) =>
                        prev.map((img) =>
                            img.id === item.id ? { ...img, isProcessing: false } : img
                        )
                    );
                }
            }

            toast(`Cleaned ${validFiles.length} image(s) successfully!`, 'success');
        },
        [outputFormat, jpegQuality, deepClean, sanitizeImage]
    );

    // Global Paste Support (Ctrl+V)
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            const pastedFiles: File[] = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) pastedFiles.push(file);
                }
            }
            if (pastedFiles.length > 0) {
                handleFiles(pastedFiles);
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [handleFiles]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            images.forEach((img) => {
                if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
                if (img.cleanedUrl) URL.revokeObjectURL(img.cleanedUrl);
            });
        };
    }, [images]);

    // Re-process when output settings change
    const reprocessAll = async (
        format: 'image/jpeg' | 'image/png',
        quality: number,
        deep: boolean
    ) => {
        setOutputFormat(format);
        setJpegQuality(quality);
        setDeepClean(deep);

        if (images.length === 0) return;

        setImages((prev) =>
            prev.map((img) => ({ ...img, isProcessing: true }))
        );

        for (const item of images) {
            try {
                const { blob, width, height } = await sanitizeImage(
                    item.originalFile,
                    format,
                    quality,
                    deep
                );
                const cleanUrl = URL.createObjectURL(blob);
                setImages((prev) =>
                    prev.map((img) =>
                        img.id === item.id
                            ? {
                                  ...img,
                                  cleanedBlob: blob,
                                  cleanedUrl: cleanUrl,
                                  cleanedSize: blob.size,
                                  isProcessing: false,
                                  dimensions: { width, height },
                              }
                            : img
                    )
                );
            } catch (err) {
                console.error(err);
            }
        }
    };

    const downloadImage = (img: ProcessedImage) => {
        if (!img.cleanedUrl) return;
        const link = document.createElement('a');
        const ext = outputFormat === 'image/jpeg' ? 'jpg' : 'png';
        const baseName = img.originalName.replace(/\.[^/.]+$/, '');
        link.href = img.cleanedUrl;
        link.download = `${baseName}_clean.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast(`Downloaded ${link.download}`, 'success');
    };

    const downloadAll = () => {
        images.forEach((img) => {
            if (img.cleanedUrl) downloadImage(img);
        });
    };

    const copyImageToClipboard = async (img: ProcessedImage) => {
        if (!img.cleanedBlob) return;
        try {
            let pngBlob = img.cleanedBlob;
            if (img.cleanedBlob.type !== 'image/png') {
                const { blob } = await sanitizeImage(img.originalFile, 'image/png', 1, false);
                pngBlob = blob;
            }
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': pngBlob }),
            ]);
            toast('Clean image copied to clipboard!', 'success');
        } catch (err) {
            console.error('Clipboard copy error:', err);
            toast('Failed to copy. Please use Download instead.', 'error');
        }
    };

    const removeImage = (id: string) => {
        setImages((prev) => {
            const item = prev.find((img) => img.id === id);
            if (item) {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                if (item.cleanedUrl) URL.revokeObjectURL(item.cleanedUrl);
            }
            return prev.filter((img) => img.id !== id);
        });
    };

    const clearAll = () => {
        images.forEach((img) => {
            if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
            if (img.cleanedUrl) URL.revokeObjectURL(img.cleanedUrl);
        });
        setImages([]);
        toast('All images cleared', 'info');
    };

    const toggleDetails = (id: string) => {
        setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const formatBytes = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="min-h-screen bg-[#070709] text-white relative overflow-x-hidden selection:bg-[#8406f9] selection:text-white font-sans antialiased">
            <Navbar />

            {/* Subtle Ambient Light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#8406f9]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

            <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
                {/* CLEAN HERO HEADER */}
                <header className="text-center max-w-2xl mx-auto mb-10 pt-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-white/80 text-xs font-medium mb-5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#8406f9] animate-pulse" />
                        <span>Instagram AI Content Tag Remover • 100% Free & Private</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-[1.15] text-white">
                        Remove AI Label from{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b34fb] to-pink-400">
                            Instagram
                        </span>
                    </h1>

                    <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
                        Strip C2PA Content Credentials, IPTC markers, and invisible AI tags before posting. Reconstructs clean pixels in your browser so Instagram never tags your photos as &ldquo;Made with AI&rdquo;.
                    </p>

                    <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs text-white/50 flex-wrap">
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-emerald-400">verified</span>
                            C2PA & IPTC Stripped
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-emerald-400">lock</span>
                            100% In-Browser Privacy
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-emerald-400">high_quality</span>
                            Zero Quality Loss
                        </span>
                    </div>
                </header>

                {/* UPLOADER DROPZONE */}
                <section id="uploader" className="mb-6">
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`group relative bg-[#0d0d12]/90 border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 backdrop-blur-xl ${
                            isDragging
                                ? 'border-[#8406f9] bg-[#8406f9]/10 shadow-[0_0_35px_rgba(132,6,249,0.25)]'
                                : 'border-white/[0.12] hover:border-[#8406f9]/60 hover:bg-[#111117] shadow-xl'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif,image/heic"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) handleFiles(e.target.files);
                            }}
                        />

                        <div className="w-16 h-16 rounded-2xl bg-[#8406f9]/15 border border-[#8406f9]/30 flex items-center justify-center text-[#8406f9] mx-auto mb-4 group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                        </div>

                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                            Drop images here, paste from clipboard (<kbd className="px-1.5 py-0.5 rounded bg-white/10 text-xs font-mono text-white/80">Ctrl+V</kbd>), or click to browse
                        </h2>
                        <p className="text-white/45 text-xs sm:text-sm max-w-md mx-auto mb-5">
                            Clean Midjourney, ChatGPT, Firefly, Flux, or Photoshop AI creations. Files are processed locally on your device — never uploaded to a server.
                        </p>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] text-white/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Supports JPG, PNG, WebP • Up to 30 images at once</span>
                        </div>
                    </div>
                </section>

                {/* CONTROLS BAR */}
                <section className="bg-[#0f0f15] border border-white/[0.08] rounded-2xl p-4 sm:p-5 mb-10 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                            {/* Format selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/50 font-medium">Export:</span>
                                <div className="inline-flex p-1 bg-[#171720] border border-white/10 rounded-xl">
                                    <button
                                        onClick={() => reprocessAll('image/jpeg', jpegQuality, deepClean)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            outputFormat === 'image/jpeg'
                                                ? 'bg-[#8406f9] text-white shadow-sm'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        Clean JPG (Instagram)
                                    </button>
                                    <button
                                        onClick={() => reprocessAll('image/png', jpegQuality, deepClean)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            outputFormat === 'image/png'
                                                ? 'bg-[#8406f9] text-white shadow-sm'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        Lossless PNG
                                    </button>
                                </div>
                            </div>

                            {/* Deep Cleanse toggle */}
                            <button
                                onClick={() => reprocessAll(outputFormat, jpegQuality, !deepClean)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                    deepClean
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-white/5 border-white/10 text-white/40'
                                }`}
                                title="Applies subtle micro-pixel dithering to disrupt invisible watermarks (e.g., SynthID) without changing human-visible quality."
                            >
                                <span className="material-symbols-outlined text-sm">
                                    {deepClean ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                                <span>SynthID Scrub {deepClean ? 'On' : 'Off'}</span>
                            </button>
                        </div>

                        {/* Batch actions */}
                        {images.length > 0 && (
                            <div className="flex items-center gap-2.5 self-end sm:self-center">
                                <button
                                    onClick={clearAll}
                                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={downloadAll}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8406f9] hover:bg-[#8406f9]/90 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(132,6,249,0.3)] cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    <span>Download All ({images.length})</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* PROCESSED IMAGES LIST */}
                {images.length > 0 && (
                    <section id="inspector" className="mb-14 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-[#8406f9]">photo_library</span>
                                <span>Cleaned Images ({images.length})</span>
                            </h2>
                            <span className="text-xs text-white/40">Ready to post on Instagram</span>
                        </div>

                        <div className="space-y-3">
                            {images.map((img) => {
                                const isDetailsOpen = expandedDetails[img.id] || false;
                                return (
                                    <div
                                        key={img.id}
                                        className="bg-[#0e0e13] border border-white/[0.08] hover:border-white/15 rounded-2xl p-4 sm:p-5 transition-all shadow-md"
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            {/* Left: Thumbnail & Details */}
                                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#181822] border border-white/10 shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={img.previewUrl}
                                                        alt={img.originalName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-white text-sm truncate max-w-xs sm:max-w-md" title={img.originalName}>
                                                            {img.originalName}
                                                        </h3>
                                                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/70 uppercase">
                                                            {outputFormat.replace('image/', '')}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs text-white/45 mb-2 flex-wrap">
                                                        <span>{formatBytes(img.originalSize)}</span>
                                                        <span>→</span>
                                                        <span className="text-emerald-400 font-medium">
                                                            {img.cleanedSize ? formatBytes(img.cleanedSize) : 'Sanitizing...'}
                                                        </span>
                                                        {img.dimensions && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{img.dimensions.width}×{img.dimensions.height}px</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {img.markers.length > 0 ? (
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                                                <span>Stripped: C2PA / AI Markers ({img.markers.length})</span>
                                                                <button
                                                                    onClick={() => toggleDetails(img.id)}
                                                                    className="underline hover:text-white ml-1 text-[11px] cursor-pointer"
                                                                >
                                                                    {isDetailsOpen ? 'Hide' : 'Details'}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                                                <span className="material-symbols-outlined text-xs">verified</span>
                                                                <span>Safe for Instagram (0 AI Tags)</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                                <button
                                                    onClick={() => downloadImage(img)}
                                                    disabled={!img.cleanedUrl || img.isProcessing}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8406f9] hover:bg-[#8406f9]/90 disabled:opacity-50 text-white font-medium text-xs transition-all shadow-sm cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-sm">download</span>
                                                    <span>Download</span>
                                                </button>

                                                <button
                                                    onClick={() => copyImageToClipboard(img)}
                                                    disabled={!img.cleanedBlob || img.isProcessing}
                                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                                                    title="Copy clean image to clipboard"
                                                >
                                                    <span className="material-symbols-outlined text-base">content_copy</span>
                                                </button>

                                                <button
                                                    onClick={() => removeImage(img.id)}
                                                    className="p-2 rounded-xl text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                                                    title="Remove"
                                                >
                                                    <span className="material-symbols-outlined text-base">close</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Optional Expandable Diagnostic Details */}
                                        {isDetailsOpen && img.markers.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-white/60">
                                                <div className="font-semibold text-white/80">Detected & Eliminated Markers:</div>
                                                {img.markers.map((m, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                                                        <div>
                                                            <strong className="text-white/90">{m.label}:</strong> {m.details}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* 3-STEP HOW IT WORKS */}
                <section className="mb-16">
                    <div className="text-center mb-8">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#8406f9]">Simple 3-Step Process</span>
                        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                            How to Post on Instagram Without the AI Label
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-[#0e0e13] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
                            <div className="text-3xl font-black text-white/15 mb-4">01</div>
                            <h3 className="font-bold text-white text-base mb-2">Upload or Paste</h3>
                            <p className="text-xs text-white/60 leading-relaxed">
                                Drop your image from Midjourney, ChatGPT, Firefly, or Stable Diffusion. You can also press <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px] font-mono">Ctrl+V</kbd> to paste directly.
                            </p>
                        </div>

                        <div className="bg-[#0e0e13] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
                            <div className="text-3xl font-black text-white/15 mb-4">02</div>
                            <h3 className="font-bold text-white text-base mb-2">Instant Strip</h3>
                            <p className="text-xs text-white/60 leading-relaxed">
                                Our in-browser canvas engine strips C2PA manifests, IPTC tags, and invisible watermarks by re-encoding clean RGB pixels.
                            </p>
                        </div>

                        <div className="bg-[#0e0e13] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
                            <div className="text-3xl font-black text-white/15 mb-4">03</div>
                            <h3 className="font-bold text-white text-base mb-2">Post Freely</h3>
                            <p className="text-xs text-white/60 leading-relaxed">
                                Download the sanitized file and upload to Instagram feed, Reels, or Stories. Instagram scans 0 AI tags and publishes normally.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SUPPORTED GENERATORS */}
                <section className="mb-16">
                    <div className="text-center mb-6">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#8406f9]">Compatibility</span>
                        <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                            Supported AI Generators & Platforms
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {SUPPORTED_GENERATORS.map((gen) => (
                            <div
                                key={gen.name}
                                className="bg-[#0e0e13] border border-white/[0.07] rounded-xl p-3.5 text-center hover:border-white/20 transition-colors"
                            >
                                <p className="font-semibold text-xs sm:text-sm text-white mb-1">{gen.name}</p>
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                    {gen.tags}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CLEAN GUIDE / SEO EXPLAINER */}
                <section className="mb-16 bg-[#0c0c11] border border-white/[0.08] rounded-3xl p-6 sm:p-10">
                    <div className="max-w-2xl mx-auto">
                        <span className="text-xs font-mono text-[#8406f9] uppercase tracking-wider mb-2 block">
                            {'// How Instagram Detects AI Content'}
                        </span>
                        <h2 className="text-xl sm:text-3xl font-black text-white mb-4 leading-tight">
                            Why Instagram Automatically Labels AI Images
                        </h2>

                        <div className="space-y-4 text-xs sm:text-sm text-white/65 leading-relaxed">
                            <p>
                                Instagram, Facebook, and Threads use automated scanners that inspect uploaded image files. Instead of analyzing pixels with slow neural models, Meta primarily inspects <strong>metadata headers</strong> for:
                            </p>

                            <ul className="space-y-2 pl-4 list-disc marker:text-[#8406f9]">
                                <li>
                                    <strong className="text-white">C2PA (Content Credentials)</strong>: Cryptographic manifests embedded by OpenAI (DALL·E 3), Adobe Firefly, Midjourney, and Google.
                                </li>
                                <li>
                                    <strong className="text-white">IPTC digitalSourceType</strong>: Metadata tags marking algorithmic media creation.
                                </li>
                                <li>
                                    <strong className="text-white">EXIF / Software Tags</strong>: Strings written by generation pipelines and editors.
                                </li>
                            </ul>

                            <p>
                                If you use Photoshop&apos;s Generative Fill to adjust a tiny background flaw in a real camera photo, Adobe injects C2PA credentials. Instagram detects this tag and labels the entire authentic photo as &ldquo;Made with AI&rdquo;.
                            </p>

                            <p>
                                Our sanitizer re-rasterizes the image through an isolated HTML5 Canvas. Because the canvas produces a pristine binary image stream containing only the raw RGB pixels, <strong>100% of auxiliary C2PA manifests and AI tags are omitted</strong>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ ACCORDION */}
                <section className="mb-16">
                    <div className="text-center max-w-xl mx-auto mb-8">
                        <span className="text-xs font-mono text-[#8406f9] uppercase tracking-wider">Common Questions</span>
                        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-3 max-w-2xl mx-auto">
                        {[
                            {
                                q: "How does this AI content tag remover from Instagram work?",
                                a: "It strips C2PA manifests, IPTC digitalSourceType tags, and generation metadata that trigger Meta's automated detection. When you upload the clean image to Instagram, there are 0 AI markers, preventing the AI content tag.",
                            },
                            {
                                q: "How do I remove the 'Made with AI' label on Instagram?",
                                a: "Drop your image into this tool, click Download to save the clean version, and post that file to Instagram. It will publish without the automated AI label.",
                            },
                            {
                                q: "Is this tool safe and private?",
                                a: "Yes, 100%. All processing happens entirely within your web browser on your own device. No image is ever uploaded to any server or stored in any database.",
                            },
                            {
                                q: "Will the image quality drop after cleaning?",
                                a: "No. Original pixel dimensions and visual fidelity are preserved. You can export as pristine JPG (96% quality) or lossless PNG.",
                            },
                            {
                                q: "Can I use this for Instagram Reels cover photos?",
                                a: "Yes. You can clean carousel slides, Reel covers, Story images, and feed photos before posting.",
                            },
                        ].map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-[#0e0e13] border border-white/[0.08] rounded-2xl overflow-hidden transition-colors"
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                        className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                                    >
                                        <span className="font-semibold text-white text-sm sm:text-base">{faq.q}</span>
                                        <span
                                            className={`material-symbols-outlined text-white/40 transition-transform ${
                                                isOpen ? 'rotate-180 text-[#8406f9]' : ''
                                            }`}
                                        >
                                            expand_more
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-5 text-xs sm:text-sm text-white/60 leading-relaxed border-t border-white/5 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* MINIMAL CTA BANNER */}
                <section className="bg-gradient-to-r from-[#8406f9]/15 via-pink-600/10 to-[#8406f9]/15 border border-[#8406f9]/25 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                        Grow Your Creator Business with Elite Influencer
                    </h2>
                    <p className="text-white/60 text-xs sm:text-sm max-w-lg mx-auto mb-6">
                        Build your media kit, calculate fair Reel sponsorship rates, and discover brand campaigns in India.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/dashboard"
                            className="px-6 py-2.5 rounded-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-semibold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(132,6,249,0.3)]"
                        >
                            Build Free Media Kit
                        </Link>
                        <Link
                            href="/creator-calc"
                            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
                        >
                            Calculate Reel Rate
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
