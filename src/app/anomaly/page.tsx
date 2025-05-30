// "use client";
"use client";
import React, { useState, useEffect } from 'react';
import '../globals.css';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Typography, 
  Badge,
  Statistic,
  Select
} from 'antd';
import { 
  ExclamationCircleOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

// Tailwind Card Component
const TailwindCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

interface StatCardProps {
  title: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon, trend }) => {
  // Add a class based on the color prop
  const colorClass = color
    ? `stat-card-value stat-card-value-${color.replace('#', '')}`
    : 'stat-card-value stat-card-value-default';
  
  return (
    <div className="stat-card-center">
      <Text type="secondary">{title}</Text>
      <div className={colorClass}>
        {icon && <span className="stat-card-icon">{icon}</span>}
        {value}
        {trend === 'up' && <ArrowUpOutlined className="trend-up" />}
        {trend === 'down' && <ArrowDownOutlined className="trend-down" />}
      </div>
    </div>
  );
};

interface Anomaly {
  screening_id?: string;
  patient_id: string;
  timestamp: string;
  description: string;
  avg_systolic?: number | null;
  avg_diastolic?: number | null;
  glucose_value?: number | null;
  glucose_type?: string | null;
  bmi?: number | null;
  severity?: number | string;
  alert_type?: string;
  patient_name?: string;
  source_table?: string;
}

interface Stats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const alertTypeDescriptions: Record<string, string> = {
  "SEVERE_HYPERGLYCEMIA": "Severely high glucose level",
  "HYPOGLYCEMIA": "Dangerously low glucose level",
  "HYPERTENSIVE_CRISIS": "Severely high blood pressure",
  "HYPOTENSIVE_CRISIS": "Dangerously low blood pressure",
  "TACHYCARDIA": "Abnormally high heart rate",
  "BRADYCARDIA": "Abnormally low heart rate",
  "POOR_GLYCEMIC_CONTROL": "Poor blood sugar control",
  "HIGH_CVD_RISK": "High cardiovascular disease risk",
  "SEVERE_OBESITY": "Severe obesity",
  "SEVERE_UNDERWEIGHT": "Severe underweight",
  "MENTAL_HEALTH_CONCERN": "Mental health concern",
  "UNDIAGNOSED_HIGH_RISK": "Undiagnosed high risk",
  "UNCONTROLLED_CONDITION": "Uncontrolled condition",
  "HIGH_RISK_LIFESTYLE": "High-risk lifestyle",
  "MEDICATION_NON_COMPLIANCE": "Medication non-compliance",
  "FREQUENT_VISITOR": "Frequent visitor",
  "CONCERNING_CLINICAL_NOTES": "Concerning clinical notes",
  "ELEVATED_FASTING_GLUCOSE": "Elevated fasting glucose",
  "ELEVATED_RANDOM_GLUCOSE": "Elevated random glucose",
  "WARNING": "General health warning"
};

