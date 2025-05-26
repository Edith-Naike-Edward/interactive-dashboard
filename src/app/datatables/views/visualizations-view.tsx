// src/app/datatables/views/visualizations-view.tsx
interface VisualizationsViewProps {
  activeTable: string;
  data: any[];
}

export function VisualizationsView({ activeTable, data }: VisualizationsViewProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4">Visualizations View</h2>
      <p>Visualizations for {activeTable}</p>
    </div>
  );
}