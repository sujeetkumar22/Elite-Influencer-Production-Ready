import type { Metadata } from "next";

const BASE_URL = "https://eliteinfluencer.in";

export const metadata: Metadata = {
    title: "Instagram AI Content Tag Remover | Remove 'Made with AI' & C2PA Metadata Free",
    description:
        "Free AI content tag remover from Instagram. Remove the 'Made with AI', 'AI info', and AI content tag from Instagram posts, Reels, and Stories by stripping C2PA Content Credentials, IPTC, and EXIF metadata in your browser.",
    alternates: { canonical: `${BASE_URL}/ai-label-remover` },
    keywords: [
        "ai content tag remover from instagram",
        "how to remove ai content tag from instagram",
        "remove ai content tag instagram",
        "instagram ai content tag remover",
        "remove ai tag instagram",
        "instagram ai tag remover",
        "remove ai label instagram",
        "how to remove made with ai on instagram",
        "instagram ai label remover",
        "remove ai info instagram",
        "remove ai generated tag instagram",
        "remove made with ai tag from instagram",
        "remove ai label from instagram post",
        "remove ai label from instagram reel",
        "how to post ai photos on instagram without ai label",
        "bypass instagram ai detection",
        "bypass instagram ai content label",
        "c2pa metadata remover instagram",
        "remove c2pa instagram",
        "strip ai metadata",
        "ai image metadata cleaner",
        "remove synthid watermark",
        "dall-e instagram ai label remover",
        "midjourney instagram ai label",
        "clean photo for instagram"
    ],
    openGraph: {
        title: "Instagram AI Content Tag Remover | Strip 'Made with AI' & C2PA Metadata",
        description:
            "Stop Instagram from flagging your posts with the AI content tag. Strip C2PA, IPTC, and invisible AI markers in your browser. 100% private, free, and instant.",
        url: `${BASE_URL}/ai-label-remover`,
        type: "website",
        images: [{ url: `${BASE_URL}/icon.png` }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Instagram AI Content Tag Remover | Remove 'Made with AI' Metadata Free",
        description:
            "Free AI content tag remover from Instagram. Strip C2PA Content Credentials, IPTC digitalSourceType, and EXIF AI tags so Instagram doesn't label your content.",
    },
};

const FAQS = [
    {
        q: "Why does Instagram add a 'Made with AI' or 'AI info' label to my posts?",
        a: "Meta (Instagram and Facebook) automatically scans uploaded images for industry-standard metadata markers, specifically C2PA (Content Credentials) manifests, IPTC digitalSourceType tags ('trainedAlgorithmicMedia'), and EXIF software tags. Even if you only used subtle generative fill or minor AI retouching on a real photo, platforms detect these tags and automatically attach the AI label.",
    },
    {
        q: "How does this tool remove the Instagram AI label?",
        a: "Our tool processes your image entirely within your browser using HTML5 Canvas re-rasterization. It strips all C2PA binary manifests, XMP packets, IPTC headers, and EXIF generation prompt comments. It also applies an imperceptible micro-pixel perturbation to disrupt fragile invisible watermarks (like SynthID) without altering human-visible image quality.",
    },
    {
        q: "Are my photos uploaded to your servers or stored in any database?",
        a: "No, never. All metadata scanning, pixel re-rasterization, and sanitization happens 100% locally on your own device inside your browser. No files are ever uploaded to our servers, ensuring complete privacy for creators and confidential campaign assets.",
    },
    {
        q: "Will this degrade the visual quality or resolution of my photo?",
        a: "No. The pixel dimensions and visual clarity remain untouched. You can export as a maximum-quality pristine JPEG (up to 100% quality) or a lossless PNG. The image will look completely identical to the human eye while being 100% free of AI metadata.",
    },
    {
        q: "Which AI tools and generators are supported?",
        a: "All of them. Our tool removes C2PA and metadata markers from ChatGPT (DALL·E 3), Midjourney (v6+), Stable Diffusion / ComfyUI, Flux, Adobe Firefly / Photoshop Generative Fill, Bing Image Creator, Google Imagen, Meta AI, Leonardo.ai, and Ideogram.",
    },
    {
        q: "Can I clean multiple images at once for an Instagram carousel?",
        a: "Yes! You can drag and drop multiple images simultaneously. The tool will scan, sanitize, and prepare each image in seconds, allowing you to download them individually or in bulk.",
    },
];

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Instagram AI Content Tag Remover",
        alternateName: "AI Content Tag Remover from Instagram",
        url: `${BASE_URL}/ai-label-remover`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5 Canvas.",
        description:
            "Free AI content tag remover from Instagram. Removes C2PA Content Credentials, IPTC digitalSourceType, XMP packets, and EXIF AI tags to prevent automated 'Made with AI' and AI content tags on Instagram, TikTok, and Meta platforms.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        publisher: { "@type": "Organization", name: "Elite Influencer", url: BASE_URL },
    },
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Remove the AI Content Tag from Instagram Photos",
        description: "A step-by-step guide to removing the AI content tag from Instagram by stripping C2PA metadata and invisible AI markers before uploading.",
        step: [
            {
                "@type": "HowToStep",
                name: "Upload or Drop Your Image",
                text: "Drag and drop your AI-generated or AI-edited image (JPG, PNG, WebP) into the AI Label Remover tool.",
                url: `${BASE_URL}/ai-label-remover#uploader`,
            },
            {
                "@type": "HowToStep",
                name: "Review Detected AI Metadata",
                text: "The scanner automatically detects C2PA manifests, IPTC digitalSourceType tags, and generator signatures.",
                url: `${BASE_URL}/ai-label-remover#inspector`,
            },
            {
                "@type": "HowToStep",
                name: "Download Clean, Safe Image",
                text: "Click Download. All AI tags are stripped and re-rasterized. Post the clean file to Instagram without getting flagged.",
                url: `${BASE_URL}/ai-label-remover#download`,
            },
        ],
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    },
];

export default function AILabelRemoverLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
