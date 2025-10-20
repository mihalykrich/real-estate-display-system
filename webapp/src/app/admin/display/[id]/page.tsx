import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { saveUploadedFile } from '@/lib/files';
import { PrismaClient } from '@/generated/prisma';
import FileDrop from '@/components/FileDrop';
import { deleteImageAction, swapImagesAction, generateQrAction } from './actions';

async function updateDisplay(id: number, formData: FormData) {
  'use server';
  const explicitUrl = process.env.DATABASE_URL || 'postgresql://realestate:realestate@localhost:5432/realestate?schema=public';
  const db = new PrismaClient({ datasources: { db: { url: explicitUrl } } });

  // Property Details
  const address = (formData.get('address') as string)?.trim() || null;
  const location = (formData.get('location') as string)?.trim() || null;
  const price = (formData.get('price') as string)?.trim() || null;
  const priceType = (formData.get('priceType') as string)?.trim() || null;
  
  // Property Features
  const bedrooms = formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : null;
  const bathrooms = formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null;
  const garage = formData.get('garage') ? parseInt(formData.get('garage') as string) : null;
  const propertyType = (formData.get('propertyType') as string)?.trim() || null;
  
  // Content
  const description = (formData.get('description') as string)?.trim() || null;
  const features = (formData.get('features') as string)?.trim() || null;
  
  // Contact
  const contactNumber = (formData.get('contactNumber') as string)?.trim() || null;
  const email = (formData.get('email') as string)?.trim() || null;
  
  // Display Styling
  const sidebarColor = (formData.get('sidebarColor') as string)?.trim() || '#7C3AED';

  // Images
  const mainImage = (formData.get('mainImage') as unknown as File) || null;
  const image1 = (formData.get('image1') as unknown as File) || null;
  const image2 = (formData.get('image2') as unknown as File) || null;
  const image3 = (formData.get('image3') as unknown as File) || null;

  const dir = `uploads/${id}`;
  const updates: any = { 
    address, location, price, priceType,
    bedrooms, bathrooms, garage, propertyType,
    description, features,
    contactNumber, email,
    sidebarColor
  };
  
  const savedMain = await saveUploadedFile(dir, 'main', mainImage);
  const saved1 = await saveUploadedFile(dir, 'img1', image1);
  const saved2 = await saveUploadedFile(dir, 'img2', image2);
  const saved3 = await saveUploadedFile(dir, 'img3', image3);
  
  if (savedMain) updates.mainImage = savedMain;
  if (saved1) updates.image1 = saved1;
  if (saved2) updates.image2 = saved2;
  if (saved3) updates.image3 = saved3;

  console.log('Updating display with data:', updates);
  await db.display.update({ where: { id }, data: updates });
  await db.$disconnect();
  
  // Revalidate the display page to show updated data
  const { revalidatePath } = await import('next/cache');
  revalidatePath(`/display/${id}`);
  revalidatePath(`/admin/display/${id}`);
  
  redirect(`/display/${id}`);
}

