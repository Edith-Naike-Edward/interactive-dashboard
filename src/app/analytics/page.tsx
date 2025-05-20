// 'use client';

// import React, { useState, useEffect } from 'react';
// import { 
//   BarChart, 
//   LineChart, 
//   PieChart, 
//   ComposedChart,
//   ScatterChart,
//   RadarChart,
//   Bar, 
//   Line, 
//   Pie, 
//   Scatter,
//   Radar,
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer,
//   Cell,
//   ReferenceLine,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis
// } from 'recharts';
// import { 
//   Users, 
//   Building2, 
//   Activity, 
//   Heart, 
//   ChevronDown, 
//   Search, 
//   Filter, 
//   Calendar, 
//   MapPin, 
//   UserPlus 
// } from 'lucide-react';
// import * as _ from 'lodash';

// // Types
// interface Patient {
//   id: string;
//   name: string;
//   age: number;
//   gender: 'Male' | 'Female' | 'Other';
//   location: {
//     county: string;
//     country: string;
//   };
//   site: string;
//   assignedDoctor: string;
//   diagnoses: Diagnosis[];
//   bloodGlucoseReadings: BloodGlucoseReading[];
//   bloodPressureReadings: BloodPressureReading[];
// }

// interface User {
//   id: string;
//   name: string;
//   role: 'Doctor' | 'Nurse' | 'Admin';
//   site: string;
//   patientsCount: number;
// }

// interface Site {
//   id: string;
//   name: string;
//   location: {
//     county: string;
//     country: string;
//   };
//   patientsCount: number;
//   staffCount: number;
// }

// interface Diagnosis {
//   id: string;
//   patientId: string;
//   condition: string;
//   diagnosedDate: string;
//   severity: 'Mild' | 'Moderate' | 'Severe';
//   status: 'Active' | 'Resolved' | 'Managed';
// }

// interface BloodGlucoseReading {
//   id: string;
//   patientId: string;
//   readingDate: string;
//   value: number; // in mg/dL
//   readingType: 'Fasting' | 'Post-meal' | 'Random';
//   notes?: string;
// }

// interface BloodPressureReading {
//   id: string;
//   patientId: string;
//   readingDate: string;
//   systolic: number;
//   diastolic: number;
//   pulse: number;
//   notes?: string;
// }

// interface FilterOptions {
//   ageRange: [number, number];
//   gender: ('Male' | 'Female' | 'Other')[];
//   location: {
//     county: string[];
//     country: string[];
//   };
//   sites: string[];
//   diagnosisTypes: string[];
//   dateRange: [string, string];
// }

// // Sample data
// const generateSampleData = () => {
//   const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];
//   const sites = ['Main Hospital', 'Community Clinic A', 'Community Clinic B', 'Rural Outpost', 'Medical Center'];
//   const conditions = ['Diabetes Type 1', 'Diabetes Type 2', 'Hypertension', 'Obesity', 'Hyperlipidemia', 'Prediabetes'];
//   const doctors = ['Dr. Jane Smith', 'Dr. John Doe', 'Dr. Alice Johnson', 'Dr. Robert Chen', 'Dr. Maria Garcia'];
  
//   // Generate patients
//   const patients: Patient[] = Array.from({ length: 100 }).map((_, idx) => {
//     const gender = ['Male', 'Female', 'Other'][Math.floor(Math.random() * 2)] as 'Male' | 'Female' | 'Other';
//     const age = 20 + Math.floor(Math.random() * 60);
//     const county = counties[Math.floor(Math.random() * counties.length)];
//     const site = sites[Math.floor(Math.random() * sites.length)];
//     const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    
//     // Generate 5-10 blood glucose readings
//     const bloodGlucoseReadings: BloodGlucoseReading[] = Array.from({ length: 5 + Math.floor(Math.random() * 6) }).map((_, i) => {
//       const today = new Date();
//       const date = new Date(today);
//       date.setDate(today.getDate() - (i * 5));
      
