"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Database, 
  Activity, 
  PieChart, 
  Monitor, 
  Settings, 
  User, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Stethoscope,
  Heart,
  Droplet
} from 'lucide-react';

type MetricsData = {
  current: {
    new_diagnoses: number;
    bp_followup: number;
    bg_followup: number;
    bp_controlled: number;
    timestamp: string;
  };
  previous: {
    new_diagnoses: number;
    bp_followup: number;
    bg_followup: number;
    bp_controlled: number;
    timestamp: string;
  };
  percent_changes: {
    new_diagnoses: number;
    bp_followup: number;
    bg_followup: number;
    bp_controlled: number;
  };
  threshold_violations: {
    new_diagnoses: boolean;
    bp_followup: boolean;
    bg_followup: boolean;
    bp_controlled: boolean;
  };
};

// Sample data for dashboard metrics
const metrics = [
  { 
    title: "New Diagnosis Rate", 
    value: "45%", 
    target: "50%", 
    status: "warning",
    color: "bg-amber-100 border-amber-500",
    icon: <Stethoscope className="text-amber-600" />
  },
  { 
    title: "BP Follow-up Rate", 
    value: "48%", 
    target: "50%", 
    status: "warning",
    color: "bg-rose-100 border-rose-500",
    icon: <Heart className="text-rose-600" />
  },
  { 
    title: "BG Follow-up Rate", 
    value: "42%", 
    target: "50%", 
    status: "danger",
    color: "bg-blue-100 border-blue-500",
    icon: <Droplet className="text-blue-600" />
  },
  { 
    title: "High Risk Patients", 
    value: "27", 
    change: "+3",
    status: "danger",
    color: "bg-red-100 border-red-500",
    icon: <AlertTriangle className="text-red-600" />
  }
];

type Patient = {
  patient_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  age: number;
  county_name: string;
  occupation: string;
  site_name: string;
  has_hypertension?: boolean;
  has_diabetes?: boolean;
  has_mental_health_issue?: boolean;
  on_htn_meds?: boolean;
  on_diabetes_meds?: boolean;
  on_mh_treatment?: boolean;
};