const AnomalyTable: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    limit: 50,
    severity: undefined as string | undefined,
    alert_type: undefined as string | undefined
  });

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patient_name',
      key: 'patient_name',
      render: (text: string, record: Anomaly) => (
        <Space>
          <Badge 
            status={Number(record.severity) >= 4 ? 'error' : 
                   Number(record.severity) >= 3 ? 'warning' : 'processing'} 
          />
          <Text strong>{text || `Patient ${record.patient_id}`}</Text>
        </Space>
      )
    },
    {
      title: 'Alert Type',
      dataIndex: 'alert_type',
      key: 'alert_type',
      render: (text: string) => (
        <Text>{alertTypeDescriptions[text] || text}</Text>
      )
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: number | string) => {
        const severityNum = typeof severity === 'string' ? parseInt(severity) : severity;
        let color = 'green';
        let text = 'Low';
        if (severityNum === 5) {
          color = 'red';
          text = 'Critical';
        } else if (severityNum === 4) {
          color = 'orange';
          text = 'High';
        } else if (severityNum === 3) {
          color = 'gold';
          text = 'Medium';
        } else if (severityNum === 2) {
          color = 'blue';
          text = 'Low';
        } else if (severityNum === 1) {
          color = 'green';
          text = 'Info';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Source',
      dataIndex: 'source_table',
      key: 'source_table',
      render: (text: string) => <Tag>{text?.replace('_', ' ') || 'Unknown'}</Tag>,
    },
  ];

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8010/api/anomalies', { 
        params: {
          limit: filters.limit,
          severity: filters.severity,
          alert_type: filters.alert_type
        }
      });
      
      // Transform the data to match our frontend expectations
      const transformedData = response.data.map((item: any) => ({
        ...item,
        severity: item.severity?.toString(), // Ensure severity is string for consistent handling
        patient_name: item.patient_name === 'nan nan' ? null : item.patient_name // Clean up patient names
      }));
      
      setAnomalies(transformedData);
      
      // Calculate stats based on the response
      const statsData = {
        total: transformedData.length,
        critical: transformedData.filter((a: Anomaly) => Number(a.severity) === 5).length,
        high: transformedData.filter((a: Anomaly) => Number(a.severity) === 4).length,
        medium: transformedData.filter((a: Anomaly) => Number(a.severity) === 3).length,
        low: transformedData.filter((a: Anomaly) => Number(a.severity) <= 2).length
      };
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      setAnomalies([]);
      setStats({
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // No need to fetch here - useEffect will handle it
  };

  useEffect(() => {
    fetchAnomalies();
  }, [filters]);

  // Function to generate unique row keys
  // const getRowKey = (record: Anomaly, index: number) => {
  //   if (record.screening_id) {
  //     return `${record.screening_id}_${record.timestamp}`;
  //   }
  //   if (record.patient_id && record.timestamp) {
  //     return `${record.patient_id}_${record.timestamp}`;
  //   }
  //   return `row_${index}`; // Fallback to index if no unique identifiers
  // };
  // Update the getRowKey function to handle all cases more robustly
const getRowKey = (record: Anomaly, index: number) => {
  // Try to use screening_id if available
  if (record.screening_id) {
    return `screening_${record.screening_id}`;
  }
  
  // Fallback to patient_id + timestamp if available
  if (record.patient_id && record.timestamp) {
    return `patient_${record.patient_id}_${record.timestamp}`;
  }
  
  // Final fallback to index with additional info if available
  return `row_${index}_${record.alert_type || 'alert'}_${record.description?.substring(0, 10) || 'desc'}`;
};

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">
        <ExclamationCircleOutlined /> Health Anomalies Dashboard
      </Title>
      
      <div className="mb-6">
        <TailwindCard>
          <Space size="large">
            <StatCard 
              title="Total Anomalies" 
              value={stats.total} 
              icon={<ExclamationCircleOutlined />}
              color="#1890ff"
            />
            <StatCard 
              title="Critical" 
              value={stats.critical} 
              color="red"
              trend={stats.critical > 0 ? 'up' : 'stable'}
            />
            <StatCard 
              title="High" 
              value={stats.high} 
              color="orange"
            />
            <StatCard 
              title="Medium" 
              value={stats.medium} 
              color="gold"
            />
            <StatCard 
              title="Low" 
              value={stats.low} 
              color="green"
            />
          </Space>
        </TailwindCard>
      </div>
      
      <TailwindCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Anomaly Detections</h3>
            <Space>
              <Select
                className="w-[180px]"
                placeholder="Filter by severity"
                onChange={(value: string) => handleFilterChange('severity', value)}
                options={[
                  { value: "5", label: "Critical" },
                  { value: "4", label: "High" },
                  { value: "3", label: "Medium" },
                  { value: "2", label: "Low" },
                  { value: "1", label: "Info" }
                ]}
              />

              <Select
                className="w-[220px]"
                placeholder="Filter by alert type"
                onChange={(value: string) => handleFilterChange('alert_type', value)}
                options={Object.entries(alertTypeDescriptions).map(([key, desc]) => ({
                  value: key,
                  label: desc
                }))}
              />

              <Select
                className="w-[100px]"
                defaultValue="50"
                onChange={(value: string) => handleFilterChange('limit', Number(value))}
                options={[
                  { value: "20", label: "20 items" },
                  { value: "50", label: "50 items" },
                  { value: "100", label: "100 items" },
                  { value: "500", label: "500 items" }
                ]}
              />
              
              <Button onClick={fetchAnomalies} loading={loading}>
                Refresh
              </Button>
            </Space>
          </div>
          
          <Table<Anomaly>
            columns={columns}
            dataSource={anomalies}
            loading={loading}
            rowKey={getRowKey}
            pagination={{ pageSize: filters.limit }}
            scroll={{ x: 'max-content' }}
            expandable={{
              expandedRowRender: (record: Anomaly) => (
                <div className="m-0">
                  <p><strong>Patient ID:</strong> {record.patient_id}</p>
                  <p><strong>Timestamp:</strong> {new Date(record.timestamp).toLocaleString()}</p>
                  <p><strong>Details:</strong> {record.description}</p>
                  {record.avg_systolic !== null && record.avg_systolic !== undefined && (
                    <p><strong>BP:</strong> {record.avg_systolic}/{record.avg_diastolic} mmHg</p>
                  )}
                  {record.glucose_value !== null && record.glucose_value !== undefined && (
                    <p><strong>Glucose:</strong> {record.glucose_value} mg/dL ({record.glucose_type})</p>
                  )}
                  {record.bmi !== null && record.bmi !== undefined && (
                    <p><strong>BMI:</strong> {record.bmi}</p>
                  )}
                </div>
              ),
              rowExpandable: (record: Anomaly) => true,
            }}
          />
        </div>
      </TailwindCard>
    </div>
  );
};

