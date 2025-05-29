"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import AlertTab from '@/app/components/AlertsTab';
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
import { getPreviouslyCachedImageOrNull } from 'next/dist/server/image-optimizer';
import { AlertFollowup, AlertSeverity, AlertType } from '../types';

// Define Alert type if not already defined
type Alert = {
  id: string;
  // alertId: string;
  type: string;
  metric: string;
  message: string;
  severity: string;
  timestamp: string;
  acknowledged: boolean;
  data?: any;
};


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
  status: string;
  data: {
    current_metrics: {
      percent_new_diagnoses: number;
      percent_bp_followup: number;
      percent_bg_followup: number;
      percent_bp_controlled: number;
      timestamp: string;
      changes?: {
        new_diagnoses: number;
        bp_followup: number;
        bg_followup: number;
        bp_controlled: number;
      };
    };
    historical_data: Array<{
      timestamp: string;
      percent_bp_followup: number;
      percent_bg_followup: number;
      percent_new_diagnoses: number;
      percent_bp_controlled: number;
      changes?: {
        new_diagnoses: number;
        bp_followup: number;
        bg_followup: number;
        bp_controlled: number;
      };
    }>;
    performance_declined: boolean;
    threshold_violations: {
      new_diagnoses: boolean;
      bp_followup: boolean;
      bg_followup: boolean;
      bp_controlled: boolean;
    };
    last_checked?: string;
  };
};

// Update the default metrics to match the API response structure
const defaultMetrics: MetricsData = {
  status: "success",
  data: {
    current_metrics: {
      percent_new_diagnoses: 0,
      percent_bp_followup: 0,
      percent_bg_followup: 0,
      percent_bp_controlled: 0,
      timestamp: new Date().toISOString(),
      changes: {
        new_diagnoses: 0,
        bp_followup: 0,
        bg_followup: 0,
        bp_controlled: 0
      }
    },
    historical_data: [],
    performance_declined: false,
    threshold_violations: {
      new_diagnoses: false,
      bp_followup: false,
      bg_followup: false,
      bp_controlled: false
    },
    last_checked: new Date().toISOString()
  }
};

export default function FollowUpPage() {
  const [activeTab, setActiveTab] = useState('bp');
  const [data, setData] = useState<FollowUpData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
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
        const [bpResponse, bgResponse, diagnosesResponse, metricsResponse] = await Promise.all([
          fetch('http://localhost:8010/api/bp-logs'),
          fetch('http://localhost:8010/api/glucose-logs'),
          fetch('http://localhost:8010/api/diagnoses'),
          fetch('http://localhost:8010/api/monitoring-metrics')
        ]);
  
        if (!bpResponse.ok || !bgResponse.ok || !diagnosesResponse.ok || !metricsResponse.ok) {
          throw new Error('Failed to fetch one or more data sources');
        }
  
        const [bpData, bgData, diagnosesData, metricsData] = await Promise.all([
          bpResponse.json(),
          bgResponse.json(),
          diagnosesResponse.json(),
          metricsResponse.json()
        ]);
  
        setData({
          bp_followups: bpData,
          bg_followups: bgData,
          diagnoses: diagnosesData,
        });
        setMetrics(metricsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAllData();
  }, []);

  // Periodic alert checks
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:8010/api/monitoring-metrics')
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            generateAlerts(data.data);
          }
        })
        .catch(console.error);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  // Call this when you receive new metrics data
  useEffect(() => {
    if (metrics && metrics.data) {
      generateAlerts(metrics.data);
    }
  }, [metrics]);

  // Type guard
  const isAlertType = (type: string): type is AlertType => {
    return ['threshold', 'performance', 'inactive', 'activity'].includes(type);
  };

  const isAlertSeverity = (severity: string): severity is AlertSeverity => {
    return ['low', 'medium', 'high'].includes(severity);
  };

  // Conversion function
  const convertToAlertFollowup = (alerts: Alert[]): AlertFollowup[] => {
    return alerts
      .filter((a) => isAlertType(a.type) && isAlertSeverity(a.severity))
      .map((a) => ({
        id: a.id,
        type: a.type as AlertType,
        message: a.message,
        severity: a.severity as AlertSeverity,
        timestamp: a.timestamp,
        acknowledged: a.acknowledged,
      }));
  };

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

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-persian-blue"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-red-500 text-center">
          Error: {error}. Please refresh the page.
        </div>
      );
    }

    if (!data) {
      return (
        <div className="p-4 text-center">
          No follow-up data available
        </div>
      );
    }

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
  

