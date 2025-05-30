// src/app/datatables/views/visualizations-view.tsx
"use client";
import { useEffect, useRef } from 'react';
// Register Chart.js components
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  TimeScale,            // <-- import this
  Tooltip,
  Legend,
  Title,
  PieController,
  BarController,
  LineController,
} from 'chart.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';


// Register components including TimeScale
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  TimeScale,            // <-- register this
  Tooltip,
  Legend,
  Title,
  PieController,
  BarController,
  LineController,
);


interface VisualizationsViewProps {
  activeTable: string;
  data: any[];
}

const COLORS = [
  'rgba(0, 136, 254, 0.8)',
  'rgba(0, 196, 159, 0.8)',
  'rgba(255, 187, 40, 0.8)',
  'rgba(255, 128, 66, 0.8)',
  'rgba(136, 132, 216, 0.8)',
  'rgba(130, 202, 157, 0.8)',
  'rgba(255, 107, 107, 0.8)',
  'rgba(78, 205, 196, 0.8)',
  'rgba(69, 183, 209, 0.8)',
  'rgba(160, 81, 149, 0.8)'
];

export function VisualizationsView({ activeTable, data }: VisualizationsViewProps) {
  // Refs for chart instances
  const chartRefs = useRef<{[key: string]: ChartJS | null}>({});

  // Cleanup charts on unmount or data change
  useEffect(() => {
    return () => {
      Object.values(chartRefs.current).forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, [data]);

  // Common data processing functions
  const processCountData = (key: string) => {
    const counts: Record<string, number> = {};
    
    data.forEach(item => {
      const value = item[key];
      if (value !== undefined && value !== null) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: COLORS.slice(0, Object.keys(counts).length)
      }]
    };
  };

  const processNumericData = (key: string) => {
    const numericData = data
      .filter(item => !isNaN(parseFloat(item[key])))
      .map(item => parseFloat(item[key]));

    return {
      labels: numericData.map((_, i) => `Item ${i + 1}`),
      datasets: [{
        label: key,
        data: numericData,
        backgroundColor: COLORS[0]
      }]
    };
  };

  const processTimeSeriesData = (dateKey: string, valueKey: string) => {
    const filteredData = data
      .filter(item => item[dateKey] && !isNaN(parseFloat(item[valueKey])))
      .map(item => ({
        x: new Date(item[dateKey]),
        y: parseFloat(item[valueKey])
      }))
      .sort((a, b) => a.x.getTime() - b.x.getTime());

    return {
      datasets: [{
        label: valueKey,
        data: filteredData,
        borderColor: COLORS[0],
        backgroundColor: COLORS[0],
        tension: 0.1
      }]
    };
  };

  // Chart rendering helper
  const renderChart = (type: 'bar' | 'pie' | 'line', canvasId: string, data: any, options?: any) => {
    useEffect(() => {
      const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!ctx) return;

      // Destroy previous chart if it exists
      if (chartRefs.current[canvasId]) {
        chartRefs.current[canvasId]?.destroy();
      }

      // Create new chart
      chartRefs.current[canvasId] = new ChartJS(ctx, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            ...options?.plugins
          },
          scales: type === 'bar' || type === 'line' ? {
            x: {
              type: 'category',
              ...options?.scales?.x
            },
            y: {
              beginAtZero: true,
              ...options?.scales?.y
            }
          } : undefined,
          ...options
        }
      });

      return () => {
        if (chartRefs.current[canvasId]) {
          chartRefs.current[canvasId]?.destroy();
          chartRefs.current[canvasId] = null;
        }
      };
    }, [data]);

    return <canvas id={canvasId} />;
  };

  // Table-specific visualizations
  const renderPatientTableVisualizations = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Patients by Gender</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('pie', 'genderChart', processCountData('gender'))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patients by Age Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('bar', 'ageChart', {
            labels: data.map(p => p.id),
            datasets: [{
              label: 'Age',
              data: data.map(p => parseInt(p.age)).filter(age => !isNaN(age)),
              backgroundColor: COLORS[0]
            }]
          })}
        </CardContent>
      </Card>
    </div>
  );

  const renderScreeningVisualizations = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>PHQ-4 Risk Levels</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('bar', 'phq4Chart', processCountData('phq4_risk_level'))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CVD Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('pie', 'cvdChart', processCountData('cvd_risk_level'))}
        </CardContent>
      </Card>
    </div>
  );

  const renderGlucoseLogVisualizations = () => (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Glucose Readings Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('line', 'glucoseChart', processTimeSeriesData('dateTime', 'glucoseValue'), {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day'
                }
              }
            }
          })}
        </CardContent>
      </Card>
    </div>
  );

  const renderBpLogVisualizations = () => (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure Readings Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('line', 'bpChart', {
            datasets: [
              {
                label: 'Systolic',
                data: data.map(item => ({
                  x: new Date(item.date),
                  y: item.systolic
                })),
                borderColor: COLORS[0],
                backgroundColor: COLORS[0]
              },
              {
                label: 'Diastolic',
                data: data.map(item => ({
                  x: new Date(item.date),
                  y: item.diastolic
                })),
                borderColor: COLORS[1],
                backgroundColor: COLORS[1]
              }
            ]
          }, {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day'
                }
              }
            }
          })}
        </CardContent>
      </Card>
    </div>
  );

  const renderDiagnosisVisualizations = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Diagnosis Conditions Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('bar', 'diagnosisConditionsChart', {
            labels: ['Diabetes', 'Hypertension', 'Both', 'Neither'],
            datasets: [{
              label: 'Patients',
              data: [
                data.filter(d => d.diabetes).length,
                data.filter(d => d.htn).length,
                data.filter(d => d.diabetes && d.htn).length,
                data.filter(d => !d.diabetes && !d.htn).length
              ],
              backgroundColor: COLORS.slice(0, 4)
            }]
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diagnosis Year Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('bar', 'diagnosisYearChart', {
            labels: [...new Set([...data.map(d => d.diabetesYear), ...data.map(d => d.htnYear)])].filter(Boolean),
            datasets: [
              {
                label: 'Diabetes Year',
                data: data.map(d => d.diabetesYear),
                backgroundColor: COLORS[0]
              },
              {
                label: 'HTN Year',
                data: data.map(d => d.htnYear),
                backgroundColor: COLORS[1]
              }
            ]
          })}
        </CardContent>
      </Card>
    </div>
  );

  const renderLifestyleVisualizations = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle Factors Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('pie', 'lifestyleFactorsChart', processCountData('lifestyleName'))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lifestyle Answers</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('bar', 'lifestyleAnswersChart', {
            ...processCountData('lifestyleAnswer'),
            datasets: [{
              ...processCountData('lifestyleAnswer').datasets[0],
              backgroundColor: COLORS[0]
            }]
          }, {
            indexAxis: 'y'
          })}
        </CardContent>
      </Card>
    </div>
  );

  const renderComplianceVisualizations = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Medication Compliance Types</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('bar', 'complianceTypesChart', processCountData('complianceName'))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medication Types</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('pie', 'medicationTypesChart', processCountData('name'))}
        </CardContent>
      </Card>
    </div>
  );

  const renderVisitVisualizations = () => (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Visits Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('line', 'visitsChart', processTimeSeriesData('visitDate', 'id'), {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day'
                }
              }
            }
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(v => v.isPrescription).length}
            </div>
            <p className="text-sm text-muted-foreground">
              {((data.filter(v => v.isPrescription).length / data.length) * 100).toFixed(1)}% of visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investigations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(v => v.isInvestigation).length}
            </div>
            <p className="text-sm text-muted-foreground">
              {((data.filter(v => v.isInvestigation).length / data.length) * 100).toFixed(1)}% of visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(v => v.isMedicalReview).length}
            </div>
            <p className="text-sm text-muted-foreground">
              {((data.filter(v => v.isMedicalReview).length / data.length) * 100).toFixed(1)}% of visits
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMedicalReviewVisualizations = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Complaints Word Cloud</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex flex-wrap gap-2">
            {data.slice(0, 50).map((review, index) => {
              const fontSizeClass = `complaint-font-size-${Math.round(Math.min(16 + (review.complaints?.length || 0) / 5, 24))}`;
              const colorClass = `complaint-bg-${index % COLORS.length}`;

              return (
                <span
                  key={index}
                  className={`complaint-badge inline-block px-3 py-1 rounded-full text-sm text-white ${fontSizeClass} ${colorClass}`}
                >
                  {review.complaints?.split(' ')[0] || 'Complaint'}
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes Length Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {renderChart('bar', 'notesChart', {
            labels: data
              .map(r => r.id)
              .sort((a, b) => b.length - a.length)
              .slice(0, 20),
            datasets: [{
              label: 'Note Length',
              data: data
                .map(r => r.clinicalNotes?.length || 0)
                .sort((a, b) => b - a)
                .slice(0, 20),
              backgroundColor: COLORS[0]
            }]
          })}
        </CardContent>
      </Card>
    </div>
  );


  const renderDefaultVisualizations = () => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4">Data Overview</h2>
      <p>Total records: {data.length}</p>
      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(data[0]).slice(0, 4).map(key => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{key}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {typeof data[0][key] === 'number' 
                    ? data.reduce((sum, item) => sum + (item[key] || 0), 0)
                    : processCountData(key).labels.length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const getVisualizations = () => {
    switch (activeTable) {
      case 'patient-table':
        return renderPatientTableVisualizations();
      case 'screening':
        return renderScreeningVisualizations();
      case 'glucose-log':
        return renderGlucoseLogVisualizations();
      case 'bp-log':
        return renderBpLogVisualizations();
      case 'diagnosis':
        return renderDiagnosisVisualizations();
      case 'lifestyle':
        return renderLifestyleVisualizations();
      case 'compliance':
        return renderComplianceVisualizations();
      case 'visit':
        return renderVisitVisualizations();
      case 'review':
        return renderMedicalReviewVisualizations();
      default:
        return renderDefaultVisualizations();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {activeTable.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Visualizations
      </h2>
      {data.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
          <p>No data available for visualization</p>
        </div>
      ) : (
        getVisualizations()
      )}
    </div>
  );
}