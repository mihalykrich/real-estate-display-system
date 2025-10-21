"use client";
import { useState } from 'react';
import { updateProfileAction, uploadLogoAction, deleteLogoAction } from '../actions';
import { Toast } from '@/components/Toast';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  companyName: string | null;
  companyLogo: string | null;
  phoneNumber: string | null;
  bio: string | null;
  website: string | null;
  timezone: string | null;
  language: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileSettingsFormProps {
  user: User;
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    companyName: user.companyName || '',
    phoneNumber: user.phoneNumber || '',
    bio: user.bio || '',
    website: user.website || '',
    timezone: user.timezone || 'Europe/London',
    language: user.language || 'en'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(user.companyLogo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfileAction(formData);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: (error as Error).message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    
    setIsLoading(true);
    try {
      await uploadLogoAction(logoFile);
      setToast({ message: 'Logo uploaded successfully!', type: 'success' });
      setLogoFile(null);
    } catch (error) {
      setToast({ message: (error as Error).message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!user.companyLogo) return;
    
    setIsLoading(true);
    try {
      await deleteLogoAction();
      setLogoPreview(null);
      setToast({ message: 'Logo deleted successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: (error as Error).message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          duration={4000}
          onClose={() => setToast(null)}
        />
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={user.email || ''}
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://your-website.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio / Description
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself or your company..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your company name"
            />
          </div>

          {/* Logo Management */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <div className="space-y-4">
              {/* Current Logo Preview */}
              {logoPreview && (
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={logoPreview.startsWith('data:') ? logoPreview : `/uploads/logos/${logoPreview}`}
                      alt="Company Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current logo</p>
                    <button
                      onClick={handleLogoDelete}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      Delete Logo
                    </button>
                  </div>
                </div>
              )}

              {/* Logo Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG, GIF up to 2MB
                      </span>
                    </label>
                    <input
                      id="logo-upload"
                      name="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="sr-only"
                    />
                  </div>
                  {logoFile && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Selected: {logoFile.name}</p>
                      <button
                        onClick={handleLogoUpload}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Uploading...' : 'Upload Logo'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Paris">Europe/Paris (CET)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Role
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-lg">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
              {new Date(user.createdAt).toLocaleDateString('en-GB')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
