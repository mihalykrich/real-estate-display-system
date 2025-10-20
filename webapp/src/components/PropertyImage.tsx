import Image from "next/image";

interface PropertyImageProps {
  src: string;
  alt: string;
  fallbackText: string;
  className?: string;
  fill?: boolean;
}

export function PropertyImage({ src, alt, fallbackText, className = "", fill = false }: PropertyImageProps) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center h-full text-gray-500 ${className}`}>
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          <p className="text-xs">{fallbackText}</p>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <Image 
        src={`/${src}`} 
        alt={alt}
        fill 
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <Image 
      src={`/${src}`} 
      alt={alt}
      width={300}
      height={300}
      className={`object-cover ${className}`}
    />
  );
}
