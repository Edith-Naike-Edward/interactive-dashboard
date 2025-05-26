// // app/data-tables/data-tables.tsx
// "use client";
// app/data-tables/data-tables.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  PatientData,
  GlucoseLogData,
  BpLog,
  PatientDiagnosisData,
  PatientLifestyleData,
  PatientMedicalComplianceData,
  PatientVisit,
  PatientMedicalReview,
  Screening,
  TableType,
  AnomalyType,
  ChartDataType
} from './types';

import { TableView } from './views/table-view';
import { TableSelector } from './components/table-selector';
import { FilterPanel } from './components/filter-panel';
import { PaginationControls } from './components/pagination-controls';
import { AnalyticsView } from './views/analytics-view';
import { VisualizationsView } from './views/visualizations-view';
import { ViewModeSelector } from './components/view-mode-selector';
import { SearchBar } from './components/search-bar';
import { useApiData } from './hooks/use-api-data';
import { Spinner } from './components/spinner';

import { ChevronDownIcon, ChevronUpIcon, FilterIcon } from 'lucide-react';

type ViewMode = 'table' | 'analytics' | 'visualizations';

export default function DataTables() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeTable, setActiveTable] = useState('patient-table');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  
  const {
    data: apiData,
    loading,
    error,
    refresh
  } = useApiData();

  // Define available tables
  const dataTables: TableType[] = [
    {
      id: 'patient-table',
      name: 'Patients',
      data: apiData.patients,
      hasAnomalies: false
    },
    {
      id: 'glucose-log',
      name: 'Glucose Logs',
      data: apiData.glucoseLogs,
      hasAnomalies: false
    },
    {
      id: 'bp-log',
      name: 'BP Logs',
      data: apiData.bpLogs,
      hasAnomalies: false
    },
    {
      id: 'patient-diagnosis',
      name: 'Diagnoses',
      data: apiData.diagnoses,
      hasAnomalies: false
    },
    {
      id: 'patient-lifestyle',
      name: 'Lifestyles',
      data: apiData.lifestyles,
      hasAnomalies: false
    },
    {
      id: 'patient-medical-compliance',
      name: 'Medical Compliance',
      data: apiData.compliances,
      hasAnomalies: false
    },
    {
      id: 'patient-visit',
      name: 'Visits',
      data: apiData.visits,
      hasAnomalies: false
    },
    {
      id: 'patient-medical-review',
      name: 'Medical Reviews',
      data: apiData.medical_reviews,
      hasAnomalies: false
    },
    {
      id: 'screening',
      name: 'Screenings',
      data: apiData.screenings,
      hasAnomalies: false
    }
  ];

  // Get current table data
  const currentTable = dataTables.find(table => table.id === activeTable);
  const tableData = currentTable?.data || [];

  // Filter data based on search query
  const filteredData = tableData.filter((item: any) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    switch (activeTable) {
      case 'patient-table':
        const patient = item as PatientData;
        return (
          `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchLower) ||
          patient.patient_id.includes(searchQuery)
        );
      case 'glucose-log':
        const glucoseLog = item as GlucoseLogData;
        return (
          glucoseLog.glucose_value.toString().includes(searchQuery) ||
          glucoseLog.patient_id.includes(searchQuery)
        );
      case 'bp-log':
        const bpLog = item as BpLog;
        return (
          bpLog.patient_id.includes(searchQuery) ||
          `${bpLog.avg_systolic}/${bpLog.avg_diastolic}`.includes(searchQuery)
        );
      case 'patient-diagnosis':
        const diagnosis = item as PatientDiagnosisData;
        return (
          diagnosis.patient_diagnosis_id.includes(searchQuery) ||
          diagnosis.patient_track_id.includes(searchQuery)
        );
      case 'patient-lifestyle':
        const lifestyle = item as PatientLifestyleData;
        return (
          lifestyle.lifestyle_name.toLowerCase().includes(searchLower) ||
          lifestyle.lifestyle_answer.toLowerCase().includes(searchLower)
        );
      case 'patient-medical-compliance':
        const compliance = item as PatientMedicalComplianceData;
        return (
          compliance.compliance_name.toLowerCase().includes(searchLower) ||
          compliance.patient_track_id.includes(searchQuery)
        );
      case 'patient-visit':
        const visit = item as PatientVisit;
        return (
          visit.patient_visit_id.includes(searchQuery) ||
          visit.patient_id.includes(searchQuery)
        );
      case 'patient-medical-review':
        const review = item as PatientMedicalReview;
        return (
          review.patient_medical_review_id.includes(searchQuery) ||
          review.patient_visit_id.includes(searchQuery)
        );
      case 'screening':
        const screening = item as Screening;
        return (
          `${screening.first_name} ${screening.last_name}`.toLowerCase().includes(searchLower) ||
          screening.patient_id.includes(searchQuery) ||
          screening.screening_id.includes(searchQuery)
        );
      default:
        return true;
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update URL without page reload
    const newUrl = `?page=${page}`;
    router.push(newUrl);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage, activeTable]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Tables</h1>
              <p className="text-sm text-gray-500">View, analyze, and visualize healthcare data</p>
            </div>
            
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              onRefresh={refresh}
            />
          </div>
          
          <TableSelector 
            tables={dataTables}
            activeTable={activeTable}
            onChange={setActiveTable}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* View mode selector */}
        <ViewModeSelector 
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Filter controls */}
        <div className="mb-4 flex items-center justify-between">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FilterIcon className="mr-2 text-gray-500" />
            <span className="text-sm">Filters</span>
            {filterOpen ? <ChevronUpIcon className="ml-2" /> : <ChevronDownIcon className="ml-2" />}
          </button>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <FilterPanel 
            activeTable={activeTable}
            onApply={() => setFilterOpen(false)}
          />
        )}

        {/* Content based on view mode */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            Error: {error.message}
          </div>
        ) : (
          <>
            {viewMode === 'table' && (
              <TableView 
                activeTable={activeTable}
                currentItems={currentItems}
                columns={getColumnsForTable(activeTable)}
              />
            )}

            {viewMode === 'analytics' && (
              <AnalyticsView 
                activeTable={activeTable}
                data={filteredData}
              />
            )}

            {viewMode === 'visualizations' && (
              <VisualizationsView 
                activeTable={activeTable}
                data={filteredData}
              />
            )}

            {/* Pagination - only shown for table view */}
            {viewMode === 'table' && filteredData.length > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Helper function to get columns for each table type
const getColumnsForTable = (tableId: string): string[] => {
  switch (tableId) {
    case 'patient-table':
      return ['ID', 'Name', 'Age', 'Gender', 'Location', 'Conditions', 'Insurance', 'Status', 'Last Updated'];
    case 'glucose-log':
      return ['Log ID', 'Patient Track ID', 'Glucose Value', 'Type', 'Date/Time', 'Last Meal', 'Status'];
    case 'bp-log':
      return ['Log ID', 'Patient Track ID', 'BP Reading', 'Pulse', 'BMI', 'Risk Level', 'Date'];
    case 'patient-diagnosis':
      return ['Diagnosis ID', 'Patient Track ID', 'Diabetes', 'Year', 'HTN', 'Year', 'Last Updated'];
    case 'patient-lifestyle':
      return ['Lifestyle ID', 'Patient Track ID', 'Lifestyle', 'Answer', 'Comments', 'Last Updated'];
    case 'patient-medical-compliance':
      return ['Compliance ID', 'Patient Track ID', 'Compliance', 'Medication Name', 'Last Updated'];
    case 'patient-visit':
      return ['Visit ID', 'Patient ID', 'Visit Date', 'Prescription', 'Investigation', 'Review', 'Last Updated'];
    case 'patient-medical-review':
      return ['Review ID', 'Visit ID', 'Complaints', 'Clinical Notes', 'Exam Notes', 'Last Updated'];
    case 'screening':
      return ['Screening ID', 'Patient ID', 'Name', 'Age', 'BP', 'Glucose', 'Risk Level', 'Date'];
    default:
      return [];
  }
};
