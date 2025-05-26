// src/app/datatables/components/bp-log-table-row.tsx
import { BpLog } from '../types';
import {StatusBadge} from '../status-badge';

interface BpLogTableRowProps {
  log: BpLog;
}

export function BpLogTableRow({ log }: BpLogTableRowProps) {
  return (
    <>
      <td className="px-4 py-3 text-sm font-mono">{log.bplog_id}</td>
      <td className="px-4 py-3 text-sm font-mono">{log.patient_id}</td>
      <td className="px-4 py-3 text-sm font-medium">
        {log.avg_systolic}/{log.avg_diastolic} mmHg
      </td>
      <td className="px-4 py-3 text-sm">
        {log.avg_pulse} bpm
      </td>
      <td className="px-4 py-3 text-sm">
        {log.bmi ? log.bmi.toFixed(1) : 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-0.5 rounded text-xs ${
          log.cvd_risk_level === 'High' ? 'bg-red-100 text-red-800' :
          log.cvd_risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {log.cvd_risk_level || 'Unknown'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(log.updated_at).toLocaleDateString()}
      </td>
    </>
  );
}