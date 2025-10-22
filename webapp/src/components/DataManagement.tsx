"use client";
import { useState } from 'react';
import { exportDataAction, importDataAction } from '@/app/admin/dashboard/data-actions';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useToast } from '@/contexts/ToastContext';

interface DataManagementProps {
  totalDisplays: number;
  activeDisplays: number;
}

export function DataManagement({ totalDisplays, activeDisplays }: DataManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const { showToast } = useToast();

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const data = await exportDataAction();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `real-estate-display-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Data exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showToast('Failed to export data: ' + (error as Error).message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImportFile(event.target.files[0]);
    } else {
      setImportFile(null);
    }
  };

  const handleImportClick = () => {
    if (!importFile) {
      showToast('Please select a JSON file to import.', 'error');
      return;
    }
    setShowImportModal(true);
  };

  const handleImportConfirm = async () => {
    if (!importFile) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
               try {
                 const json = JSON.parse(e.target?.result as string);
                 await importDataAction(json);
                 showToast('Data imported successfully! Refreshing page...', 'success');
                 setTimeout(() => window.location.reload(), 1500);
               } catch (parseError) {
                 console.error('Error parsing JSON:', parseError);
                 showToast('Invalid JSON file. Please ensure it is a valid JSON format.', 'error');
               }
      };
      reader.readAsText(importFile);
    } catch (error) {
      console.error('Error importing data:', error);
      showToast('Failed to import data: ' + (error as Error).message, 'error');
    } finally {
      setIsLoading(false);
      setShowImportModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">Processing request...</span>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Export Display Data</h3>
        <p className="text-gray-600 mb-4">
          Download all current display configurations as a JSON file for backup purposes.
        </p>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Exporting...' : 'Export All Data'}
        </button>
      </div>

      {/* Import Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Import Display Data</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 font-semibold text-sm">
            ⚠️ WARNING: Importing data will OVERWRITE all existing display data.
          </p>
        </div>
        <p className="text-gray-600 mb-4">
          Upload a JSON file to restore display configurations. This will replace all current data.
        </p>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
          disabled={isLoading}
        />
        <button
          onClick={handleImportClick}
          disabled={isLoading || !importFile}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Importing...' : 'Import Data'}
        </button>
      </div>

      {/* Database Statistics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Database Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{totalDisplays}</p>
            <p className="text-sm text-gray-600">Total Display Slots</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{activeDisplays}</p>
            <p className="text-sm text-gray-600">Active Displays</p>
          </div>
        </div>
      </div>

      {/* Import Confirmation Modal */}
      <ConfirmationModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onConfirm={handleImportConfirm}
        title="Import Display Data"
        message={`WARNING: Importing data will OVERWRITE all existing display data. Are you absolutely sure you want to proceed with importing "${importFile?.name}"?`}
        confirmText="Import Data"
        cancelText="Cancel"
        type="warning"
        isLoading={isLoading}
      />
    </div>
  );
}
