"use client";

import { useState } from 'react';

interface ScheduledImageUploadProps {
  scheduledDisplayId: number | null;
  imageType: string;
  label: string;
  existingImage?: {
    fileName: string;
    filePath: string;
  } | null;
  onImageUploaded: (imageType: string, imageData: any) => void;
  onImageDeleted: (imageType: string) => void;
}

export function ScheduledImageUpload({
  scheduledDisplayId,
  imageType,
  label,
  existingImage,
  onImageUploaded,
  onImageDeleted,
}: ScheduledImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !scheduledDisplayId) return;

    setIsUploading(true);
    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('scheduledDisplayId', scheduledDisplayId.toString());
      formData.append('imageType', imageType);

      const uploadResponse = await fetch('/api/admin/scheduling/images', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();

      // Save to database
      const saveResponse = await fetch('/api/admin/scheduling/images/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledDisplayId,
          imageType,
          fileName: uploadData.fileName,
          filePath: uploadData.filePath,
          fileSize: uploadData.fileSize,
          mimeType: uploadData.mimeType,
        }),
      });

      if (saveResponse.ok) {
        const imageData = await saveResponse.json();
        onImageUploaded(imageType, imageData);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!scheduledDisplayId || !existingImage) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/scheduling/images/save?scheduledDisplayId=${scheduledDisplayId}&imageType=${imageType}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        onImageDeleted(imageType);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {existingImage ? (
        <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{existingImage.fileName}</p>
            <p className="text-xs text-gray-500">Image uploaded</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteImage}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <label className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer">
              Replace
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="mt-2">
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  {isUploading ? 'Uploading...' : 'Upload image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading || !scheduledDisplayId}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
