// src/app/datatables/components/patient-lifestyle-table-row.tsx
import { PatientLifestyleData } from '../types';

interface PatientLifestyleTableRowProps {
  lifestyle: PatientLifestyleData;
}

export function PatientLifestyleTableRow({ lifestyle }: PatientLifestyleTableRowProps) {
  return (
    <>
      <td className="px-4 py-3 text-sm font-mono">{lifestyle.patient_lifestyle_id}</td>
      <td className="px-4 py-3 text-sm font-mono">{lifestyle.patient_track_id}</td>
      <td className="px-4 py-3 text-sm font-medium">
        {lifestyle.lifestyle_name}
      </td>
      <td className="px-4 py-3 text-sm">
        {lifestyle.lifestyle_answer}
      </td>
      <td className="px-4 py-3 text-sm">
        {lifestyle.comments || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(lifestyle.updated_at).toLocaleDateString()}
      </td>
    </>
  );
}