// Update the historical data handling
  const historicalData = metrics?.data?.historical_data || [];
  const currentMetrics = metrics?.data?.current_metrics || defaultMetrics.data.current_metrics;
  const thresholdViolations = metrics?.data?.threshold_violations || defaultMetrics.data.threshold_violations;

const historicalChartData = {
    labels: historicalData.map(item => {
      const date = new Date(item.timestamp);
      return isNaN(date.getTime()) ? 'Invalid Date' :
        date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
    }),
    datasets: [
      {
        label: 'BP Follow-up Rate',
        data: historicalData.map(item => item.percent_bp_followup),
        borderColor: '#675BD2',
        backgroundColor: 'rgba(103, 91, 210, 0.1)',
        tension: 0.4
      },
      {
        label: 'BG Follow-up Rate',
        data: historicalData.map(item => item.percent_bg_followup),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      },
      {
        label: 'New Diagnoses',
        data: historicalData.map(item => item.percent_new_diagnoses),
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.4
      },
      {
        label: 'BP Controlled Rate',
        data: historicalData.map(item => item.percent_bp_controlled),
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4
      }
    ]
  };

  // First, create individual chart data configurations
  const getChartData = (metric: 'bp_followup' | 'bg_followup' | 'new_diagnoses' | 'bp_controlled') => {
    // Map metric to the correct property key
    const metricKeyMap: Record<typeof metric, keyof (typeof historicalData)[number]> = {
      bp_followup: 'percent_bp_followup',
      bg_followup: 'percent_bg_followup',
      new_diagnoses: 'percent_new_diagnoses',
      bp_controlled: 'percent_bp_controlled',
    };

    return {
      labels: historicalData.map(item => {
        const date = new Date(item.timestamp);
        return isNaN(date.getTime()) ? 'Invalid Date' : 
          date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: metric,
        data: historicalData.map(item => item[metricKeyMap[metric]]),
        borderColor: 
          metric === 'bp_followup' ? '#675BD2' :
          metric === 'bg_followup' ? '#4CAF50' :
          metric === 'new_diagnoses' ? '#FF9800' : '#F44336',
        backgroundColor: 
          metric === 'bp_followup' ? 'rgba(103, 91, 210, 0.1)' :
          metric === 'bg_followup' ? 'rgba(76, 175, 80, 0.1)' :
          metric === 'new_diagnoses' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(244, 67, 54, 0.1)',
        tension: 0.4
      }]
    };
  };

  type MetricKey = 'new_diagnoses' | 'bp_followup' | 'bg_followup' | 'bp_controlled';

  const renderTrendIndicator = (changeValue: number) => {
    if (changeValue > 0) {
      return (
        <span className="text-green-500 flex items-center">
          <ArrowUpward className="h-4 w-4 mr-1" />
          {Math.abs(changeValue)}%
        </span>
      );
    } else if (changeValue < 0) {
      return (
        <span className="text-red-500 flex items-center">
          <ArrowDownward className="h-4 w-4 mr-1" />
          {Math.abs(changeValue)}%
        </span>
      );
    }
    return <span className="text-gray-500">0%</span>;
  };

  // Function to generate alerts from metrics data
  const generateAlerts = (metricsData: MetricsData['data']) => {
    const newAlerts: Alert[] = [];

    // Threshold violations
    if (metricsData.threshold_violations.new_diagnoses) {
      newAlerts.push({
        id: `threshold-new_diagnoses-${Date.now()}`,
        type: 'threshold',
        metric: 'new_diagnoses',
        message: 'New diagnoses rate below 50% threshold',
        severity: 'high',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        data: {
          current: metricsData.current_metrics.percent_new_diagnoses
        }
      });
    }
    if (metricsData.threshold_violations.bp_followup) {
      newAlerts.push({
        id: `threshold-bp_followup-${Date.now()}`,
        type: 'threshold',
        metric: 'bp_followup',
        message: 'BP follow-up rate below 70% threshold',
        severity: 'high',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        data: {
          current: metricsData.current_metrics.percent_bp_followup
        }
      });
    } 
    if (metricsData.threshold_violations.bg_followup) {
      newAlerts.push({
        id: `threshold-bg_followup-${Date.now()}`,
        type: 'threshold',
        metric: 'bg_followup',
        message: 'BG follow-up rate below 60% threshold',
        severity: 'high',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        data: {
          current: metricsData.current_metrics.percent_bg_followup
        }
      });
    }
    if (metricsData.threshold_violations.bp_controlled) {
      newAlerts.push({
        id: `threshold-bp_controlled-${Date.now()}`,
        type: 'threshold',
        metric: 'bp_controlled',
        message: 'BP controlled rate below 80% threshold',
        severity: 'high',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        data: {
          current: metricsData.current_metrics.percent_bp_controlled
        }
      });
    } 

    // Performance declines
    if (metricsData.performance_declined) {
      if (
        metricsData.current_metrics.changes &&
        metricsData.current_metrics.changes.new_diagnoses !== undefined &&
        metricsData.current_metrics.changes.new_diagnoses < 0
      ) {
        newAlerts.push({
          id: `performance-new_diagnoses-${Date.now()}`,
          type: 'performance',
          metric: 'new_diagnoses',
          message: `New diagnoses rate dropped by ${Math.abs(metricsData.current_metrics.changes.new_diagnoses)}%`,
          severity: metricsData.current_metrics.changes.new_diagnoses <= -10 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          acknowledged: false,
          data: {
            change: metricsData.current_metrics.changes.new_diagnoses
          }
        });
      }
      if (
        metricsData.current_metrics.changes &&
        metricsData.current_metrics.changes.bp_followup !== undefined &&
        metricsData.current_metrics.changes.bp_followup < 0
      ) {
        newAlerts.push({
          id: `performance-bp_followup-${Date.now()}`,
          type: 'performance',
          metric: 'bp_followup',
          message: `BP follow-up rate dropped by ${Math.abs(metricsData.current_metrics.changes.bp_followup)}%`,
          severity: metricsData.current_metrics.changes.bp_followup <= -10 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          acknowledged: false,
          data: {
            change: metricsData.current_metrics.changes.bp_followup
          }
        });
      }
      if (
        metricsData.current_metrics.changes &&
        metricsData.current_metrics.changes.bg_followup !== undefined &&
        metricsData.current_metrics.changes.bg_followup < 0
      ) {
        newAlerts.push({
          id: `performance-bg_followup-${Date.now()}`,
          type: 'performance',
          metric: 'bg_followup',
          message: `New diagnoses rate dropped by ${Math.abs(metricsData.current_metrics.changes.bg_followup)}%`,
          severity: metricsData.current_metrics.changes.bg_followup <= -10 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          acknowledged: false,
          data: {
            change: metricsData.current_metrics.changes.bg_followup
          }
        });
      }
      if (
        metricsData.current_metrics.changes &&
        metricsData.current_metrics.changes.bp_controlled !== undefined &&
        metricsData.current_metrics.changes.bp_controlled < 0
      ) {
        newAlerts.push({
          id: `performance-bp_controlled-${Date.now()}`,
          type: 'performance',
          metric: 'bp_controlled',
          message: `BP controlled rate dropped by ${Math.abs(metricsData.current_metrics.changes.bp_controlled)}%`,
          severity: metricsData.current_metrics.changes.bp_controlled <= -10 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          acknowledged: false,
          data: {
            change: metricsData.current_metrics.changes.bp_controlled
          }
        });
      }
    }

    // Add new alerts if they don't already exist
    setAlerts(prev => {
      const existingIds = prev.map(a => a.id);
      const toAdd = newAlerts.filter(a => !existingIds.includes(a.id));
      return [...prev, ...toAdd];
    });
  };


