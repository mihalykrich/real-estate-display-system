"use client";
import { useState } from 'react';
import { exportDataAction, importDataAction } from '../data-actions';

interface DataManagementProps {
  totalDisplays: number;
  activeDisplays: number;
}

export function DataManagement({ totalDisplays, activeDisplays }: DataManagementProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExportData = async () => {
    setLoading('export');
    try {
      await exportDataAction();
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Please select a JSON file.');
      return;
    }

    setLoading('import');
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importDataAction(data);
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('Failed to import data. Please check the file format.');
    } finally {
      setLoading(null);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{totalDisplays}</div>
          <div className="text-sm text-gray-600">Total Displays</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{activeDisplays}</div>
          <div className="text-sm text-gray-600">With Images</div>
        </div>
      </div>

      {/* Export Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <p className="text-sm text-gray-600 mb-4">
          Export all display data to a JSON file for backup or migration purposes.
        </p>
        <button
          onClick={handleExportData}
          disabled={loading === 'export'}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{loading === 'export' ? 'Exporting...' : 'Export All Data'}</span>
        </button>
      </div>

      {/* Import Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h3>
        <p className="text-sm text-gray-600 mb-4">
          Import display data from a previously exported JSON file. This will replace existing data.
        </p>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            disabled={loading === 'import'}
            className="hidden"
            id="import-file"
          />
          <label
            htmlFor="import-file"
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>{loading === 'import' ? 'Importing...' : 'Import Data'}</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ⚠️ Warning: Importing will replace all existing display data.
        </p>
      </div>

      {/* Database Actions */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Actions</h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              if (confirm('This will delete ALL display data. Are you sure?')) {
                // This would need to be implemented as a server action
                alert('Feature coming soon - database reset functionality');
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
          >
            Reset All Displays
          </button>
          <p className="text-xs text-gray-500">
            ⚠️ This will permanently delete all display data and cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
}