//       return {
//         id: `bg-${idx}-${i}`,
//         patientId: `p-${idx}`,
//         readingDate: date.toISOString().split('T')[0],
//         value: 80 + Math.floor(Math.random() * 140),
//         readingType: ['Fasting', 'Post-meal', 'Random'][Math.floor(Math.random() * 3)] as 'Fasting' | 'Post-meal' | 'Random',
//         notes: Math.random() > 0.7 ? 'Note about this reading' : undefined
//       };
//     });
    
//     // Generate 5-10 blood pressure readings
//     const bloodPressureReadings: BloodPressureReading[] = Array.from({ length: 5 + Math.floor(Math.random() * 6) }).map((_, i) => {
//       const today = new Date();
//       const date = new Date(today);
//       date.setDate(today.getDate() - (i * 5));
      
//       return {
//         id: `bp-${idx}-${i}`,
//         patientId: `p-${idx}`,
//         readingDate: date.toISOString().split('T')[0],
//         systolic: 110 + Math.floor(Math.random() * 50),
//         diastolic: 70 + Math.floor(Math.random() * 30),
//         pulse: 60 + Math.floor(Math.random() * 40),
//         notes: Math.random() > 0.7 ? 'Note about this reading' : undefined
//       };
//     });
    
//     // Generate 1-3 diagnoses
//     const diagnoses: Diagnosis[] = Array.from({ length: 1 + Math.floor(Math.random() * 3) }).map((_, i) => {
//       const today = new Date();
//       const date = new Date(today);
//       date.setDate(today.getDate() - (Math.floor(Math.random() * 365)));
      
//       return {
//         id: `d-${idx}-${i}`,
//         patientId: `p-${idx}`,
//         condition: conditions[Math.floor(Math.random() * conditions.length)],
//         diagnosedDate: date.toISOString().split('T')[0],
//         severity: ['Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 3)] as 'Mild' | 'Moderate' | 'Severe',
//         status: ['Active', 'Resolved', 'Managed'][Math.floor(Math.random() * 3)] as 'Active' | 'Resolved' | 'Managed'
//       };
//     });
    
//     return {
//       id: `p-${idx}`,
//       name: `Patient ${idx + 1}`,
//       age,
//       gender,
//       location: {
//         county,
//         country: 'Kenya'
//       },
//       site,
//       assignedDoctor: doctor,
//       diagnoses,
//       bloodGlucoseReadings,
//       bloodPressureReadings
//     };
//   });
  
//   // Generate users
//   const users: User[] = doctors.map((name, idx) => ({
//     id: `u-${idx}`,
//     name,
//     role: idx % 3 === 0 ? 'Admin' : idx % 2 === 0 ? 'Nurse' : 'Doctor' as 'Doctor' | 'Nurse' | 'Admin',
//     site: sites[Math.floor(Math.random() * sites.length)],
//     patientsCount: 10 + Math.floor(Math.random() * 30)
//   }));
  
//   // Generate sites
//   const siteObjects: Site[] = sites.map((name, idx) => ({
//     id: `s-${idx}`,
//     name,
//     location: {
//       county: counties[Math.floor(Math.random() * counties.length)],
//       country: 'Kenya'
//     },
//     patientsCount: 50 + Math.floor(Math.random() * 150),
//     staffCount: 5 + Math.floor(Math.random() * 15)
//   }));
  
//   return { patients, users, sites: siteObjects };
// };

// // Dashboard component
// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'sites' | 'users' | 'analytics'>('overview');
//   const [data, setData] = useState<{
//     patients: Patient[],
//     users: User[],
//     sites: Site[]
//   }>({ patients: [], users: [], sites: [] });
  
//   const [filters, setFilters] = useState<FilterOptions>({
//     ageRange: [0, 100],
//     gender: ['Male', 'Female', 'Other'],
//     location: {
//       county: [],
//       country: []
//     },
//     sites: [],
//     diagnosisTypes: [],
//     dateRange: ['', '']
//   });
  
//   const [searchTerm, setSearchTerm] = useState('');
  
//   useEffect(() => {
//     // Load sample data
//     const sampleData = generateSampleData();
//     setData(sampleData);
    
//     // Initialize filters based on available data
//     const counties = Array.from(new Set(sampleData.patients.map(p => p.location.county)));
//     const countries = Array.from(new Set(sampleData.patients.map(p => p.location.country)));
//     const siteNames = Array.from(new Set(sampleData.sites.map(s => s.name)));
//     const diagnoses = Array.from(new Set(sampleData.patients.flatMap(p => p.diagnoses.map(d => d.condition))));
    
//     setFilters(prev => ({
//       ...prev,
//       location: {
//         county: counties,
//         country: countries
//       },
//       sites: siteNames,
//       diagnosisTypes: diagnoses
//     }));
//   }, []);
  
//   // Filtered data
//   const filteredPatients = data.patients.filter(patient => {
//     // Age filter
//     const ageMatch = patient.age >= filters.ageRange[0] && patient.age <= filters.ageRange[1];
    
//     // Gender filter
//     const genderMatch = filters.gender.includes(patient.gender);
    
//     // Location filter
//     const countyMatch = filters.location.county.length === 0 || filters.location.county.includes(patient.location.county);
//     const countryMatch = filters.location.country.length === 0 || filters.location.country.includes(patient.location.country);
    
//     // Site filter
//     const siteMatch = filters.sites.length === 0 || filters.sites.includes(patient.site);
    
//     // Diagnosis filter
//     const diagnosisMatch = filters.diagnosisTypes.length === 0 || 
//       patient.diagnoses.some(d => filters.diagnosisTypes.includes(d.condition));
    
//     // Search term filter
//     const searchMatch = searchTerm === '' || 
//       patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       patient.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase());
    
//     return ageMatch && genderMatch && countyMatch && countryMatch && siteMatch && diagnosisMatch && searchMatch;
//   });
  
//   // Calculate aggregations
//   const aggregations = {
//     patientsByGender: _.countBy(filteredPatients, 'gender'),
//     patientsByAgeGroup: _.countBy(filteredPatients, patient => {
//       if (patient.age < 30) return 'Under 30';
//       if (patient.age < 50) return '30-49';
//       if (patient.age < 70) return '50-69';
//       return '70+';
//     }),
//     patientsByLocation: _.countBy(filteredPatients, p => p.location.county),
//     patientsBySite: _.countBy(filteredPatients, 'site'),
//     diagnosisByType: _.countBy(filteredPatients.flatMap(p => p.diagnoses), 'condition'),
//     averageBloodGlucose: _.mean(filteredPatients.flatMap(p => p.bloodGlucoseReadings.map(r => r.value))),
//     averageBloodPressure: {
//       systolic: _.mean(filteredPatients.flatMap(p => p.bloodPressureReadings.map(r => r.systolic))),
//       diastolic: _.mean(filteredPatients.flatMap(p => p.bloodPressureReadings.map(r => r.diastolic)))
//     }
//   };
  
//   // Format data for charts
//   const genderChartData = Object.entries(aggregations.patientsByGender).map(([name, value]) => ({ name, value }));
//   const ageGroupChartData = Object.entries(aggregations.patientsByAgeGroup).map(([name, value]) => ({ name, value }));
//   const locationChartData = Object.entries(aggregations.patientsByLocation).map(([name, value]) => ({ name, value }));
//   const diagnosisChartData = Object.entries(aggregations.diagnosisByType).map(([name, value]) => ({ name, value }));
  
//   // Blood glucose trend data (average by date)
//   const bloodGlucoseTrends = _(filteredPatients)
//     .flatMap(p => p.bloodGlucoseReadings)
//     .groupBy('readingDate')
//     .mapValues(readings => _.mean(readings.map(r => r.value)))
//     .toPairs()
//     .map(([date, value]) => ({ date, value }))
//     .sortBy('date')
//     .value();
  
