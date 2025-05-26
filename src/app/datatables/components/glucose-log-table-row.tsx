// src/app/datatables/components/glucose-log-table-row.tsx
import { GlucoseLogData } from '../types';
import { StatusBadge } from '../status-badge';

interface GlucoseLogTableRowProps {
  log: GlucoseLogData;
}

export function GlucoseLogTableRow({ log }: GlucoseLogTableRowProps) {
  return (
    <>
      <td className="px-4 py-3 text-sm font-mono">{log.glucose_log_id}</td>
      <td className="px-4 py-3 text-sm font-mono">{log.patient_id}</td>
      <td className="px-4 py-3 text-sm font-medium">
        {log.glucose_value} mg/dL
      </td>
      <td className="px-4 py-3 text-sm">
        {log.glucose_type || 'Unknown'}
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(log.glucose_date_time).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm">
        {log.last_meal_time ? new Date(log.last_meal_time).toLocaleTimeString() : 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        <StatusBadge status={log.is_active ? 'Active' : 'Inactive'} />
      </td>
    </>
  );
}