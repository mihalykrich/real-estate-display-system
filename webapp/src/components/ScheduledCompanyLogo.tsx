"use client";

interface ScheduledCompanyLogoProps {
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
}

export function ScheduledCompanyLogo({
  isEnabled,
  onToggleEnabled,
}: ScheduledCompanyLogoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Company Logo
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggleEnabled(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">Show Company Logo</span>
        </div>
      </div>

      {isEnabled && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-600 mt-2">
              Uses default company logo from admin settings
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Upload your company logo in the main admin dashboard
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
