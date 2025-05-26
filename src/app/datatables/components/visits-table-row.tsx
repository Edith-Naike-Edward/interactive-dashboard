// src/app/datatables/components/patient-visit-table-row.tsx
import { PatientVisit } from '../types';

interface PatientVisitTableRowProps {
  visit: PatientVisit;
}

export function PatientVisitTableRow({ visit }: PatientVisitTableRowProps) {
  return (
    <>
      <td className="px-4 py-3 text-sm font-mono">{visit.patient_visit_id}</td>
      <td className="px-4 py-3 text-sm font-mono">{visit.patient_id}</td>
      <td className="px-4 py-3 text-sm">
        {new Date(visit.visit_date).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-sm">
        {visit.is_prescription ? 'Yes' : 'No'}
      </td>
      <td className="px-4 py-3 text-sm">
        {visit.is_investigation ? 'Yes' : 'No'}
      </td>
      <td className="px-4 py-3 text-sm">
        {visit.is_medical_review ? 'Yes' : 'No'}
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(visit.updated_at).toLocaleDateString()}
      </td>
    </>
  );
}