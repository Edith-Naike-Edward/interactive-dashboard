"use client";
import { useState, useEffect } from 'react';
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
} from "@mui/icons-material";
import { Pie } from 'react-chartjs-2';
import {  Line } from "react-chartjs-2";
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
  PieChartIcon
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement, PointElement, annotationPlugin, LineElement, Title);
// Define types based on your site/user data
type SiteData = {
  site_id: number;
  name: string;
  site_type: string;
  county_id: number;
  sub_county_id: number;
  latitude: number;
  longitude: number;
  is_active: boolean;
};

type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  organisation: string;
  site_id: number;
  is_active: boolean;
};

type Alert = {
  id: string;
  siteId: number;
  siteName: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  acknowledged: boolean;
};

type ActivityDeclineData = {
  current: {
    sites: number;
    users: number;
  };
  previous: {
    sites: number;
    users: number;
  };
  site_activity_declined_5_percent: boolean;
  user_activity_declined_5_percent: boolean;
  historical_data: {
    sites: Array<{
      date: string;
      count: number;
    }>;
    users: Array<{
      date: string;
      count: number;
    }>;
  };
};

const generateMockAlerts = (sites: SiteData[]): Alert[] => {
  const alertTypes = [
    'Site Inactive', 
    'User Activity Drop', 
    'Data Sync Failure', 
    'Connectivity Issue', 
    'Resource Shortage'
  ];
  
  return sites
    .filter(site => !site.is_active || Math.random() > 0.7)
    .map((site, i) => ({
      id: `A${i + 1000}`,
      siteId: site.site_id,
      siteName: site.name,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      message: `Site ${site.name} requires attention`,
      severity: !site.is_active ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
      timestamp: new Date().toISOString(),
      acknowledged: false
    }));
};

