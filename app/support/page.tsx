import type { Metadata } from 'next'
import { DonationTierSection } from '../components/organisms/DonationTierSection'
import { ImpactCalculator } from '../components/organisms/ImpactCalculator'
import { DonationHero } from '../components/organisms/DonationHero'
import { TransparencySection } from '../components/organisms/TransparencySection'
import Navigation from '../components/Navigation'

export const metadata: Metadata = {
  title: 'Support My Journey | Summit Chronicles',
  description: 'Join the community-supported adventure preparation. Help fund the systematic training and expedition goals through transparent, impactful donations.',
  keywords: 'mountaineering support, expedition funding, adventure preparation, Mount Everest training',
  openGraph: {
    title: 'Support My Journey | Summit Chronicles',
    description: 'Join the community-supported adventure preparation. Help fund the systematic training and expedition goals.',
    type: 'website',
  },
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-spa-stone">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <DonationHero />
        
        {/* Donation Tiers */}
        <DonationTierSection />
        
        {/* Impact Calculator */}
        <ImpactCalculator />
        
        {/* Financial Transparency */}
        <TransparencySection />
      </main>
    </div>
  )
}