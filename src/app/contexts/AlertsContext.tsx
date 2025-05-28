"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from '../types';

type AlertsContextType = {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  acknowledgeAlert: (id: string) => void;
};

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlertsState] = useState<Alert[]>([]);

  const setAlerts = (newAlerts: Alert[]) => setAlertsState(newAlerts);

  const acknowledgeAlert = (id: string) => {
    setAlertsState(prev => prev.map(a =>
      a.id === id ? { ...a, acknowledged: true } : a
    ));
  };

  return (
    <AlertsContext.Provider value={{ alerts, setAlerts, acknowledgeAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) throw new Error('useAlerts must be used within an AlertsProvider');
  return context;
};
