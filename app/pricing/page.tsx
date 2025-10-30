import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Pricing } from "@/components/pricing"

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      {/* Header is a Server Component */}
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <Pricing />
      <Footer />
    </main>
  )
}