export default function Dashboard() {
  const router = useRouter();
  const [activeSidebar, setActiveSidebar] = useState("home");
  type SectionType = 'dashboard' | 'patients' | 'reports' | 'settings'; // add all your possible sections here

  const [expandedSection, setExpandedSection] = useState<SectionType | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching patients...');

        // Fetch data from your API endpoint
        const response = await fetch('http://localhost:8010/api/patients');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        // Set the fetched patients data
        setPatients(data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setError(err instanceof Error ? err.message : 'Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []); // Empty dependency array ensures this runs once after the initial render

  if (loading) return <div>Loading patients...</div>;
  if (error) return <div>Error: {error}</div>;
    
  const toggleSection = (section: SectionType) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // List of sidebar items
  const sidebarItems = [
    { id: "home", label: "Dashboard", icon: <Home size={20} /> },
    { 
      id: "data", 
      label: "Data Tables", 
      icon: <Database size={20} />,
      expandable: true,
      subItems: [
        { id: "patient-table", label: "Patient Demographics" },
        { id: "glucoselog", label: "Glucose Logs" },
        { id: "diagnosis", label: "Patient Diagnosis" },
        { id: "lifestyle", label: "Patient Lifestyle" },
        { id: "medical-review", label: "Medical Reviews" },
        { id: "compliance", label: "Medical Compliance" },
        { id: "screeninglog", label: "Screening Logs" },
        { id: "bplog", label: "BP Logs" },
        { id: "redrisk", label: "High Risk Patients" },
      ]
    },
    { id: "monitoring", label: "Site Monitoring", icon: <Monitor size={20} /> },
    { id: "new-diagnosis", label: "New Diagnosis", icon: <Stethoscope size={20} /> },
    { id: "followup", label: "BP & BG Follow-up", icon: <Heart size={20} /> },
    { id: "analytics", label: "Analytics", icon: <Activity size={20} /> },
    { id: "visualizations", label: "Visualizations", icon: <PieChart size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    { id: "profile", label: "Profile", icon: <User size={20} /> }
  ];


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-indigo-900 text-white shadow-lg flex flex-col">
        <div className="p-5 bg-indigo-800">
          <h1 className="text-xl font-bold">Health Metrics</h1>
          <p className="text-xs opacity-70">Clinical Dashboard</p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id} className="mb-1">
                {!item.expandable ? (
                  <button 
                  onClick={() => {
                    setActiveSidebar(item.id);
                    if (item.id === 'monitoring') {
                      router.push('/interactive-dashboard'); // ✅ Route to your page
                    } else if (item.id === 'home') {
                      router.push('/dashboard'); // Optional, route back home
                    }
                  }}                  
                    className={`w-full flex items-center px-4 py-3 text-sm ${
                      activeSidebar === item.id 
                        ? "bg-indigo-700 border-l-4 border-indigo-300" 
                        : "hover:bg-indigo-800"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ) : (
                  <>
                    <button 
                      // onClick={() => toggleSection(item.id)}
                      onClick={() => toggleSection(item.id as SectionType)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm ${
                        expandedSection === item.id ? "bg-indigo-700" : "hover:bg-indigo-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </div>
                      {expandedSection === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {expandedSection === item.id && (
                      <ul className="bg-indigo-950 py-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id}>
                            <button 
                              onClick={() => {
                                setActiveSidebar(item.id);
                                if (item.id === 'monitoring') {
                                  router.push('/site-monitoring'); // ✅ Route to your page
                                } else if (item.id === 'followup') {
                                  router.push('/followup'); // ✅ Route to your page
                                } else if (item.id === 'analytics') {
                                  router.push('/analytics'); // ✅ Route to your page
                                } else if (item.id === 'visualizations') {
                                  router.push('/visualizations'); // ✅ Route to your page
                                } else if (item.id === 'settings') {
                                  router.push('/settings'); // ✅ Route to your page
                                } else if (item.id === 'profile') {
                                  router.push('/profile'); // ✅ Route to your page
                                } else if (item.id === 'data') {
                                  router.push('/datatables'); // ✅ Route to your page
                                } else if (item.id === 'new-diagnosis') {
                                  router.push('/new-diagnosis'); // ✅ Route to your page
                                } else if (item.id === 'followup') {
                                  router.push('/followup'); // ✅ Route to your page
                                } else if (item.id === 'analytics') {
                                  router.push('/analytics'); // ✅ Route to your page
                                } else if (item.id === 'home') {
                                  router.push('/dashboard'); 
                                }
                              }}                              
                              className={`w-full text-left pl-12 pr-4 py-2 text-sm ${
                                activeSidebar === subItem.id 
                                  ? "text-indigo-300 font-medium" 
                                  : "text-gray-300 hover:text-white"
                              }`}
                            >
                              {subItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 bg-indigo-800 mt-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-semibold">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Dr. Jane Doe</p>
              <p className="text-xs opacity-70">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search patients..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={20} />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  5
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-sm border-l-4 p-6 ${metric.color}`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                    <div className="flex items-baseline mt-1">
                      <h3 className="text-2xl font-bold text-gray-800">{metric.value}</h3>
                      {metric.target && (
                        <span className="ml-2 text-sm text-gray-500">
                          Target: {metric.target}
                        </span>
                      )}
                      {metric.change && (
                        <span className={`ml-2 text-sm ${metric.change.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                          {metric.change}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-full p-3 bg-white shadow-inner">
                    {metric.icon}
                  </div>
                </div>
                {metric.status === "warning" && (
                  <div className="mt-3 text-sm text-amber-600 bg-amber-50 rounded p-2 flex items-center">
                    <AlertTriangle size={16} className="mr-1" />
                    <span>Below target threshold</span>
                  </div>
                )}
                {metric.status === "danger" && (
                  <div className="mt-3 text-sm text-red-600 bg-red-50 rounded p-2 flex items-center">
                    <AlertTriangle size={16} className="mr-1" />
                    <span>Critical - requires attention</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Patients */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Recent Patients</h2>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View All
                </button>
              </div>

              {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">County</th>
                    <th className="px-4 py-3">Conditions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.patient_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {patient.patient_id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {`${patient.first_name} ${patient.last_name}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {patient.age}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {patient.county_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.has_hypertension && patient.has_diabetes 
                            ? 'bg-red-100 text-red-800' 
                            : patient.has_hypertension || patient.has_diabetes
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {patient.has_hypertension && patient.has_diabetes 
                            ? 'Hypertension & Diabetes' 
                            : patient.has_hypertension
                              ? 'Hypertension'
                              : patient.has_diabetes
                                ? 'Diabetes'
                                : 'No conditions'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                  <Stethoscope size={32} className="text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-800">New Diagnosis</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-colors">
                  <Heart size={32} className="text-rose-600 mb-2" />
                  <span className="text-sm font-medium text-gray-800">BP Follow Up</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                  <Droplet size={32} className="text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-800">BG Follow Up</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors">
                  <AlertTriangle size={32} className="text-amber-600 mb-2" />
                  <span className="text-sm font-medium text-gray-800">High Risk Patients</span>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Dashboard Sections */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-start p-3 border-l-4 border-green-500 bg-green-50 rounded">
                  <div className="mr-4 rounded-full bg-green-200 p-2">
                    <User size={16} className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Sarah Johnson</span> completed blood glucose follow-up
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Today, 10:23 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border-l-4 border-amber-500 bg-amber-50 rounded">
                  <div className="mr-4 rounded-full bg-amber-200 p-2">
                    <AlertTriangle size={16} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Michael Chen</span> missed blood pressure follow-up appointment
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday, 3:45 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border-l-4 border-indigo-500 bg-indigo-50 rounded">
                  <div className="mr-4 rounded-full bg-indigo-200 p-2">
                    <Stethoscope size={16} className="text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Emma Rodriguez</span> received new diagnosis: Type 2 Diabetes
                    </p>
                    <p className="text-xs text-gray-500 mt-1">May 2, 2025</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Performance Metrics</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">New Diagnosis Rate</span>
                    <span className="text-gray-500">45%</span>
                  </div>
                  {/* <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div> */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        {/* <div className="bg-amber-500 h-2 rounded-full progress-45"></div> */}
                        <div className="bg-amber-500 h-2 rounded-full w-[45%]"></div>
                      </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">BP Follow-up Rate</span>
                    <span className="text-gray-500">48%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-rose-500 h-2 rounded-full progress-48"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">BG Follow-up Rate</span>
                    <span className="text-gray-500">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {/* <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div> */}
                    <div className="bg-blue-500 h-2 rounded-full progress-42"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Patient Compliance</span>
                    <span className="text-gray-500">76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {/* <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div> */}
                    <div className="bg-green-500 h-2 rounded-full progress-76"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}