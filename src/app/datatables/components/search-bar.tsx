// // src/app/datatables/components/search-bar.tsx
// src/app/datatables/components/search-bar.tsx
import { SearchIcon, RefreshCwIcon } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
}

export function SearchBar({ value, onChange, onRefresh }: SearchBarProps) {
  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <RefreshCwIcon className="h-4 w-4 mr-2" />
        Refresh
      </button>
    </div>
  );
}
// import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// interface SearchBarProps {
//   value: string;
//   onChange: (value: string) => void;
//   onRefresh: () => void;
// }

// export function SearchBar({ value, onChange, onRefresh }: SearchBarProps) {
//   return (
//     <div className="flex gap-2">
//       <div className="relative flex-1">
//         <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search..."
//           className="pl-10 pr-4 py-2 w-full border rounded-lg"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       </div>
//       <button
//         onClick={onRefresh}
//         className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg"
//       >
//         <ArrowPathIcon className="h-4 w-4 mr-2" />
//         Refresh
//       </button>
//     </div>
//   );
// }