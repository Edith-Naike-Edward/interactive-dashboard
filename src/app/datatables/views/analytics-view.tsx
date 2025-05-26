// src/app/datatables/views/analytics-view.tsx
interface AnalyticsViewProps {
  activeTable: string;
  data: any[];
}

export function AnalyticsView({  activeTable, data }: AnalyticsViewProps) {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h2 className="text-lg font-medium mb-4">Data Analytics</h2>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
        <p>Analytics charts will appear here</p>
      </div>
    </div>
  );
}