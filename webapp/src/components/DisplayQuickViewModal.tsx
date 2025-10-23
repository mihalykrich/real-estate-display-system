"use client";
import { useState, useEffect } from 'react';
import { PropertyImage } from '@/components/PropertyImage';
import { ImageCarousel } from '@/components/ImageCarousel';
import { CustomIcon } from '@/components/CustomIcon';

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  
  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

interface DisplayData {
  id: number;
  address: string | null;
  location: string | null;
  price: string | null;
  priceType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  garage: number | null;
  propertyType: string | null;
  description: string | null;
  features: string | null;
  mainImage: string | null;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  qrCodePath: string | null;
  contactNumber: string | null;
  email: string | null;
  sidebarColor: string | null;
  sidebarPosition: string | null;
  showCompanyLogo: boolean | null;
  companyLogoPath: string | null;
  carouselEnabled: boolean | null;
  carouselDuration: number | null;
  carouselTransition: string | null;
}

interface DisplayQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayId: number;
}

export function DisplayQuickViewModal({ isOpen, onClose, displayId }: DisplayQuickViewModalProps) {
  const [display, setDisplay] = useState<DisplayData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && displayId) {
      fetchDisplayData();
    }
  }, [isOpen, displayId]);

  const fetchDisplayData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/display/${displayId}`);
      if (response.ok) {
        const data = await response.json();
        setDisplay(data);
      }
    } catch (error) {
      console.error('Error fetching display data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading display preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!display) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Display Preview</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">Display not found or no data available.</p>
          </div>
        </div>
      </div>
    );
  }

  // Parse features from text (one per line)
  const features = display.features ? display.features.split('\n').filter(f => f.trim()) : [];
  const sidebarPosition = display.sidebarPosition || 'left';


  // Sidebar content component
  const SidebarContent = () => {
    // Special layout for bottom sidebar
    if (sidebarPosition === 'bottom') {
      return (
        <div 
          className="text-white p-2 lg:p-3"
          style={{ 
            background: `linear-gradient(to bottom, ${display.sidebarColor || '#7C3AED'}, ${adjustColor(display.sidebarColor || '#7C3AED', -20)})` 
          }}
        >
          {/* Header Section */}
          <div className="mb-2">
            <h1 className="text-sm lg:text-base font-bold mb-1">
              {display.address || "Property Address"}
            </h1>
            <h2 className="text-xs lg:text-sm font-semibold mb-1">
              {display.location || "Location"}
            </h2>
            <div className="text-lg lg:text-xl font-bold">
              {display.price || "£0"} {display.priceType && (
                <span className="text-xs font-normal">{display.priceType}</span>
              )}
            </div>
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-3">
            
            {/* Column 1: Property Features Icons */}
            <div className="flex flex-col justify-center">
              {(display.bedrooms || display.bathrooms || display.livingroom || display.garage) && (
                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                  {display.bedrooms && (
                    <div className="flex items-center gap-1">
                      <CustomIcon type="bedroom" size={14} className="text-white" />
                      <span className="text-xs font-semibold">{display.bedrooms}</span>
                    </div>
                  )}
                  {display.bathrooms && (
                    <div className="flex items-center gap-1">
                      <CustomIcon type="bathroom" size={14} className="text-white" />
                      <span className="text-xs font-semibold">{display.bathrooms}</span>
                    </div>
                  )}
                  {display.livingroom && (
                    <div className="flex items-center gap-1">
                      <CustomIcon type="livingroom" size={14} className="text-white" />
                      <span className="text-xs font-semibold">{display.livingroom}</span>
                    </div>
                  )}
                  {display.garage && (
                    <div className="flex items-center gap-1">
                      <CustomIcon type="garage" size={14} className="text-white" />
                      <span className="text-xs font-semibold">{display.garage}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Column 2: Description */}
            <div className="flex flex-col justify-center">
              {display.description && (
                <div>
                  <p className="text-xs leading-relaxed opacity-90 line-clamp-2">
                    {display.description}
                  </p>
                </div>
              )}
              
              {/* Key Features */}
              {features.length > 0 && (
                <div className="mt-1">
                  <h3 className="text-xs font-semibold mb-1 uppercase tracking-wide">Key Features</h3>
                  <ul className="space-y-0.5">
                    {features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="text-xs opacity-90">
                        • {feature.trim()}
                      </li>
                    ))}
                    {features.length > 2 && (
                      <li className="text-xs opacity-70">
                        +{features.length - 2} more...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Column 3: QR Code and Company Logo */}
            <div className="flex flex-col justify-center items-center">
              {(() => {
                const showQrCode = display.showQrCode && display.qrCodePath;
                const showCompanyLogo = display.showCompanyLogo && display.companyLogoPath;
                
                if (!showQrCode && !showCompanyLogo) return null;
                
                // If only one item is enabled, center it
                if (showQrCode && !showCompanyLogo) {
                  return (
                    <div className="text-center">
                      <h3 className="text-xs font-semibold mb-1 opacity-90">Scan for more information</h3>
                      <div className="w-10 h-10 relative bg-white rounded shadow p-1">
                        <PropertyImage 
                          src={`uploads/${displayId}/${display.qrCodePath}`}
                          alt="QR Code"
                          fallbackText="QR Code"
                          fill={true}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  );
                }
                
                if (!showQrCode && showCompanyLogo) {
                  return (
                    <div className="text-center">
                      <div className="w-20 h-5 relative">
                        <PropertyImage 
                          src={`uploads/${displayId}/${display.companyLogoPath}`}
                          alt="Company Logo"
                          fallbackText="Logo"
                          fill={true}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  );
                }
                
                // If both are enabled, show them vertically stacked
                return (
                  <div className="text-center space-y-1">
                    <div>
                      <h3 className="text-xs font-semibold mb-1 opacity-90">Scan for more information</h3>
                      <div className="w-8 h-8 relative bg-white rounded shadow p-1 mx-auto">
                        <PropertyImage 
                          src={`uploads/${displayId}/${display.qrCodePath}`}
                          alt="QR Code"
                          fallbackText="QR Code"
                          fill={true}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="w-16 h-4 relative mx-auto">
                        <PropertyImage 
                          src={`uploads/${displayId}/${display.companyLogoPath}`}
                          alt="Company Logo"
                          fallbackText="Logo"
                          fill={true}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      );
    }

    // Default layout for left/right sidebars
    return (
      <div 
        className="text-white p-3 lg:p-4 flex flex-col"
        style={{ 
          background: `linear-gradient(to bottom, ${display.sidebarColor || '#7C3AED'}, ${adjustColor(display.sidebarColor || '#7C3AED', -20)})` 
        }}
      >
        {/* Header Section */}
        <div className="mb-3">
          <h1 className="text-lg lg:text-xl font-bold mb-1">
            {display.address || "Property Address"}
          </h1>
          <h2 className="text-sm lg:text-base font-semibold mb-2">
            {display.location || "Location"}
          </h2>
          <div className="text-xl lg:text-2xl font-bold">
            {display.price || "£0"} {display.priceType && (
              <span className="text-sm font-normal">{display.priceType}</span>
            )}
          </div>
        </div>

        {/* Property Features Icons */}
        {(display.bedrooms || display.bathrooms || display.livingroom || display.garage) && (
          <div className="flex items-center gap-3 mb-3">
            {display.bedrooms && (
              <div className="flex items-center gap-1">
                <CustomIcon type="bedroom" size={16} className="text-white" />
                <span className="text-sm font-semibold">{display.bedrooms}</span>
              </div>
            )}
            {display.bathrooms && (
              <div className="flex items-center gap-1">
                <CustomIcon type="bathroom" size={16} className="text-white" />
                <span className="text-sm font-semibold">{display.bathrooms}</span>
              </div>
            )}
            {display.livingroom && (
              <div className="flex items-center gap-1">
                <CustomIcon type="livingroom" size={16} className="text-white" />
                <span className="text-sm font-semibold">{display.livingroom}</span>
              </div>
            )}
            {display.garage && (
              <div className="flex items-center gap-1">
                <CustomIcon type="garage" size={16} className="text-white" />
                <span className="text-sm font-semibold">{display.garage}</span>
              </div>
            )}
          </div>
        )}

        {/* Property Description */}
        {display.description && (
          <div className="mb-3">
            <p className="text-xs leading-relaxed opacity-90">
              {display.description}
            </p>
          </div>
        )}

        {/* Key Features */}
        {features.length > 0 && (
          <div className="mb-3">
            <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide">Key Features</h3>
            <ul className="space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-xs opacity-90">
                  • {feature.trim()}
                </li>
              ))}
              {features.length > 3 && (
                <li className="text-xs opacity-90">• +{features.length - 3} more...</li>
              )}
            </ul>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t border-white/20 pt-2 mb-3">
          {display.contactNumber && (
            <div className="text-xs mb-1">
              <span className="font-semibold">Phone:</span> {display.contactNumber}
            </div>
          )}
          {display.email && (
            <div className="text-xs mb-2">
              <span className="font-semibold">Email:</span> {display.email}
            </div>
          )}
        </div>

        {/* Bottom Section - QR Code and Company Logo */}
        <div className="mt-auto">
          {(() => {
            const showQrCode = display.showQrCode && display.qrCodePath;
            const showCompanyLogo = display.showCompanyLogo && display.companyLogoPath;
            
            if (!showQrCode && !showCompanyLogo) return null;
            
            // If only one item is enabled, center it
            if (showQrCode && !showCompanyLogo) {
              return (
                <div className="text-center">
                  <h3 className="text-xs font-semibold mb-2 opacity-90">Scan for more information</h3>
                  <div className="w-12 h-12 relative bg-white rounded shadow p-1 mx-auto">
                    <PropertyImage 
                      src={`uploads/${displayId}/${display.qrCodePath}`}
                      alt="QR Code"
                      fallbackText="QR Code"
                      fill={true}
                      className="object-contain"
                    />
                  </div>
                </div>
              );
            }
            
            if (!showQrCode && showCompanyLogo) {
              return (
                <div className="text-center py-2 px-2">
                  <div className="w-26 h-7 relative mx-auto">
                    <PropertyImage 
                      src={`uploads/${displayId}/${display.companyLogoPath}`}
                      alt="Company Logo"
                      fallbackText="Logo"
                      fill={true}
                      className="object-contain"
                    />
                  </div>
                </div>
              );
            }
            
            // If both are enabled, show them side by side
            return (
              <div className="flex items-end justify-center gap-2">
                <div className="text-center">
                  <h3 className="text-xs font-semibold mb-2 opacity-90">Scan for more information</h3>
                  <div className="w-10 h-10 relative bg-white rounded shadow p-1">
                    <PropertyImage 
                      src={`uploads/${displayId}/${display.qrCodePath}`}
                      alt="QR Code"
                      fallbackText="QR Code"
                      fill={true}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-26 h-7 relative">
                    <PropertyImage 
                      src={`uploads/${displayId}/${display.companyLogoPath}`}
                      alt="Company Logo"
                      fallbackText="Logo"
                      fill={true}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  // Images content component
  const ImagesContent = () => (
    <div className="bg-gray-50 p-2 lg:p-3">
      <div className="space-y-2 h-full">
        
        {/* Main Property Image with Carousel */}
        <ImageCarousel
          mainImage={display.mainImage}
          image1={display.image1}
          image2={display.image2}
          image3={display.image3}
          displayId={displayId}
          enabled={display.carouselEnabled ?? false}
          duration={display.carouselDuration ?? 5000}
          transition={display.carouselTransition as 'none' | 'fade' ?? 'fade'}
        />

        {/* Three Interior Images in a Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="aspect-square relative bg-gray-200 rounded overflow-hidden">
            <PropertyImage 
              src={display.image1 ? `uploads/${displayId}/${display.image1}` : ''}
              alt={`${display.address || 'Property'} - Interior 1`}
              fallbackText="Interior 1"
              fill={true}
            />
          </div>

          <div className="aspect-square relative bg-gray-200 rounded overflow-hidden">
            <PropertyImage 
              src={display.image2 ? `uploads/${displayId}/${display.image2}` : ''}
              alt={`${display.address || 'Property'} - Interior 2`}
              fallbackText="Interior 2"
              fill={true}
            />
          </div>

          <div className="aspect-square relative bg-gray-200 rounded overflow-hidden">
            <PropertyImage 
              src={display.image3 ? `uploads/${displayId}/${display.image3}` : ''}
              alt={`${display.address || 'Property'} - Interior 3`}
              fallbackText="Interior 3"
              fill={true}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Display {displayId} Preview</h3>
              <p className="text-sm text-gray-600">Quick view of the display layout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Display Preview Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
              
              {sidebarPosition === 'left' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <SidebarContent />
                  <div className="lg:col-span-2">
                    <ImagesContent />
                  </div>
                </div>
              )}
              
              {sidebarPosition === 'right' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <div className="lg:col-span-2">
                    <ImagesContent />
                  </div>
                  <SidebarContent />
                </div>
              )}
              
              {sidebarPosition === 'bottom' && (
                <div className="flex flex-col">
                  <div className="flex-1">
                    <ImagesContent />
                  </div>
                  <div className="lg:h-32">
                    <SidebarContent />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            This is a preview of how Display {displayId} will appear to visitors
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
            <a
              href={`/display/${displayId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              View Full Display
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
