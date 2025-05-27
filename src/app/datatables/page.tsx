// // // app/data-tables/data-tables.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TableType,
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

interface FilterState {
  ageGroup?: string;
  category?: string;
  name?: string; // For screening table, used for patient name search
  glucoseType?: string; // For glucose log table, used for condition search
  bmi?: string; // For screening table, used for BMI search
  siteName?: string; // For screening table, used for site name search
  condition?: string;
  county?: string;
  gender?: string;
  riskLevel?: string;
  startDate?: string;
  endDate?: string;
  // New filter fields
  diagnosisType?: string;
  lifestyleType?: string;
  complianceType?: string;
  visitType?: string;
  hasPrescription?: string;
  hasInvestigation?: string;
  hasMedicalReview?: string;
  complaintSearch?: string;
  clinicalNoteSearch?: string;
}

export default function DataTables() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeTable, setActiveTable] = useState('patient-table');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const { data: apiData, loading, error, refresh } = useApiData();

  // Define available tables
  const dataTables: TableType[] = [
    {
      id: 'patient-table',
      name: 'Patients',
      data: apiData?.patients || [],
      hasAnomalies: false
    },
    {
      id: 'glucose-log',
      name: 'Glucose Logs',
      data: apiData?.glucoseLogs || [],
      hasAnomalies: false
    },
    {
      id: 'bp-log',
      name: 'BP Logs',
      data: apiData?.bpLogs || [],
      hasAnomalies: false
    },
    {
      id: 'diagnosis',
      name: 'Diagnoses',
      data: apiData?.diagnoses || [],
      hasAnomalies: false
    },
    {
      id: 'lifestyle',
      name: 'Lifestyles',
      data: apiData?.lifestyles || [],
      hasAnomalies: false
    },
    {
      id: 'compliance',
      name: 'Medical Compliance',
      data: apiData?.compliances || [],
      hasAnomalies: false
    },
    {
      id: 'visit',
      name: 'Visits',
      data: apiData?.visits || [],
      hasAnomalies: false
    },
    {
      id: 'review',
      name: 'Medical Reviews',
      data: apiData?.medical_reviews || [],
      hasAnomalies: false
    },
    {
      id: 'screening',
      name: 'Screenings',
      data: apiData?.screenings || [],
      hasAnomalies: false
    }
  ];

  // Get current table data
  const currentTable = dataTables.find(table => table.id === activeTable);
  const tableData = currentTable?.data || [];

  // Filter data based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(tableData);
      return;
    }
  
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = tableData.filter((item: any) => {
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowerQuery)
      );
    });
  
    setFilteredData(filtered);
  }, [searchQuery, tableData]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // const newUrl = `?page=${page}`;
    // router.push(newUrl);
  };

  useEffect(() => {
  console.log('API Data Loaded:', {
    diagnoses: apiData?.diagnoses?.length,
    lifestyles: apiData?.lifestyles?.length,
    compliances: apiData?.compliances?.length,
    visits: apiData?.visits?.length,
    medical_reviews: apiData?.medical_reviews?.length
  });
}, [apiData]);
  
  // // Update this useEffect to include filters in dependencies
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage, activeTable, filters]); // Added filters here

  // Add this useEffect hook to your DataTables component, right after the existing search query useEffect
  useEffect(() => {
    console.log('--- FILTERING DEBUG START ---');
    console.log('Active table:', activeTable);
    console.log('Current filters:', filters);
    console.log('Search query:', searchQuery);
    console.log('Original table data:', tableData);
    let result = tableData;

    // Apply search filter if exists
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((item: any) => {
        return Object.values(item).some(value =>
          String(value).toLowerCase().includes(lowerQuery)
        );
      });
    }

    // Apply other filters
    if (Object.keys(filters).length > 0) {
      console.log('Applying filters:', filters);
      console.log('Before filtering:', result);
      result = result.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true; // Skip empty filters

          // Table-specific filtering logic
                  // Use the same IDs as in dataTables
        switch (activeTable) {
          case 'patient-table':
            return filterPatientTable(item, key, value);
          case 'screening':
            return filterScreeningTable(item, key, value);
          case 'bp-log':
            return filterBpLog(item, key, value);
          case 'glucose-log':
            return filterGlucoseLog(item, key, value);
          case 'diagnosis':
            return filterDiagnosis(item, key, value);
          case 'lifestyle':
            return filterLifestyleTable(item, key, value);
          case 'compliance':
            return filterComplianceTable(item, key, value);
          case 'visit':
            return filterVisitTable(item, key, value);
          case 'review':
            return filterMedicalReviewTable(item, key, value);
          default:
            return true;
        }
        });
      });
    }

    setFilteredData(result);
  }, [searchQuery, tableData, filters, activeTable]);

  useEffect(() => {
  console.log('Filtered Data:', {
    activeTable,
    filteredDataLength: filteredData.length,
    currentItemsLength: currentItems.length,
    totalPages
  });
}, [filteredData, activeTable]);

  useEffect(() => {
  if (!searchQuery && Object.keys(filters).length === 0 && tableData.length > 0) {
    setFilteredData(tableData);
  }
}, [tableData, searchQuery, filters]);


  // Add these filter functions right before your component's return statement
  const filterPatientTable = (item: any, key: string, value: string): boolean => {
    switch (key) {
      case 'ageGroup':
        if (!value) return true;
        const [min, max] = value.split('-').map(Number);
        return item.age >= min && item.age <= max;
      
      case 'condition':
        if (!value) return true;
        return item.conditions?.toLowerCase().includes(value.toLowerCase());
      
      case 'county':
        if (!value) return true;
        return item.county_name?.toLowerCase().includes(value.toLowerCase());
      
      case 'gender':
        if (!value) return true;
        return item.gender?.toUpperCase() === value.toUpperCase();
      
      case 'startDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) >= new Date(value);
      
      case 'endDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) <= new Date(value);
      
      default:
        return true;
    }
  };

  const filterBpLog = (item: any, key: string, value: string): boolean => {
    switch (key) {
      case 'riskLevel':
        if (!value) return true;
        return item.riskLevel?.toLowerCase() === value.toLowerCase();
      
      case 'startDate':
        if (!value || !item.date) return true;
        return new Date(item.date) >= new Date(value);
      
      case 'endDate':
        if (!value || !item.date) return true;
        return new Date(item.date) <= new Date(value);
      
      default:
        return true;
    }
  };

  const filterGlucoseLog = (item: any, key: string, value: string): boolean => {
    switch (key) {
      case 'condition': // Used for glucose type in this table
        if (!value) return true;
        return item.type?.toLowerCase() === value.toLowerCase();
      
      case 'startDate':
        if (!value || !item.dateTime) return true;
        return new Date(item.dateTime) >= new Date(value);
      
      case 'endDate':
        if (!value || !item.dateTime) return true;
        return new Date(item.dateTime) <= new Date(value);
      
      default:
        return true;
    }
  };

  const filterDiagnosis = (item: any, key: string, value: string): boolean => {
    switch (key) {
      case 'condition':
        if (!value) return true;
        if (value === 'diabetes') return item.diabetes;
        if (value === 'hypertension') return item.htn;
        return true;
      
      case 'startDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) >= new Date(value);
      
      case 'endDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) <= new Date(value);
      
      default:
        return true;
    }
  };

  const filterLifestyleTable = (item: any, key: string, value: string): boolean => {
    switch (key) {
      case 'lifestyle':
        if (!value) return true;
        return item.lifestyleName?.toLowerCase().includes(value.toLowerCase());
      
      case 'answer':
        if (!value) return true;
        return item.lifestyleAnswer?.toLowerCase().includes(value.toLowerCase());
      
      case 'comments':
        if (!value) return true;
        return item.comments?.toLowerCase().includes(value.toLowerCase());
      
      case 'startDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) >= new Date(value);
      
      case 'endDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) <= new Date(value);
      
      default:
        return true;
    }
  }

    const filterComplianceTable = (item: any, key: string, value: string): boolean => {
    switch (key) {
      case 'compliance':
        if (!value) return true;
        return item.complianceName?.toLowerCase().includes(value.toLowerCase());
      
      case 'medicationName':
        if (!value) return true;
        return item.name?.toLowerCase().includes(value.toLowerCase());
      
      case 'startDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) >= new Date(value);
      
      case 'endDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) <= new Date(value);
      
      default:
        return true;
    }
  }
  const filterVisitTable = (item: any, key: string, value: string): boolean => {
    switch (key) {
      case 'prescription':
        if (!value) return true;
        return item.isPrescription ?.toLowerCase().includes(value.toLowerCase());
      case 'investigation':
        if (!value) return true;
        return item.isInvestigation ?.toLowerCase().includes(value.toLowerCase());
      case 'medicalReview':
        if (!value) return true;
        return item.isMedicalReview ?.toLowerCase().includes(value.toLowerCase());
      case 'startDate':
        if (!value || !item.visitDate) return true;
        return new Date(item.visitDate) >= new Date(value);
      case 'endDate':
        if (!value || !item.visitDate) return true;
        return new Date(item.visitDate) <= new Date(value);
      default:
        return true;
    }   
  }
  const filterMedicalReviewTable = (item: any, key: string, value: string): boolean => {
    switch (key) {
      case 'complaints':
        if (!value) return true;
        return item.complaints?.toLowerCase().includes(value.toLowerCase());
      case 'clinicalNotes':
        if (!value) return true;
        return item.clinicalNotes?.toLowerCase().includes(value.toLowerCase());
      case 'examNotes':
        if (!value) return true;
        return item.examNotes?.toLowerCase().includes(value.toLowerCase());
      case 'startDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) >= new Date(value);
      case 'endDate':
        if (!value || !item.lastUpdated) return true;
        return new Date(item.lastUpdated) <= new Date(value);
      default:
        return true;
    }
  }

  const filterScreeningTable = (item: any, key: string, value: string): boolean => {
  // if (!value) return true; // Early return for empty filters
  
  switch (key) {
    case 'name':
      return item.firstName?.toLowerCase().includes(value.toLowerCase()) ||
             item.lastName?.toLowerCase().includes(value.toLowerCase());
    case 'ageGroup':
      if (!value) return true;
      const [min, max] = value.split('-').map(Number);
      return item.age >= min && item.age <= max;
    case 'bmi':
      if (!value) return true;
      const bmiValue = parseFloat(value);
      if (isNaN(bmiValue)) return true; // Skip if value is not a number
      return item.bmi >= bmiValue; // Assuming item.bmi is a number
    case 'category':
      return item.category?.toLowerCase() === value.toLowerCase();
    case 'county_name':
      return item.county_name?.toLowerCase().includes(value.toLowerCase());
    case 'condition':
      return item.condition?.toLowerCase() === value.toLowerCase();
    case 'site_name':
      // return item.site_name?.toLowerCase().includes(value.toLowerCase());
      return item.site_name?.toLowerCase() === value.toLowerCase();
    case 'condition':
      return item.condition?.toLowerCase() === value.toLowerCase();
    case 'phq4_risk_level':
      return item.phq4_risk_level?.toLowerCase() === value.toLowerCase();
    case 'phq4_score':
      if (!value) return true;
      if (value === '0') return item.phq4_score === 0;
      if (value === '1-3') return item.phq4_score >= 1 && item.phq4_score <= 3;
      if (value === '4-6') return item.phq4_score >= 4 && item.phq4_score <= 6;
      if (value === '7-9') return item.phq4_score >= 7 && item.phq4_score <= 9;
      if (value === '10+') return item.phq4_score >= 10;
      return true;
    case 'cvd_risk_score':
      if (!value) return true;
      if ( value === '0' ) return item.cvd_risk_score === '0';
      if (value === '1-3') return item.cvd_risk_score >= 1 && item.cvd_risk_score <= 3;
      if (value === '4-5') return item.cvd_risk_score >= 4 && item.cvd_risk_score <= 5;
      if (value === '6-10') return item.cvd_risk_score >= 6 && item.cvd_risk_score <= 10;
      if (value === '11-15') return item.cvd_risk_score >= 11 && item.cvd_risk_score <= 15;
      if (value === '16-20') return item.cvd_risk_score >= 16 && item.cvd_risk_score <= 20;
      if (value === '21+') return item.cvd_risk_score >= 21;
      return true;
    case 'cvd_risk_level':
      if (!value) return true;
      if (value === 'Low') return item.cvd_risk_level?.toLowerCase() === 'low';
      if (value === 'Medium') return item.cvd_risk_level?.toLowerCase() === 'medium';
      if (value === 'High') return item.cvd_risk_level?.toLowerCase() === 'high';
      return true;
    case 'is_regular_smoker':
      return item.is_regular_smoker === (value.toLowerCase() === 'yes');
    case 'startDate':
      return item.date ? new Date(item.date) >= new Date(value) : true;
    case 'endDate':
      return item.date ? new Date(item.date) <= new Date(value) : true;
    default:
      return true;
  }
}

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

        {filterOpen && (
          <FilterPanel 
            activeTable={activeTable}
            onApply={(newFilters) => {
              setFilters(newFilters);
            }}
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
}

// Helper function to get columns for each table type
const getColumnsForTable = (tableId: string): string[] => {
  switch (tableId) {
    case 'patient-table':
      return ['ID', 'Name', 'Age', 'Gender', 'Location', 'Conditions', 'Insurance', 'Status', 'Last Updated'];
    case 'glucose-log':
      return ['Log ID', 'Patient Track ID', 'Glucose Value', 'Type', 'Date/Time', 'Last Meal', 'Status'];
    case 'bp-log':
      return ['Log ID', 'Patient Track ID', 'BP Reading', 'Pulse', 'BMI', 'Risk Level', 'Date'];
    case 'diagnosis':
      return ['Diagnosis ID', 'Patient Track ID', 'Diabetes', 'Year', 'HTN', 'Year', 'Last Updated'];
    case 'lifestyle':
      return ['Lifestyle ID', 'Patient Track ID', 'Lifestyle', 'Answer', 'Comments', 'Last Updated'];
    case 'compliance':
      return ['Compliance ID', 'Patient Track ID', 'Compliance', 'Medication Name', 'Last Updated'];
    case 'visit':
      return ['Visit ID', 'Patient ID', 'Visit Date', 'Prescription', 'Investigation', 'Review', 'Last Updated'];
    case 'review':
      return ['Review ID', 'Visit ID', 'Complaints', 'Clinical Notes', 'Exam Notes', 'Last Updated'];
    case 'screening':
      return ['Screening ID', 'Patient ID', 'Name', 'Age', 'BMI', 'Site Name', 'Site Category', 'BP', 'Glucose', 'Pulse', 'Phq4 Risk Level', 'Phq4 Score', 'CVD Risk Score', 'CVD Risk Level', 'National ID', 'Regular Smoker', 'Date'];
    default:
      return [];
  }
};

