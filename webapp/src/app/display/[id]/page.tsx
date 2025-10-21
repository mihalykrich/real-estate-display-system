import { prisma } from "@/lib/prisma";
import { PropertyImage } from "@/components/PropertyImage";

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

export default async function DisplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const display = await prisma.display.findUnique({ where: { id } });
  if (!display) return <div className="p-6">Display not found</div>;

  // Debug: Log the display data
  console.log('Display data for ID', id, ':', {
    address: display.address,
    location: display.location,
    price: display.price,
    bedrooms: display.bedrooms,
    bathrooms: display.bathrooms,
    sidebarColor: display.sidebarColor
  });

  // Parse features from text (one per line)
  const features = display.features ? display.features.split('\n').filter(f => f.trim()) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Display Container */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            
            {/* Left Sidebar - Property Info */}
            <div 
              className="text-white p-6 lg:p-8 flex flex-col"
              style={{ 
                background: `linear-gradient(to bottom, ${display.sidebarColor || '#7C3AED'}, ${adjustColor(display.sidebarColor || '#7C3AED', -20)})` 
              }}
            >
              {/* Header Section */}
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                  {display.address || "Property Address"}
                </h1>
                <h2 className="text-lg lg:text-xl font-semibold mb-4">
                  {display.location || "Location"}
                </h2>
                <div className="text-3xl lg:text-4xl font-bold">
                  {display.price || "£0"} {display.priceType && (
                    <span className="text-lg font-normal">{display.priceType}</span>
                  )}
                </div>
              </div>

              {/* Property Features Icons */}
              {(display.bedrooms || display.bathrooms || display.garage) && (
                <div className="flex items-center gap-6 mb-6">
                  {display.bedrooms && (
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                      <span className="text-lg font-semibold">{display.bedrooms}</span>
                    </div>
                  )}
                  {display.bathrooms && (
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-lg font-semibold">{display.bathrooms}</span>
                    </div>
                  )}
                  {display.garage && (
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4v-5h12v5zm0-7H4V5h12v3z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-lg font-semibold">{display.garage}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Property Description */}
              {display.description && (
                <div className="mb-6">
                  <p className="text-sm leading-relaxed opacity-90">
                    {display.description}
                  </p>
                </div>
              )}

              {/* Key Features */}
              {features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">Key Features</h3>
                  <ul className="space-y-1">
                    {features.map((feature, index) => (
                      <li key={index} className="text-sm opacity-90">
                        • {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Information */}
              <div className="border-t border-white/20 pt-4 mb-6">
                {display.contactNumber && (
                  <div className="text-sm mb-2">
                    <span className="font-semibold">Phone:</span> {display.contactNumber}
                  </div>
                )}
                {display.email && (
                  <div className="text-sm mb-4">
                    <span className="font-semibold">Email:</span> {display.email}
                  </div>
                )}
              </div>

              {/* QR Code Section */}
              {display.qrCodePath && (
                <div className="mt-auto">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold mb-3 opacity-90">Scan for more information</h3>
                    <div className="w-24 h-24 relative bg-white rounded-lg shadow-lg p-2 mx-auto">
                      <PropertyImage 
                        src={`uploads/${id}/${display.qrCodePath}`}
                        alt="QR Code"
                        fallbackText="QR Code"
                        fill={true}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Images */}
            <div className="lg:col-span-2 bg-gray-50 p-4 lg:p-6">
              <div className="space-y-4 h-full">
                
                {/* Main Property Image */}
                <div className="aspect-[4/3] relative bg-gray-200 rounded-lg overflow-hidden">
                  <PropertyImage 
                    src={display.mainImage ? `uploads/${id}/${display.mainImage}` : ''}
                    alt={`${display.address || 'Property'} - Main view`}
                    fallbackText="Main Property Image"
                    fill={true}
                  />
                </div>

                {/* Three Interior Images in a Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square relative bg-gray-200 rounded-lg overflow-hidden">
                    <PropertyImage 
                      src={display.image1 ? `uploads/${id}/${display.image1}` : ''}
                      alt={`${display.address || 'Property'} - Interior 1`}
                      fallbackText="Interior 1"
                      fill={true}
                    />
                  </div>

                  <div className="aspect-square relative bg-gray-200 rounded-lg overflow-hidden">
                    <PropertyImage 
                      src={display.image2 ? `uploads/${id}/${display.image2}` : ''}
                      alt={`${display.address || 'Property'} - Interior 2`}
                      fallbackText="Interior 2"
                      fill={true}
                    />
                  </div>

                  <div className="aspect-square relative bg-gray-200 rounded-lg overflow-hidden">
                    <PropertyImage 
                      src={display.image3 ? `uploads/${id}/${display.image3}` : ''}
                      alt={`${display.address || 'Property'} - Interior 3`}
                      fallbackText="Interior 3"
                      fill={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}