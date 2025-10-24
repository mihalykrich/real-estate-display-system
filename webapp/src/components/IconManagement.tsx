"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface IconFile {
  name: string;
  path: string;
  type: string;
}

export function IconManagement() {
  const [icons, setIcons] = useState<Record<string, IconFile[]>>({
    bedroom: [],
    bathroom: [],
    livingroom: [],
    garage: []
  });
  const [selectedIcons, setSelectedIcons] = useState<Record<string, string>>({
    bedroom: '',
    bathroom: '',
    livingroom: '',
    garage: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIcons();
  }, []);

  const loadIcons = async () => {
    setIsLoading(true);
    const iconTypes = ['bedroom', 'bathroom', 'livingroom', 'garage'];
    const newIcons: Record<string, IconFile[]> = {
      bedroom: [],
      bathroom: [],
      livingroom: [],
      garage: []
    };

    // Load saved preferences first
    let savedPreferences = {};
    try {
      const prefsResponse = await fetch('/api/admin/icon-preferences');
      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json();
        savedPreferences = prefsData.preferences || {};
      }
    } catch (error) {
      console.error('Error loading icon preferences:', error);
    }

    for (const type of iconTypes) {
      try {
        const response = await fetch(`/api/icons/${type}`);
        if (response.ok) {
          const data = await response.json();
          newIcons[type] = data.icons || [];
        } else {
          newIcons[type] = [];
        }
      } catch (error) {
        console.error(`Error loading ${type} icons:`, error);
        newIcons[type] = [];
      }
    }

    // Set preferences: use saved ones if available, otherwise use first available icon
    const finalPreferences: Record<string, string> = {};
    for (const type of iconTypes) {
      if (savedPreferences[type]) {
        // Use saved preference if it exists
        finalPreferences[type] = savedPreferences[type];
      } else if (newIcons[type].length > 0) {
        // Use first available icon if no saved preference
        finalPreferences[type] = newIcons[type][0].name;
      }
    }

    setSelectedIcons(finalPreferences);
    setIcons(newIcons);
    setIsLoading(false);

    // Save the auto-selected preferences if they weren't saved before
    if (Object.keys(savedPreferences).length === 0 && Object.keys(finalPreferences).length > 0) {
      try {
        await fetch('/api/admin/icon-preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ preferences: finalPreferences }),
        });
      } catch (error) {
        console.error('Error auto-saving icon preferences:', error);
      }
    }
  };

  const handleFileUpload = async (type: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/admin/upload-icon', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        loadIcons(); // Reload icons
      } else {
        console.error('Failed to upload icon');
      }
    } catch (error) {
      console.error('Error uploading icon:', error);
    }
  };

  const handleIconSelection = async (type: string, iconName: string) => {
    const newPreferences = {
      ...selectedIcons,
      [type]: iconName
    };
    
    setSelectedIcons(newPreferences);
    
    // Save preferences to server
    try {
      const response = await fetch('/api/admin/icon-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: newPreferences }),
      });
      
      if (!response.ok) {
        console.error('Failed to save icon preferences');
      }
    } catch (error) {
      console.error('Error saving icon preferences:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Icon Management</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Icon Management</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Upload custom icons for bedroom, bathroom, living room, and garage features. 
            Icons will automatically replace the default SVG icons in displays.
          </p>
          <button
            onClick={loadIcons}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Refresh Icons
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Upload Instructions:</h3>
          <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Extract your ZIP file</li>
            <li>Place bedroom icons in <code className="bg-blue-100 px-1 rounded">public/icons/bedroom/</code></li>
            <li>Place bathroom icons in <code className="bg-blue-100 px-1 rounded">public/icons/bathroom/</code></li>
            <li>Place living room icons in <code className="bg-blue-100 px-1 rounded">public/icons/livingroom/</code></li>
            <li>Place garage icons in <code className="bg-blue-100 px-1 rounded">public/icons/garage/</code></li>
            <li>Refresh this page to see the new icons</li>
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(icons).map(([type, iconFiles]) => (
          <div key={type} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
              {type === 'livingroom' ? 'Living Room' : type} Icons
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload {type} icon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(type, file);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Current icons:</p>
                {iconFiles.length > 0 ? (
                  <div className="space-y-2">
                    {iconFiles.map((icon, index) => (
                      <div key={index} className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedIcons[type] === icon.name 
                          ? 'bg-blue-50 border-blue-400 shadow-md' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name={`${type}-icon`}
                          value={icon.name}
                          checked={selectedIcons[type] === icon.name}
                          onChange={() => handleIconSelection(type, icon.name)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <div className={`w-10 h-10 relative rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedIcons[type] === icon.name 
                            ? 'border-2 border-blue-400 bg-blue-25' 
                            : 'border border-gray-200 bg-white'
                        }`}>
                          <Image
                            src={icon.path}
                            alt={icon.name}
                            width={36}
                            height={36}
                            className="object-contain max-w-full max-h-full"
                            unoptimized={true}
                            onError={(e) => {
                              console.log('Image failed to load:', icon.path, e);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="text-xs text-gray-400">?</div>';
                              }
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', icon.path);
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium block truncate ${
                            selectedIcons[type] === icon.name ? 'text-blue-800' : 'text-gray-700'
                          }`}>
                            {icon.name}
                          </span>
                          <span className={`text-xs uppercase ${
                            selectedIcons[type] === icon.name ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {icon.type}
                          </span>
                        </div>
                        {selectedIcons[type] === icon.name && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedIcons[type] && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-xs text-green-700">
                          ✓ Selected: <span className="font-medium">{selectedIcons[type]}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No icons uploaded yet</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Supported Formats:</h3>
        <p className="text-sm text-gray-600">
          PNG, SVG, JPG, JPEG, WebP. Recommended size: 24x24px to 48x48px for best display.
        </p>
      </div>
    </div>
  );
}