// Main Dashboard Component
export default function SiteMonitoringDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sites, setSites] = useState<SiteData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationInterval, setSimulationIntervalState] = useState<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
//   const [activityDecline, setActivityDecline] = useState<ActivityDeclineData | null>(null);
  const [activityDecline, setActivityDecline] = useState<ActivityDeclineData>({
    // active_sites: 0,
    // active_users: 0,
    current: {
      sites: 0,
      users: 0
    },
    previous: {
      sites: 0,
      users: 0
    },
    site_activity_declined_5_percent: false,
    user_activity_declined_5_percent: false,
    historical_data: {
      sites: [],
      users: []
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  type PieData = {
    name: string;
    value: number;
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

    // Load sites data
    useEffect(() => {
        const loadSites = async () => {
          try {
            const response = await fetch('http://localhost:8000/api/sites');
            if (!response.ok) throw new Error('Failed to load sites');
            const data = await response.json();
            setSites(data);
          } catch (error) {
            console.error('Error loading sites:', error);
            setError('Failed to load health facilities. Please refresh the page.');
          }
        };
    
        // Load users data
        const loadUsers = async () => {
          try {
            const response = await fetch('http://localhost:8000/api/users');
            if (!response.ok) throw new Error('Failed to load users');
            const data = await response.json();
            setUsers(data);
          } catch (error) {
            console.error('Error loading users:', error);
            setError('Failed to load users. Please refresh the page.');
          } finally {
            setIsLoading(false);
          }
        };

        // Load activity decline data
        const activityResponse = async () => {
            try{
                const response = await fetch('http://localhost:8000/api/check-activity-decline');
                if (!response.ok) throw new Error('Failed to load activity decline data');
                const data = await response.json();
                setActivityDecline(data);
            }  catch (error) {
                console.error('Error loading activity decline data:', error);
                setError('Failed to load activity decline data. Please refresh the page.');
            } finally { 
                setIsLoading(false);
            }
        };
    
        loadSites();
        loadUsers();
        activityResponse();
      }, []);

      // Periodically check for activity decline
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:8000/api/check-activity-decline');
                if (response.ok) {
                    const data = await response.json();
                    setActivityDecline(data);
                
                // Add alert if there's a significant decline
                if (data.site_activity_declined_5_percent) {
                    setAlerts(prev => [...prev, {
                    id: `DECLINE-${Date.now()}`,
                    siteId: 0,
                    siteName: 'System',
                    type: 'Activity Decline',
                    message: `Site activity has declined by 5% or more`,
                    severity: 'medium',
                    timestamp: new Date().toISOString(),
                    acknowledged: false
                    }]);
                }
                
                if (data.user_activity_declined_5_percent) {
                    setAlerts(prev => [...prev, {
                    id: `DECLINE-${Date.now() + 1}`,
                    siteId: 0,
                    siteName: 'System',
                    type: 'Activity Decline',
                    message: `User activity has declined by 5% or more`,
                    severity: 'medium',
                    timestamp: new Date().toISOString(),
                    acknowledged: false
                    }]);
                }
                }
            } catch (error) {
                console.error('Error checking activity decline:', error);
            }
            }, 30000); // Check every 30 seconds
            return () => clearInterval(interval);
  }, []);
        
      // Generate alerts based on site/user status
      useEffect(() => {
        if (sites.length > 0) {
          const inactiveSites = sites.filter(site => !site.is_active);
          const newAlerts = inactiveSites.map((site, i) => ({
            id: `A${i + 1000}`,
            siteId: site.site_id,
            siteName: site.name,
            type: 'Site Inactive',
            message: `Site ${site.name} is inactive`,
            severity: 'high'as const, // Explicitly type this as 'high'
            timestamp: new Date().toISOString(),
            acknowledged: false
          }));
          setAlerts(newAlerts);
        }
      }, [sites]);

  // Acknowledge alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  // Filter sites based on search input
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.site_id.toString().includes(searchTerm)
  );

  // Filter users based on search input
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dashboard Stats
  const activeSites = sites.filter(s => s.is_active).length;
  const inactiveSites = sites.filter(s => !s.is_active).length;
  const activeUsers = users.filter(u => u.is_active).length;
  const inactiveUsers = users.filter(u => !u.is_active).length;
  const alertCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <>
    <Head>
        <title>Interactive Health Data Visualization Tool</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes float {
            0% {
                opacity: 0;
                transform: translateY(0) scale(0.5);
            }
            10% {
                opacity: 1;
                transform: translateY(-10px) scale(1);
            }
            90% {
                opacity: 1;
                transform: translateY(-200px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-220px) scale(0.5);
                }
              }
              .data-point {
                background-color: rgba(255, 255, 255, 0.4);
                animation: float 15s infinite linear;
              }
            @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
            }
            }
        `}</style>
    </Head>
    <div className="flex flex-col min-h-screen bg-white/95 backdrop-blur-md shadow-md  font-sans">
      {/* Navigation */}
      <nav className="p-4 flex justify-between items-center w-full top-0 left-0 z-50 py-4 px-8 bg-white shadow-md">
        <div className="flex items-center">
          <a href="#" className="flex items-center gap-2 no-underline text-blue-800 font-serif font-bold text-xl">
          <div className="w-8 h-8 bg-blue-800 text-white rounded-lg flex items-center justify-center text-lg">🔍</div>
          <span>AfyaScope</span>
        </a>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center relative" 
            onClick={() => setShowAlertPanel(!showAlertPanel)}
          >
            <Bell className="h-6 w-6" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-tacao text-tacao-darkest text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {alertCount}
              </span>
            )}
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
      <div className="flex flex-1 overflow-hidden ">
        {/* Sidebar */}
        <aside className="bg-[#FFFFF] w-56 p-4 shadow-md shadow-black/10 hidden md:block">
          <nav className="space-y-2">
            <button 
              className={`w-full text-left p-2 rounded-md flex items-center ${activeTab === 'overview' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue-lightest'}`}
              onClick={() => setActiveTab('overview')}
            >
              <PieChart className="h-5 w-5 mr-2" />
              Overview
            </button>
            <button 
              className={`w-full text-left p-2 rounded-md flex items-center ${activeTab === 'sites' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue'}`}
              onClick={() => setActiveTab('sites')}
            >
              <Building className="h-5 w-5 mr-2" />
              Sites
            </button>
            <button 
              className={`w-full text-left p-2 rounded-md flex items-center ${activeTab === 'users' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue'}`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-5 w-5 mr-2" />
              Users
            </button>
            <button 
              className={`w-full text-left p-2 rounded-md flex items-center ${activeTab === 'analytics' ? 'bg-persian-blue text-black' : 'hover:bg-persian-blue'}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Analytics
            </button>
          </nav>
          
        </aside>

        {/* Main Dashboard Area */}
        <main className="flex-1 p-6 overflow-auto bg-[#EAE7FA]">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-3xl font-bold mb-2 md:mb-0">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'sites' && 'Site Management'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'analytics' && 'System Analytics'}
            </h2>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search sites or users..."
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
          <div className="bg-padua-lightest grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-[#675BD2]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Total Sites</h3>
                <Building className="h-6 w-6 text-padua-darkest" />
              </div>
              <p className="text-3xl font-bold">{sites.length}</p>
              <p className="text-sm text-indigo mt-2">Health facilities monitored</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-[#675BD2]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Active Sites</h3>
                <Activity className="h-6 w-6 text-persian-blue" />
              </div>
              <p className="text-3xl font-bold">{activeSites}</p>
              <p className="text-sm text-indigo mt-2">Currently operational</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-[#675BD2]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Total Users</h3>
                <Users className="h-6 w-6 text-tacao" />
              </div>
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="text-sm text-indigo mt-2">Registered users</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-[#675BD2]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Active Users</h3>
                <User className="h-6 w-6 text-bizarre-darkest" />
              </div>
              <p className="text-3xl font-bold">{activeUsers}</p>
              <p className="text-sm text-indigo mt-2">Currently active</p>
            </div>
          </div>

          {/* Site List */}
          {activeTab === 'overview' && (
            <div className="card rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-bizarre bg-white">
                <h3 className="text-xl font-medium">Site Monitoring</h3>
                <p className="text-sm text-indigo">Real-time site status monitoring</p>
              </div>
              
              <div className="overflow-x-auto ">
                <table className="w-full whitespace-nowrap">
                  <thead className="bg-padua-lightest">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Site</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Users</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-bizarre">
                    {filteredSites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((site) => {
                      const siteUsers = users.filter(u => u.site_id === site.site_id);
                      const activeSiteUsers = siteUsers.filter(u => u.is_active).length;
                      
                      return (
                        <tr key={site.site_id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-persian-blue-lightest flex items-center justify-center">
                                <Building className="h-4 w-4 text-persian-blue" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">{site.name}</p>
                                <p className="text-xs text-indigo">ID: {site.site_id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm">{site.site_type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-tacao" />
                              <span className="text-sm">Lat: {site.latitude.toFixed(4)}, Long: {site.longitude.toFixed(4)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-persian-blue" />
                              <span className="text-sm">{activeSiteUsers}/{siteUsers.length} active</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${site.is_active ? 'bg-padua-lightest text-padua-darkest' : 'bg-bizarre-lightest text-bizarre-darkest'}`}>
                              {site.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredSites.length > 0 && (
                <PaginationControls
                    currentPage={currentPage}
                    totalItems={filteredSites.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => {
                    setCurrentPage(page);
                    }}
                />
                )}

            </div>
          )}

          {/* Sites View */}
          {activeTab === 'sites' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSites.map((site) => {
                const siteUsers = users.filter(u => u.site_id === site.site_id);
                const activeUsersCount = siteUsers.filter(u => u.is_active).length;
                
                return (
                  <div 
                    key={site.site_id} 
                    className={`card rounded-lg shadow-sm p-4 border-l-4 
                      ${site.is_active ? 'border-l-padua' : 'border-l-bizarre'}`}
                  >
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{site.name}</h3>
                        <p className="text-sm text-indigo">ID: {site.site_id} • {site.site_type}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium h-fit 
                        ${site.is_active ? 'bg-padua-lightest text-padua-darkest' : 'bg-bizarre-lightest text-bizarre-darkest'}`}>
                        {site.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-2 bg-persian-blue-lightest rounded-md">
                        <div className="flex items-center mb-1">
                          <MapPin className="h-4 w-4 mr-1 text-persian-blue" />
                          <span className="text-xs font-medium">Location</span>
                        </div>
                        <p className="text-sm font-medium">
                          {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                        </p>
                      </div>
                      
                      <div className="p-2 bg-padua-lightest rounded-md">
                        <div className="flex items-center mb-1">
                          <Users className="h-4 w-4 mr-1 text-padua" />
                          <span className="text-xs font-medium">Users</span>
                        </div>
                        <p className="text-xl font-bold">{activeUsersCount}/{siteUsers.length}</p>
                      </div>
                      
                      <div className="p-2 bg-tacao-lightest rounded-md">
                        <div className="flex items-center mb-1">
                          <Activity className="h-4 w-4 mr-1 text-tacao" />
                          <span className="text-xs font-medium">Last Activity</span>
                        </div>
                        <p className="text-sm font-medium">
                          {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="bg-persian-blue text-white py-1 px-4 rounded-md text-sm hover:bg-indigo transition-colors mr-2">
                        View Details
                      </button>
                      <button className="bg-persian-blue-lightest text-persian-blue py-1 px-4 rounded-md text-sm hover:bg-persian-blue-lightest transition-colors">
                        Manage Users
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Users View */}
          {activeTab === 'users' && (
            <div className="card rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-bizarre bg-white">
                <h3 className="text-xl font-medium">User Management</h3>
                <p className="text-sm text-indigo">All registered system users</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead className="bg-padua-darkest">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Site</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Organization</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-darkest uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-bizarre">
                    {filteredUsers .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((user) => {
                      const userSite = sites.find(s => s.site_id === user.site_id);
                      
                      return (
                        <tr key={user.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-bizarre-lightest flex items-center justify-center">
                                <User className="h-4 w-4 text-persian-blue" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-indigo">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm">{user.role}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className=" items-center">
                              <Building className="h-4 w-4 mr-1 text-tacao" />
                              <span className="text-sm">{userSite?.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm">{user.organisation}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${user.is_active ? 'bg-padua-lightest text-padua-darkest' : 'bg-bizarre-lightest text-bizarre-darkest'}`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
                  {/* Pagination controls */}
            <div className="p-4 border-t border-bizarre bg-white">
                <PaginationControls
                    currentPage={currentPage}
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => {
                    setCurrentPage(page);
                    }}
                />
            </div>
            </div>
          )}
          
          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <div className="card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-medium mb-4">System Analytics</h3>
              <p className="text-indigo mb-8">Site and user activity trends and statistics</p>

              <div className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-indigo">Site Activity Decline</p>
                    <p className={`text-lg font-semibold ${activityDecline.site_activity_declined_5_percent ? 'text-red-600' : 'text-green-600'}`}>
                      {activityDecline.site_activity_declined_5_percent ? '↓ More than 5%' : 'No Significant Decline'}
                    </p>
                    <p className="text-xs text-indigo">
                      Previous: {activityDecline.previous.sites} → Current: {activityDecline.current.sites}
                    </p>
                  </div>
                  <PieChart className={`h-8 w-8 ${activityDecline.site_activity_declined_5_percent ? 'text-red-500' : 'text-green-500'}`} />
                </div>

                <div className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-indigo">User Activity Decline</p>
                    <p className={`text-lg font-semibold ${activityDecline.user_activity_declined_5_percent ? 'text-red-600' : 'text-green-600'}`}>
                      {activityDecline.user_activity_declined_5_percent ? '↓ More than 5%' : 'No Significant Decline'}
                    </p>
                    <p className="text-xs text-indigo">
                      Previous: {activityDecline.previous.users} → Current: {activityDecline.current.users}
                    </p>
                  </div>
                  <Users className={`h-8 w-8 ${activityDecline.user_activity_declined_5_percent ? 'text-red-500' : 'text-green-500'}`} />
                </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex justify-center items-center h-64 bg-bizarre-darkest border-2 border-dashed border-indigo rounded-lg">
                  <div className="text-center">
                    <p className="text-indigo font-bold">Site Status Distribution</p>
                    <p className="text-sm text-indigo">{activeSites} Active / {inactiveSites} Inactive</p>
                    <div className="h-48">
                    <Pie
                      data={{
                        labels: ['Active', 'Inactive'],
                        datasets: [
                          {
                            data: [activeSites, inactiveSites],
                            backgroundColor: ['#4CAF50', '#F44336'],
                            borderColor: ['#4CAF50', '#F44336'],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                if (typeof context.raw === 'number' && Array.isArray(context.dataset.data)) {
                                  const value = context.raw;
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${percentage}% (${value})`;
                                }
                                return label;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  </div>
                </div>
                <div className="flex justify-center items-center h-64 bg-bizarre-darkest border-2 border-dashed border-indigo rounded-lg">
                  <div className="text-center">
                    <p className="text-indigo font-bold">User Activity</p>
                    <p className="text-sm text-indigo">{activeUsers} Active / {inactiveUsers} Inactive</p>
                    <div className="h-48">
                    <Pie
                      data={{
                        labels: ['Active', 'Inactive'],
                        datasets: [
                          {
                            data: [activeUsers, inactiveUsers],
                            backgroundColor: ['#4CAF50', '#F44336'],
                            borderColor: ['#4CAF50', '#F44336'],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                if (typeof context.raw === 'number' && Array.isArray(context.dataset.data)) {
                                  const value = context.raw;
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${percentage}% (${value})`;
                                }
                                return label;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  </div>
                </div>
              </div>
          
              <div className="flex justify-center items-center h-64 bg-indigo-lightest border-2 border-dashed border-indigo rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-build text-indigo">Site and user activity trends (Last 30 Days)</p>
                  <div className="mt-6 p-4 bg-white rounded-lg shadow">
                  <div className="h-40 w-200">
                  <Line 
                      data={{
                        labels: [
                          ...(activityDecline.historical_data?.sites?.map((item) => item.date) || []),
                          'Previous',
                          'Current'
                        ],
                        datasets: [
                          {
                            label: 'Active Sites',
                            data: [
                              ...(activityDecline.historical_data?.sites?.map((item) => item.count) || []),
                              activityDecline.previous.sites,
                              activityDecline.current.sites
                            ],
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            tension: 0.3,
                            borderWidth: 2
                          },
                          {
                            label: 'Active Users',
                            data: [
                              ...(activityDecline.historical_data?.users?.map((item) => item.count) || []),
                              activityDecline.previous.users,
                              activityDecline.current.users
                            ],
                            borderColor: '#2196F3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            tension: 0.3,
                            borderWidth: 2
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                  label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                  label += context.parsed.y;
                                }
                                
                                // Add special labels for current/previous points
                                const totalPoints = context.chart.data.labels?.length || 0;
                                if (context.dataIndex === totalPoints - 2) {
                                  label += ' (Previous)';
                                } else if (context.dataIndex === totalPoints - 1) {
                                  label += ' (Current)';
                                }
                                
                                return label;
                              }
                            }
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: false
                          }
                        }
                      }}
                    />
                  </div>
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