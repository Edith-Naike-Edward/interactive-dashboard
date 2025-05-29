export type Alert = {
  id: string;
  siteId: number;
  siteName: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  acknowledged: boolean;
};

export type AlertType = 'threshold' | 'performance' | 'inactive' | 'activity';
export type AlertSeverity = 'low' | 'medium' | 'high';

export type AlertFollowup = {
  id: string;
  // alertId: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
};