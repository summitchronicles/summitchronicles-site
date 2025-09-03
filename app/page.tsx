import ModernHero from "./components/hero/ModernHero";
import ModernTraining from "./components/sections/ModernTraining";
import ModernContent from "./components/sections/ModernContent";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Modern Hero Section */}
      <ModernHero />

      {/* Modern Training Section */}
      <ModernTraining />

      {/* Modern Content Section */}
      <ModernContent />
    </main>
  );
}