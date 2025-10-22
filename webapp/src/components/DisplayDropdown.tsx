"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DisplayDropdownProps {
  currentDisplayId?: number;
}

export function DisplayDropdown({ currentDisplayId }: DisplayDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Generate display options (1-12)
  const displays = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    label: `Display ${i + 1}`,
    href: `/display/${i + 1}`
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract current display ID from pathname if not provided
  const currentId = currentDisplayId || (pathname.includes('/display/') ? 
    parseInt(pathname.split('/display/')[1]) : 1);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
      >
        <span>View Display</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            Select Display
          </div>
          {displays.map((display) => (
            <Link
              key={display.id}
              href={display.href}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${
                currentId === display.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span>{display.label}</span>
              {currentId === display.id && (
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Link>
          ))}
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <Link
              href="/admin"
              className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              Manage All Displays
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
