// src/app/datatables/components/screening-table-row.tsx
import { Screening } from '../types';
import { StatusBadge } from '../status-badge';

interface ScreeningTableRowProps {
  screening: Screening;
}

export function ScreeningTableRow({ screening }: ScreeningTableRowProps) {
  return (
    <>
      <td className="px-4 py-3 text-sm font-mono">{screening.screening_id}</td>
      <td className="px-4 py-3 text-sm font-mono">{screening.patient_id}</td>
      <td className="px-4 py-3 text-sm font-medium">
        {screening.first_name} {screening.last_name}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.age}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.avg_systolic}/{screening.avg_diastolic} mmHg
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.glucose_value} mg/dL ({screening.glucose_type})
      </td>
      <td className="px-4 py-3 text-sm">
        <StatusBadge 
          status={screening.cvd_risk_level} 
          highClass="bg-red-100 text-red-800"
          mediumClass="bg-yellow-100 text-yellow-800"
          lowClass="bg-green-100 text-green-800"
        />
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(screening.updated_at).toLocaleDateString()}
      </td>
    </>
  );
}