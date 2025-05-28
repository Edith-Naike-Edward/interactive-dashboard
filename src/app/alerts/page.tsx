// // // pages/alerts.tsx
// 'use client';
'use client';

import { AlertsProvider } from '../contexts/AlertsContext';
import { useAlerts } from '../contexts/AlertsContext';

const AlertsPage = () => {
  const { alerts, acknowledgeAlert } = useAlerts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Alerts</h1>

      {alerts.length === 0 ? (
        <p className="text-gray-500">No alerts to display</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 border-b flex justify-between items-center ${
                alert.acknowledged ? 'bg-gray-50' :
                alert.severity === 'high' ? 'bg-red-50' :
                alert.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
              }`}
            >
              <div>
                <p className="font-medium">{alert.message}</p>
                <p className="text-sm text-gray-500">
                  {new Date(alert.timestamp).toLocaleString()}
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                  {alert.siteName && (
                    <span className="ml-2 px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                      {alert.siteName}
                    </span>
                  )}
                </p>
              </div>
              {!alert.acknowledged && (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="text-sm bg-white px-3 py-1 rounded border hover:bg-gray-50"
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AlertsPageWrapper() {
  return (
    <AlertsProvider>
      <AlertsPage />
    </AlertsProvider>
  );
}

// import { useAlerts } from '../contexts/AlertsContext';

// const AlertsPage = () => {
//   const { alerts, acknowledgeAlert } = useAlerts();

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Alerts</h1>

//       {alerts.length === 0 ? (
//         <p className="text-gray-500">No alerts to display</p>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {alerts.map(alert => (
//             <div
//               key={alert.id}
//               className={`p-4 border-b flex justify-between items-center ${
//                 alert.acknowledged ? 'bg-gray-50' :
//                 alert.severity === 'high' ? 'bg-red-50' :
//                 alert.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
//               }`}
//             >
//               <div>
//                 <p className="font-medium">{alert.message}</p>
//                 <p className="text-sm text-gray-500">
//                   {new Date(alert.timestamp).toLocaleString()}
//                   <span className={`ml-2 px-2 py-1 rounded text-xs ${
//                     alert.severity === 'high' ? 'bg-red-100 text-red-800' :
//                     alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-blue-100 text-blue-800'
//                   }`}>
//                     {alert.severity}
//                   </span>
//                   {alert.siteName && (
//                     <span className="ml-2 px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
//                       {alert.siteName}
//                     </span>
//                   )}
//                 </p>
//               </div>
//               {!alert.acknowledged && (
//                 <button
//                   onClick={() => acknowledgeAlert(alert.id)}
//                   className="text-sm bg-white px-3 py-1 rounded border hover:bg-gray-50"
//                 >
//                   Acknowledge
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AlertsPage;

// import { useState } from 'react';
// import type { Alert } from '../types'; // Adjust import path as needed

// type AlertsPageProps = {
//   alerts: Alert[];
//   onAcknowledge: (id: string) => void;
// };

// const AlertsPage = ({ alerts = [], onAcknowledge }: AlertsPageProps) => {
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Alerts</h1>
      
//       {alerts.length === 0 ? (
//         <p className="text-gray-500">No alerts to display</p>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {alerts.map(alert => (
//             <div 
//               key={alert.id}
//               className={`p-4 border-b flex justify-between items-center ${
//                 alert.acknowledged ? 'bg-gray-50' : 
//                 alert.severity === 'high' ? 'bg-red-50' :
//                 alert.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
//               }`}
//             >
//               <div>
//                 <p className="font-medium">{alert.message}</p>
//                 <p className="text-sm text-gray-500">
//                   {new Date(alert.timestamp).toLocaleString()}
//                   <span className={`ml-2 px-2 py-1 rounded text-xs ${
//                     alert.severity === 'high' ? 'bg-red-100 text-red-800' :
//                     alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-blue-100 text-blue-800'
//                   }`}>
//                     {alert.severity}
//                   </span>
//                   {alert.siteName && (
//                     <span className="ml-2 px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
//                       {alert.siteName}
//                     </span>
//                   )}
//                 </p>
//               </div>
//               {!alert.acknowledged && (
//                 <button 
//                   onClick={() => onAcknowledge(alert.id)}
//                   className="text-sm bg-white px-3 py-1 rounded border hover:bg-gray-50"
//                 >
//                   Acknowledge
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AlertsPage;