//   // Blood pressure trend data (average by date)
//   const bloodPressureTrends = _(filteredPatients)
//     .flatMap(p => p.bloodPressureReadings)
//     .groupBy('readingDate')
//     .mapValues(readings => ({
//       systolic: _.mean(readings.map(r => r.systolic)),
//       diastolic: _.mean(readings.map(r => r.diastolic))
//     }))
//     .toPairs()
//     .map(([date, values]) => ({ date, ...values }))
//     .sortBy('date')
//     .value();
  
//   // Color scales for charts
//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-md">
//         <div className="p-4 border-b">
//           <h1 className="text-xl font-bold text-blue-700">MediTrack</h1>
//           <p className="text-xs text-gray-500">Patient Monitoring System</p>
//         </div>
//         <nav className="p-2">
//           <ul>
//             <li>
//               <button 
//                 onClick={() => setActiveTab('overview')}
//                 className={`flex items-center w-full p-3 rounded-lg text-left ${activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <Activity className="mr-3 h-5 w-5" />
//                 Dashboard
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => setActiveTab('patients')}
//                 className={`flex items-center w-full p-3 rounded-lg text-left ${activeTab === 'patients' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <Users className="mr-3 h-5 w-5" />
//                 Patients
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => setActiveTab('sites')}
//                 className={`flex items-center w-full p-3 rounded-lg text-left ${activeTab === 'sites' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <Building2 className="mr-3 h-5 w-5" />
//                 Sites
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => setActiveTab('users')}
//                 className={`flex items-center w-full p-3 rounded-lg text-left ${activeTab === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <UserPlus className="mr-3 h-5 w-5" />
//                 Users
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => setActiveTab('analytics')}
//                 className={`flex items-center w-full p-3 rounded-lg text-left ${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <Heart className="mr-3 h-5 w-5" />
//                 Health Analytics
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </div>
      
