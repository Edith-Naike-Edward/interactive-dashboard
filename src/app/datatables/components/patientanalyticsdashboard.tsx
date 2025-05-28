// components/PatientAnalyticsDashboard.tsx
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface PatientData {
  age: number;
  gender: string;
  county_name: string;
  level_of_education: string;
  insurance_type: string;
  has_hypertension: boolean;
  has_diabetes: boolean;
  has_mental_health_issue: boolean;
  on_htn_meds: boolean;
  on_diabetes_meds: boolean;
  on_mh_treatment: boolean;
}

interface AnalyticsDashboardProps {
  patients: PatientData[];
}

const PatientAnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ patients }) => {
  // 1. Disease Prevalence Analysis
  const analyzeDiseasePrevalence = () => {
    const ageGroups = [
      { label: '0-18', min: 0, max: 18 },
      { label: '19-30', min: 19, max: 30 },
      { label: '31-40', min: 31, max: 40 },
      { label: '41-50', min: 41, max: 50 },
      { label: '51-60', min: 51, max: 60 },
      { label: '61-70', min: 61, max: 70 },
      { label: '71-80', min: 71, max: 80 },
      { label: '81+', min: 81, max: 120 },
    ];

    const results = ageGroups.map(group => {
      const groupPatients = patients.filter(p => p.age >= group.min && p.age <= group.max);
      const malePatients = groupPatients.filter(p => p.gender === 'M');
      const femalePatients = groupPatients.filter(p => p.gender === 'F');

      return {
        ageGroup: group.label,
        male: {
          hypertension: malePatients.filter(p => p.has_hypertension).length / (malePatients.length || 1),
          diabetes: malePatients.filter(p => p.has_diabetes).length / (malePatients.length || 1),
          mentalHealth: malePatients.filter(p => p.has_mental_health_issue).length / (malePatients.length || 1),
        },
        female: {
          hypertension: femalePatients.filter(p => p.has_hypertension).length / (femalePatients.length || 1),
          diabetes: femalePatients.filter(p => p.has_diabetes).length / (femalePatients.length || 1),
          mentalHealth: femalePatients.filter(p => p.has_mental_health_issue).length / (femalePatients.length || 1),
        },
      };
    });

    return results;
  };

  // 2. Insurance Coverage Analysis
  const analyzeInsuranceCoverage = () => {
    const counties = [...new Set(patients.map(p => p.county_name))];
    const educationLevels = [...new Set(patients.map(p => p.level_of_education))];

    const results = counties.map(county => {
      const countyPatients = patients.filter(p => p.county_name === county);
      const coverageByEducation = educationLevels.map(level => {
        const educationPatients = countyPatients.filter(p => p.level_of_education === level);
        const covered = educationPatients.filter(p => p.insurance_type !== 'None').length;
        return {
          educationLevel: level,
          coverageRate: covered / (educationPatients.length || 1),
          count: educationPatients.length,
        };
      });

      return {
        county,
        coverageByEducation,
        totalCoverage: countyPatients.filter(p => p.insurance_type !== 'None').length / countyPatients.length,
      };
    });

    // Sort by coverage rate and take top 5
    return results.sort((a, b) => b.totalCoverage - a.totalCoverage).slice(0, 5);
  };

  // 3. Treatment Rates Analysis
  const analyzeTreatmentRates = () => {
    const genders = [...new Set(patients.map(p => p.gender))];
    
    return genders.map(gender => {
      const genderPatients = patients.filter(p => p.gender === gender);
      const withHypertension = genderPatients.filter(p => p.has_hypertension);
      const withDiabetes = genderPatients.filter(p => p.has_diabetes);
      const withMentalHealth = genderPatients.filter(p => p.has_mental_health_issue);

      return {
        gender,
        htnTreatmentRate: withHypertension.filter(p => p.on_htn_meds).length / (withHypertension.length || 1),
        diabetesTreatmentRate: withDiabetes.filter(p => p.on_diabetes_meds).length / (withDiabetes.length || 1),
        mhTreatmentRate: withMentalHealth.filter(p => p.on_mh_treatment).length / (withMentalHealth.length || 1),
      };
    });
  };

  // Generate chart data
  const diseasePrevalenceData = analyzeDiseasePrevalence();
  const insuranceCoverageData = analyzeInsuranceCoverage();
  const treatmentRatesData = analyzeTreatmentRates();

  // Chart 1: Disease Prevalence by Age and Gender
  const prevalenceChartData = {
    labels: diseasePrevalenceData.map(d => d.ageGroup),
    datasets: [
      {
        label: 'Hypertension (Male)',
        data: diseasePrevalenceData.map(d => d.male.hypertension),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Diabetes (Male)',
        data: diseasePrevalenceData.map(d => d.male.diabetes),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
      {
        label: 'Mental Health (Male)',
        data: diseasePrevalenceData.map(d => d.male.mentalHealth),
        backgroundColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Hypertension (Female)',
        data: diseasePrevalenceData.map(d => d.female.hypertension),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Diabetes (Female)',
        data: diseasePrevalenceData.map(d => d.female.diabetes),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
      {
        label: 'Mental Health (Female)',
        data: diseasePrevalenceData.map(d => d.female.mentalHealth),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  // Chart 2: Insurance Coverage by County and Education
  const insuranceChartData = {
    labels: insuranceCoverageData.map(d => d.county),
    datasets: insuranceCoverageData[0]?.coverageByEducation.map((edu, i) => ({
      label: edu.educationLevel,
      data: insuranceCoverageData.map(county => 
        county.coverageByEducation[i]?.coverageRate || 0
      ),
      backgroundColor: [
        'rgba(255, 159, 64, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(201, 203, 207, 0.7)',
      ][i % 5],
    })) || [],
  };

  // Chart 3: Treatment Rates by Gender
  const treatmentChartData = {
    labels: treatmentRatesData.map(d => d.gender),
    datasets: [
      {
        label: 'Hypertension Treatment',
        data: treatmentRatesData.map(d => d.htnTreatmentRate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Diabetes Treatment',
        data: treatmentRatesData.map(d => d.diabetesTreatmentRate),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Mental Health Treatment',
        data: treatmentRatesData.map(d => d.mhTreatmentRate),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Patient Analytics Dashboard</h1>
      
      {/* Disease Prevalence Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Disease Prevalence by Age and Gender</h2>
        <div className="h-96">
          <Bar
            data={prevalenceChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Disease Prevalence Rates',
                },
              },
              scales: {
                x: {
                  stacked: false,
                },
                y: {
                  stacked: false,
                  title: {
                    display: true,
                    text: 'Prevalence Rate',
                  },
                },
              },
            }}
          />
        </div>
        <p className="text-gray-600 mt-4">
          This chart shows the prevalence of hypertension, diabetes, and mental health issues across different age groups and genders.
        </p>
      </div>

      {/* Insurance Coverage Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Insurance Coverage by County and Education Level</h2>
        <div className="h-96">
          <Bar
            data={insuranceChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Insurance Coverage Rates',
                },
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  title: {
                    display: true,
                    text: 'Coverage Rate',
                  },
                },
              },
            }}
          />
        </div>
        <p className="text-gray-600 mt-4">
          Insurance coverage rates vary significantly by county and education level, with more educated populations generally having better coverage.
        </p>
      </div>

      {/* Treatment Rates Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Treatment Rates for Chronic Conditions by Gender</h2>
        <div className="h-96">
          <Bar
            data={treatmentChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Treatment Rates',
                },
              },
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Treatment Rate',
                  },
                },
              },
            }}
          />
        </div>
        <p className="text-gray-600 mt-4">
          While disease prevalence may vary by gender, treatment rates show different patterns with some conditions being better managed in one gender than another.
        </p>
      </div>
    </div>
  );
};

export default PatientAnalyticsDashboard;