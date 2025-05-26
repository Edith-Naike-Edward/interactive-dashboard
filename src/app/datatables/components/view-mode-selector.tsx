// src/app/datatables/components/view-mode-selector.tsx
import { TableIcon, ChartBarIcon, ChartPieIcon } from 'lucide-react';

type ViewMode = 'table' | 'analytics' | 'visualizations';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function ViewModeSelector({ viewMode, setViewMode }: ViewModeSelectorProps) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setViewMode('table')}
        className={`flex items-center px-3 py-1 rounded-md ${
          viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
        }`}
      >
        <TableIcon className="w-4 h-4 mr-1" />
        Table
      </button>
      <button
        onClick={() => setViewMode('analytics')}
        className={`flex items-center px-3 py-1 rounded-md ${
          viewMode === 'analytics' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
        }`}
      >
        <ChartBarIcon className="w-4 h-4 mr-1" />
        Analytics
      </button>
      <button
        onClick={() => setViewMode('visualizations')}
        className={`flex items-center px-3 py-1 rounded-md ${
          viewMode === 'visualizations' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
        }`}
      >
        <ChartPieIcon className="w-4 h-4 mr-1" />
        Visualizations
      </button>
    </div>
  );
}