//       {/* Main content */}
//       <div className="flex-1 overflow-auto">
//         {/* Top bar */}
//         <div className="bg-white p-4 shadow-sm flex justify-between items-center">
//           <h1 className="text-2xl font-semibold text-gray-800">
//             {activeTab === 'overview' && 'Dashboard Overview'}
//             {activeTab === 'patients' && 'Patient Management'}
//             {activeTab === 'sites' && 'Facility Management'}
//             {activeTab === 'users' && 'User Management'}
//             {activeTab === 'analytics' && 'Health Analytics'}
//           </h1>
//           <div className="flex items-center">
//             <div className="relative mr-4">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             </div>
//             <div className="relative">
//               <button className="flex items-center bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
//                 <Filter className="mr-2 h-4 w-4" />
//                 Filters
//                 <ChevronDown className="ml-2 h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Filter panel */}
//         <div className="bg-white p-4 border-t border-b">
//           <div className="flex flex-wrap gap-4">
//             <div className="flex items-center">
//               <label className="block text-sm font-medium text-gray-700 mr-2">Age:</label>
//               <select 
//                 className="border rounded-md px-3 py-1 text-sm"
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value === 'all') {
//                     setFilters(prev => ({ ...prev, ageRange: [0, 100] }));
//                   } else if (value === 'under30') {
//                     setFilters(prev => ({ ...prev, ageRange: [0, 29] }));
//                   } else if (value === '30-49') {
//                     setFilters(prev => ({ ...prev, ageRange: [30, 49] }));
//                   } else if (value === '50-69') {
//                     setFilters(prev => ({ ...prev, ageRange: [50, 69] }));
//                   } else if (value === '70plus') {
//                     setFilters(prev => ({ ...prev, ageRange: [70, 100] }));
//                   }
//                 }}
//               >
//                 <option value="all">All Ages</option>
//                 <option value="under30">Under 30</option>
//                 <option value="30-49">30-49</option>
//                 <option value="50-69">50-69</option>
//                 <option value="70plus">70+</option>
//               </select>
//             </div>
            
//             <div className="flex items-center">
//               <label className="block text-sm font-medium text-gray-700 mr-2">Gender:</label>
//               <select 
//                 className="border rounded-md px-3 py-1 text-sm"
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value === 'all') {
//                     setFilters(prev => ({ ...prev, gender: ['Male', 'Female', 'Other'] }));
//                   } else {
//                     setFilters(prev => ({ ...prev, gender: [value as 'Male' | 'Female' | 'Other'] }));
//                   }
//                 }}
//               >
//                 <option value="all">All Genders</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
            
//             <div className="flex items-center">
//               <label className="block text-sm font-medium text-gray-700 mr-2">Location:</label>
//               <select 
//                 className="border rounded-md px-3 py-1 text-sm"
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value === 'all') {
//                     setFilters(prev => ({
//                       ...prev,
//                       location: {
//                         ...prev.location,
//                         county: []
//                       }
//                     }));
//                   } else {
//                     setFilters(prev => ({
//                       ...prev,
//                       location: {
//                         ...prev.location,
//                         county: [value]
//                       }
//                     }));
//                   }
//                 }}
//               >
//                 <option value="all">All Counties</option>
//                 {Array.from(new Set(data.patients.map(p => p.location.county))).map(county => (
//                   <option key={county} value={county}>{county}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div className="flex items-center">
//               <label className="block text-sm font-medium text-gray-700 mr-2">Site:</label>
//               <select 
//                 className="border rounded-md px-3 py-1 text-sm"
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value === 'all') {
//                     setFilters(prev => ({ ...prev, sites: [] }));
//                   } else {
//                     setFilters(prev => ({ ...prev, sites: [value] }));
//                   }
//                 }}
//               >
//                 <option value="all">All Sites</option>
//                 {data.sites.map(site => (
//                   <option key={site.id} value={site.name}>{site.name}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div className="flex items-center">
//               <label className="block text-sm font-medium text-gray-700 mr-2">Diagnosis:</label>
//               <select 
//                 className="border rounded-md px-3 py-1 text-sm"
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value === 'all') {
//                     setFilters(prev => ({ ...prev, diagnosisTypes: [] }));
//                   } else {
//                     setFilters(prev => ({ ...prev, diagnosisTypes: [value] }));
//                   }
//                 }}
//               >
//                 <option value="all">All Diagnoses</option>
//                 {Array.from(new Set(data.patients.flatMap(p => p.diagnoses.map(d => d.condition)))).map(condition => (
//                   <option key={condition} value={condition}>{condition}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div className="flex items-center">
//               <button 
//                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center"
//                 onClick={() => {
//                   setFilters({
//                     ageRange: [0, 100],
//                     gender: ['Male', 'Female', 'Other'],
//                     location: {
//                       county: [],
//                       country: []
//                     },
//                     sites: [],
//                     diagnosisTypes: [],
//                     dateRange: ['', '']
//                   });
//                   setSearchTerm('');
//                 }}
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Dashboard overview content */}
//         {activeTab === 'overview' && (
//           <div className="p-6">
//             {/* Stats cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <div className="bg-blue-100 p-3 rounded-full">
//                     <Users className="h-6 w-6 text-blue-700" />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-semibold text-gray-700">Total Patients</h3>
//                     <p className="text-2xl font-bold text-gray-900">{filteredPatients.length}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <div className="bg-green-100 p-3 rounded-full">
//                     <Building2 className="h-6 w-6 text-green-700" />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-semibold text-gray-700">Active Sites</h3>
//                     <p className="text-2xl font-bold text-gray-900">{data.sites.length}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <div className="bg-purple-100 p-3 rounded-full">
//                     <UserPlus className="h-6 w-6 text-purple-700" />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-semibold text-gray-700">Healthcare Staff</h3>
//                     <p className="text-2xl font-bold text-gray-900">{data.users.length}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <div className="bg-red-100 p-3 rounded-full">
//                     <Activity className="h-6 w-6 text-red-700" />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-semibold text-gray-700">Avg. Blood Glucose</h3>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {aggregations.averageBloodGlucose.toFixed(1)} <span className="text-sm font-normal">mg/dL</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Charts */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Patient Demographics</h3>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={genderChartData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                       >
//                         {genderChartData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip formatter={(value: number) => [`${value} patients`, 'Count']} />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Patients by Age Group</h3>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={ageGroupChartData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip formatter={(value: number) => [`${value} patients`, 'Count']} />
//                       <Legend />
//                       <Bar dataKey="value" name="Patients" fill="#0088FE" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Diagnoses Distribution</h3>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={diagnosisChartData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip formatter={(value: number) => [`${value} cases`, 'Count']} />
//                       <Legend />
//                       <Bar dataKey="value" name="Diagnoses" fill="#00C49F" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Patients by Location</h3>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={locationChartData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip formatter={(value: number) => [`${value} patients`, 'Count']} />
//                       <Legend />
//                       <Bar dataKey="value" name="Patients" fill="#FFBB28" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
            
