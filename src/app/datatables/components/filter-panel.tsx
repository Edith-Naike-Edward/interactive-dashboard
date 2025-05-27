// src/app/datatables/components/filter-panel.tsx
import { useState } from 'react';
interface FilterState {
  ageGroup?: string;
  condition?: string;
  county?: string;
  gender?: string;
  riskLevel?: string;
  startDate?: string;
  endDate?: string;
  phq4_risk_level?: string;
  phq4_score?: string;
  cvd_risk_score?: string;
  cvd_risk_level?: string;
  // New filter fields
  diagnosisType?: string;
  lifestyleType?: string;
  complianceType?: string;
  visitType?: string;
  is_regular_smoker?: string;
  hasPrescription?: string;
  category?: string;
  hasInvestigation?: string;
  hasMedicalReview?: string;
  complaintSearch?: string;
  clinicalNoteSearch?: string;
  site_name?: string;
}

interface FilterPanelProps {
  activeTable: string;
  onApply: (filters: FilterState) => void;
}

const ageGroups = [
  { label: 'All Ages', value: '' },
  { label: 'Children (0-12)', value: '0-12' },
  { label: 'Teens (13-19)', value: '13-19' },
  { label: 'Adults (20-64)', value: '20-64' },
  { label: 'Seniors (65+)', value: '65-120' }
];

const conditionOptions = [
  { label: 'All', value: '' },
  { label: 'Hypertension', value: 'hypertension' },
  { label: 'Diabetes', value: 'diabetes' },
  { label: 'Mental Health', value: 'mental_health' }
];

const countyOptions = [
  { label: 'All Counties', value: '' },
  { label: 'Makueni', value: 'Makueni' },
  { label: 'Nyeri', value: 'Nyeri' },
  { label: 'Kakamega', value: 'Kakamega' },
  { label: 'Nakuru', value: 'Nakuru' },
  { label: 'Nyandarua', value: 'Nyandarua' },
  { label: 'Meru', value: 'Meru' },
  { label: 'Nairobi', value: 'Nairobi' },
  { label: 'Mombasa', value: 'Mombasa' },
  { label: 'Kilifi', value: 'Kilifi' }
];

const riskLevels = [
  { label: 'All', value: '' },
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' }
];

const diagnosisTypes = [
  { label: 'All Types', value: '' },
  { label: 'Diabetes', value: 'diabetes' },
  { label: 'Hypertension', value: 'hypertension' },
  { label: 'Both', value: 'both' }
];

const lifestyleTypes = [
  { label: 'All Types', value: '' },
  { label: 'Smoking', value: 'smoking' },
  { label: 'Alcohol', value: 'alcohol' },
  { label: 'Exercise', value: 'exercise' },
  { label: 'Diet', value: 'diet' }
];

const complianceTypes = [
  { label: 'All Types', value: '' },
  { label: 'Medication', value: 'medication' },
  { label: 'Therapy', value: 'therapy' },
  { label: 'Follow-up', value: 'followup' }
];

const visitTypes = [
  { label: 'All Types', value: '' },
  { label: 'Prescription', value: 'prescription' },
  { label: 'Investigation', value: 'investigation' },
  { label: 'Medical Review', value: 'medical_review' }
];

const yesNoOptions = [
  { label: 'All', value: '' },
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
];

