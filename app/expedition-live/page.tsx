import { Metadata } from "next";
import dynamic from "next/dynamic";

const RealTimeExpeditionDashboard = dynamic(
  () => import("@/app/components/expedition/RealTimeExpeditionDashboard"),
  { 
    ssr: false,
    loading: () => <div className="min-h-screen bg-gradient-to-b from-charcoal to-black flex items-center justify-center">
      <div className="text-white text-xl">Loading expedition dashboard...</div>
    </div>
  }
);

export const metadata: Metadata = {
  title: "Live Expedition Tracking - Summit Chronicles",
  description: "Real-time expedition tracking with GPS, health monitoring, and weather data",
};

export default function ExpeditionLivePage() {
  // Using mock expedition ID for testing
  const mockExpeditionId = "mock-expedition-1";

  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal to-black">
      <RealTimeExpeditionDashboard expeditionId={mockExpeditionId} />
    </div>
  );
}