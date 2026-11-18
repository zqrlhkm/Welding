import { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'md' | 'sm';
}

export function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);
  const iconSize = size === 'sm' ? 'h-7 w-auto' : 'h-9 sm:h-10 w-auto';
  const textSize =
    size === 'sm'
      ? 'text-xs sm:text-sm'
      : 'text-xs sm:text-base max-w-[185px] sm:max-w-none truncate';

  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      {!imgError ? (
        <img
          src="/assets/aistudio/Logo_GIS_646a33dd.png"
          alt="Logo Akademi Kemahiran Kimpalan (GIS)"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`${iconSize} object-contain shrink-0`}
        />
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-slate-900 text-amber-400 font-extrabold text-xs shrink-0"
        >
          GIS
        </span>
      )}
      <span className={`font-extrabold tracking-tight text-slate-900 ${textSize}`}>
        Akademi Kemahiran Kimpalan (GIS)
      </span>
    </span>
  );
}
