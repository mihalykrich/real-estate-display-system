"use client";

import { useState, useEffect } from 'react';
import { ScheduledImageUpload } from './ScheduledImageUpload';
import { ScheduledQrCode } from './ScheduledQrCode';
import { ScheduledCompanyLogo } from './ScheduledCompanyLogo';

interface Display {
  id: number;
  address: string | null;
}

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingSchedule?: any;
  onSave: (schedule: any) => void;
}

export function ScheduleForm({ isOpen, onClose, editingSchedule, onSave }: ScheduleFormProps) {
  const [displays, setDisplays] = useState<Display[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduledImages, setScheduledImages] = useState<Record<string, any>>({});
  const [tempScheduledDisplayId, setTempScheduledDisplayId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetDisplayId: '',
    startDate: '',
    endDate: '',
    scheduleType: 'once',
    scheduleTime: '',
    scheduleDays: '',
    scheduleDate: '',
    contentData: {
      address: '',
      location: '',
      price: '',
      priceType: 'PCM',
      bedrooms: '',
      bathrooms: '',
      garage: '',
      livingroom: '',
      propertyType: 'House',
      description: '',
      features: '',
      contactNumber: '',
      email: '',
      sidebarColor: '#22c353',
      sidebarPosition: 'left',
      showCompanyLogo: false,
      showQrCode: false,
      carouselEnabled: false,
      carouselDuration: 5000,
      carouselTransition: 'fade',
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchDisplays();
      
      // Generate a temporary ID for new schedules or use existing ID for editing
      const tempId = editingSchedule ? editingSchedule.id : Date.now();
      setTempScheduledDisplayId(tempId);
      
      if (editingSchedule) {
        setFormData({
          name: editingSchedule.name || '',
          description: editingSchedule.description || '',
          targetDisplayId: editingSchedule.targetDisplayId?.toString() || '',
          startDate: editingSchedule.startDate ? new Date(editingSchedule.startDate).toISOString().slice(0, 16) : '',
          endDate: editingSchedule.endDate ? new Date(editingSchedule.endDate).toISOString().slice(0, 16) : '',
          scheduleType: editingSchedule.scheduleType || 'once',
          scheduleTime: editingSchedule.scheduleTime || '',
          scheduleDays: editingSchedule.scheduleDays || '',
          scheduleDate: editingSchedule.scheduleDate?.toString() || '',
          contentData: editingSchedule.contentData ? JSON.parse(editingSchedule.contentData) : {
            address: '',
            location: '',
            price: '',
            priceType: 'PCM',
            bedrooms: '',
            bathrooms: '',
            garage: '',
            livingroom: '',
            propertyType: 'House',
            description: '',
            features: '',
            contactNumber: '',
            email: '',
            sidebarColor: '#22c353',
            sidebarPosition: 'left',
            showCompanyLogo: false,
            showQrCode: false,
            carouselEnabled: false,
            carouselDuration: 5000,
            carouselTransition: 'fade',
          },
        });
        
        // Set existing images
        if (editingSchedule.images) {
          const imagesMap: Record<string, any> = {};
          editingSchedule.images.forEach((img: any) => {
            imagesMap[img.imageType] = img;
          });
          setScheduledImages(imagesMap);
        }
      } else {
        // Reset form for new schedule
        resetForm();
        setScheduledImages({});
      }
    }
  }, [isOpen, editingSchedule]);

  const fetchDisplays = async () => {
    try {
      const response = await fetch('/api/admin/displays');
      if (response.ok) {
        const data = await response.json();
        setDisplays(data);
      }
    } catch (error) {
      console.error('Error fetching displays:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const scheduleData = {
        ...formData,
        targetDisplayId: parseInt(formData.targetDisplayId),
        scheduleDate: formData.scheduleDate ? parseInt(formData.scheduleDate) : null,
        contentData: formData.contentData,
      };

      const url = editingSchedule 
        ? `/api/admin/scheduling/${editingSchedule.id}`
        : '/api/admin/scheduling';
      
      const method = editingSchedule ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (response.ok) {
        const savedSchedule = await response.json();
        onSave(savedSchedule);
        onClose();
        resetForm();
      } else {
        console.error('Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      targetDisplayId: '',
      startDate: '',
      endDate: '',
      scheduleType: 'once',
      scheduleTime: '',
      scheduleDays: '',
      scheduleDate: '',
      contentData: {
        address: '',
        location: '',
        price: '',
        priceType: 'PCM',
        bedrooms: '',
        bathrooms: '',
        garage: '',
        livingroom: '',
        propertyType: 'House',
        description: '',
        features: '',
        contactNumber: '',
        email: '',
        sidebarColor: '#22c353',
        sidebarPosition: 'left',
        showCompanyLogo: false,
        showQrCode: false,
        carouselEnabled: false,
        carouselDuration: 5000,
        carouselTransition: 'fade',
      },
    });
  };

  const handleContentDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      contentData: {
        ...prev.contentData,
        [field]: value,
      },
    }));
  };

  const handleImageUploaded = (imageType: string, imageData: any) => {
    setScheduledImages(prev => ({
      ...prev,
      [imageType]: imageData,
    }));
  };

  const handleImageDeleted = (imageType: string) => {
    setScheduledImages(prev => {
      const newImages = { ...prev };
      delete newImages[imageType];
      return newImages;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingSchedule ? 'Edit Scheduled Display' : 'Create Scheduled Display'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Display *
                </label>
                <select
                  value={formData.targetDisplayId}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetDisplayId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a display</option>
                  {displays.map((display) => (
                    <option key={display.id} value={display.id}>
                      Display #{display.id} - {display.address || 'No address'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Type *
                </label>
                <select
                  value={formData.scheduleType}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduleType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="once">One-time execution</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {formData.scheduleType !== 'once' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={formData.scheduleType !== 'once'}
                  />
                </div>
              )}
            </div>

            {formData.scheduleType === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of Week *
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.scheduleDays.includes(index.toString())}
                        onChange={(e) => {
                          const days = formData.scheduleDays.split(',').filter(d => d !== '');
                          if (e.target.checked) {
                            days.push(index.toString());
                          } else {
                            const indexToRemove = days.indexOf(index.toString());
                            if (indexToRemove > -1) {
                              days.splice(indexToRemove, 1);
                            }
                          }
                          setFormData(prev => ({ ...prev, scheduleDays: days.join(',') }));
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formData.scheduleType === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Month *
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={formData.scheduleType === 'monthly'}
                />
              </div>
            )}

            {/* Content Data */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Display Content</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.contentData.address}
                    onChange={(e) => handleContentDataChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.contentData.location}
                    onChange={(e) => handleContentDataChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    value={formData.contentData.price}
                    onChange={(e) => handleContentDataChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Type
                  </label>
                  <select
                    value={formData.contentData.priceType}
                    onChange={(e) => handleContentDataChange('priceType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PCM">PCM</option>
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.contentData.bedrooms}
                    onChange={(e) => handleContentDataChange('bedrooms', parseInt(e.target.value) || '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.contentData.bathrooms}
                    onChange={(e) => handleContentDataChange('bathrooms', parseInt(e.target.value) || '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Living Rooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.contentData.livingroom}
                    onChange={(e) => handleContentDataChange('livingroom', parseInt(e.target.value) || '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Garage
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.contentData.garage}
                    onChange={(e) => handleContentDataChange('garage', parseInt(e.target.value) || '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.contentData.description}
                  onChange={(e) => handleContentDataChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (one per line)
                </label>
                <textarea
                  value={formData.contentData.features}
                  onChange={(e) => handleContentDataChange('features', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contentData.contactNumber}
                    onChange={(e) => handleContentDataChange('contactNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contentData.email}
                    onChange={(e) => handleContentDataChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sidebar Color
                  </label>
                  <input
                    type="color"
                    value={formData.contentData.sidebarColor}
                    onChange={(e) => handleContentDataChange('sidebarColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sidebar Position
                  </label>
                  <select
                    value={formData.contentData.sidebarPosition}
                    onChange={(e) => handleContentDataChange('sidebarPosition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="left">Left Side</option>
                    <option value="right">Right Side</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Image Uploads */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Images</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScheduledImageUpload
                scheduledDisplayId={tempScheduledDisplayId}
                imageType="mainImage"
                label="Main Image"
                existingImage={scheduledImages.mainImage}
                onImageUploaded={handleImageUploaded}
                onImageDeleted={handleImageDeleted}
              />

              <ScheduledImageUpload
                scheduledDisplayId={tempScheduledDisplayId}
                imageType="image1"
                label="Image 1"
                existingImage={scheduledImages.image1}
                onImageUploaded={handleImageUploaded}
                onImageDeleted={handleImageDeleted}
              />

              <ScheduledImageUpload
                scheduledDisplayId={tempScheduledDisplayId}
                imageType="image2"
                label="Image 2"
                existingImage={scheduledImages.image2}
                onImageUploaded={handleImageUploaded}
                onImageDeleted={handleImageDeleted}
              />

              <ScheduledImageUpload
                scheduledDisplayId={tempScheduledDisplayId}
                imageType="image3"
                label="Image 3"
                existingImage={scheduledImages.image3}
                onImageUploaded={handleImageUploaded}
                onImageDeleted={handleImageDeleted}
              />

              <ScheduledQrCode
                scheduledDisplayId={tempScheduledDisplayId}
                existingImage={scheduledImages.qrCode}
                isEnabled={formData.contentData.showQrCode}
                onToggleEnabled={(enabled) => handleContentDataChange('showQrCode', enabled)}
                onImageUploaded={handleImageUploaded}
                onImageDeleted={handleImageDeleted}
              />

              <ScheduledCompanyLogo
                isEnabled={formData.contentData.showCompanyLogo}
                onToggleEnabled={(enabled) => handleContentDataChange('showCompanyLogo', enabled)}
              />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (editingSchedule ? 'Update Schedule' : 'Create Schedule')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
