import AIChat from '@/components/sections/AIChat'
import AIDocumentGenerator from '@/components/sections/AIDocumentGenerator'
import AutomationMarketplace from '@/components/sections/AutomationMarketplace'
import CaseStudies from '@/components/sections/CaseStudies'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/sections/Footer'
import GovernanceDashboard from '@/components/sections/GovernanceDashboard'
import HeroSection from '@/components/sections/HeroSection'
import Navbar from '@/components/sections/Navbar'
import PlatformModules from '@/components/sections/PlatformModules'
import PricingSection from '@/components/sections/PricingSection'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-acres-black">
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <PlatformModules />
        <GovernanceDashboard />
        <AIDocumentGenerator />
        <AutomationMarketplace />
        <PricingSection />
        <CaseStudies />
        <ContactSection />
        <Footer />
        <AIChat />
      </div>
    </main>
  )
}