export function FilterPanel({ activeTable, onApply }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({});

  const handleChange = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleApply = () => onApply(filters);
  const handleReset = () => {
    setFilters({});
    onApply({});
  };

  const renderSelect = (
    id: string,
    label: string,
    value: string | undefined,
    options: { label: string; value: string }[],
    stateKey: keyof FilterState
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={id}
        className="w-full p-2 border border-gray-300 rounded-md"
        value={value || ''}
        onChange={handleChange(stateKey)}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  const renderInput = (
    id: string,
    label: string,
    value: string | undefined,
    placeholder: string,
    stateKey: keyof FilterState,
    type = 'text'
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        type={type}
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder={placeholder}
        value={value || ''}
        onChange={handleChange(stateKey)}
      />
    </div>
  );

  const renderDateRange = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
      <div className="flex gap-2">
        {renderInput('start-date', '', filters.startDate, 'Start Date', 'startDate', 'date')}
        {renderInput('end-date', '', filters.endDate, 'End Date', 'endDate', 'date')}
      </div>
    </div>
  );

  const renderPatientFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {renderSelect('age-group', 'Age Group', filters.ageGroup, ageGroups, 'ageGroup')}
      {renderSelect('condition', 'Condition', filters.condition, [
        { label: 'All Conditions', value: '' },
        { label: 'Hypertension', value: 'hypertension' },
        { label: 'Diabetes', value: 'diabetes' },
        { label: 'Mental Health', value: 'mental_health' }
      ],'condition')}
      {renderSelect('county', 'County', filters.county, [
        { label: 'All Counties', value: '' }, 
        { label: 'Makueni', value: 'Makueni' },
        { label: 'Nyeri', value: 'Nyeri' },
        { label: 'Kakamega', value: 'Kakamega' },
        { label: 'Nakuru', value: 'Nakuru' },
        { label: 'Nyandarua', value: 'Nyandarua' },
        { label: 'Meru', value: 'Meru' },
        { label: 'Nairobi', value: 'Nairobi' },
        { label: 'Mombasa', value: 'Mombasa' },
        { label: 'Kilifi', value: 'Kilifi' }
      ], 'county')}
      {/* {renderInput('county', 'County', filters.county, 'Enter county', 'county')} */}
      {renderSelect('gender', 'Gender', filters.gender, [
        { label: 'All Genders', value: '' },
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' }
      ], 'gender')}
    </div>
  );

  const renderBpLogFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderSelect('risk-level', 'Risk Level', filters.riskLevel, riskLevels, 'riskLevel')}
      {renderDateRange()}
    </div>
  );

  const renderGlucoseLogFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderSelect('glucose-type', 'Glucose Type', filters.condition, [
        { label: 'All Types', value: '' },
        { label: 'Fasting Blood Sugar', value: 'FBS' },
        { label: 'Random Blood Sugar', value: 'RBS' }
      ], 'condition')}
      {renderDateRange()}
    </div>
  );

  const renderDiagnosisFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {renderSelect('diagnosis-type', 'Diagnosis Type', filters.diagnosisType, diagnosisTypes, 'diagnosisType')}
      {renderDateRange()}
      {renderInput('diagnosis-year', 'Year of Diagnosis', filters.startDate, 'Enter year', 'startDate', 'number')}
    </div>
  );

  const renderLifestyleFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {renderSelect('lifestyle-type', 'Lifestyle Type', filters.lifestyleType, lifestyleTypes, 'lifestyleType')}
      {renderInput('lifestyle-answer', 'Answer Contains', filters.complaintSearch, 'Search answers', 'complaintSearch')}
      {renderInput('lifestyle-comments', 'Comments Contains', filters.clinicalNoteSearch, 'Search comments', 'clinicalNoteSearch')}
    </div>
  );

  const renderComplianceFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {renderSelect('compliance-type', 'Compliance Type', filters.complianceType, complianceTypes, 'complianceType')}
      {renderInput('medication-name', 'Medication Name', filters.county, 'Search medication', 'county')}
      {renderDateRange()}
    </div>
  );

  const renderVisitFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {renderSelect('visit-type', 'Visit Type', filters.visitType, visitTypes, 'visitType')}
      {renderSelect('has-prescription', 'Has Prescription', filters.hasPrescription, yesNoOptions, 'hasPrescription')}
      {renderSelect('has-investigation', 'Has Investigation', filters.hasInvestigation, yesNoOptions, 'hasInvestigation')}
      {renderSelect('has-medical-review', 'Has Medical Review', filters.hasMedicalReview, yesNoOptions, 'hasMedicalReview')}
      {renderDateRange()}
    </div>
  );

  const renderMedicalReviewFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderInput('complaint-search', 'Complaints Contains', filters.complaintSearch, 'Search complaints', 'complaintSearch')}
      {renderInput('clinical-note-search', 'Clinical Notes Contains', filters.clinicalNoteSearch, 'Search notes', 'clinicalNoteSearch')}
      {renderDateRange()}
    </div>
  );

  const renderScreeningFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {renderSelect('screening-condition', 'Category', filters.category, [
        {label : 'All Categories', value: ''},
        { label: 'Facility', value: 'Facility' },
        { label: 'Community', value: 'Community' }
      ], 'category')}
      {renderSelect('screening-county', 'County', filters.county,[
          { label: 'All Counties', value: '' },
          { label: 'Makueni', value: 'Makueni' },
          { label: 'Nyeri', value: 'Nyeri' },
          { label: 'Kakamega', value: 'Kakamega' },
          { label: 'Nakuru', value: 'Nakuru' },
          { label: 'Nyandarua', value: 'Nyandarua' },
          { label: 'Meru', value: 'Meru' },
          { label: 'Nairobi', value: 'Nairobi' },
          { label: 'Mombasa', value: 'Mombasa' },
          { label: 'Kilifi', value: 'Kilifi' }
      ], 'county')}
      {renderSelect('screening-glucose-type', 'Glucose Type', filters.condition, [
        { label: 'All Types', value: '' },
        { label: 'Fasting Blood Sugar', value: 'FBS' },
        { label: 'Random Blood Sugar', value: 'RBS' }
      ], 'condition')}
      {renderDateRange()}
      {renderSelect('screening-phq4-risk-level', 'PHQ-4 Risk Level', filters.phq4_risk_level, [
        { label: 'All Levels', value: '' },
        { label: 'None', value: 'None' },
        { label: 'Mild', value: 'Mild' },
        { label: 'Moderate', value: 'Moderate' },
        { label: 'Severe', value: 'Severe' }
      ], 'phq4_risk_level')}
      {renderSelect('screening-phq4-score', 'PHQ-4 Score', filters.phq4_score,[
        { label: 'All Scores', value: '' },
        { label: '0', value: '0' },
        { label: '1-3', value: '1-3' },
        { label: '4-6', value: '4-6' },
        { label: '7-9', value: '7-9' },
        { label: '10+', value: '10+' }
      ], 'phq4_score')}
      {renderSelect('screening-is-regular-smoker', 'Is Regular Smoker', filters.is_regular_smoker, [
          { label: 'All', value: '' },
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' }
        ], 'is_regular_smoker')}
      {renderSelect('screening-cvd-risk-level', 'CVD Risk Level', filters.cvd_risk_level,[
        { label: 'All Levels', value: '' },
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' }
      ], 'cvd_risk_level')}
      {renderSelect('screening-cvd-risk-score', 'CVD Risk Score', filters.cvd_risk_score, [
        { label: 'All Scores', value: '' },
        { label: '0', value: '0' },
        { label: '1-3', value: '1-3' },
        { label: '4-5', value: '4-5' },
        { label: '6-10', value: '6-10' },
        { label: '11-15', value: '11-15' },
        { label: '16-20', value: '16-20' },
        { label: '21+', value: '21+' }
        ] , 'cvd_risk_score')}
      {renderSelect(
        'screening-site',
        'Screening Site (Full List)',
        filters.site_name,
        [
          { label: 'All Sites', value: '' },
          { label: 'Makueni County Referral Hospital', value: 'Makueni County Referral Hospital' },
          { label: 'Kibwezi Sub-County Hospital', value: 'Kibwezi Sub-County Hospital' },
          { label: 'Kilungu Sub-County Hospital', value: 'Kilungu Sub-County Hospital' },
          { label: 'Makindu Sub-County Hospital', value: 'Makindu Sub-County Hospital' },
          { label: 'Sultan Hamud Health Centre', value: 'Sultan Hamud Health Centre' },
          { label: 'Wote Health Centre', value: 'Wote Health Centre' },
          { label: 'Matiliku Health Centre', value: 'Matiliku Health Centre' },
          { label: 'Kambu Health Centre', value: 'Kambu Health Centre' },
          { label: 'Kathonzweni Health Centre', value: 'Kathonzweni Health Centre' },
          { label: 'Emali Model Health Centre', value: 'Emali Model Health Centre' },
          { label: 'Nyeri County Referral Hospital', value: 'Nyeri County Referral Hospital' },
          { label: 'Karatina Sub-County Hospital', value: 'Karatina Sub-County Hospital' },
          { label: 'Othaya Sub-County Hospital', value: 'Othaya Sub-County Hospital' },
          { label: 'Mukurweini Sub-County Hospital', value: 'Mukurweini Sub-County Hospital' },
          { label: 'Naromoru Health Centre', value: 'Naromoru Health Centre' },
          { label: 'Tumutumu PCEA Hospital', value: 'Tumutumu PCEA Hospital' },
          { label: 'Wamagana Health Centre', value: 'Wamagana Health Centre' },
          { label: 'Gichiche Health Centre', value: 'Gichiche Health Centre' },
          { label: 'Chaka Health Centre', value: 'Chaka Health Centre' },
          { label: 'Mweiga Health Centre', value: 'Mweiga Health Centre' },
          { label: 'Kakamega County Referral Hospital', value: 'Kakamega County Referral Hospital' },
          { label: 'Butere Sub-County Hospital', value: 'Butere Sub-County Hospital' },
          { label: 'Mumias County Hospital', value: 'Mumias County Hospital' },
          { label: 'Malava Sub-County Hospital', value: 'Malava Sub-County Hospital' },
          { label: 'Mautuma County Hospital', value: 'Mautuma County Hospital' },
          { label: 'Khwisero Sub-County Hospital', value: 'Khwisero Sub-County Hospital' },
          { label: 'Matungu Sub-County Hospital', value: 'Matungu Sub-County Hospital' },
          { label: 'Navakholo Sub-County Hospital', value: 'Navakholo Sub-County Hospital' },
          { label: 'Likuyani Sub-County Hospital', value: 'Likuyani Sub-County Hospital' },
          { label: 'Sheywe Community Hospital Limited', value: 'Sheywe Community Hospital Limited' },
          { label: 'Nakuru Level 5 Hospital', value: 'Nakuru Level 5 Hospital' },
          { label: 'Naivasha Sub-County Hospital', value: 'Naivasha Sub-County Hospital' },
          { label: 'Molo Sub-County Hospital', value: 'Molo Sub-County Hospital' },
          { label: 'Gilgil Sub-County Hospital', value: 'Gilgil Sub-County Hospital' },
          { label: 'Bahati Sub-County Hospital', value: 'Bahati Sub-County Hospital' },
          { label: 'Subukia Sub-County Hospital', value: 'Subukia Sub-County Hospital' },
          { label: 'Keringet Sub County Hospital', value: 'Keringet Sub County Hospital' },
          { label: 'Elburgon Sub-County Hospital', value: 'Elburgon Sub-County Hospital' },
          { label: 'Njoro Sub-County Hospital', value: 'Njoro Sub-County Hospital' },
          { label: 'Rongai Health Centre', value: 'Rongai Health Centre' },
          { label: 'JM Kariuki Memorial Hospital', value: 'JM Kariuki Memorial Hospital' },
          { label: 'Engineer Sub-County Hospital', value: 'Engineer Sub-County Hospital' },
          { label: 'Ndaragwa Health Centre', value: 'Ndaragwa Health Centre' },
          { label: 'Mirangine Health Centre', value: 'Mirangine Health Centre' },
          { label: 'Kimathi Dispensary-Kipipiri Sub County', value: 'Kimathi Dispensary-Kipipiri Sub County' },
          { label: 'Ol Joro Orok Medical Clinic', value: 'Ol Joro Orok Medical Clinic' },
          { label: 'Amani Medical Clinic', value: 'Amani Medical Clinic' },
          { label: 'Wanjohi Health Centre', value: 'Wanjohi Health Centre' },
          { label: 'Shamata Health Centre', value: 'Shamata Health Centre' },
          { label: 'Leshau Pondo Health Centre', value: 'Leshau Pondo Health Centre' },
          { label: 'Kenyatta National Hospital', value: 'Kenyatta National Hospital' },
          { label: 'Mama Lucy Kibaki Hospital', value: 'Mama Lucy Kibaki Hospital' },
          { label: 'Mbagathi County Referral Hospital', value: 'Mbagathi County Referral Hospital' },
          { label: 'Pumwani Maternity Hospital', value: 'Pumwani Maternity Hospital' },
          { label: 'Dagoretti Sub-County Hospital Mutuini', value: 'Dagoretti Sub-County Hospital Mutuini' },
          { label: 'Kangemi Health Centre', value: 'Kangemi Health Centre' },
          { label: 'Riruta Health Centre', value: 'Riruta Health Centre' },
          { label: 'Kayole II Sub County Hospital', value: 'Kayole II Sub County Hospital' },
          { label: 'Kasarani Health Centre', value: 'Kasarani Health Centre' },
          { label: 'Dandora II Health Centre', value: 'Dandora II Health Centre' },
          { label: 'Coast General Teaching and Referral Hospital Vikwatani Outreach Centre', value: 'Coast General Teaching and Referral Hospital Vikwatani Outreach Centre' },
          { label: 'Port Reitz Sub-County Hospital', value: 'Port Reitz Sub-County Hospital' },
          { label: 'Tudor District Hospital', value: 'Tudor District Hospital' },
          { label: 'Magongo (MCM) Dispensary', value: 'Magongo (MCM) Dispensary' },
          { label: 'Likoni Sub-County Hospital', value: 'Likoni Sub-County Hospital' },
          { label: 'Jomvu Model Health Centre', value: 'Jomvu Model Health Centre' },
          { label: 'Kisauni Health Centre', value: 'Kisauni Health Centre' },
          { label: 'Bamburi Dispensary', value: 'Bamburi Dispensary' },
          { label: 'Coast General Teaching Refferal Hospital - Mtongwe Outreach Centre', value: 'Coast General Teaching Refferal Hospital - Mtongwe Outreach Centre' },
          { label: 'Diani Beach Hospital Limited - Shika Adabu', value: 'Diani Beach Hospital Limited - Shika Adabu' },
          { label: 'Mikindani Medical Clinic', value: 'Mikindani Medical Clinic' },
          { label: 'Kilifi County Hospital', value: 'Kilifi County Hospital' },
          { label: 'Malindi Sub-County Hospital', value: 'Malindi Sub-County Hospital' },
          { label: 'Mariakani Sub-County Hospital', value: 'Mariakani Sub-County Hospital' },
          { label: 'Rabai Sub County Hospital', value: 'Rabai Sub County Hospital' },
          { label: 'Ganze Health Centre', value: 'Ganze Health Centre' },
          { label: 'Bamba Sub County Hospital', value: 'Bamba Sub County Hospital' },
          { label: 'Mtwapa Sub County Hospital', value: 'Mtwapa Sub County Hospital' },
          { label: 'Chasimba Health Centre', value: 'Chasimba Health Centre' },
          { label: 'Vipingo Rural Demonstration Health Centre', value: 'Vipingo Rural Demonstration Health Centre' },
          { label: 'Matsangoni Model Health Centre', value: 'Matsangoni Model Health Centre' },
          { label: 'Meru Teaching & Referral Hospital', value: 'Meru Teaching & Referral Hospital' },
          { label: 'Consolata Mission Hospital Nkubu', value: 'Consolata Mission Hospital Nkubu' },
          { label: 'Maua Methodist Hospital', value: 'Maua Methodist Hospital' },
          { label: 'Muthara Sub-District Hospital', value: 'Muthara Sub-District Hospital' },
          { label: 'Miathene Sub-County Hospital', value: 'Miathene Sub-County Hospital' },
          { label: 'Laare Health Centre', value: 'Laare Health Centre' },
          { label: 'Kanyakine Sub County Hospital', value: 'Kanyakine Sub County Hospital' },
          { label: 'Kangeta Sub County Hospital', value: 'Kangeta Sub County Hospital' },
          { label: 'Timau Sub-County Hospital', value: 'Timau Sub-County Hospital' },
          { label: 'Gatimbi Health Centre', value: 'Gatimbi Health Centre' }
        ],
        'site_name'
      )}
    </div>
  );

const renderFilters = () => {
  console.log('Active table ID:', activeTable); // Debug log
  
  switch (activeTable) {
    case 'patient-table':
      return renderPatientFilters();
    case 'bp-log':
      return renderBpLogFilters();
    case 'glucose-log':
      return renderGlucoseLogFilters();
    case 'diagnosis':
      return renderDiagnosisFilters();
    case 'lifestyle':
      return renderLifestyleFilters();
    case 'compliance':
      return renderComplianceFilters();
    case 'visit':
      return renderVisitFilters();
    case 'review':
      return renderMedicalReviewFilters();
    case 'screening':
      return renderScreeningFilters();
    default:
      console.warn(`No filters defined for table: ${activeTable}`);
      return null;
  }
};

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
      <h3 className="text-lg font-medium mb-4">Filter Options</h3>
      {renderFilters()}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Reset Filters
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

