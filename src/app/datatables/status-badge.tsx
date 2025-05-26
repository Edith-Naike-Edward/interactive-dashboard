// src/app/datatables/components/status-badge.tsx
// interface StatusBadgeProps {
//   status: boolean;
// }

// export function StatusBadge({ status }: StatusBadgeProps) {
//   return (
//     <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
//       status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//     }`}>
//       {status ? 'Active' : 'Inactive'}
//     </span>
//   );
// }
// src/app/datatables/components/status-badge.tsx
interface StatusBadgeProps {
  status?: string;
  highClass?: string;
  mediumClass?: string;
  lowClass?: string;
  defaultClass?: string;
}

export function StatusBadge({ 
  status, 
  highClass = 'bg-red-100 text-red-800',
  mediumClass = 'bg-yellow-100 text-yellow-800',
  lowClass = 'bg-green-100 text-green-800',
  defaultClass = 'bg-gray-100 text-gray-800'
}: StatusBadgeProps) {
  const getClass = () => {
    if (!status) return defaultClass;
    if (status.toLowerCase().includes('high')) return highClass;
    if (status.toLowerCase().includes('medium')) return mediumClass;
    if (status.toLowerCase().includes('low')) return lowClass;
    return defaultClass;
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs ${getClass()}`}>
      {status || 'Unknown'}
    </span>
  );
}