// // // app/data-tables/views/table-view.tsx
import { PatientTableRow } from '../components/patient-table-row';
import { GlucoseLogTableRow } from '../components/glucose-log-table-row';
import { BpLogTableRow } from '../components/bp-log-table-row';
import { PatientDiagnosisTableRow } from '../components/diagnosis-table-row';
import { PatientLifestyleTableRow } from '../components/lifestyle-table-row';
import { PatientMedicalComplianceTableRow } from '../components/compliance-table-row';
import { PatientVisitTableRow } from '../components/visits-table-row';
import { PatientMedicalReviewTableRow } from '../components/review-table-row';
import { ScreeningTableRow } from '../components/screening-table-row';

import {
  PatientData,
  GlucoseLogData,
  BpLog,
  PatientDiagnosisData,
  PatientLifestyleData,
  PatientMedicalComplianceData,
  PatientVisit,
  PatientMedicalReview,
  Screening
} from '../types';

type TableItem = 
  | PatientData
  | GlucoseLogData
  | BpLog
  | PatientDiagnosisData
  | PatientLifestyleData
  | PatientMedicalComplianceData
  | PatientVisit
  | PatientMedicalReview
  | Screening;

type TableViewProps = {
  activeTable: string;
  currentItems: TableItem[];
  columns: string[];
};

const getRowKey = (item: TableItem, activeTable: string, index: number): string => {
  switch (activeTable) {
    case 'patient-table':
      return `patient-${(item as PatientData).patient_id || index}`;
    case 'glucose-log':
      return `glucose-${(item as GlucoseLogData).patient_id || 'unknown'}-${(item as GlucoseLogData).glucose_log_id || index}`;
    case 'bp-log':
      return `bp-${(item as BpLog).patient_id || 'unknown'}-${(item as BpLog).bplog_id || index}`;
    case 'patient-diagnosis':
      return `diagnosis-${(item as PatientDiagnosisData).patient_diagnosis_id || index}`;
    case 'patient-lifestyle':
      return `lifestyle-${(item as PatientLifestyleData).patient_lifestyle_id || index}`;
    case 'patient-medical-compliance':
      return `compliance-${(item as PatientMedicalComplianceData).patient_medical_compliance_id || index}`;
    case 'patient-visit':
      return `visit-${(item as PatientVisit).patient_visit_id || index}`;
    case 'patient-medical-review':
      return `review-${(item as PatientMedicalReview).patient_medical_review_id || index}`;
    case 'screening':
      return `screening-${(item as Screening).screening_id || index}`;
    default:
      return `row-${index}`;
  }
};

export const TableView = ({ activeTable, currentItems, columns }: TableViewProps) => {
  const renderTableRow = (item: TableItem) => {
    switch (activeTable) {
      case 'patient-table':
        return <PatientTableRow patient={item as PatientData} />;
      case 'glucose-log':
        return <GlucoseLogTableRow log={item as GlucoseLogData} />;
      case 'bp-log':
        return <BpLogTableRow log={item as BpLog} />;
      case 'patient-diagnosis':
        return <PatientDiagnosisTableRow diagnosis={item as PatientDiagnosisData} />;
      case 'patient-lifestyle':
        return <PatientLifestyleTableRow lifestyle={item as PatientLifestyleData} />;
      case 'patient-medical-compliance':
        return <PatientMedicalComplianceTableRow compliance={item as PatientMedicalComplianceData} />;
      case 'patient-visit':
        return <PatientVisitTableRow visit={item as PatientVisit} />;
      case 'patient-medical-review':
        return <PatientMedicalReviewTableRow review={item as PatientMedicalReview} />;
      case 'screening':
        return <ScreeningTableRow screening={item as Screening} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {currentItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={`${activeTable}-header-${index}`}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item, index) => (
                <tr 
                  key={getRowKey(item, activeTable, index)}
                  className="hover:bg-gray-50"
                >
                  {renderTableRow(item)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};
