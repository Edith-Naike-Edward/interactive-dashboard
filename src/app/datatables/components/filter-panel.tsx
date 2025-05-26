// // src/app/datatables/components/filter-panel.tsx
// src/app/datatables/components/filter-panel.tsx
import { FunnelIcon } from '@heroicons/react/24/outline';

interface FilterPanelProps {
  activeTable: string;
  onApply: () => void;
  // onReset: () => void;
}

export function FilterPanel({ activeTable, onApply }: FilterPanelProps) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50 mb-4">
      <div className="flex items-center mb-3">
        <FunnelIcon className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="font-medium">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Table-specific filters will go here */}
        {activeTable === 'patient-table' && (
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select 
              id="status-filter"
              className="w-full p-2 border rounded"
              aria-label="Filter by status"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button 
          // onClick={onReset}
          className="px-3 py-1.5 text-sm border rounded"
        >
          Reset
        </button>
        <button 
          onClick={onApply}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
// interface FilterPanelProps {
//   activeTable: string;
//   onApplyFilters: () => void;
// }

// export function FilterPanel({ activeTable, onApplyFilters }: FilterPanelProps) {
//   return (
//     <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Add your filter fields here based on activeTable */}
//       </div>
//       <div className="mt-4 flex justify-end space-x-2">
//         <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
//           Reset
//         </button>
//         <button 
//           onClick={onApplyFilters}
//           className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// }