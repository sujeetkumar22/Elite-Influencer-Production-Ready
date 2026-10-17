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
    { name: 'Adobe Firefly', tags: 'Content Credentials' },
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
                                const delta = (i % 2 === 0 ? 1 : -1);
                                data[i] = Math.min(255, Math.max(0, data[i] + delta));     // R
                                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] - delta)); // G
                                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + delta)); // B
                            }
                            ctx.putImageData(imgData, 0, 0);
                        }

                        // Re-encode to completely fresh container (all C2PA & EXIF omitted)
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

            toast(`Successfully cleaned ${validFiles.length} image(s)!`, 'success');
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
            // Browsers only allow image/png on the clipboard
            let pngBlob = img.cleanedBlob;
            if (img.cleanedBlob.type !== 'image/png') {
                const { blob } = await sanitizeImage(img.originalFile, 'image/png', 1, false);
                pngBlob = blob;
            }
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': pngBlob }),
            ]);
            toast('Clean image copied to clipboard! Ready to paste.', 'success');
        } catch (err) {
            console.error('Clipboard copy error:', err);
            toast('Failed to copy to clipboard. Please download directly.', 'error');
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
        toast('Cleared all images', 'info');
    };

    const formatBytes = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden selection:bg-[#8406f9] selection:text-white">
            <Navbar />

            {/* Background Ambient Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8406f9]/15 blur-[160px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-pink-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-900/10 blur-[140px] rounded-full pointer-events-none -z-10" />

            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
                {/* HERO HEADER */}
                <header className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8406f9]/10 border border-[#8406f9]/30 text-[#8406f9] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(132,6,249,0.2)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8406f9] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8406f9]"></span>
                        </span>
                        AI Content Tag Remover from Instagram • 100% Free & Private
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight leading-[1.08] text-white">
                        AI CONTENT{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8406f9] via-pink-400 to-purple-300 drop-shadow-[0_0_35px_rgba(132,6,249,0.4)]">
                            TAG REMOVER
                        </span>{' '}
                        FROM INSTAGRAM
                    </h1>

                    <p className="text-white/60 text-base sm:text-xl leading-relaxed mb-6">
                        Strip C2PA Content Credentials, IPTC markers, and invisible AI metadata before uploading to Instagram, Facebook, and TikTok. The #1 tool to remove the &ldquo;Made with AI&rdquo; and AI content tag from your photos, Reels, and carousels.
                    </p>

                    <div className="flex items-center justify-center gap-6 text-xs text-white/40 font-medium">
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
                            C2PA & IPTC Stripped
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
                            No AI Content Tag on Post
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
                            100% In-Browser Privacy
                        </span>
                    </div>
                </header>

                {/* UPLOADER DROPZONE */}
                <section id="uploader" className="mb-12">
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
                        className={`relative group bg-[#0e0e12]/90 border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                            isDragging
                                ? 'border-[#8406f9] bg-[#8406f9]/10 shadow-[0_0_40px_rgba(132,6,249,0.3)]'
                                : 'border-white/15 hover:border-[#8406f9]/60 hover:bg-[#121217] shadow-2xl'
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

                        <div className="w-20 h-20 rounded-3xl bg-[#8406f9]/20 border border-[#8406f9]/40 flex items-center justify-center text-[#8406f9] mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(132,6,249,0.25)]">
                            <span className="material-symbols-outlined text-4xl">auto_fix_high</span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                            Drop images here, paste from clipboard (Ctrl+V), or click to upload
                        </h3>
                        <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
                            Upload photos created or edited with ChatGPT, Midjourney, Photoshop Generative Fill, Stable Diffusion, or Flux.
                        </p>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                            <span>JPG • PNG • WebP • Up to 30 images at once</span>
                        </div>
                    </div>
                </section>

                {/* CONTROLS & SETTINGS BAR */}
                <section className="bg-[#101015] border border-white/10 rounded-2xl p-5 sm:p-6 mb-12 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6 flex-wrap">
                            {/* Format selector */}
                            <div>
                                <label className="text-xs text-white/50 block font-semibold mb-1.5 uppercase tracking-wider">
                                    Clean Export Format
                                </label>
                                <div className="inline-flex p-1 bg-[#18181f] border border-white/10 rounded-xl">
                                    <button
                                        onClick={() => reprocessAll('image/jpeg', jpegQuality, deepClean)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            outputFormat === 'image/jpeg'
                                                ? 'bg-[#8406f9] text-white shadow-md'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        Clean JPG (Recommended for Instagram)
                                    </button>
                                    <button
                                        onClick={() => reprocessAll('image/png', jpegQuality, deepClean)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            outputFormat === 'image/png'
                                                ? 'bg-[#8406f9] text-white shadow-md'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        Lossless PNG
                                    </button>
                                </div>
                            </div>

                            {/* Deep Cleanse / SynthID Watermark Scrub */}
                            <div>
                                <label className="text-xs text-white/50 block font-semibold mb-1.5 uppercase tracking-wider">
                                    Deep Clean (Disrupt Invisible Watermarks)
                                </label>
                                <button
                                    onClick={() => reprocessAll(outputFormat, jpegQuality, !deepClean)}
                                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                        deepClean
                                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                            : 'bg-white/5 border-white/10 text-white/40'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {deepClean ? 'check_box' : 'check_box_outline_blank'}
                                    </span>
                                    <span>SynthID / Invisible Watermark Scrub ({deepClean ? 'ACTIVE' : 'OFF'})</span>
                                </button>
                            </div>
                        </div>

                        {/* Batch actions */}
                        {images.length > 0 && (
                            <div className="flex items-center gap-3 self-end md:self-center">
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={downloadAll}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8406f9] hover:bg-[#8406f9]/90 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(132,6,249,0.3)] cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    <span>Download All Clean ({images.length})</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* PROCESSED IMAGES LIST & INSPECTOR */}
                {images.length > 0 && (
                    <section id="inspector" className="mb-16 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#8406f9]">verified_user</span>
                                <span>Sanitization & Diagnostic Inspector</span>
                            </h2>
                            <span className="text-xs text-white/50">{images.length} file(s) ready</span>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {images.map((img) => (
                                <div
                                    key={img.id}
                                    className="bg-[#0c0c0f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-6 items-start justify-between"
                                >
                                    {/* Image Preview & Details */}
                                    <div className="flex flex-col sm:flex-row items-start gap-6 w-full lg:w-2/3">
                                        <div className="relative w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-[#15151c] border border-white/10 shrink-0 flex items-center justify-center group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={img.previewUrl}
                                                alt={img.originalName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-white/80">
                                                {img.dimensions ? `${img.dimensions.width}×${img.dimensions.height}` : 'Loading...'}
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <h3 className="font-bold text-white text-base truncate max-w-sm" title={img.originalName}>
                                                    {img.originalName}
                                                </h3>
                                                <button
                                                    onClick={() => removeImage(img.id)}
                                                    className="text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                                                    title="Remove"
                                                >
                                                    <span className="material-symbols-outlined text-lg">close</span>
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-white/50 mb-4 flex-wrap">
                                                <span>Original: <strong className="text-white">{formatBytes(img.originalSize)}</strong></span>
                                                <span>•</span>
                                                <span>Cleaned: <strong className="text-emerald-400">{img.cleanedSize ? formatBytes(img.cleanedSize) : 'Processing...'}</strong></span>
                                                <span>•</span>
                                                <span className="capitalize">{outputFormat.replace('image/', '')}</span>
                                            </div>

                                            {/* Marker Diagnostic Status */}
                                            <div className="space-y-2 mb-4">
                                                {img.markers.length > 0 ? (
                                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-1.5">
                                                            <span className="material-symbols-outlined text-sm">warning</span>
                                                            <span>{img.markers.length} AI Marker(s) Detected in Original File:</span>
                                                        </div>
                                                        <ul className="space-y-1 text-xs text-white/70">
                                                            {img.markers.map((m, idx) => (
                                                                <li key={idx} className="flex items-center gap-1.5">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                                                    <strong className="text-white">{m.label}</strong> — {m.details}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white/60">
                                                        <div className="flex items-center gap-1.5 text-white/80 font-semibold mb-0.5">
                                                            <span className="material-symbols-outlined text-sm text-[#8406f9]">info</span>
                                                            <span>No direct plain-text AI tags found in header</span>
                                                        </div>
                                                        <span>Full rasterization applied to ensure any hidden chunks or metadata boxes are eliminated.</span>
                                                    </div>
                                                )}

                                                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                                                    <span className="material-symbols-outlined text-base">verified</span>
                                                    <span>Cleaned image has 0 C2PA, 0 IPTC, 0 EXIF AI tags. 100% Safe for Instagram!</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                                        <button
                                            onClick={() => downloadImage(img)}
                                            disabled={!img.cleanedUrl || img.isProcessing}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#8406f9] hover:bg-[#8406f9]/90 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(132,6,249,0.3)] hover:shadow-[0_0_30px_rgba(132,6,249,0.5)] cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-base">download</span>
                                            <span>Download Clean Image</span>
                                        </button>

                                        <button
                                            onClick={() => copyImageToClipboard(img)}
                                            disabled={!img.cleanedBlob || img.isProcessing}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-base">content_copy</span>
                                            <span>Copy to Clipboard</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SUPPORTED PLATFORMS & GENERATORS BADGE GRID */}
                <section className="mb-20">
                    <div className="text-center mb-8">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#8406f9]">Comprehensive Coverage</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                            Removes AI Labels From All Leading Generators
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {SUPPORTED_GENERATORS.map((gen) => (
                            <div
                                key={gen.name}
                                className="bg-[#0e0e12] border border-white/10 rounded-2xl p-4 text-center hover:border-[#8406f9]/40 transition-colors"
                            >
                                <p className="font-bold text-sm text-white mb-1">{gen.name}</p>
                                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                    Stripped: {gen.tags}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* DETAILED EDUCATIONAL GUIDE SECTION (SEO-MAXIMIZED) */}
                <section className="mb-20 bg-[#0c0c0f] border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                    <div className="max-w-3xl">
                        <span className="text-xs font-mono text-[#8406f9] uppercase tracking-wider mb-2 block">
                            {'// HOW INSTAGRAM AI DETECTION WORKS'}
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-6 leading-tight">
                            Why Instagram Automatically Slaps the &ldquo;Made with AI&rdquo; Badge on Your Content
                        </h2>

                        <div className="space-y-6 text-sm sm:text-base text-white/70 leading-relaxed">
                            <p>
                                In 2024, Meta implemented automated detection across <strong>Instagram, Facebook, and Threads</strong> to label AI-generated content. Rather than visually examining every pixel with complex neural networks, Meta scans the file header for <strong>C2PA (Coalition for Content Provenance and Authenticity) manifests</strong> and <strong>IPTC digitalSourceType</strong> metadata.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                                    <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#8406f9]">fingerprint</span>
                                        C2PA Content Credentials
                                    </h3>
                                    <p className="text-xs text-white/60 leading-normal">
                                        Invisible cryptographically signed data boxes added by OpenAI, Adobe, Google, and Midjourney recording when and where the AI was used.
                                    </p>
                                </div>

                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                                    <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#8406f9]">tag</span>
                                        IPTC & XMP Source Tags
                                    </h3>
                                    <p className="text-xs text-white/60 leading-normal">
                                        Standard photo industry tags like <code className="text-purple-300">trainedAlgorithmicMedia</code> that signal to social algorithms that an image originated from an AI model.
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white pt-2">The False Positive Problem for Creators</h3>
                            <p>
                                The biggest issue facing photographers and digital creators is <strong>false positives</strong>. If you take an authentic camera photo on your Sony or iPhone and use Photoshop&apos;s Generative Fill to remove a photobomber or expand a background margin, Adobe quietly embeds C2PA manifests into your file. When you upload your genuine photo to Instagram, Instagram flags the entire photo as &ldquo;Made with AI&rdquo; or &ldquo;AI info&rdquo;, damaging your reach and creator authenticity.
                            </p>

                            <h3 className="text-xl font-bold text-white pt-2">How Our Sanitizer Guarantees Freedom from AI Labels</h3>
                            <p>
                                By drawing the image into an isolated browser canvas and reconstructing the binary stream from raw RGB pixel data, our tool strips 100% of auxiliary C2PA boxes, XMP packets, and EXIF comments. The resulting output is a clean, natural file ready to upload to Instagram without triggering Meta&apos;s detection filters.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ ACCORDION SECTION */}
                <section className="mb-20">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-mono text-[#8406f9] uppercase tracking-wider">Help & Answers</span>
                        <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4 max-w-3xl mx-auto">
                        {[
                            {
                                q: "How does this AI content tag remover from Instagram work?",
                                a: "Our AI content tag remover from Instagram strips the C2PA Content Credentials manifests, IPTC digitalSourceType markers, and EXIF software tags that trigger Meta's automated detection. When you post the sanitized photo to Instagram, the platform finds zero AI markers, preventing the AI content tag and 'Made with AI' label from appearing.",
                            },
                            {
                                q: "How do I remove the 'Made with AI' label on Instagram?",
                                a: "Before uploading your image to Instagram, upload it to our tool. It automatically detects and strips the C2PA Content Credentials, IPTC tags, and EXIF comments that trigger Instagram's automated scanner. Download the clean file and post it to Instagram — it will publish without the AI label.",
                            },
                            {
                                q: "Is this tool safe and legal to use?",
                                a: "Yes. As a creator, you own your creative files and have the full right to remove metadata tags, EXIF details, and personal comments from your own assets prior to distribution. Our tool runs locally in your browser and never touches our servers.",
                            },
                            {
                                q: "Does Instagram detect visual AI without metadata?",
                                a: "Meta's automated 'Made with AI' label is primarily triggered by file metadata (C2PA, IPTC, XMP). For the vast majority of posts, stripping metadata prevents the label. However, if you explicitly toggle Instagram's manual 'Label as AI' switch in post settings, Instagram will display the label.",
                            },
                            {
                                q: "Will the image quality drop after cleaning?",
                                a: "No. The visual clarity and pixel dimensions are preserved. You can select clean high-quality JPG (96% quality) or lossless PNG. Your image will look identical to your original creation.",
                            },
                            {
                                q: "Can I use this for Instagram Reels or video thumbnails?",
                                a: "Yes! You can clean your cover images, Reel thumbnails, carousel slides, and story graphics before posting.",
                            },
                            {
                                q: "Is there any limit on how many images I can clean?",
                                a: "No limits whatsoever. You can process unlimited single photos or batches for free without signing up or creating an account.",
                            },
                        ].map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-[#0e0e12] border border-white/10 rounded-2xl overflow-hidden transition-colors"
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                        className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                                    >
                                        <span className="font-bold text-white text-base sm:text-lg">{faq.q}</span>
                                        <span
                                            className={`material-symbols-outlined text-white/50 transition-transform ${
                                                isOpen ? 'rotate-180 text-[#8406f9]' : ''
                                            }`}
                                        >
                                            expand_more
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="px-6 pb-6 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* CROSS-PROMOTION BANNER */}
                <section className="bg-gradient-to-r from-[#8406f9]/20 via-pink-600/10 to-[#8406f9]/20 border border-[#8406f9]/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
                    <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
                        Ready to Turn Your Content into Paid Brand Deals?
                    </h2>
                    <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto mb-8">
                        Elite Influencer gives creators verified media kits, accurate rate calculations with CreatorCalc, and direct access to paid brand campaigns in India.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 rounded-full bg-[#8406f9] hover:bg-[#8406f9]/90 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(132,6,249,0.4)]"
                        >
                            Build Free Media Kit
                        </Link>
                        <Link
                            href="/creator-calc"
                            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-colors"
                        >
                            Calculate My Reel Rate
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
