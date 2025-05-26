// src/app/datatables/components/patient-medical-compliance-table-row.tsx
import { PatientMedicalComplianceData } from '../types';

interface PatientMedicalComplianceTableRowProps {
  compliance: PatientMedicalComplianceData;
}

export function PatientMedicalComplianceTableRow({ compliance }: PatientMedicalComplianceTableRowProps) {
  return (
    <>
      <td className="px-4 py-3 text-sm font-mono">{compliance.patient_medical_compliance_id}</td>
      <td className="px-4 py-3 text-sm font-mono">{compliance.patient_track_id}</td>
      <td className="px-4 py-3 text-sm font-medium">
        {compliance.compliance_name}
      </td>
      <td className="px-4 py-3 text-sm">
        {compliance.name}
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(compliance.updated_at).toLocaleDateString()}
      </td>
    </>
  );
}