import React from 'react';
import Link from 'next/link';

interface ArticleMarkdownProps {
    content: string;
}

export default function ArticleMarkdown({ content }: ArticleMarkdownProps) {
    if (!content) return null;

    // Split content by lines
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let isFirstParagraph = true;
    let listBuffer: string[] = [];

    const flushList = (keyPrefix: number) => {
        if (listBuffer.length > 0) {
            elements.push(
                <ul key={`list-${keyPrefix}`} className="space-y-3 my-6 pl-4 border-l-2 border-[#8406f9]/40 bg-white/[0.02] p-4 rounded-r-2xl">
                    {listBuffer.map((item, i) => (
                        <li key={i} className="text-white/80 leading-relaxed flex items-start gap-3">
                            <span className="text-[#8406f9] text-base mt-1">•</span>
                            <span className="flex-1">{parseInlineFormatting(item)}</span>
                        </li>
                    ))}
                </ul>
            );
            listBuffer = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
            flushList(index);
            return;
        }

        // Heading 2 (##)
        if (trimmed.startsWith('## ')) {
            flushList(index);
            elements.push(
                <h2
                    key={`h2-${index}`}
                    className="text-2xl md:text-3xl font-black text-white mt-12 mb-6 pt-6 border-t border-white/10 tracking-tight flex items-center gap-3"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8406f9] inline-block shadow-[0_0_10px_rgba(132,6,249,0.8)]"></span>
                    <span>{parseInlineFormatting(trimmed.replace(/^##\s+/, ''))}</span>
                </h2>
            );
            return;
        }

        // Heading 3 (###)
        if (trimmed.startsWith('### ')) {
            flushList(index);
            elements.push(
                <h3
                    key={`h3-${index}`}
                    className="text-xl md:text-2xl font-bold text-white/95 mt-8 mb-4 tracking-tight text-[#8406f9]"
                >
                    {parseInlineFormatting(trimmed.replace(/^###\s+/, ''))}
                </h3>
            );
            return;
        }

        // Bullet point item (- or *)
        if (/^[-*]\s+/.test(trimmed)) {
            listBuffer.push(trimmed.replace(/^[-*]\s+/, ''));
            return;
        }

        // Numbered list item (1. 2. etc)
        if (/^\d+\.\s+/.test(trimmed)) {
            flushList(index);
            elements.push(
                <div key={`num-${index}`} className="flex items-start gap-4 my-3 text-white/80">
                    <span className="w-7 h-7 rounded-full bg-[#8406f9]/20 border border-[#8406f9]/40 text-[#8406f9] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {trimmed.match(/^\d+/)?.[0]}
                    </span>
                    <p className="flex-1 leading-relaxed">{parseInlineFormatting(trimmed.replace(/^\d+\.\s+/, ''))}</p>
                </div>
            );
            return;
        }

        // Blockquote (> )
        if (trimmed.startsWith('> ')) {
            flushList(index);
            elements.push(
                <blockquote
                    key={`quote-${index}`}
                    className="my-8 p-6 bg-gradient-to-r from-[#8406f9]/10 to-transparent border-l-4 border-[#8406f9] rounded-r-2xl italic text-white/90 font-medium text-lg leading-relaxed shadow-lg"
                >
                    {parseInlineFormatting(trimmed.replace(/^>\s+/, ''))}
                </blockquote>
            );
            return;
        }

        // Horizontal divider (--- or ***)
        if (/^[-*_]{3,}$/.test(trimmed)) {
            flushList(index);
            elements.push(<hr key={`hr-${index}`} className="my-10 border-white/10" />);
            return;
        }

        // Standard paragraph
        flushList(index);
        if (isFirstParagraph) {
            isFirstParagraph = false;
            elements.push(
                <p key={`p-${index}`} className="mb-8 leading-relaxed text-white/95 text-lg md:text-xl font-normal">
                    {parseInlineFormatting(trimmed)}
                </p>
            );
        } else {
            elements.push(
                <p key={`p-${index}`} className="mb-6 leading-relaxed text-white/80 text-base md:text-lg font-light">
                    {parseInlineFormatting(trimmed)}
                </p>
            );
        }
    });

    flushList(lines.length);

    return <div className="space-y-2">{elements}</div>;
}

// Parses **bold**, *italic*, and [link](url)
function parseInlineFormatting(text: string): React.ReactNode {
    // Regex matches [text](url) OR **bold** OR *italic*
    const parts: React.ReactNode[] = [];
    const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        // Push preceding plain text
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        const token = match[0];
        if (token.startsWith('[') && token.includes('](')) {
            const linkText = token.slice(1, token.indexOf(']('));
            const linkHref = token.slice(token.indexOf('](') + 2, -1);
            const isExternal = linkHref.startsWith('http');
            parts.push(
                <Link
                    key={`link-${match.index}`}
                    href={linkHref}
                    target={isExternal ? '_blank' : undefined}
                    className="text-[#8406f9] font-semibold underline underline-offset-4 decoration-[#8406f9]/50 hover:decoration-[#8406f9] hover:text-[#9d35ff] transition-colors"
                >
                    {linkText}
                </Link>
            );
        } else if (token.startsWith('**') && token.endsWith('**')) {
            parts.push(
                <strong key={`b-${match.index}`} className="font-bold text-white">
                    {token.slice(2, -2)}
                </strong>
            );
        } else if (token.startsWith('*') && token.endsWith('*')) {
            parts.push(
                <em key={`i-${match.index}`} className="italic text-white/90">
                    {token.slice(1, -1)}
                </em>
            );
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length === 1 ? parts[0] : parts;
}
