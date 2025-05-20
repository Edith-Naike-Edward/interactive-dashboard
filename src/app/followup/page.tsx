"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Notifications,
  AccountCircle,
  Menu,
  Dashboard as DashboardIcon,
  BarChart,
  PieChart,
  Map,
  Category,
  AccessTime,
  WarningAmber,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { Pie } from 'react-chartjs-2';
import { Line } from "react-chartjs-2";
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, ArcElement, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Tick } from "chart.js";
import Head from 'next/head';
import { 
  Bell, 
  User, 
  Settings, 
  AlertTriangle, 
  Activity, 
  Thermometer, 
  MapPin,
  Clock, 
  BarChart3, 
  LineChart,
  Users,
  Building,
  PieChart as PieChartIcon
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement, PointElement, annotationPlugin, LineElement, Title);

type FollowUpData = {
  bp_followups: Array<{
    bplog_id: string;
    patient_id: string;
    patient_track_id: string;
    patient_name: string;
    avg_systolic: number;
    avg_diastolic: number;
    avg_pulse: number;
    height: number; 
    weight: number;
    bmi: number;
    temperature: number;
    is_regular_smoker: boolean;
    cvd_risk_score: number;
    cvd_risk_level: string;
    risk_level: string; // Simplified
    type: string; // 'bp' or 'bg'
    is_latest: boolean;
    is_active: boolean;
    is_deleted: boolean;
    tenant_id: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
  }>;

  bg_followups: Array<{
    glucose_log_id: string;
    patient_id: string;
    patient_track_id: string;
    glucose_value: number;
    glucose_type: string; // 'fasting' or 'postprandial'
    hba1c: number; // Rough conversion from glucose value
    type: string; // 'bp' or 'bg'
    is_latest: boolean;
    is_active: boolean;
    is_deleted: boolean;
    tenant_id: string;
    glucose_date_time: string;
    last_meal_time: string; // Time of last meal
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
  }>; // Array of blood glucose follow-ups
  diagnoses: Array<{
    patient_diagnosis_id: string;
    patient_track_id: string;
    diabetes_year_of_diagnosis: number;
    diabetes_patient_type: string; // 'type1' or 'type2'
    htn_patient_type: string; // 'primary' or 'secondary'
    diabetes_diagnosis: string; // 'diabetes' or 'prediabetes'
    htn_year_of_diagnosis: number;
    is_diabetes_diagnosis: boolean;
    is_htn_diagnosis: boolean;
    diabetes_diag_controlled_type: string; // 'controlled' or 'uncontrolled'
    is_active: boolean;
    is_deleted: boolean;
    tenant_id: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
  }>;
};

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
  historical_data: Array<{
    timestamp: string;
    percent_bp_followup: number;
    percent_bg_followup: number;
    percent_new_diagnoses: number;
    percent_bp_controlled: number;
    performance_declined?: boolean; 
  }>;
  last_checked: string;
  performance_declined: boolean;
  threshold_violations: {
    new_diagnoses: boolean;
    bp_followup: boolean;
    bg_followup: boolean;
    bp_controlled: boolean;
  };
};