export default async function AdminDisplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const display = await prisma.display.findUnique({ where: { id } });
  if (!display) return <div className="p-6">Display not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Display {id}</h1>
            <p className="text-gray-600">Manage your property listing content and images</p>
          </div>

          <form action={updateDisplay.bind(null, id)} className="space-y-8">
            {/* Property Details Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Address</div>
                  <input 
                    name="address" 
                    defaultValue={display.address ?? ''} 
                    placeholder="e.g., Priory Road"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Location</div>
                  <input 
                    name="location" 
                    defaultValue={display.location ?? ''} 
                    placeholder="e.g., St Ives"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Price</div>
                  <input 
                    name="price" 
                    defaultValue={display.price ?? ''} 
                    placeholder="e.g., £1,519"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Price Type</div>
                  <select 
                    name="priceType" 
                    defaultValue={display.priceType ?? ''} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="PCM">Per Calendar Month</option>
                    <option value="PW">Per Week</option>
                    <option value="Sale">For Sale</option>
                    <option value="POA">Price on Application</option>
                  </select>
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Property Type</div>
                  <select 
                    name="propertyType" 
                    defaultValue={display.propertyType ?? ''} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Cottage">Cottage</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Studio">Studio</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Property Features Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Bedrooms</div>
                  <input 
                    name="bedrooms" 
                    type="number" 
                    min="0" 
                    max="10"
                    defaultValue={display.bedrooms ?? ''} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Bathrooms</div>
                  <input 
                    name="bathrooms" 
                    type="number" 
                    min="0" 
                    max="10"
                    defaultValue={display.bathrooms ?? ''} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Garage Spaces</div>
                  <input 
                    name="garage" 
                    type="number" 
                    min="0" 
                    max="5"
                    defaultValue={display.garage ?? ''} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </label>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Description</h2>
              <label className="block">
                <div className="text-sm font-medium text-gray-700 mb-2">Description</div>
                <textarea 
                  name="description" 
                  rows={6}
                  defaultValue={display.description ?? ''} 
                  placeholder="Enter a detailed property description..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
              <label className="block mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Key Features (one per line)</div>
                <textarea 
                  name="features" 
                  rows={4}
                  defaultValue={display.features ?? ''} 
                  placeholder="Enter key features, one per line:&#10;• Total Renovation&#10;• New Kitchen&#10;• Close to Town Centre"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </label>
            </div>

            {/* Images Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Main Property Image</label>
                  <FileDrop name="mainImage" label="Main image" existingFileName={display.mainImage} />
                  <div className="flex items-center gap-2">
                    <button formAction={async () => { 'use server'; await deleteImageAction(id, 'mainImage'); }} className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-3 py-1 rounded transition-colors duration-200">Delete</button>
                    <button formAction={async () => { 'use server'; await swapImagesAction(id, 'mainImage', 'image1'); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded transition-colors duration-200">Swap with Image 1</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Interior Image 1</label>
                  <FileDrop name="image1" label="Interior image 1" existingFileName={display.image1} />
                  <div className="flex items-center gap-2">
                    <button formAction={async () => { 'use server'; await deleteImageAction(id, 'image1'); }} className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-3 py-1 rounded transition-colors duration-200">Delete</button>
                    <button formAction={async () => { 'use server'; await swapImagesAction(id, 'image1', 'image2'); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded transition-colors duration-200">Swap with Image 2</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Interior Image 2</label>
                  <FileDrop name="image2" label="Interior image 2" existingFileName={display.image2} />
                  <div className="flex items-center gap-2">
                    <button formAction={async () => { 'use server'; await deleteImageAction(id, 'image2'); }} className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-3 py-1 rounded transition-colors duration-200">Delete</button>
                    <button formAction={async () => { 'use server'; await swapImagesAction(id, 'image2', 'image3'); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded transition-colors duration-200">Swap with Image 3</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Interior Image 3</label>
                  <FileDrop name="image3" label="Interior image 3" existingFileName={display.image3} />
                  <div className="flex items-center gap-2">
                    <button formAction={async () => { 'use server'; await deleteImageAction(id, 'image3'); }} className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-3 py-1 rounded transition-colors duration-200">Delete</button>
                    <button formAction={async () => { 'use server'; await swapImagesAction(id, 'image3', 'mainImage'); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded transition-colors duration-200">Swap with Main</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Contact Number</div>
                  <input 
                    name="contactNumber" 
                    defaultValue={display.contactNumber ?? ''} 
                    placeholder="e.g., 01234 567890"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Email Address</div>
                  <input 
                    name="email" 
                    type="email"
                    defaultValue={display.email ?? ''} 
                    placeholder="e.g., info@estateagent.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </label>
              </div>
            </div>

            {/* Display Styling */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Display Styling</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">Sidebar Color</div>
                  <div className="flex items-center gap-3">
                    <input 
                      name="sidebarColor" 
                      type="color"
                      defaultValue={display.sidebarColor ?? '#7C3AED'} 
                      className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer" 
                    />
                    <input 
                      type="text"
                      defaultValue={display.sidebarColor ?? '#7C3AED'} 
                      placeholder="#7C3AED"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Choose a color for the left sidebar background</p>
                </label>
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Preview:</p>
                    <div 
                      className="w-full h-16 rounded-lg border-2 border-gray-300"
                      style={{ backgroundColor: display.sidebarColor ?? '#7C3AED' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Generation */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">QR Code Image</label>
                  <FileDrop name="qrCode" label="QR code" existingFileName={display.qrCodePath} />
                  <div className="flex items-center gap-2">
                    <button formAction={async () => { 'use server'; await deleteImageAction(id, 'qrCodePath'); }} className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-3 py-1 rounded transition-colors duration-200">Delete</button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    name="qrUrl" 
                    placeholder="Generate QR from URL (e.g., https://yourwebsite.com/property/123)" 
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                  <button 
                    formAction={async (formData: FormData) => {
                      'use server';
                      const url = String(formData.get('qrUrl') || '');
                      if (url) {
                        await generateQrAction(id, url);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Generate QR
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Save Property Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


