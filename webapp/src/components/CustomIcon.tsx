"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CustomIconProps {
  type: 'bedroom' | 'bathroom' | 'livingroom' | 'garage';
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}

export function CustomIcon({ type, size = 24, className = '', fallback }: CustomIconProps) {
  const [iconPath, setIconPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Try to find an icon in the appropriate folder
    const checkForIcon = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // First, try to get available icons from the API
        const response = await fetch(`/api/icons/${type}`);
        if (response.ok) {
          const data = await response.json();
          if (data.icons && data.icons.length > 0) {
            // Use the first available icon
            setIconPath(data.icons[0].path);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('API not available, trying direct file check');
      }

      // Fallback: Common icon file names to try
      const possibleNames = [
        // Your specific naming pattern (prioritized)
        `icons8-${type === 'bedroom' ? 'bed' : type === 'livingroom' ? 'sofa' : type}-50.png`,
        `icons8-${type === 'bedroom' ? 'bed' : type === 'livingroom' ? 'sofa' : type}-100.png`,
        // Generic patterns
        `${type}.png`,
        `${type}.svg`,
        `${type}.jpg`,
        `${type}.jpeg`,
        `${type}.webp`,
        `icon-${type}.png`,
        `${type}-icon.png`,
        `${type}-white.png`,
        `${type}-black.png`,
        `icons8-${type}-50.png`,
        `icons8-${type}-100.png`,
        `icons8-${type}-50.svg`,
        `icons8-${type}-100.svg`
      ];

      for (const name of possibleNames) {
        try {
          const response = await fetch(`/icons/${type}/${name}`, { method: 'HEAD' });
          if (response.ok) {
            setIconPath(`/icons/${type}/${name}`);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          // Continue to next name
        }
      }
      
      // No custom icon found
      setHasError(true);
      setIsLoading(false);
    };

    checkForIcon();
  }, [type]);

  if (isLoading) {
    return (
      <div 
        className={`animate-pulse bg-gray-300 rounded ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (hasError || !iconPath) {
    return fallback || <DefaultIcon type={type} size={size} className={className} />;
  }

  return (
    <Image
      src={iconPath}
      alt={`${type} icon`}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

// Default SVG icons as fallback
function DefaultIcon({ type, size, className }: { type: string; size: number; className: string }) {
  const iconProps = {
    width: size,
    height: size,
    className: className,
    fill: 'currentColor',
    viewBox: '0 0 20 20'
  };

  switch (type) {
    case 'bedroom':
      return (
        <svg {...iconProps}>
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
      );
    case 'bathroom':
      return (
        <svg {...iconProps}>
          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"/>
        </svg>
      );
    case 'livingroom':
      return (
        <svg {...iconProps}>
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      );
    case 'garage':
      return (
        <svg {...iconProps}>
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4v-5h12v5zm0-7H4V5h12v3z" clipRule="evenodd"/>
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      );
  }
}
