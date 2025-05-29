
import { BellIcon } from '@heroicons/react/24/outline';
import type { AlertFollowup } from '../types';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

type AlertBellProps = {
  alerts: AlertFollowup[];
  onAcknowledge: (id: string) => void;
  setActiveTab: (tab: string) => void;
};

const AlertBell = ({ alerts, onAcknowledge, setActiveTab }: AlertBellProps) => {
  const [showAlerts, setShowAlerts] = useState(false);
  const unacknowledged = alerts.filter(a => !a.acknowledged);

  const getSeverityColor = (severity: AlertFollowup['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowAlerts(!showAlerts)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
        aria-label={`Show alerts (${unacknowledged.length} unread)`}
      >
        <BellIcon className="h-6 w-6 text-gray-600" />
        {unacknowledged.length > 0 && (
          <span className={`absolute top-0 right-0 ${getSeverityColor(unacknowledged[0].severity)} text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`}>
            {unacknowledged.length}
          </span>
        )}
      </button>

      {showAlerts && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Alerts ({unacknowledged.length})</h3>
            <button 
              onClick={() => setShowAlerts(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close alerts"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {unacknowledged.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No new alerts
              </div>
            ) : (
              unacknowledged.slice(0, 5).map(alert => (
                <div 
                  key={alert.id}
                  className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    onAcknowledge(alert.id);
                    setShowAlerts(false);
                    setActiveTab('alerts');
                  }}
                >
                  <div className="flex items-start">
                    <div className={`h-2 w-2 mt-1 rounded-full mr-2 ${getSeverityColor(alert.severity)}`}></div>
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {unacknowledged.length > 0 && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default AlertBell;