export default function FollowUpPage() {
  const [activeTab, setActiveTab] = useState('bp');
  const [data, setData] = useState<FollowUpData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        // Fetch all data in parallel
        const [bpResponse, bgResponse, diagnosesResponse, metricsResponse] = await Promise.all([
          fetch('http://localhost:8010/api/bp-logs'),
          fetch('http://localhost:8010/api/glucose-logs'),
          fetch('http://localhost:8010/api/diagnoses'),
          fetch('http://localhost:8010/api/monitoring-metrics')
        ]);
  
        // Check all responses
        if (!bpResponse.ok || !bgResponse.ok || !diagnosesResponse.ok || !metricsResponse.ok) {
          throw new Error('Failed to fetch one or more data sources');
        }
  
        // Parse all responses
        const [bpData, bgData, diagnosesData, metricsData] = await Promise.all([
          bpResponse.json(),
          bgResponse.json(),
          diagnosesResponse.json(),
          metricsResponse.json()
        ]);
  
        // Combine all data into a single object
        const combinedData: FollowUpData = {
          bp_followups: bpData,
          bg_followups: bgData,
          diagnoses: diagnosesData,
        };
  
        setData(combinedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8010/api/monitoring-metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics data');
        const result = await response.json();
        setMetrics(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

const PaginationControls = ({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange 
  }: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    console.log({ currentPage, totalItems, itemsPerPage, totalPages }); 
  
    return (
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-persian-blue text-black hover:bg-persian-blue-dark'}`}
        >
          Previous
        </button>
        <span className="text-sm text-indigo">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-persian-blue text-black hover:bg-persian-blue-dark'}`}
        >
          Next
        </button>
      </div>
    );
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-persian-blue"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500 text-center">
      Error: {error}. Please refresh the page.
    </div>
  );

  if (!data) return (
    <div className="p-4 text-center">
      No follow-up data available
    </div>
  );

  const filteredBgFollowups = data?.bg_followups?.filter(item => 
    item.patient_track_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
  )|| [];

  const filteredBpFollowups = data?.bp_followups?.filter(item => 
    item.patient_track_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []; // Default to an empty array if undefined
  
  const filteredDiagnoses = data?.diagnoses?.filter(item => 
    item.patient_diagnosis_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.patient_track_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.diabetes_patient_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.htn_patient_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.diabetes_diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.is_diabetes_diagnosis.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.is_htn_diagnosis.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.diabetes_diag_controlled_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []; // Default to an empty array if undefined
  
  const renderTrendIndicator = (value: number) => {
    if (value > 0) {
      return (
        <span className="text-green-500 flex items-center">
          <ArrowUpward className="h-4 w-4 mr-1" />
          {Math.abs(value)}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="text-red-500 flex items-center">
          <ArrowDownward className="h-4 w-4 mr-1" />
          {Math.abs(value)}%
        </span>
      );
    }
    return <span className="text-gray-500">0%</span>;
  };

  const historicalData = Array.isArray(metrics?.historical_data) ? metrics.historical_data : [];

  const historicalChartData = {
    labels: metrics?.historical_data.map(item => {
      const date = new Date(item.timestamp);
      return isNaN(date.getTime()) ? 'Invalid Date' : 
        date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
    }) || [],
    datasets: [
      {
        label: 'BP Follow-up Rate',
        data: metrics?.historical_data.map(item => item.percent_bp_followup) || [],
        borderColor: '#675BD2',
        backgroundColor: 'rgba(103, 91, 210, 0.1)',
        tension: 0.4
      },
      {
        label: 'BG Follow-up Rate',
        data: metrics?.historical_data.map(item => item.percent_bg_followup) || [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      },
      {
        label: 'New Diagnoses',
        data: metrics?.historical_data.map(item => item.percent_new_diagnoses) || [],
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.4
      },
      {
        label: 'BP Controlled Rate',
        data: metrics?.historical_data.map(item => item.percent_bp_controlled) || [],
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4
      }
    ]
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-persian-blue"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500 text-center">
      Error: {error}. Please refresh the page.
    </div>
  );

  if (!metrics) return (
    <div className="p-4 text-center">
      No metrics data available
    </div>
  );
  

  return (
    <>
      <Head>
        <title>Patient Follow-up Dashboard</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <div className="flex flex-col min-h-screen bg-white/95 backdrop-blur-md shadow-md font-sans">
        {/* Navigation - Same as your dashboard */}
        <nav className="p-4 flex justify-between items-center w-full top-0 left-0 z-50 py-4 px-8 bg-white shadow-md">
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2 no-underline text-blue-800 font-serif font-bold text-xl">
              <div className="w-8 h-8 bg-blue-800 text-white rounded-lg flex items-center justify-center text-lg">🔍</div>
              <span>AfyaScope</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center relative">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-tacao text-tacao-darkest text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button className="flex items-center" aria-label="Settings">
              <Settings className="h-6 w-6" />
            </button>
            <button className="flex items-center" aria-label="User Profile">
              <User className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Same as your dashboard */}
          <aside className="bg-[#FFFFF] w-56 p-4 shadow-md shadow-black/10 hidden md:block">
            <nav className="space-y-2">
              <button 
                className={`w-full text-left p-2 rounded-md flex items-center ${activeTab === 'overview' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue-lightest'}`}
                onClick={() => setActiveTab('overview')}
              >
                <PieChartIcon className="h-5 w-5 mr-2" />
                Overview
              </button>
              <button 
                className={`w-full text-left p-2 rounded-md flex items-center ${activeTab === 'bp' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue-lightest'}`}
                onClick={() => setActiveTab('bp')}
              >
                <Activity className="h-5 w-5 mr-2" />
                BP Follow-up
              </button>
              <button 
                className={`w-full text-left p-2 rounded-md flex items-center ${activeTab === 'bg' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue-lightest'}`}
                onClick={() => setActiveTab('bg')}
              >
                <Thermometer className="h-5 w-5 mr-2" />
                BG Follow-up
              </button>
              <button 
                className={`w-full text-left p-2 rounded-md flex items-center ${activeTab === 'diagnoses' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue-lightest'}`}
                onClick={() => setActiveTab('diagnoses')}
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Diagnoses
              </button>
            </nav>
          </aside>

          {/* Main Dashboard Area */}
          <main className="flex-1 p-6 overflow-auto bg-[#EAE7FA]">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-3xl font-bold mb-2 md:mb-0">
                {activeTab === 'bp' && 'Blood Pressure Follow-up'}
                {activeTab === 'bg' && 'Blood Glucose Follow-up'}
                {activeTab === 'diagnoses' && 'Patient Diagnoses'}
              </h2>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 rounded-md border border-bizarre focus:outline-none focus:ring-2 focus:ring-persian-blue w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-indigo opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* New Diagnoses */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-[#675BD2] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">New Diagnoses</h3>
                    <WarningAmber className={`h-6 w-6 ${metrics.threshold_violations.new_diagnoses ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                  <p className="text-3xl font-bold">{metrics.current.new_diagnoses}</p>
                  <p className="text-sm text-indigo mt-2">vs {metrics.previous.new_diagnoses} last period</p>
                </div>
                <div className="mt-4">{renderTrendIndicator(metrics.percent_changes.new_diagnoses)}</div>
              </div>

              {/* BP Follow-up */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-[#675BD2] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">BP Follow-up</h3>
                    <Activity className={`h-6 w-6 ${metrics.threshold_violations.bp_followup ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                  <p className="text-3xl font-bold">{metrics.current.bp_followup}%</p>
                  <p className="text-sm text-indigo mt-2">vs {metrics.previous.bp_followup}% last period</p>
                </div>
                <div className="mt-4">{renderTrendIndicator(metrics.percent_changes.bp_followup)}</div>
              </div>

              {/* BG Follow-up */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-[#675BD2] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">BG Follow-up</h3>
                    <Thermometer className={`h-6 w-6 ${metrics.threshold_violations.bg_followup ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                  <p className="text-3xl font-bold">{metrics.current.bg_followup}%</p>
                  <p className="text-sm text-indigo mt-2">vs {metrics.previous.bg_followup}% last period</p>
                </div>
                <div className="mt-4">{renderTrendIndicator(metrics.percent_changes.bg_followup)}</div>
              </div>

              {/* BP Controlled */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-[#675BD2] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">BP Controlled</h3>
                    <BarChart3 className={`h-6 w-6 ${metrics.threshold_violations.bp_controlled ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                  <p className="text-3xl font-bold">{metrics.current.bp_controlled}%</p>
                  <p className="text-sm text-indigo mt-2">vs {metrics.previous.bp_controlled}% last period</p>
                </div>
                <div className="mt-4">{renderTrendIndicator(metrics.percent_changes.bp_controlled)}</div>
              </div>
            </div>


            {/* Follow-up Rates Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-medium mb-4">Historical Trends</h3>
              <div className="h-64">
              <Line
                data={{
                  labels: metrics?.historical_data.map(item => {
                    // Format date as "MMM DD" (e.g., "Jan 15")
                    return new Date(item.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    });
                  }) || [],
                  datasets: [
                    {
                      label: 'BP Follow-up Rate',
                      data: metrics?.historical_data.map(item => item.percent_bp_followup) || [],
                      borderColor: '#675BD2',
                      backgroundColor: 'rgba(103, 91, 210, 0.1)',
                      tension: 0.3,
                      fill: true
                    },
                    {
                      label: 'BG Follow-up Rate',
                      data: metrics?.historical_data.map(item => item.percent_bg_followup) || [],
                      borderColor: '#4CAF50',
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      tension: 0.3,
                      fill: true
                    },
                    {
                      label: 'New Diagnoses',
                      data: metrics?.historical_data.map(item => item.percent_new_diagnoses) || [],
                      borderColor: '#FF9800',
                      backgroundColor: 'rgba(255, 152, 0, 0.1)',
                      tension: 0.3,
                      fill: true
                    },
                    {
                      label: 'BP Controlled Rate',
                      data: metrics?.historical_data.map(item => item.percent_bp_controlled) || [],
                      borderColor: '#F44336',
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      tension: 0.3,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.raw}%`;
                        },
                        title: function(context) {
                          // Format the full date for tooltip
                          const dateStr = metrics?.historical_data[context[0].dataIndex].timestamp || '';
                          return new Date(dateStr).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    },
                    y: {
                      min: 0,
                      max: 100,
                      ticks: {
                        callback: function(value) {
                          return `${value}%`;
                        }
                      },
                      // grid: {
                      //   borderColor: 'transparent',  // Hides the border line
                      //   borderWidth: 0               // Removes any border around the grid lines
                      // }
                    }
                  },
                  elements: {
                    point: {
                      radius: 3,
                      hoverRadius: 6
                    }
                  }
                }}
              />
              {/* <Line
                data={historicalChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.dataset.label}: ${context.raw}%`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Date'
                      }
                    },
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Percentage (%)'
                      }
                    }
                  }
                }}
              /> */}
              </div>
            </div>

            {/* BP Follow-up Table */}
            {activeTab === 'bp' && (
              <div className="card rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-bizarre bg-white">
                  <h3 className="text-xl font-medium">BP Follow-up Patients</h3>
                  <p className="text-sm text-indigo">Blood pressure follow-up metrics</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead className="bg-padua-lightest">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Track ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Avg Systolic</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Avg Diastolic</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">BMI</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">CVD Risk</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-bizarre">
                      {filteredBpFollowups
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((patient) => (
                          <tr key={patient.bplog_id}>
                            <td className="px-4 py-3 text-sm">{patient.patient_track_id}</td>
                            <td className="px-4 py-3 text-sm">{patient.avg_systolic}</td>
                            <td className="px-4 py-3 text-sm">{patient.avg_diastolic}</td>
                            <td className="px-4 py-3 text-sm">{patient.bmi.toFixed(1)}</td>
                            <td className="px-4 py-3 text-sm">{patient.cvd_risk_level} ({patient.cvd_risk_score}%)</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {filteredBpFollowups.length > 0 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalItems={filteredBpFollowups.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            )}

            {/* BG Follow-up Table */}
            {activeTab === 'bg' && (
              <div className="card rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-bizarre bg-white">
                  <h3 className="text-xl font-medium">BG Follow-up Patients</h3>
                  <p className="text-sm text-indigo">Blood glucose follow-up metrics</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead className="bg-padua-lightest">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Track ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Glucose Value</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">HbA1c</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Reading Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-bizarre">
                      {filteredBgFollowups
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((patient) => (
                          <tr key={patient.glucose_log_id}>
                            <td className="px-4 py-3 text-sm">{patient.patient_track_id}</td>
                            <td className="px-4 py-3 text-sm">{patient.glucose_value} mg/dL</td>
                            <td className="px-4 py-3 text-sm capitalize">{patient.glucose_type}</td>
                            <td className="px-4 py-3 text-sm">{patient.hba1c.toFixed(1)}%</td>
                            <td className="px-4 py-3 text-sm">{new Date(patient.glucose_date_time).toLocaleString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {filteredBgFollowups.length > 0 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalItems={filteredBgFollowups.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            )}

            {/* Diagnoses Table */}
            {activeTab === 'diagnoses' && (
              <div className="card rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-bizarre bg-white">
                  <h3 className="text-xl font-medium">Patient Diagnoses</h3>
                  <p className="text-sm text-indigo">Diabetes and Hypertension history</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead className="bg-padua-lightest">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Track ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Diabetes Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Diabetes Diagnosis</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Controlled?</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">HTN Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Years Diagnosed (DM/HTN)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Is Active?</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-bizarre">
                      {filteredDiagnoses
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((diagnosis) => (
                          <tr key={diagnosis.patient_diagnosis_id}>
                            <td className="px-4 py-3 text-sm">{diagnosis.patient_track_id}</td>
                            <td className="px-4 py-3 text-sm capitalize">{diagnosis.diabetes_patient_type}</td>
                            <td className="px-4 py-3 text-sm capitalize">{diagnosis.diabetes_diagnosis}</td>
                            <td className="px-4 py-3 text-sm capitalize">{diagnosis.diabetes_diag_controlled_type}</td>
                            <td className="px-4 py-3 text-sm capitalize">{diagnosis.htn_patient_type}</td>
                            <td className="px-4 py-3 text-sm">{diagnosis.diabetes_year_of_diagnosis}/{diagnosis.htn_year_of_diagnosis}</td>
                            <td className="px-4 py-3 text-sm">{diagnosis.is_active ? 'Yes' : 'No'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {filteredDiagnoses.length > 0 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalItems={filteredDiagnoses.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            )}

            {/* Performance Alerts */}
                        {metrics.performance_declined && (
                          <div className="bg-red-50 border-l-4 mt-6 border-red-500 p-4 mb-6 rounded-r">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <WarningAmber className="h-5 w-5 text-red-500" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Performance Alert</h3>
                                <div className="mt-2 text-sm text-red-700">
                                  <p>
                                    One or more metrics have declined compared to the previous period. Please review patient follow-ups.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
            
                        {/* Threshold Violations */}
                        {(metrics.threshold_violations.new_diagnoses || 
                          metrics.threshold_violations.bp_followup || 
                          metrics.threshold_violations.bg_followup || 
                          metrics.threshold_violations.bp_controlled) && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <WarningAmber className="h-5 w-5 text-yellow-500" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Threshold Warning</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                  <ul className="list-disc pl-5 space-y-1">
                                    {metrics.threshold_violations.new_diagnoses && <li>New diagnoses rate is below 50%</li>}
                                    {metrics.threshold_violations.bp_followup && <li>BP follow-up rate is below 50%</li>}
                                    {metrics.threshold_violations.bg_followup && <li>BG follow-up rate is below 50%</li>}
                                    {metrics.threshold_violations.bp_controlled && <li>BP controlled rate is below 50%</li>}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
          </main>
        </div>
      </div>
    </>
  );
}
