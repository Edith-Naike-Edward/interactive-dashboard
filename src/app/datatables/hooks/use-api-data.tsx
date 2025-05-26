// src/app/datatables/hooks/use-api-data.ts
import { useState, useEffect } from 'react';
import {
  PatientData,
  GlucoseLogData,
  BpLog,
  PatientDiagnosisData,
  PatientLifestyleData,
  PatientMedicalComplianceData,
  PatientMedicalReview,
  PatientVisit,
  Screening
} from '../types';

type ApiData = {
  patients: PatientData[];
  glucoseLogs: GlucoseLogData[];
  bpLogs: BpLog[];
  diagnoses: PatientDiagnosisData[];
  lifestyles : PatientLifestyleData[];
  compliances: PatientMedicalComplianceData[];
  medical_reviews:  PatientMedicalReview[];
  visits: PatientVisit[];
  screenings: Screening[];
};

export const useApiData = () => {
  const [data, setData] = useState<ApiData>({
    patients: [],
    glucoseLogs: [],
    bpLogs: [],
    diagnoses: [],
    lifestyles: [],
    compliances: [],
    medical_reviews: [],
    visits: [],
    screenings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoints = [
        'patients',
        'glucose-logs',
        'bp-logs',
        'diagnoses',
        'lifestyles',
        'compliances',
        'medical_reviews',
        'visits',
        'screenings'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => 
          fetch(`http://localhost:8010/api/${endpoint}`)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
              return res.json();
            })
            .catch(err => {
              console.error(`Error fetching ${endpoint}:`, err);
              return [];
            })
        )
      );

      setData({
        patients: responses[0],
        glucoseLogs: responses[1],
        bpLogs: responses[2],
        diagnoses: responses[3],
        lifestyles: responses[4],
        compliances: responses[5],
        medical_reviews: responses[6],
        visits: responses[7],
        screenings: responses[8]
      });

    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return { data, loading, error, refresh };
};// // app/data-tables/hooks/use-api-data.ts
// import { useState, useEffect } from 'react';
// import {
//   PatientData,
//   GlucoseLogData,
//   BpLog,
//   PatientDiagnosisData
// } from '../types';

// type ApiData = {
//   patients: PatientData[];
//   glucoseLogs: GlucoseLogData[];
//   bpLogs: BpLog[];
//   diagnoses: PatientDiagnosisData[];
// };

// export const useApiData = () => {
//   const [data, setData] = useState<ApiData>({
//     patients: [],
//     glucoseLogs: [],
//     bpLogs: [],
//     diagnoses: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const endpoints = [
//         'patients',
//         'glucose-logs',
//         'bp-logs',
//         'diagnoses'
//       ];

//       const responses = await Promise.all(
//         endpoints.map(endpoint => 
//           fetch(`http://localhost:8010/${endpoint}`)
//             .then(res => {
//               if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
//               return res.json();
//             })
//             .catch(err => {
//               console.error(`Error fetching ${endpoint}:`, err);
//               return [];
//             })
//         )
//       );

//       setData({
//         patients: responses[0],
//         glucoseLogs: responses[1],
//         bpLogs: responses[2],
//         diagnoses: responses[3]
//       });

//     } catch (err) {
//       console.error("Failed to fetch data:", err);
//       setError(err instanceof Error ? err : new Error('Failed to load data'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refresh = () => {
//     fetchAllData();
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   return { data, loading, error, refresh };
// };