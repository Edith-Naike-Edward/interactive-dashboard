// // src/app/datatables/components/table-selector.tsx
// src/app/datatables/components/table-selector.tsx
import { TableType } from '../types';

interface TableSelectorProps {
  tables: TableType[];
  activeTable: string;
  onChange: (tableId: string) => void;
}

export function TableSelector({ tables, activeTable, onChange }: TableSelectorProps) {
  return (
    <div className="flex space-x-1 mt-4 overflow-x-auto">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => onChange(table.id)}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap ${
            activeTable === table.id
              ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {table.name}
        </button>
      ))}
    </div>
  );
}
// interface TableType {
//   id: string;
//   name: string;
// }

// interface TableSelectorProps {
//   tables: TableType[];
//   activeTable: string;
//   onChange: (tableId: string) => void;
// }

// export function TableSelector({ tables, activeTable, onChange }: TableSelectorProps) {
//   return (
//     <div className="flex border-b">
//       {tables.map((table) => (
//         <button
//           key={table.id}
//           onClick={() => onChange(table.id)}
//           className={`px-4 py-2 font-medium text-sm ${
//             activeTable === table.id
//               ? 'border-b-2 border-blue-500 text-blue-600'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           {table.name}
//         </button>
//       ))}
//     </div>
//   );
// }