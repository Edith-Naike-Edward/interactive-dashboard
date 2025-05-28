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