import { FeatureStatusBanner } from "@/components/common/FeatureStatus";

export const metadata = {
  title: "Fee Schedule | Eleviq Hospital - Modern Healthcare Solutions",
  description: "View Eleviq Hospital fee schedule and cashless insurance tariff information.",
};

export default function FeesPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-slate-50">
      <FeatureStatusBanner
        type="coming-soon"
        title="Hospital Fee & Tariff Schedule"
        description="Our digitized OPD consultation fee schedule and TPA cashless package tariff charts are currently being prepared for online access. For immediate pricing details, please reach out to our patient administration desk."
        missingDependency="Hospital Tariff Master API (GET /api/billing/tariffs)"
        actionText="Contact Patient Support"
        actionHref="/contact"
      />
    </div>
  );
}
