"use client";
import { useState, useEffect } from 'react';
import { 
  Database, 
  Filter, 
  Search, 
  RefreshCcw, 
  Download, 
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Info,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

type PatientData = {
  patient_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: string;
  age: number;
  date_of_birth: string;
  national_id: string;
  initial: string;
  sub_county_name: string;
  sub_county_id: number;
  county_name: string;
  county_id: number;
  level_of_education: string;
  occupation: string;
  landmark: string;
  country_id: string;
  country_name: string;
  phone_number: string;
  phone_number_category: string;
  insurance_id: string;
  insurance_type: string;
  insurance_status: string;
  site_id: number;
  site_name: string;
  program_id: string;
  program_name: string;
  is_pregnant: boolean;
  is_support_group: boolean;
  is_regular_smoker: boolean;
  created_by: string;
  updated_by: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_deleted: boolean; 
  has_hypertension?: boolean;
  has_diabetes?: boolean;
  has_mental_health_issue?: boolean;
  on_htn_meds?: boolean;
  on_diabetes_meds?: boolean;
  on_mh_treatment?: boolean;
};

// Sample glucose log data
const glucoseLogSampleData = [
  { id: 1, patientId: "PT20250123", date: "2025-05-03", fasting: 145, postMeal: 210, bedtime: 160, notes: "Higher than usual" },
  { id: 2, patientId: "PT20250189", date: "2025-05-03", fasting: 125, postMeal: 165, bedtime: 140, notes: "Within normal range" },
  { id: 3, patientId: "PT20250206", date: "2025-05-02", fasting: 160, postMeal: 230, bedtime: 180, notes: "Missed morning medication" },
  { id: 4, patientId: "PT20250208", date: "2025-05-03", fasting: 130, postMeal: 175, bedtime: 145, notes: "" },
  { id: 5, patientId: "PT20250123", date: "2025-05-02", fasting: 150, postMeal: 205, bedtime: 165, notes: "" }
];

// Sample BP log data
const bpLogSampleData = [
  { id: 1, patientId: "PT20250167", date: "2025-05-03", systolic: 145, diastolic: 90, pulse: 78, notes: "Slightly elevated" },
  { id: 2, patientId: "PT20250204", date: "2025-05-03", systolic: 130, diastolic: 85, pulse: 72, notes: "" },
  { id: 3, patientId: "PT20250207", date: "2025-05-02", systolic: 155, diastolic: 95, pulse: 80, notes: "After exercise" },
  { id: 4, patientId: "PT20250167", date: "2025-05-02", systolic: 140, diastolic: 88, pulse: 75, notes: "" },
  { id: 5, patientId: "PT20250204", date: "2025-05-02", systolic: 135, diastolic: 82, pulse: 70, notes: "Morning reading" }
];

// Anomaly data
const anomalies: AnomalyType[] = [
  { tableId: "glucoselog", count: 12, message: "Patients with rapid glucose fluctuations" },
  { tableId: "bplog", count: 8, message: "Patients with consistently high BP readings" },
  { tableId: "compliance", count: 15, message: "Patients with missed medication doses" },
  { tableId: "redrisk", count: 5, message: "New high-risk patients identified" }
];

// Chart data
const chartData: ChartDataType[] = [
  {name: 'Type 2 Diabetes', count: 45},
  {name: 'Hypertension', count: 38},
  {name: 'Pre-diabetes', count: 27},
  {name: 'Obesity', count: 22},
  {name: 'Hyperlipidemia', count: 18}
];

// Component for table visualization buttons
const VisualizationButtons = ({ table }: { table: TableType }) => {
  return (
    <div className="flex space-x-2">
      <button 
        className="p-1 rounded hover:bg-indigo-100" 
        title="View line chart"
      >
        <LineChart size={18} className="text-indigo-600" />
      </button>
      <button 
        className="p-1 rounded hover:bg-indigo-100" 
        title="View bar chart"
      >
        <BarChart3 size={18} className="text-indigo-600" />
      </button>
      <button 
        className="p-1 rounded hover:bg-indigo-100" 
        title="View pie chart"
      >
        <PieChart size={18} className="text-indigo-600" />
      </button>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: "High Risk" | "Review Needed" | "Stable" | boolean }) => {
  if (typeof status === 'boolean') {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {status ? 'Active' : 'Inactive'}
      </span>
    );
  }

  let colorClass = "bg-gray-100 text-gray-800";
  
  if (status === "High Risk") {
    colorClass = "bg-red-100 text-red-800";
  } else if (status === "Review Needed") {
    colorClass = "bg-amber-100 text-amber-800";
  } else if (status === "Stable") {
    colorClass = "bg-green-100 text-green-800";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

// Anomaly indicator component
const AnomalyIndicator = ({ tableId }: { tableId: string }) => {
  const anomaly = anomalies.find(a => a.tableId === tableId);
  
  if (!anomaly) return null;
  
  return (
    <div className="flex items-center text-red-600">
      <AlertTriangle size={16} className="mr-1" />
      <span className="text-sm font-medium">{anomaly.count} anomalies detected</span>
    </div>
  );
};

const ConditionIndicator = ({ condition, type }: { condition: boolean, type: 'htn' | 'diabetes' | 'mental' }) => {
  const colors = {
    htn: condition ? 'bg-blue-500' : 'bg-gray-300',
    diabetes: condition ? 'bg-red-500' : 'bg-gray-300',
    mental: condition ? 'bg-purple-500' : 'bg-gray-300'
  };
  
  return (
    <span className={`inline-block w-3 h-3 rounded-full ${colors[type]}`}></span>
  );
};

// DataTable Row component to handle different table schemas
const DataTableRow = ({ 
  table, 
  item, 
  columns 
}: { 
  table: TableType; 
  item: any; 
  columns: string[] 
}) => {
  if (table.id === "patient-table") {
    const patientItem = item as PatientData;
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 text-sm font-mono">{patientItem.patient_id}</td>
        <td className="px-4 py-3 text-sm font-medium">
          {patientItem.first_name} {patientItem.middle_name && `${patientItem.middle_name} `}{patientItem.last_name}
          {patientItem.initial && <span className="text-xs text-gray-500 ml-1">({patientItem.initial})</span>}
        </td>
        <td className="px-4 py-3 text-sm">{patientItem.age}</td>
        <td className="px-4 py-3 text-sm">
          {patientItem.gender === 'M' ? 'Male' : 'Female'}
          {patientItem.is_pregnant && patientItem.gender === 'F' && (
            <span className="ml-1 text-xs text-purple-600">(Pregnant)</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm">
          {patientItem.sub_county_name}, {patientItem.county_name}
          <div className="text-xs text-gray-500">{patientItem.site_name}</div>
        </td>
        <td className="px-4 py-3 text-sm">
          <div className="flex space-x-2">
            <div className="flex items-center">
              <ConditionIndicator 
                condition={patientItem.has_hypertension || false} 
                type="htn" 
              />
              <span className="ml-1 text-xs">HTN</span>
            </div>
            <div className="flex items-center">
              <ConditionIndicator 
                condition={patientItem.has_diabetes || false} 
                type="diabetes" 
              />
              <span className="ml-1 text-xs">DM</span>
            </div>
            <div className="flex items-center">
              <ConditionIndicator 
                condition={patientItem.has_mental_health_issue || false} 
                type="mental" 
              />
              <span className="ml-1 text-xs">MH</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm">
          {patientItem.insurance_type}
          <div className="text-xs text-gray-500">{patientItem.insurance_status}</div>
        </td>
        <td className="px-4 py-3 text-sm">
          <StatusBadge status={patientItem.is_active} />
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {new Date(patientItem.updated_at).toLocaleDateString()}
        </td>
      </tr>
    );
  } else if (table.id === "glucoselog") {
    const glucoseItem = item as GlucoseLogData;
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 text-sm">{glucoseItem.id}</td>
        <td className="px-4 py-3 text-sm">{glucoseItem.patientId}</td>
        <td className="px-4 py-3 text-sm">{glucoseItem.date}</td>
        <td className="px-4 py-3 text-sm">{glucoseItem.fasting}</td>
        <td className="px-4 py-3 text-sm">{glucoseItem.postMeal}</td>
        <td className="px-4 py-3 text-sm">{glucoseItem.bedtime}</td>
        <td className="px-4 py-3 text-sm">{glucoseItem.notes}</td>
      </tr>
    );
  } else if (table.id === "bplog") {
    const bpItem = item as BPLogData;
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 text-sm">{bpItem.id}</td>
        <td className="px-4 py-3 text-sm">{bpItem.patientId}</td>
        <td className="px-4 py-3 text-sm">{bpItem.date}</td>
        <td className="px-4 py-3 text-sm">{bpItem.systolic}</td>
        <td className="px-4 py-3 text-sm">{bpItem.diastolic}</td>
        <td className="px-4 py-3 text-sm">{bpItem.pulse}</td>
        <td className="px-4 py-3 text-sm">{bpItem.notes}</td>
      </tr>
    );
  } else {
    // Generic row for tables without specific schema
    return (
      <tr className="hover:bg-gray-50">
        {columns.map((column: string, idx: number) => (
          <td key={idx} className="px-4 py-3 text-sm">
            {item[column.toLowerCase()] || "-"}
          </td>
        ))}
      </tr>
    );
  }
};

// Type definitions
type TableType = {
  id: string;
  name: string;
  data: any[];
  hasAnomalies: boolean;
};

type GlucoseLogData = {
  id: number;
  patientId: string;
  date: string;
  fasting: number;
  postMeal: number;
  bedtime: number;
  notes: string;
};

type BPLogData = {
  id: number;
  patientId: string;
  date: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  notes: string;
};

type AnomalyType = {
  tableId: string;
  count: number;
  message: string;
};

type ChartDataType = {
  name: string;
  count: number;
};


// Table headers for different tables
const getTableColumns = (tableId: string): string[] => {
  switch (tableId) {
    case "patient-table":
      return [
        "Patient ID", 
        "Full Name", 
        "Age", 
        "Gender", 
        "Location", 
        "Conditions", 
        "Insurance", 
        "Status",
        "Last Updated"
      ];
    case "glucoselog":
      return ["ID", "Patient ID", "Date", "Fasting", "Post-Meal", "Bedtime", "Notes"];
    case "bplog":
      return ["ID", "Patient ID", "Date", "Systolic", "Diastolic", "Pulse", "Notes"];
    case "diagnosis":
      return ["ID", "Patient ID", "Diagnosis", "Date", "Provider", "Severity", "Notes"];
    case "lifestyle":
      return ["ID", "Patient ID", "Exercise Freq", "Diet Quality", "Smoking", "Alcohol", "Sleep Hours", "Notes"];
    case "medical-review":
      return ["ID", "Patient ID", "Review Date", "Provider", "Findings", "Recommendations", "Next Review"];
    case "compliance":
      return ["ID", "Patient ID", "Medication", "Prescribed Date", "Compliance Rate", "Issues", "Notes"];
    case "screeninglog":
      return ["ID", "Patient ID", "Screening Type", "Date", "Result", "Follow-up Required", "Notes"];
    case "redrisk":
      return ["ID", "Patient ID", "Risk Factor", "Identified Date", "Severity", "Intervention", "Status"];
    default:
      return ["ID", "Name", "Details", "Status"];
  }
};

// Main component
export default function DataTablesPage() {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState("patient-table");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Change default to 5 to match your data
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 

    // Sample tables configuration
    const dataTables: TableType[] = [
      { id: "patient-table", name: "Patient Demographics", data: patients, hasAnomalies: false },
      { id: "glucoselog", name: "Glucose Logs", data: glucoseLogSampleData, hasAnomalies: true },
      { id: "diagnosis", name: "Patient Diagnosis", data: [], hasAnomalies: false },
      { id: "lifestyle", name: "Patient Lifestyle", data: [], hasAnomalies: false },
      { id: "medical-review", name: "Medical Reviews", data: [], hasAnomalies: false },
      { id: "compliance", name: "Medical Compliance", data: [], hasAnomalies: true },
      { id: "screeninglog", name: "Screening Logs", data: [], hasAnomalies: false },
      { id: "bplog", name: "BP Logs", data: bpLogSampleData, hasAnomalies: true },
      { id: "redrisk", name: "High Risk Patients", data: [], hasAnomalies: true }
    ];
  
    // Get current table data
    const currentTable = dataTables.find(table => table.id === activeTable);
    const tableColumns = getTableColumns(activeTable);

    // useEffect(() => {
    //   setCurrentPage(1);
    // }, [activeTable]);

    useEffect(() => {
      setCurrentPage(1); // Reset to first page when table or filters change
    }, [activeTable, searchQuery]);

   

    // Fetch patient data from API
    useEffect(() => {
      const fetchPatients = async () => {
        try {
          setLoading(true);
          setError(null);
          console.log('Fetching patients...'); 
          const response = await fetch('http://localhost:8000/api/patients');
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Received data:', data);
          setPatients(data);
        } catch (err) {
          console.error("Failed to fetch patients:", err);
          setError(err instanceof Error ? err.message : 'Failed to load patient data');
        } finally {
          setLoading(false);
        }
      };
  
      fetchPatients();
    }, []);

    // const filteredData = currentTable ? currentTable.data.filter(item => 
    //   Object.values(item).some(
    //     value => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    //   )
    // ) : [];
    // const filteredData = patients.filter(patient => 
    //   Object.values(patient).some(
    //     value => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    //   )
    // );
    const filteredData = currentTable ? currentTable.data.filter(item => {
      if (!item) return false;
      return Object.values(item).some(
        value => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }) : [];

     // Add this useEffect to log pagination changes
    useEffect(() => {
      console.log('Pagination updated:', {
        currentPage,
        itemsPerPage,
        filteredDataLength: filteredData.length,
        totalPages,
        showingItems: `${indexOfFirstItem}-${indexOfLastItem}`
      });
    }, [currentPage, itemsPerPage, filteredData.length]);

    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    console.log('Filtered data length:', filteredData.length);
    console.log('Current page:', currentPage);
    console.log('Items per page:', itemsPerPage);
    console.log('Showing items:', indexOfFirstItem, 'to', indexOfLastItem);
  
    // const PaginationControls = () => {
    //   if (loading) return null;
    //   if (filteredData.length == 0) return null;
    
    //   return (
    //     <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    //       <div className="flex-1 flex justify-between sm:hidden">
    //         <button
    //           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    //           disabled={currentPage === 1}
    //           className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
    //         >
    //           Previous
    //         </button>
    //         <button
    //           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    //           disabled={currentPage === totalPages}
    //           className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
    //         >
    //           Next
    //         </button>
    //       </div>
    //       <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
    //         <div>
    //           <p className="text-sm text-gray-700">
    //             Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
    //             <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> of{' '}
    //             <span className="font-medium">{filteredData.length}</span> results
    //           </p>
    //         </div>
    //         <div>
    //           <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
    //             <button
    //               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    //               disabled={currentPage === 1}
    //               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
    //             >
    //               <span className="sr-only">Previous</span>
    //               Previous
    //             </button>
                
    //             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    //               let pageNum;
    //               if (totalPages <= 5) {
    //                 pageNum = i + 1;
    //               } else if (currentPage <= 3) {
    //                 pageNum = i + 1;
    //               } else if (currentPage >= totalPages - 2) {
    //                 pageNum = totalPages - 4 + i;
    //               } else {
    //                 pageNum = currentPage - 2 + i;
    //               }
                  
    //               return (
    //                 <button
    //                   key={pageNum}
    //                   onClick={() => setCurrentPage(pageNum)}
    //                   className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
    //                     currentPage === pageNum
    //                       ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
    //                       : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
    //                   }`}
    //                 >
    //                   {pageNum}
    //                 </button>
    //               );
    //             })}
    
    //             {totalPages > 5 && currentPage < totalPages - 2 && (
    //               <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
    //                 ...
    //               </span>
    //             )}
    
    //             {totalPages > 5 && currentPage < totalPages - 2 && (
    //               <button
    //                 onClick={() => setCurrentPage(totalPages)}
    //                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
    //               >
    //                 {totalPages}
    //               </button>
    //             )}
    
    //             <button
    //               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    //               disabled={currentPage === totalPages}
    //               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
    //             >
    //               <span className="sr-only">Next</span>
    //               Next
    //             </button>
    //           </nav>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };
    const PaginationControls = () => {
      // Debug why controls might not show
      console.log('PaginationControls render:', {
        hasData: filteredData.length > 0,
        loading,
        currentPage,
        totalPages
      });
    
      if (filteredData.length === 0) return null;
    
      return (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          {/* Mobile view */}
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => {
                console.log('Previous button clicked');
                setCurrentPage(prev => Math.max(prev - 1, 1));
              }}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                console.log('Next button clicked');
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
              }}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
    
          {/* Desktop view - simplified for debugging */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> of{' '}
                <span className="font-medium">{filteredData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => {
                    console.log('First page clicked');
                    setCurrentPage(1);
                  }}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">First</span>
                  «
                </button>
                <button
                  onClick={() => {
                    console.log('Previous page clicked');
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  ‹
                </button>
    
                {/* Simplified page numbers for debugging */}
                <button
                  onClick={() => {
                    console.log('Page 1 clicked');
                    setCurrentPage(1);
                  }}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === 1
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  1
                </button>
    
                <button
                  onClick={() => {
                    console.log('Next page clicked');
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  ›
                </button>
                <button
                  onClick={() => {
                    console.log('Last page clicked');
                    setCurrentPage(totalPages);
                  }}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Last</span>
                  »
                </button>
              </nav>
            </div>
          </div>
        </div>
      );
    };

    // const PaginationControls = () => {
    //   // Always show if there's data, even if it fits on one page
    //   if (filteredData.length === 0) return null;
    
    //   return (
    //     <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    //       {/* Mobile view */}
    //       <div className="flex-1 flex justify-between sm:hidden">
    //         <button
    //           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    //           disabled={currentPage === 1}
    //           className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    //         >
    //           Previous
    //         </button>
    //         <span className="px-4 py-2 text-sm text-gray-700">
    //           Page {currentPage} of {totalPages}
    //         </span>
    //         <button
    //           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    //           disabled={currentPage === totalPages}
    //           className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    //         >
    //           Next
    //         </button>
    //       </div>
    
    //       {/* Desktop view */}
    //       <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
    //         <div>
    //           <p className="text-sm text-gray-700">
    //             Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
    //             <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> of{' '}
    //             <span className="font-medium">{filteredData.length}</span> results
    //           </p>
    //         </div>
    //         <div>
    //           <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
    //             <button
    //               onClick={() => setCurrentPage(1)}
    //               disabled={currentPage === 1}
    //               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    //             >
    //               <span className="sr-only">First</span>
    //               «
    //             </button>
    //             <button
    //               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    //               disabled={currentPage === 1}
    //               className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    //             >
    //               <span className="sr-only">Previous</span>
    //               ‹
    //             </button>
    
    //             {/* Page numbers */}
    //             {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
    //               <button
    //                 key={page}
    //                 onClick={() => setCurrentPage(page)}
    //                 className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
    //                   currentPage === page
    //                     ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
    //                     : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
    //                 }`}
    //               >
    //                 {page}
    //               </button>
    //             ))}
    
    //             <button
    //               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    //               disabled={currentPage === totalPages}
    //               className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    //             >
    //               <span className="sr-only">Next</span>
    //               ›
    //             </button>
    //             <button
    //               onClick={() => setCurrentPage(totalPages)}
    //               disabled={currentPage === totalPages}
    //               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    //             >
    //               <span className="sr-only">Last</span>
    //               »
    //             </button>
    //           </nav>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };

// DataTable Row component for patient table
const PatientTableRow = ({ patient }: { patient: PatientData }) => {
  return (
    <tr className="hover:bg-gray-50">
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
          <div className="flex items-center">
            <ConditionIndicator 
              condition={patient.has_hypertension || false} 
              type="htn" 
            />
            <span className="ml-1 text-xs">HTN</span>
          </div>
          <div className="flex items-center">
            <ConditionIndicator 
              condition={patient.has_diabetes || false} 
              type="diabetes" 
            />
            <span className="ml-1 text-xs">DM</span>
          </div>
          <div className="flex items-center">
            <ConditionIndicator 
              condition={patient.has_mental_health_issue || false} 
              type="mental" 
            />
            <span className="ml-1 text-xs">MH</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        {patient.insurance_type}
        <div className="text-xs text-gray-500">{patient.insurance_status}</div>
      </td>
      <td className="px-4 py-3 text-sm">
        <StatusBadge status={patient.is_active} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(patient.updated_at).toLocaleDateString()}
      </td>
    </tr>
  );
};

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/patients');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error("Failed to refresh patients:", err);
      setError(err instanceof Error ? err.message : 'Failed to refresh patient data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Page header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Tables</h1>
              <p className="text-sm text-gray-500">View, analyze, and visualize healthcare data</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search data..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button 
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={handleRefresh}
              >
                <RefreshCcw size={16} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Table selector */}
          <div className="px-6 pb-4 overflow-x-auto">
            <div className="flex space-x-1">
              {dataTables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => setActiveTable(table.id)}
                  className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap flex items-center
                    ${activeTable === table.id 
                      ? 'bg-white border-t border-l border-r border-gray-200 text-indigo-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {table.name}
                  {table.hasAnomalies && (
                    <AlertCircle size={14} className="ml-1 text-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* View mode selector */}
        <div className="bg-white border-b border-gray-200 px-6 py-2">
          <div className="flex space-x-4">
            <button 
              className={`px-3 py-1 text-sm font-medium rounded ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setViewMode('table')}
            >
              <span className="flex items-center">
                <Database size={16} className="mr-1" />
                Table View
              </span>
            </button>
            <button 
              className={`px-3 py-1 text-sm font-medium rounded ${viewMode === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setViewMode('analytics')}
            >
              <span className="flex items-center">
                <Activity size={16} className="mr-1" />
                Analytics
              </span>
            </button>
            <button 
              className={`px-3 py-1 text-sm font-medium rounded ${viewMode === 'visualizations' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setViewMode('visualizations')}
            >
              <span className="flex items-center">
                <BarChart3 size={16} className="mr-1" />
                Visualizations
              </span>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Anomaly alert if present */}
          {currentTable && currentTable.hasAnomalies && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AnomalyIndicator tableId={activeTable} />
              <p className="text-sm text-red-700 mt-1">
                {anomalies.find(a => a.tableId === activeTable)?.message}
              </p>
            </div>
          )}

          {/* Table filters */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={16} className="mr-2 text-gray-500" />
                <span className="text-sm">Filters</span>
                {filterOpen ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {currentTable && <VisualizationButtons table={currentTable} />}
              <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download size={16} className="mr-2 text-gray-500" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>

          {/* Filter panel */}
          {filterOpen && (
            <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filter fields specific to the table */}
                {activeTable === "patient-table" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        id="status-filter"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        aria-label="Filter by patient status"
                      >
                        <option value="">All Statuses</option>
                        <option value="High Risk">High Risk</option>
                        <option value="Review Needed">Review Needed</option>
                        <option value="Stable">Stable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                      <select 
                          id="diagnosis-filter"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          aria-label="Filter by diagnosis"
                        >
                        <option value="">All Diagnoses</option>
                        <option value="Type 2 Diabetes">Type 2 Diabetes</option>
                        <option value="Hypertension">Hypertension</option>
                        <option value="Pre-diabetes">Pre-diabetes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                        <span>-</span>
                        <input type="number" placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                  </>
                )}

                {activeTable === "glucoselog" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                      <div className="flex items-center space-x-2">
                      <input 
                        type="date" 
                        id="start-date"
                        className="w-1/2 p-2 border border-gray-300 rounded-md" 
                        aria-label="Start date"
                      />
                        <span>-</span>
                        <input 
                          type="date" 
                          id="end-date"
                          className="w-1/2 p-2 border border-gray-300 rounded-md" 
                          aria-label="End date"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fasting Range</label>
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                        <span>-</span>
                        <input type="number" placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post-Meal Range</label>
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                        <span>-</span>
                        <input type="number" placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                  </>
                )}

                {activeTable === "bplog" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                      <div className="flex items-center space-x-2">
                      <input 
                          type="date" 
                          id="bp-start-date"
                          className="w-1/2 p-2 border border-gray-300 rounded-md"
                          aria-label="Blood pressure log start date"
                        />
                        <span>-</span>
                        <input 
                          type="date" 
                          id="bp-end-date"
                          className="w-1/2 p-2 border border-gray-300 rounded-md"
                          aria-label="Blood pressure log end date"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Systolic Range</label>
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                        <span>-</span>
                        <input type="number" placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic Range</label>
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                        <span>-</span>
                        <input type="number" placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  Reset
                </button>
                <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* table view mode */}
          {viewMode === 'table' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {currentItems.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                  <div className="flex items-center mb-4">
                    <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-700">
                      Items per page:
                    </label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={(e) => {
                        const newValue = Number(e.target.value);
                        console.log('Items per page changed to:', newValue);
                        setItemsPerPage(newValue);
                        setCurrentPage(1); // Reset to first page
                      }}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {tableColumns.map((column, index) => (
                            <th 
                              key={index} 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              <div className="flex items-center">
                                {column}
                                <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                          <DataTableRow 
                            key={index} 
                            table={currentTable!} 
                            item={item} 
                            columns={tableColumns} 
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredData.length > 0 && <PaginationControls />}
                </>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                  <Database size={48} className="mb-4 opacity-30" />
                  <p className="text-lg font-medium">No data available</p>
                  <p className="text-sm">Try changing your filters or selecting a different table</p>
                </div>
              )}
            </div>
          )}
          {/* Analytics View */}
          {viewMode === 'analytics' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Data Analytics</h2>
              
              {activeTable === "patient-table" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-medium text-indigo-800 mb-2">Diagnosis Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500 italic">Chart visualization would appear here</p>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Patient Status</h3>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500 italic">Chart visualization would appear here</p>
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'analytics' && !['patient-table', 'glucoselog', 'bplog'].includes(activeTable) && (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                  <BarChart3 size={48} className="mb-4 opacity-30" />
                  <p className="text-lg font-medium">Analytics not available for this table</p>
                  <p className="text-sm">Select a different table to view analytics</p>
                </div>
              )}
            </div>
          )}

          {/* Visualizations View */}
          {viewMode === 'visualizations' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Data Visualizations</h2>
              <p className="text-gray-500 mb-6">Interactive visual representations of your data</p>
              
              {viewMode === 'visualizations' && !['patient-table', 'glucoselog'].includes(activeTable) && (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                  <PieChart size={48} className="mb-4 opacity-30" />
                  <p className="text-lg font-medium">Visualizations not available for this table</p>
                  <p className="text-sm">Select a different table to view visualizations</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}