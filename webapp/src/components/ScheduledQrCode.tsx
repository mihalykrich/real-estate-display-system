"use client";

import { useState } from 'react';

interface ScheduledQrCodeProps {
  scheduledDisplayId: number | null;
  existingImage?: {
    fileName: string;
    filePath: string;
  } | null;
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onImageUploaded: (imageType: string, imageData: any) => void;
  onImageDeleted: (imageType: string) => void;
}

export function ScheduledQrCode({
  scheduledDisplayId,
  existingImage,
  isEnabled,
  onToggleEnabled,
  onImageUploaded,
  onImageDeleted,
}: ScheduledQrCodeProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !scheduledDisplayId) return;

    setIsUploading(true);
    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('scheduledDisplayId', scheduledDisplayId.toString());
      formData.append('imageType', 'qrCode');

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
          imageType: 'qrCode',
          fileName: uploadData.fileName,
          filePath: uploadData.filePath,
          fileSize: uploadData.fileSize,
          mimeType: uploadData.mimeType,
        }),
      });

      if (saveResponse.ok) {
        const imageData = await saveResponse.json();
        onImageUploaded('qrCode', imageData);
      }
    } catch (error) {
      console.error('Error uploading QR code:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateQrCode = async () => {
    if (!qrCodeUrl || !scheduledDisplayId) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/scheduling/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledDisplayId,
          url: qrCodeUrl,
        }),
      });

      if (response.ok) {
        const qrData = await response.json();
        onImageUploaded('qrCode', qrData);
        setQrCodeUrl('');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!scheduledDisplayId || !existingImage) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/scheduling/images/save?scheduledDisplayId=${scheduledDisplayId}&imageType=qrCode`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        onImageDeleted('qrCode');
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          QR Code
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggleEnabled(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">Enable QR Code</span>
        </div>
      </div>

      {isEnabled && (
        <>
          {existingImage ? (
            <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{existingImage.fileName}</p>
                <p className="text-xs text-gray-500">QR Code uploaded</p>
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
            <div className="space-y-3">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        {isUploading ? 'Uploading...' : 'Upload QR Code'}
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

              {/* Generate QR Code Section */}
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Generate QR Code from URL</h5>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={qrCodeUrl}
                    onChange={(e) => setQrCodeUrl(e.target.value)}
                    placeholder="e.g., https://yourwebsite.com/property/123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateQrCode}
                    disabled={!qrCodeUrl || isGenerating || !scheduledDisplayId}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate QR Code'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
