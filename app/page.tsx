import EnhancedModernHero from "./components/hero/EnhancedModernHero";
import EnhancedSevenSummitsTracker from "./components/sections/EnhancedSevenSummitsTracker";
import ModernTraining from "./components/sections/ModernTraining";
import ModernContent from "./components/sections/ModernContent";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Modern Hero Section */}
      <EnhancedModernHero />

      {/* Seven Summits Progress Tracker */}
      <EnhancedSevenSummitsTracker />

      {/* Modern Training Section */}
      <ModernTraining />

      {/* Modern Content Section */}
      <ModernContent />
    </main>
  );
}