// src/app/datatables/components/patient-diagnosis-table-row.tsx
import { PatientDiagnosisData } from '../types';

interface PatientDiagnosisTableRowProps {
  diagnosis: PatientDiagnosisData;
}

export function PatientDiagnosisTableRow({ diagnosis }: PatientDiagnosisTableRowProps) {
  return (
    <>
      <td className="px-4 py-3 text-sm font-mono">{diagnosis.patient_diagnosis_id}</td>
      <td className="px-4 py-3 text-sm font-mono">{diagnosis.patient_track_id}</td>
      <td className="px-4 py-3 text-sm">
        {diagnosis.is_diabetes_diagnosis ? 'Yes' : 'No'}
      </td>
      <td className="px-4 py-3 text-sm">
        {diagnosis.diabetes_year_of_diagnosis || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {diagnosis.is_htn_diagnosis ? 'Yes' : 'No'}
      </td>
      <td className="px-4 py-3 text-sm">
        {diagnosis.htn_year_of_diagnosis || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(diagnosis.updated_at).toLocaleDateString()}
      </td>
    </>
  );
}