// src/app/datatables/components/patient-table-row.tsx
import { PatientData } from '../types';
import { StatusBadge } from '../status-badge';

interface PatientTableRowProps {
  patient: PatientData;
}

export function PatientTableRow({ patient }: PatientTableRowProps) {
  return (
    <>
      <td className="px-4 py-3 text-sm font-mono">{patient.patient_id}</td>
      <td className="px-4 py-3 text-sm font-medium">
        {patient.first_name} {patient.middle_name && `${patient.middle_name} `}{patient.last_name}
        {patient.initial && <span className="text-xs text-gray-500 ml-1">({patient.initial})</span>}
      </td>
      <td className="px-4 py-3 text-sm">{patient.age}</td>
      <td className="px-4 py-3 text-sm">
        {patient.gender === 'M' ? 'Male' : 'Female'}
        {patient.is_pregnant && patient.gender === 'F' && (
          <span className="ml-1 text-xs text-purple-600">(Pregnant)</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        {patient.sub_county_name}, {patient.county_name}
        <div className="text-xs text-gray-500">{patient.site_name}</div>
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex space-x-2">
          {patient.has_hypertension && (
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">HTN</span>
          )}
          {patient.has_diabetes && (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">DM</span>
          )}
          {patient.has_mental_health_issue && (
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">MH</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        {patient.insurance_type}
        <div className="text-xs text-gray-500">{patient.insurance_status}</div>
      </td>
      <td className="px-4 py-3 text-sm">
        <StatusBadge status={patient.is_active ? 'Active' : 'Inactive'} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(patient.updated_at).toLocaleDateString()}
      </td>
    </>
  );
}