export default AnomalyTable;// // "use client";
// "use client";
// import React, { useState, useEffect } from 'react';
// import '../globals.css';
// import { 
//   Table, 
//   Tag, 
//   Space, 
//   Button, 
//   Typography, 
//   Badge,
//   Statistic,
//   Select
// } from 'antd';
// import { 
//   ExclamationCircleOutlined, 
//   ArrowUpOutlined, 
//   ArrowDownOutlined 
// } from '@ant-design/icons';
// import axios from 'axios';

// const { Title, Text } = Typography;

// // Tailwind Card Component
// const TailwindCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
//   <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
//     {children}
//   </div>
// );

// interface StatCardProps {
//   title: string;
//   value: number;
//   color?: string;
//   icon?: React.ReactNode;
//   trend?: 'up' | 'down' | 'stable';
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon, trend }) => {
//   // Add a class based on the color prop
//   const colorClass = color
//     ? `stat-card-value stat-card-value-${color.replace('#', '')}`
//     : 'stat-card-value stat-card-value-default';
  
//   return (
//     <div className="stat-card-center">
//       <Text type="secondary">{title}</Text>
//       <div className={colorClass}>
//         {icon && <span className="stat-card-icon">{icon}</span>}
//         {value}
//         {trend === 'up' && <ArrowUpOutlined className="trend-up" />}
//         {trend === 'down' && <ArrowDownOutlined className="trend-down" />}
//       </div>
//     </div>
//   );
// };

// interface Anomaly {
//   screening_id?: string;
//   patient_id: string;
//   timestamp: string;
//   description: string;
//   avg_systolic?: number | null;
//   avg_diastolic?: number | null;
//   glucose_value?: number | null;
//   glucose_type?: string | null;
//   bmi?: number | null;
//   severity?: number | string;
//   alert_type?: string;
//   patient_name?: string;
//   source_table?: string;
// }

// interface Stats {
//   total: number;
//   critical: number;
//   high: number;
//   medium: number;
//   low: number;
// }

// const alertTypeDescriptions: Record<string, string> = {
//   "SEVERE_HYPERGLYCEMIA": "Severely high glucose level",
//   "HYPOGLYCEMIA": "Dangerously low glucose level",
//   "HYPERTENSIVE_CRISIS": "Severely high blood pressure",
//   "HYPOTENSIVE_CRISIS": "Dangerously low blood pressure",
//   "TACHYCARDIA": "Abnormally high heart rate",
//   "BRADYCARDIA": "Abnormally low heart rate",
//   "POOR_GLYCEMIC_CONTROL": "Poor blood sugar control",
//   "HIGH_CVD_RISK": "High cardiovascular disease risk",
//   "SEVERE_OBESITY": "Severe obesity",
//   "SEVERE_UNDERWEIGHT": "Severe underweight",
//   "MENTAL_HEALTH_CONCERN": "Mental health concern",
//   "UNDIAGNOSED_HIGH_RISK": "Undiagnosed high risk",
//   "UNCONTROLLED_CONDITION": "Uncontrolled condition",
//   "HIGH_RISK_LIFESTYLE": "High-risk lifestyle",
//   "MEDICATION_NON_COMPLIANCE": "Medication non-compliance",
//   "FREQUENT_VISITOR": "Frequent visitor",
//   "CONCERNING_CLINICAL_NOTES": "Concerning clinical notes",
//   "ELEVATED_FASTING_GLUCOSE": "Elevated fasting glucose",
//   "ELEVATED_RANDOM_GLUCOSE": "Elevated random glucose",
//   "WARNING": "General health warning"
// };

// const AnomalyTable: React.FC = () => {
//   const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
//   const [stats, setStats] = useState<Stats>({
//     total: 0,
//     critical: 0,
//     high: 0,
//     medium: 0,
//     low: 0
//   });
//   const [loading, setLoading] = useState<boolean>(false);
//   const [filters, setFilters] = useState({
//     limit: 50,
//     severity: undefined as string | undefined,
//     alert_type: undefined as string | undefined
//   });

//   const columns = [
//     {
//       title: 'Patient',
//       dataIndex: 'patient_name',
//       key: 'patient_name',
//       render: (text: string, record: Anomaly) => (
//         <Space>
//           <Badge 
//             status={Number(record.severity) >= 4 ? 'error' : 
//                    Number(record.severity) >= 3 ? 'warning' : 'processing'} 
//           />
//           <Text strong>{text || `Patient ${record.patient_id}`}</Text>
//         </Space>
//       )
//     },
//     {
//       title: 'Alert Type',
//       dataIndex: 'alert_type',
//       key: 'alert_type',
//       render: (text: string) => (
//         <Text>{alertTypeDescriptions[text] || text}</Text>
//       )
//     },
//     {
//       title: 'Severity',
//       dataIndex: 'severity',
//       key: 'severity',
//       render: (severity: number | string) => {
//         const severityNum = typeof severity === 'string' ? parseInt(severity) : severity;
//         let color = 'green';
//         let text = 'Low';
//         if (severityNum === 5) {
//           color = 'red';
//           text = 'Critical';
//         } else if (severityNum === 4) {
//           color = 'orange';
//           text = 'High';
//         } else if (severityNum === 3) {
//           color = 'gold';
//           text = 'Medium';
//         } else if (severityNum === 2) {
//           color = 'blue';
//           text = 'Low';
//         } else if (severityNum === 1) {
//           color = 'green';
//           text = 'Info';
//         }
//         return <Tag color={color}>{text}</Tag>;
//       },
//     },
//     {
//       title: 'Timestamp',
//       dataIndex: 'timestamp',
//       key: 'timestamp',
//       render: (text: string) => new Date(text).toLocaleString(),
//     },
//     {
//       title: 'Description',
//       dataIndex: 'description',
//       key: 'description',
//     },
//     {
//       title: 'Source',
//       dataIndex: 'source_table',
//       key: 'source_table',
//       render: (text: string) => <Tag>{text?.replace('_', ' ') || 'Unknown'}</Tag>,
//     },
//   ];

//   const fetchAnomalies = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:8010/api/anomalies', { 
//         params: {
//           limit: filters.limit,
//           severity: filters.severity,
//           alert_type: filters.alert_type
//         }
//       });
      
//       // Transform the data to match our frontend expectations
//       const transformedData = response.data.map((item: any) => ({
//         ...item,
//         severity: item.severity?.toString(), // Ensure severity is string for consistent handling
//         patient_name: item.patient_name === 'nan nan' ? null : item.patient_name // Clean up patient names
//       }));
      
//       setAnomalies(transformedData);
      
//       // Calculate stats based on the response
//       const statsData = {
//         total: transformedData.length,
//         critical: transformedData.filter((a: Anomaly) => Number(a.severity) === 5).length,
//         high: transformedData.filter((a: Anomaly) => Number(a.severity) === 4).length,
//         medium: transformedData.filter((a: Anomaly) => Number(a.severity) === 3).length,
//         low: transformedData.filter((a: Anomaly) => Number(a.severity) <= 2).length
//       };
//       setStats(statsData);
//     } catch (error) {
//       console.error('Error fetching anomalies:', error);
//       setAnomalies([]);
//       setStats({
//         total: 0,
//         critical: 0,
//         high: 0,
//         medium: 0,
//         low: 0
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (key: string, value: any) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     // No need to fetch here - useEffect will handle it
//   };

//   useEffect(() => {
//     fetchAnomalies();
//   }, [filters]);

//   return (
//     <div className="p-6">
//       <Title level={2} className="mb-6">
//         <ExclamationCircleOutlined /> Health Anomalies Dashboard
//       </Title>
      
//       <div className="mb-6">
//         <TailwindCard>
//           <Space size="large">
//             <StatCard 
//               title="Total Anomalies" 
//               value={stats.total} 
//               icon={<ExclamationCircleOutlined />}
//               color="#1890ff"
//             />
//             <StatCard 
//               title="Critical" 
//               value={stats.critical} 
//               color="red"
//               trend={stats.critical > 0 ? 'up' : 'stable'}
//             />
//             <StatCard 
//               title="High" 
//               value={stats.high} 
//               color="orange"
//             />
//             <StatCard 
//               title="Medium" 
//               value={stats.medium} 
//               color="gold"
//             />
//             <StatCard 
//               title="Low" 
//               value={stats.low} 
//               color="green"
//             />
//           </Space>
//         </TailwindCard>
//       </div>
      
//       <TailwindCard>
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium">Anomaly Detections</h3>
//             <Space>
//               <Select
//                 className="w-[180px]"
//                 placeholder="Filter by severity"
//                 onChange={(value: string) => handleFilterChange('severity', value)}
//                 options={[
//                   { value: "5", label: "Critical" },
//                   { value: "4", label: "High" },
//                   { value: "3", label: "Medium" },
//                   { value: "2", label: "Low" },
//                   { value: "1", label: "Info" }
//                 ]}
//               />

//               <Select
//                 className="w-[220px]"
//                 placeholder="Filter by alert type"
//                 onChange={(value: string) => handleFilterChange('alert_type', value)}
//                 options={Object.entries(alertTypeDescriptions).map(([key, desc]) => ({
//                   value: key,
//                   label: desc
//                 }))}
//               />

//               <Select
//                 className="w-[100px]"
//                 defaultValue="50"
//                 onChange={(value: string) => handleFilterChange('limit', Number(value))}
//                 options={[
//                   { value: "20", label: "20 items" },
//                   { value: "50", label: "50 items" },
//                   { value: "100", label: "100 items" },
//                   { value: "500", label: "500 items" }
//                 ]}
//               />
              
//               <Button onClick={fetchAnomalies} loading={loading}>
//                 Refresh
//               </Button>
//             </Space>
//           </div>
          
//           <Table<Anomaly>
//             columns={columns}
//             dataSource={anomalies}
//             loading={loading}
//             rowKey="screening_id"
//             pagination={{ pageSize: filters.limit }}
//             scroll={{ x: 'max-content' }}
//             expandable={{
//               expandedRowRender: (record: Anomaly) => (
//                 <div className="m-0">
//                   <p><strong>Patient ID:</strong> {record.patient_id}</p>
//                   <p><strong>Timestamp:</strong> {new Date(record.timestamp).toLocaleString()}</p>
//                   <p><strong>Details:</strong> {record.description}</p>
//                   {record.avg_systolic !== null && record.avg_systolic !== undefined && (
//                     <p><strong>BP:</strong> {record.avg_systolic}/{record.avg_diastolic} mmHg</p>
//                   )}
//                   {record.glucose_value !== null && record.glucose_value !== undefined && (
//                     <p><strong>Glucose:</strong> {record.glucose_value} mg/dL ({record.glucose_type})</p>
//                   )}
//                   {record.bmi !== null && record.bmi !== undefined && (
//                     <p><strong>BMI:</strong> {record.bmi}</p>
//                   )}
//                 </div>
//               ),
//               rowExpandable: (record: Anomaly) => true,
//             }}
//           />
//         </div>
//       </TailwindCard>
//     </div>
//   );
// };

// export default AnomalyTable;
// import React, { useState, useEffect } from 'react';
// import '../globals.css';
// import { 
//   Table, 
//   Tag, 
//   Space, 
//   Button, 
//   Typography, 
//   Badge,
//   Statistic,
//   Select,
//   Card
// } from 'antd';
// import { 
//   ExclamationCircleOutlined, 
//   ArrowUpOutlined, 
//   ArrowDownOutlined 
// } from '@ant-design/icons';
// import axios from 'axios';

// const { Title, Text } = Typography;

// // Tailwind Card Component
// const TailwindCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
//   <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
//     {children}
//   </div>
// );

// interface StatCardProps {
//   title: string;
//   value: number;
//   color?: string;
//   icon?: React.ReactNode;
//   trend?: 'up' | 'down' | 'stable';
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon, trend }) => {
//   // Add a class based on the color prop
//   const colorClass = color
//     ? `stat-card-value stat-card-value-${color.replace('#', '')}`
//     : 'stat-card-value stat-card-value-default';
  
//   return (
//     <div className="stat-card-center">
//       <Text type="secondary">{title}</Text>
//       <div className={colorClass}>
//         {icon && <span className="stat-card-icon">{icon}</span>}
//         {value}
//         {trend === 'up' && <ArrowUpOutlined className="trend-up" />}
//         {trend === 'down' && <ArrowDownOutlined className="trend-down" />}
//       </div>
//     </div>
//   );
// };

// // Define types for anomaly and stats
// interface Anomaly {
//   screening_id: string;
//   patient_id: string;
//   timestamp: string;
//   description: string;
//   avg_systolic?: number;
//   avg_diastolic?: number;
//   glucose_value?: number;
//   glucose_type?: string;
//   bmi?: number;
//   severity?: string;
//   alert_type?: string;
// }

// interface Stats {
//   total: number;
//   critical: number;
//   high: number;
//   medium: number;
//   low: number;
// }

// const alertTypeDescriptions: Record<string, string> = {
//   bp: "Blood Pressure",
//   glucose: "Glucose",
//   bmi: "BMI",
//   // Add more alert types as needed
// };

// const defaultStats: Stats = {
//   total: 0,
//   critical: 0,
//   high: 0,
//   medium: 0,
//   low: 0,
// };

// const AnomalyTable: React.FC = () => {
//   const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
//   const [stats, setStats] = useState<Stats>(defaultStats);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [filters, setFilters] = useState<{ severity?: string; alert_type?: string; limit: number }>({
//     limit: 50,
//   });

//   const columns = [
//     {
//       title: 'Patient ID',
//       dataIndex: 'patient_id',
//       key: 'patient_id',
//     },
//     {
//       title: 'Timestamp',
//       dataIndex: 'timestamp',
//       key: 'timestamp',
//       render: (value: string) => new Date(value).toLocaleString(),
//     },
//     {
//       title: 'Severity',
//       dataIndex: 'severity',
//       key: 'severity',
//       render: (value: string) => {
//         let color = 'green';
//         let text = 'Low';
//         if (value === '5') {
//           color = 'red';
//           text = 'Critical';
//         } else if (value === '4') {
//           color = 'orange';
//           text = 'High';
//         } else if (value === '3') {
//           color = 'gold';
//           text = 'Medium';
//         } else if (value === '2') {
//           color = 'green';
//           text = 'Low';
//         } else if (value === '1') {
//           color = 'blue';
//           text = 'Info';
//         }
//         return <Tag color={color}>{text}</Tag>;
//       },
//     },
//     {
//       title: 'Alert Type',
//       dataIndex: 'alert_type',
//       key: 'alert_type',
//       render: (value: string) => alertTypeDescriptions[value] || value,
//     },
//     {
//       title: 'Description',
//       dataIndex: 'description',
//       key: 'description',
//     },
//   ];

//   const fetchAnomalies = async () => {
//     setLoading(true);
//     try {
//       // Frontend (should be POST)
//       const response = await axios.get('http://localhost:8010/api/anomalies', { params: filters });
//       setAnomalies(response.data.anomalies || []);
//       setStats(response.data.stats || defaultStats);
//     } catch (error) {
//       // Handle error as needed
//       setAnomalies([]);
//       setStats(defaultStats);
//     }
//     setLoading(false);
//   };

//   const handleFilterChange = (key: string, value: any) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   useEffect(() => {
//     fetchAnomalies();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters]);

//   return (
//     <div className="anomaly-dashboard">
//       <Title level={2} className="dashboard-title">
//         <ExclamationCircleOutlined /> Health Anomalies Dashboard
//       </Title>
      
//       <div className="mb-6">
//         <TailwindCard className="p-6">
//           <Space size="large">
//             <StatCard 
//               title="Total Anomalies" 
//               value={stats.total} 
//               icon={<ExclamationCircleOutlined />}
//               color="#1890ff"
//             />
//             <StatCard 
//               title="Critical" 
//               value={stats.critical} 
//               color="red"
//               trend={stats.critical > 0 ? 'up' : 'stable'}
//             />
//             <StatCard 
//               title="High" 
//               value={stats.high} 
//               color="orange"
//             />
//             <StatCard 
//               title="Medium" 
//               value={stats.medium} 
//               color="gold"
//             />
//             <StatCard 
//               title="Low" 
//               value={stats.low} 
//               color="green"
//             />
//           </Space>
//         </TailwindCard>
//       </div>
      
// <TailwindCard className="p-0 overflow-hidden">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium">Anomaly Detections</h3>
//             <Space>
//               <Select
//                 className="w-[180px]"
//                 placeholder="Filter by severity"
//                 onChange={(value: string) => handleFilterChange('severity', value)}
//                 options={[
//                   { value: "5", label: "Critical" },
//                   { value: "4", label: "High" },
//                   { value: "3", label: "Medium" },
//                   { value: "2", label: "Low" },
//                   { value: "1", label: "Info" }
//                 ]}
//               />

//               <Select
//                 className="w-[220px]"
//                 placeholder="Filter by alert type"
//                 onChange={(value: string) => handleFilterChange('alert_type', value)}
//                 options={Object.entries(alertTypeDescriptions).map(([key, desc]) => ({
//                   value: key,
//                   label: desc
//                 }))}
//               />

//               <Select
//                 className="w-[100px]"
//                 defaultValue="50"
//                 onChange={(value: string) => handleFilterChange('limit', Number(value))}
//                 options={[
//                   { value: "20", label: "20 items" },
//                   { value: "50", label: "50 items" },
//                   { value: "100", label: "100 items" },
//                   { value: "500", label: "500 items" }
//                 ]}
//               />
              
//               <Button onClick={fetchAnomalies} loading={loading}>
//                 Refresh
//               </Button>
//             </Space>
//           </div>
          
//           <Table<Anomaly>
//             columns={columns}
//             dataSource={anomalies}
//             loading={loading}
//             rowKey="screening_id"
//             pagination={{ pageSize: filters.limit }}
//             scroll={{ x: 'max-content' }}
//             expandable={{
//               expandedRowRender: (record: Anomaly) => (
//                 <div className="m-0">
//                   <p><strong>Patient ID:</strong> {record.patient_id}</p>
//                   <p><strong>Timestamp:</strong> {new Date(record.timestamp).toLocaleString()}</p>
//                   <p><strong>Details:</strong> {record.description}</p>
//                   {record.avg_systolic && (
//                     <p><strong>BP:</strong> {record.avg_systolic}/{record.avg_diastolic} mmHg</p>
//                   )}
//                   {record.glucose_value && (
//                     <p><strong>Glucose:</strong> {record.glucose_value} mg/dL ({record.glucose_type})</p>
//                   )}
//                   {record.bmi && (
//                     <p><strong>BMI:</strong> {record.bmi}</p>
//                   )}
//                 </div>
//               ),
//               rowExpandable: (record: Anomaly) => true,
//             }}
//           />
//         </div>
//       </TailwindCard>
//     </div>
//   );
// };

// export default AnomalyTable;