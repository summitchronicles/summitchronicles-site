import Hero from '@/components/Hero'
import AboutStrip from '@/components/AboutStrip'
import SignupCard from '@/components/SignupCard'
import StatsTracker from '@/components/StatsTracker'  // ⟵ add this

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutStrip />
      <SignupCard />
      <StatsTracker />      {/* ⟵ add this */}
    </>
  )
}