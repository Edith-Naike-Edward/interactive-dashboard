// src/app/datatables/components/patient-medical-review-table-row.tsx
import { PatientMedicalReview } from '../types';

interface PatientMedicalReviewTableRowProps {
  review: PatientMedicalReview;
}

export function PatientMedicalReviewTableRow({ review }: PatientMedicalReviewTableRowProps) {
  return (
    <>
      <td className="px-4 py-3 text-sm font-mono">{review.patient_medical_review_id}</td>
      <td className="px-4 py-3 text-sm font-mono">{review.patient_visit_id}</td>
      <td className="px-4 py-3 text-sm">
        {review.complaint_comments || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {review.clinical_note || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {review.physical_exam_comments || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(review.updated_at).toLocaleDateString()}
      </td>
    </>
  );
}