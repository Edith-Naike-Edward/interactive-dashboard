// // components/PatientTable.tsx
// import React, { useState } from 'react';
// import { Patient } from '../types';

// interface PatientTableProps {
//   patients: Patient[];
//   onPatientSelect: (patient: Patient) => void;
// }

// const PatientTable: React.FC<PatientTableProps> = ({ patients, onPatientSelect }) => {
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof Patient;
//     direction: 'ascending' | 'descending';
//   } | null>(null);
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const [patientsPerPage] = useState(10);
  
//   // Sorting logic
//   const sortedPatients = React.useMemo(() => {
//     let sortablePatients = [...patients];
//     if (sortConfig !== null) {
//       sortablePatients.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortablePatients;
//   }, [patients, sortConfig]);

//   const requestSort = (key: keyof Patient) => {
//     let direction: 'ascending' | 'descending' = 'ascending';
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Pagination logic
//   const indexOfLastPatient = currentPage * patientsPerPage;
//   const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
//   const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);
//   const totalPages = Math.ceil(sortedPatients.length / patientsPerPage);
  
//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
//   // Rendering the sort direction indicator
//   const getSortDirectionIcon = (key: keyof Patient) => {
//     if (!sortConfig || sortConfig.key !== key) {
//       return <span className="ml-1">⇅</span>;
//     }
//     return sortConfig.direction === 'ascending' ? 
//       <span className="ml-1">↑</span> : 
//       <span className="ml-1">↓</span>;
//   };

//   return (
//     <div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => requestSort('id')}
//               >
//                 ID {getSortDirectionIcon('id')}
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => requestSort('firstName')}
//               >
//                 Name {getSortDirectionIcon('firstName')}
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => requestSort('age')}
//               >
//                 Age {getSortDirectionIcon('age')}
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => requestSort('gender')}
//               >
//                 Gender {getSortDirectionIcon('gender')}
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => requestSort('condition')}
//               >
//                 Condition {getSortDirectionIcon('condition')}
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => requestSort('county')}
//               >
//                 County {getSortDirectionIcon('county')}
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => requestSort('facility')}
//               >
//                 Facility {getSortDirectionIcon('facility')}
//               </th>
//               <th scope="col" className="relative px-6 py-3">
//                 <span className="sr-only">Actions</span>
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentPatients.length > 0 ? (
//               currentPatients.map((patient) => (
//                 <tr key={patient.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {patient.id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {patient.firstName} {patient.lastName}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {patient.age}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {patient.gender}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                       {patient.condition}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {patient.county}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {patient.facility}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => onPatientSelect(patient)}
//                       className="text-blue-600 hover:text-blue-900"
//                     >
//                       Track Progress
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
//                   No patients found matching the selected criteria.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{indexOfFirstPatient + 1}</span> to{' '}
//                 <span className="font-medium">
//                   {indexOfLastPatient > sortedPatients.length ? sortedPatients.length : indexOfLastPatient}
//                 </span>{' '}
//                 of <span className="font-medium">{sortedPatients.length}</span> patients
//               </p>
//             </div>
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
//                   disabled={currentPage === 1}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
//                     currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className="sr-only">Previous</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
                
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => paginate(i + 1)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                       currentPage === i + 1
//                         ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                         : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
                
//                 <button
//                   onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
//                   disabled={currentPage === totalPages}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
//                     currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className="sr-only">Next</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientTable;