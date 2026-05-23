import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ProductImageProps {
    src: string | null | undefined;
    alt: string;
    className?: string;
    brandName?: string;
    minimal?: boolean;
}

export default function ProductImage({ src, alt, className = "w-full h-full object-cover", brandName, minimal = false }: ProductImageProps) {
    const [hasError, setHasError] = useState(false);

    // Reset error state if src changes
    useEffect(() => {
        setHasError(false);
    }, [src]);

    if (!src || hasError) {
        if (minimal) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-neutral-900 border border-stone-200/30 dark:border-neutral-900/30">
                    <Sparkles className="h-4 w-4 text-amber-700/30 dark:text-amber-500/30 animate-pulse" />
                </div>
            );
        }
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 dark:bg-neutral-900 border border-stone-200/50 dark:border-neutral-900/50 p-4 text-center">
                <Sparkles className="h-6 w-6 text-amber-700/40 dark:text-amber-500/40 mb-2 animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase font-serif text-neutral-400 block">
                    {brandName || 'Luxe Parfum'}
                </span>
                <span className="text-[9px] font-mono text-neutral-400 mt-1.5 max-w-[150px] truncate block">
                    {alt}
                </span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
            loading="lazy"
        />
    );
}