// Acknowledge single alert
const acknowledgeAlert = (id: string) => {
  setAlerts(prev => 
    prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    )
  );
};

// Acknowledge all alerts
const acknowledgeAllAlerts = () => {
  setAlerts(prev => 
    prev.map(alert => ({ ...alert, acknowledged: true }))
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

  if (!metrics) return (
    <div className="p-4 text-center">
      No metrics data available
    </div>
  );

  const AlertItem = ({ 
  alert, 
      onAcknowledge 
    }: { 
      alert: Alert; 
      onAcknowledge: (id: string) => void 
    }) => {
      const severityColors = {
        high: 'bg-red-50 border-red-200',
        medium: 'bg-orange-50 border-orange-200',
        low: 'bg-yellow-50 border-yellow-200'
      };

      return (
        <li 
          className={`p-4 rounded-lg border ${severityColors[alert.severity as 'high' | 'medium' | 'low']} ${
            alert.acknowledged ? 'opacity-70' : ''
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold capitalize">
                  {alert.metric.replace(/_/g, ' ')}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
            </div>
            {!alert.acknowledged && (
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={() => onAcknowledge(alert.id)}
              >
                Acknowledge
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {new Date(alert.timestamp).toLocaleString()}
          </div>
          {alert.data && (
            <div className="mt-2 text-xs">
              {Object.entries(alert.data).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          )}
        </li>
      );
    };
  
const metricsCards = [
  {
    label: 'New Diagnoses',
    icon: WarningAmber,
    current: metrics.data?.current_metrics?.percent_new_diagnoses ?? 0,
    previous: metrics.data?.historical_data?.[0]?.percent_new_diagnoses ?? 0,
    // previous: metrics.data?.current_metrics?.changes?.new_diagnoses ?? 0,
    change: metrics.data?.current_metrics?.changes?.new_diagnoses ?? 0,
    violated: metrics.data?.threshold_violations?.new_diagnoses ?? false
  },
  {
    label: 'BP Follow-up %',
    icon: Activity,
    current: metrics.data?.current_metrics?.percent_bp_followup ?? 0,
    previous: metrics.data?.historical_data?.[0]?.percent_bp_followup ?? 0,
    // previous: metrics.data?.current_metrics?.changes?.bp_followup ?? 0,
    change: metrics.data?.current_metrics?.changes?.bp_followup ?? 0,
    violated: metrics.data?.threshold_violations?.bp_followup ?? false
  },
  {
    label: 'BG Follow-up %',
    icon: Thermometer,
    current: metrics.data?.current_metrics?.percent_bg_followup ?? 0,
    previous: metrics.data?.historical_data?.[0]?.percent_bg_followup ?? 0,
    // previous: metrics.data?.current_metrics?.changes?.bg_followup ?? 0,
    change: metrics.data?.current_metrics?.changes?.bg_followup ?? 0,
    violated: metrics.data?.threshold_violations?.bg_followup ?? false
  },
  {
    label: 'BP Controlled %',
    icon: BarChart3,
    current: metrics.data?.current_metrics?.percent_bp_controlled ?? 0,
    previous: metrics.data?.historical_data?.[0]?.percent_bp_controlled ?? 0,
    // previous: metrics.data?.historical_data?.changes?.bp_controlled ?? 0,
    change: metrics.data?.current_metrics?.changes?.bp_controlled ?? 0,
    violated: metrics.data?.threshold_violations?.bp_controlled ?? false
  }
];

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
          <div
              role="button"
              tabIndex={0}
              aria-label="Show Alerts"
              title="Show Alerts"
              onClick={() => setActiveTab('alerts')}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('alerts')}
              className={`w-full text-left p-2 rounded-md flex items-center cursor-pointer ${
                activeTab === 'alerts' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue'
              }`}
            >
                <AlertTab
                    alerts={convertToAlertFollowup(alerts)}
                    onAcknowledge={acknowledgeAlert}
                    setActiveTab={setActiveTab}
                  />
            </div>
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
              <button 
                className={`w-full text-left p-2 rounded-md flex items-center ${activeTab === 'alerts' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue-lightest'}`}
                onClick={() => setActiveTab('alerts')}
              >
                <Bell className="h-5 w-5 mr-2" />
                Alerts
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

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {metricsCards.map((card, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-[#675BD2] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">{card.label}</h3>
                      <card.icon className={`h-6 w-6 ${card.violated ? 'text-red-500' : 'text-green-500'}`} />
                    </div>
                    <p className="text-3xl font-bold">{card.current}%</p>
                    <p className="text-sm text-indigo mt-2">vs Previous {card.previous}%</p>
                  </div>
                  <div className="mt-4">
                    {/* {renderTrendIndicator(card.change)} */}
                    <p className={`text-sm ${card.change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {card.change < 0 ? `${Math.abs(card.change)}% drop` : `${card.change}% increase`}
                    </p>
                  </div>
                </div>
              ))}
            </div>


            {/* Follow-up Rates Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-medium mb-4">Historical Trends</h3>
              
              {activeTab === 'overview' ? (
                <>
                  <h2 className="text-lg font-semibold mb-4">Follow-up Performance Trends</h2>
                  <Line data={historicalChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    {activeTab === 'bp' ? 'BP Follow-up Trend' : 
                    activeTab === 'bg' ? 'BG Follow-up Trend' : 
                    'New Diagnoses Trend'}
                  </h2>
                  <Line 
                    data={getChartData(
                      activeTab === 'bp' ? 'bp_followup' : 
                      activeTab === 'bg' ? 'bg_followup' : 'new_diagnoses'
                    )} 
                    options={{ responsive: true }} 
                  />
                </>
              )}
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

                        {/* Alerts Section */}
            {activeTab === 'alerts' && (
              <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">Alerts</h3>
                  {alerts.length > 0 && (
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={acknowledgeAllAlerts}
                      disabled={alerts.every(a => a.acknowledged)}
                    >
                      Acknowledge All
                    </button>
                  )}
                </div>
                
                {alerts.length === 0 ? (
                  <p className="text-gray-500">No alerts at this time.</p>
                ) : (
                  <ul className="space-y-4">
                    {alerts
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map(alert => (
                        <AlertItem 
                          key={alert.id}
                          alert={alert}
                          onAcknowledge={acknowledgeAlert}
                        />
                      ))
                    }
                  </ul>
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
            {metrics.data?.performance_declined && (
              <div className="bg-red-50 border-l-4 mt-6 border-red-500 p-4 mb-6 rounded-r">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <WarningAmber className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Performance Alert</h3>
                    <div className="mt-2 text-sm text-red-700">
                    {metrics?.data?.current_metrics?.changes && (
                      <ul className="list-disc pl-5 space-y-1">
                        {metrics.data.current_metrics.changes.new_diagnoses < 0 && (
                          <li>
                            New diagnoses rate dropped by {Math.abs(metrics.data.current_metrics.changes.new_diagnoses)}%
                          </li>
                        )}
                        {metrics.data.current_metrics.changes.bp_followup < 0 && (
                          <li>
                            BP follow-up rate dropped by {Math.abs(metrics.data.current_metrics.changes.bp_followup)}%
                          </li>
                        )}
                        {metrics.data.current_metrics.changes.bg_followup < 0 && (
                          <li>
                            BG follow-up rate dropped by {Math.abs(metrics.data.current_metrics.changes.bg_followup)}%
                          </li>
                        )}
                        {metrics.data.current_metrics.changes.bp_controlled < 0 && (
                          <li>
                            BP controlled rate dropped by {Math.abs(metrics.data.current_metrics.changes.bp_controlled)}%
                          </li>
                        )}
                      </ul>
                    )}

                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Threshold Violations */}
          {(metrics.data?.threshold_violations?.new_diagnoses || 
            metrics.data?.threshold_violations?.bp_followup || 
            metrics.data?.threshold_violations?.bg_followup || 
            metrics.data?.threshold_violations?.bp_controlled) && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <WarningAmber className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Threshold Warning</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {metrics.data?.threshold_violations?.new_diagnoses && <li>New diagnoses rate is below 50%</li>}
                      {metrics.data?.threshold_violations?.bp_followup && <li>BP follow-up rate is below 50%</li>}
                      {metrics.data?.threshold_violations?.bg_followup && <li>BG follow-up rate is below 50%</li>}
                      {metrics.data?.threshold_violations?.bp_controlled && <li>BP controlled rate is below 50%</li>}
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
