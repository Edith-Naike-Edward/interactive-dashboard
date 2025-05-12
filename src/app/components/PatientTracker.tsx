// // components/PatientTracker.tsx
// import React, { useState, useEffect } from 'react';
// import { Patient, ProgressData } from '../types';
// import { fetchPatientProgress } from '../services/api';
// import { 
//   LineChart, Line, XAxis, YAxis, CartesianGrid, 
//   Tooltip, Legend, ResponsiveContainer 
// } from 'recharts';

// interface PatientTrackerProps {
//   patient: Patient;
// }

// const PatientTracker: React.FC<PatientTrackerProps> = ({ patient }) => {
//   const [progressData, setProgressData] = useState<ProgressData[]>([]);
//   const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['bloodPressure', 'glucoseLevel']);
//   const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   const availableMetrics = [
//     { id: 'bloodPressure', name: 'Blood Pressure' },
//     { id: 'glucoseLevel', name: 'Glucose Level' },
//     { id: 'cholesterol', name: 'Cholesterol' },
//     { id: 'heartRate', name: 'Heart Rate' },
//     { id: 'weight', name: 'Weight' },
//     { id: 'temperature', name: 'Temperature' }
//   ];

//   const colorMap: Record<string, string> = {
//     bloodPressure: '#8884d8',
//     glucoseLevel: '#82ca9d',
//     cholesterol: '#ffc658',
//     heartRate: '#ff8042',
//     weight: '#0088fe',
//     temperature: '#ff0000'
//   };

//   useEffect(() => {
//     const loadProgressData = async () => {
//       setIsLoading(true);
//       try {
//         const data = await fetchPatientProgress(patient.id, timeRange);
//         setProgressData(data);
//       } catch (error) {
//         console.error('Failed to fetch patient progress:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     loadProgressData();
//   }, [patient.id, timeRange]);

//   const handleMetricToggle = (metricId: string) => {
//     if (selectedMetrics.includes(metricId)) {
//       setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
//     } else {
//       setSelectedMetrics([...selectedMetrics, metricId]);
//     }
//   };

//   const calculateProgress = (metric: string) => {
//     if (progressData.length < 2) return { change: 0, isPositive: true };
    
//     const latestValue = progressData[progressData.length - 1][metric as keyof typeof progressData[0]] as number;
//     const previousValue = progressData[0][metric as keyof typeof progressData[0]] as number;
//     const change = parseFloat(((latestValue - previousValue) / previousValue * 100).toFixed(1));
    
//     // Some metrics like cholesterol, glucose - lower is better
//     const lowerIsBetter = ['cholesterol', 'glucoseLevel'].includes(metric);
//     const isPositive = lowerIsBetter ? change <= 0 : change >= 0;
    
//     return { change: Math.abs(change), isPositive };
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       <div className="border-b border-gray-200 pb-4 mb-4">
//         <h2 className="text-xl font-semibold">Patient Progress Tracker</h2>
//         <div className="mt-1 flex flex-wrap items-center gap-2">
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//             ID: {patient.id}
//           </span>
//           <span className="text-gray-500 text-sm">
//             {patient.firstName} {patient.lastName} • {patient.age} years • {patient.gender}
//           </span>
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//             {patient.condition}
//           </span>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Sidebar Controls */}
//         <div className="lg:col-span-1 space-y-6">
//           {/* Time Range Selector */}
//           <div>
//             <h3 className="text-lg font-medium mb-2">Time Range</h3>
//             <div className="flex flex-wrap gap-2">
//               {[
//                 { value: '1m', label: '1 Month' },
//                 { value: '3m', label: '3 Months' },
//                 { value: '6m', label: '6 Months' },
//                 { value: '1y', label: '1 Year' }
//               ].map(option => (
//                 <button
//                   key={option.value}
//                   className={`px-3 py-1 text-sm font-medium rounded-md ${
//                     timeRange === option.value
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                   onClick={() => setTimeRange(option.value as any)}
//                 >
//                   {option.label}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           {/* Metrics Selector */}
//           <div>
//             <h3 className="text-lg font-medium mb-2">Metrics</h3>
//             <div className="space-y-2">
//               {availableMetrics.map(metric => (
//                 <div key={metric.id} className="flex items-center">
//                   <input
//                     id={`metric-${metric.id}`}
//                     type="checkbox"
//                     checked={selectedMetrics.includes(metric.id)}
//                     onChange={() => handleMetricToggle(metric.id)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label
//                     htmlFor={`metric-${metric.id}`}
//                     className="ml-2 flex items-center"
//                   >
//                     <span
//                       className="inline-block w-3 h-3 rounded-full mr-2"
//                       style={{ backgroundColor: colorMap[metric.id] }}
//                     ></span>
//                     <span className="text-sm text-gray-700">{metric.name}</span>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Key Insights */}
//           <div>
//             <h3 className="text-lg font-medium mb-2">Insights</h3>
//             <div className="space-y-3">
//               {selectedMetrics.map(metric => {
//                 const { change, isPositive } = calculateProgress(metric);
//                 const metricName = availableMetrics.find(m => m.id === metric)?.name || metric;
                
//                 return (
//                   <div key={metric} className="bg-gray-50 p-3 rounded-md">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">{metricName}</span>
//                       <span className={`inline-flex items-center text-sm font-medium ${
//                         isPositive ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {isPositive ? (
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
//                           </svg>
//                         ) : (
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
//                           </svg>
//                         )}
//                         {change}%
//                       </span>
//                     </div>
                    
//                     <div className="mt-1">
//                       <div className="text-sm text-gray-500">
//                         {isPositive 
//                           ? 'Improving trend' 
//                           : 'Declining trend'}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
              
//               {selectedMetrics.length === 0 && (
//                 <div className="bg-gray-50 p-3 rounded-md text-center text-gray-500 text-sm">
//                   Select metrics to see insights
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {/* Main Chart Area */}
//         <div className="lg:col-span-2">
//           {isLoading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="text-center">
//                 <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="mt-2 text-gray-600">Loading patient data...</p>
//               </div>
//             </div>
//           ) : progressData.length > 0 ? (
//             <div>
//               <h3 className="text-lg font-medium mb-4">Progress Chart</h3>
//               <div className="bg-white p-4 rounded-lg border border-gray-200 h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={progressData}
//                     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     {selectedMetrics.map(metric => (
//                       <Line
//                         key={metric}
//                         type="monotone"
//                         dataKey={metric}
//                         name={availableMetrics.find(m => m.id === metric)?.name}
//                         stroke={colorMap[metric]}
//                         activeDot={{ r: 8 }}
//                       />
//                     ))}
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
              
//               {/* Latest Readings */}
//               <div className="mt-6">
//                 <h3 className="text-lg font-medium mb-2">Latest Readings</h3>
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Date
//                           </th>
//                           {selectedMetrics.map(metric => (
//                             <th key={metric} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               {availableMetrics.find(m => m.id === metric)?.name}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {progressData.slice(-5).reverse().map((record, idx) => (
//                           <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {record.date}
//                             </td>
//                             {selectedMetrics.map(metric => (
//                               <td key={metric} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {record[metric as keyof typeof record]}
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
//               <div className="text-center p-4">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                 </svg>
//                 <p className="mt-1 text-sm text-gray-500">No progress data available for this patient.</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientTracker;