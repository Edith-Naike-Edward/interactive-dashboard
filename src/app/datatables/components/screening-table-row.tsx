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
        {typeof screening.bmi === 'number' ? `${screening.bmi.toFixed(2)} kg/m²` : 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.site_name}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.category || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.avg_systolic}/{screening.avg_diastolic} mmHg
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.glucose_value} mg/dL ({screening.glucose_type})
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.avg_pulse} bpm
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.phq4_risk_level || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.phq4_score || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.cvd_risk_score || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.cvd_risk_level || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.national_id}
      </td>
      <td className="px-4 py-3 text-sm">
        {screening.is_regular_smoker ? 'Yes' : 'No'}
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(screening.updated_at).toLocaleDateString()}
      </td>
    </>
  );
}