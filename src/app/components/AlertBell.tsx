// components/AlertBell.tsx
import { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import type { Alert } from '../types'; // Adjust import path as needed


type AlertBellProps = {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  setActiveTab: (tab: string) => void; 
};

const AlertBell = ({ alerts, onAcknowledge, setActiveTab }: AlertBellProps) => {
  const [showAlerts, setShowAlerts] = useState(false);
  const unacknowledged = alerts.filter(a => !a.acknowledged);


  return (
    <div className="relative">
      <button 
        onClick={() => setShowAlerts(!showAlerts)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        <BellIcon className="h-6 w-6" />
        {unacknowledged.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unacknowledged.length}
          </span>
        )}
      </button>

      {showAlerts && unacknowledged.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border">
          <div className="p-2 font-medium border-b">Alerts ({unacknowledged.length})</div>
          <div className="max-h-60 overflow-y-auto">
            {unacknowledged.slice(0, 5).map(alert => (
              <div 
                key={alert.id}
                onClick={() => {
                  onAcknowledge(alert.id);
                  setShowAlerts(false);
                }}
                className="p-3 border-b hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm ${
                    alert.severity === 'high' ? 'text-red-600' : 
                    alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {alert.message}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 text-center text-sm text-blue-600 border-t">
            <button
              onClick={() => {
                setShowAlerts(false);
                setActiveTab('alerts');
              }}
              className="hover:underline focus:outline-none"
            >
              View all alerts
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertBell;