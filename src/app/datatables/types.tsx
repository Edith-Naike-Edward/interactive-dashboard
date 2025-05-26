// app/datatables/types.tsx
export type PatientData = {
  patient_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: string;
  age: number;
  date_of_birth: string;
  national_id: string;
  initial: string;
  sub_county_name: string;
  sub_county_id: number;
  county_name: string;
  county_id: number;
  level_of_education: string;
  occupation: string;
  landmark: string;
  country_id: string;
  country_name: string;
  phone_number: string;
  phone_number_category: string;
  insurance_id: string;
  insurance_type: string;
  insurance_status: string;
  site_id: number;
  site_name: string;
  program_id: string;
  program_name: string;
  is_pregnant: boolean;
  is_support_group: boolean;
  is_regular_smoker: boolean;
  created_by: string;
  updated_by: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_deleted: boolean; 
  has_hypertension?: boolean;
  has_diabetes?: boolean;
  has_mental_health_issue?: boolean;
  on_htn_meds?: boolean;
  on_diabetes_meds?: boolean;
  on_mh_treatment?: boolean;
};

export type GlucoseLogData = {
  glucose_log_id: string;
  patient_id: string;
  patient_track_id: string;
  glucose_value: number;
  glucose_type?: string;
  hba1c?: number;
  type?: string;
  is_latest?: boolean;
  is_active: boolean;
  is_deleted: boolean;
  tenant_id: string;
  glucose_date_time: string;
  last_meal_time?: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

export type PatientDiagnosisData = {
  patient_diagnosis_id: string;
  patient_track_id: string;
  diabetes_year_of_diagnosis?: number;
  htn_year_of_diagnosis?: number;
  diabetes_patient_type?: string;
  htn_patient_type?: string;
  diabetes_diagnosis?: string;
  is_diabetes_diagnosis: boolean;
  is_htn_diagnosis: boolean;
  diabetes_diag_controlled_type?: string;
  is_active: boolean;
  is_deleted: boolean;
  tenant_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

export type PatientLifestyleData = {
  patient_lifestyle_id: string;
  lifestyle_id: string;
  lifestyle_name: string;
  lifestyle_answer: string;
  patient_track_id: string;
  is_active: boolean;
  is_deleted: boolean;
  tenant_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  comments?: string;
};

export type PatientMedicalComplianceData = {
  patient_medical_compliance_id: string;
  compliance_id: string;
  name?: string;
  compliance_name: string;
  other_compliance?: string;
  bplog_id: string;
  patient_track_id: string;
  is_active: boolean;
  is_deleted: boolean;
  tenant_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

export type PatientVisit = {
  patient_visit_id: string;
  patient_id: string;
  patient_track_id: string;
  is_prescription: boolean;
  is_investigation: boolean;
  is_medical_review: boolean;
  patient_treatment_plan: string;
  is_active: boolean;
  is_deleted: boolean;
  tenant_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  visit_date: string;
};

export type PatientMedicalReview = {
  patient_medical_review_id: string;
  patient_visit_id: string;
  patient_track_id: string;
  complaint_comments: string;
  clinical_note: string;
  physical_exam_comments: string;
  is_active: boolean;
  is_deleted: boolean;
  tenant_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};


export type Screening = {
  screening_id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: string;
  date_of_birth: string;
  age: number;
  national_id: string;
  height: number;
  weight: number;
  bmi: number;
  avg_systolic: number;
  avg_diastolic: number;
  avg_pulse: number;
  glucose_value: number;
  glucose_type: string;
  glucose_date_time: string;
  last_meal_time: string;
  is_before_diabetes_diagnosis: boolean;
  is_before_htn_diagnosis: boolean;
  is_regular_smoker: boolean;
  cvd_risk_score: number;
  cvd_risk_level: string;
  phq4_score: number;
  phq4_risk_level: string;
  phq4_mental_health: string;
  refer_assessment: boolean;
  country_id: string;
  country_name: string;
  county_id: string;
  county_name: string;
  sub_county_id: string;
  sub_county_name: string;
  site_id: string;
  site_name: string;
  landmark: string;
  latitude: number;
  longitude: number;
  phone_number: string;
  phone_number_category: string;
  type: "Inpatient" | "Outpatient";
  category: "Community" | "Facility";
  device_info_id: string;
  is_latest: boolean;
  is_active: boolean;
  is_deleted: boolean;
  tenant_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};


export type BpLog = {
  bplog_id: string;
  patient_id: string;
  patient_track_id: string;
  avg_systolic: number;
  avg_diastolic: number;
  avg_pulse: number;
  height: number;
  weight: number;
  bmi: number;
  temperature: number;
  is_regular_smoker: boolean;
  cvd_risk_score: number;
  cvd_risk_level: string;
  risk_level: string;
  type: string;
  is_latest: boolean;
  is_active: boolean;
  is_deleted: boolean;
  tenant_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};


export type AnomalyType = {
  tableId: string;
  count: number;
  message: string;
};

export type ChartDataType = {
  name: string;
  count: number;
};

export type TableType = {
  id: string;
  name: string;
  data: any[];
  hasAnomalies: boolean;
};

export type PatientProgressData = {
  date: string;
  glucose?: number;
  systolic?: number;
  diastolic?: number;
};

export type AnalyticsFilters = {
  patientId?: string;
  dateRange: {
    start: string;
    end: string;
  };
  metrics: string[];
  county?: string;
  ageRange?: [number, number];
  gender?: string;
};