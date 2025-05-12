// // components/DataSlicer.tsx
// import React, { useState, useEffect } from 'react';
// import { Patient, FilterOptions } from '../types';
// import FilterPanel from './FilterPanel';
// import PatientTable from './PatientTable';
// import VisualizationPanel from './VisualizationPanel';

// interface DataSlicerProps {
//   patients: Patient[];
//   onFilterChange: (filters: FilterOptions) => void;
//   onPatientSelect: (patient: Patient) => void;
// }

// const DataSlicer: React.FC<DataSlicerProps> = ({ patients, onFilterChange, onPatientSelect }) => {
//   const [filters, setFilters] = useState<FilterOptions>({
//     gender: 'all',
//     ageRange: { min: 0, max: 100 },
//     location: {
//       county: 'all',
//       facility: 'all'
//     },
//     demographics: {
//       condition: 'all'
//     }
//   });
  
//   const [activeView, setActiveView] = useState<'table' | 'visualization'>('table');
//   const [availableCounties, setAvailableCounties] = useState<string[]>([]);
//   const [availableFacilities, setAvailableFacilities] = useState<string[]>([]);
//   const [availableConditions, setAvailableConditions] = useState<string[]>([]);

//   useEffect(() => {
//     // Extract unique values for filter options
//     if (patients.length > 0) {
//       const counties = [...new Set(patients.map(p => p.county))];
//       const facilities = [...new Set(patients.map(p => p.facility))];
//       const conditions = [...new Set(patients.map(p => p.condition))];
      
//       setAvailableCounties(counties);
//       setAvailableFacilities(facilities);
//       setAvailableConditions(conditions);
//     }
//   }, [patients]);

//   const handleFilterUpdate = (updatedFilters: FilterOptions) => {
//     setFilters(updatedFilters);
//     onFilterChange(updatedFilters);
//   };

//   return (
//     <div className="grid grid-cols-12 gap-4">
//       {/* Filter Panel - Left Sidebar */}
//       <div className="col-span-3 bg-white rounded-lg shadow-md p-4">
//         <FilterPanel 
//           filters={filters} 
//           onFilterChange={handleFilterUpdate}
//           counties={availableCounties}
//           facilities={availableFacilities}
//           conditions={availableConditions}
//         />
//       </div>
      
//       {/* Main Content Area */}
//       <div className="col-span-9">
//         <div className="bg-white rounded-lg shadow-md p-4 mb-4">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium">Patient Data Analysis</h3>
//             <div className="inline-flex rounded-md shadow-sm" role="group">
//               <button
//                 type="button"
//                 onClick={() => setActiveView('table')}
//                 className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
//                   activeView === 'table' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
//                 }`}
//               >
//                 Table View
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setActiveView('visualization')}
//                 className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
//                   activeView === 'visualization' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
//                 }`}
//               >
//                 Visualization
//               </button>
//             </div>
//           </div>

//           <div className="bg-gray-50 p-2 mb-4 rounded">
//             <p className="text-sm text-gray-700">
//               <span className="font-medium">Filtered Results:</span> {patients.length} patients
//             </p>
            
//             {/* Active Filters Display */}
//             <div className="flex flex-wrap gap-2 mt-2">
//               {filters.gender !== 'all' && (
//                 <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                   Gender: {filters.gender}
//                 </span>
//               )}
              
//               {(filters.ageRange.min > 0 || filters.ageRange.max < 100) && (
//                 <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                   Age: {filters.ageRange.min}-{filters.ageRange.max}
//                 </span>
//               )}
              
//               {filters.location.county !== 'all' && (
//                 <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                   County: {filters.location.county}
//                 </span>
//               )}
              
//               {filters.location.facility !== 'all' && (
//                 <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                   Facility: {filters.location.facility}
//                 </span>
//               )}
              
//               {filters.demographics.condition !== 'all' && (
//                 <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                   Condition: {filters.demographics.condition}
//                 </span>
//               )}
//             </div>
//           </div>

//           {activeView === 'table' ? (
//             <PatientTable patients={patients} onPatientSelect={onPatientSelect} />
//           ) : (
//             <VisualizationPanel patients={patients} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataSlicer;