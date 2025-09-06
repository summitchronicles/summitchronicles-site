import { Metadata } from "next";
import RealTimeExpeditionDashboard from "@/app/components/expedition/RealTimeExpeditionDashboard";

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