//             {/* Health metrics trends */}
//             <div className="grid grid-cols-1 gap-6 mb-6">
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Blood Glucose Trends</h3>
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={bloodGlucoseTrends}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="date" />
//                       <YAxis label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }} />
//                       <Tooltip formatter={(value: number) => [`${value} mg/dL`, 'Blood Glucose']} />
//                       <Legend />
//                       <Line 
//                         type="monotone" 
//                         dataKey="value" 
//                         name="Average Blood Glucose" 
//                         stroke="#FF8042" 
//                         strokeWidth={2}
//                         dot={{ r: 2 }}
//                         activeDot={{ r: 4 }}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Blood Pressure Trends</h3>
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <ComposedChart data={bloodPressureTrends}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="date" />
//                       <YAxis yAxisId="left" label={{ value: 'mmHg', angle: -90, position: 'insideLeft' }} />
//                       <YAxis yAxisId="right" orientation="right" label={{ value: 'mmHg', angle: 90, position: 'insideRight' }} />
//                       <Tooltip 
//                         formatter={(value: number, name: string) => {
//                           if (name === 'Systolic') return [`${value} mmHg`, 'Systolic'];
//                           if (name === 'Diastolic') return [`${value} mmHg`, 'Diastolic'];
//                           return [value, name];
//                         }}
//                       />
//                       <Legend />
//                       <Line 
//                         yAxisId="left"
//                         type="monotone" 
//                         dataKey="systolic" 
//                         name="Systolic" 
//                         stroke="#8884d8" 
//                         strokeWidth={2}
//                         dot={{ r: 2 }}
//                         activeDot={{ r: 4 }}
//                       />
//                       <Line 
//                         yAxisId="right"
//                         type="monotone" 
//                         dataKey="diastolic" 
//                         name="Diastolic" 
//                         stroke="#82ca9d" 
//                         strokeWidth={2}
//                         dot={{ r: 2 }}
//                         activeDot={{ r: 4 }}
//                       />
//                     </ComposedChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
            
//             {/* Recent patients table */}
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="p-6 border-b">
//                 <h3 className="text-lg font-semibold text-gray-700">Recent Patients</h3>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conditions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredPatients.slice(0, 5).map(patient => (
//                       <tr key={patient.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                               <Users className="h-5 w-5 text-blue-600" />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">{patient.name}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{patient.age}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                             ${patient.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 
//                               patient.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 
//                               'bg-purple-100 text-purple-800'}`}>
//                             {patient.gender}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900 flex items-center">
//                             <MapPin className="h-4 w-4 mr-1 text-gray-500" />
//                             {patient.location.county}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{patient.site}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{patient.assignedDoctor}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex flex-wrap gap-1">
//                             {patient.diagnoses.slice(0, 2).map(diagnosis => (
//                               <span key={diagnosis.id} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
//                                 {diagnosis.condition}
//                               </span>
//                             ))}
//                             {patient.diagnoses.length > 2 && (
//                               <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
//                                 +{patient.diagnoses.length - 2}

//                               </span>