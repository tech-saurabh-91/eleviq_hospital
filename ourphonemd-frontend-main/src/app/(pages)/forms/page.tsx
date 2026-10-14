import { FeatureStatusBanner } from "@/components/common/FeatureStatus";

export const metadata = {
  title: "Patient Forms | Eleviq Hospital - Modern Healthcare Solutions",
  description: "Access and download patient forms and declarations for Eleviq Hospital services.",
};

export default function FormsPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-slate-50">
      <FeatureStatusBanner
        type="coming-soon"
        title="Downloadable Patient & Admission Forms"
        description="Standard hospital admission forms, consent documentation, insurance pre-authorisation forms, and medical records release declarations are being digitized for direct download and electronic signing."
        missingDependency="Patient Document Templates Service (GET /api/documents/templates)"
        actionText="Go to Patient Portal"
        actionHref="/patient"
      />
    </div>
  );
}
