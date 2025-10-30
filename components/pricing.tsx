"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

const PLANS = [
  {
    key: "basic" as const,
    name: "Basic",
    tagline: "For getting started",
    price: { monthly: 9, yearly: 90 },
    features: ["50 edits/month", "Standard model", "Email support"],
    cta: "Get Basic",
    popular: false,
  },
  {
    key: "pro" as const,
    name: "Pro",
    tagline: "For power users",
    price: { monthly: 19, yearly: 190 },
    features: ["Unlimited edits", "Advanced model", "Priority support", "High-res export"],
    cta: "Get Pro",
    popular: true,
  },
  {
    key: "team" as const,
    name: "Team",
    tagline: "For teams and studios",
    price: { monthly: 49, yearly: 490 },
    features: ["Unlimited seats", "Team workspace", "SAML/SSO", "Dedicated support"],
    cta: "Contact Sales",
    popular: false,
  },
]

type BillingCycle = "monthly" | "yearly"

type CheckoutResponse = {
  id: string
  checkout_url: string
}

export function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>("monthly")
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleCheckout = async (plan: (typeof PLANS)[number]["key"]) => {
    try {
      setLoadingPlan(plan)
      const res = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing }),
      })
      const payload = (await res.json().catch(() => null)) as CheckoutResponse | { error?: string } | null
      if (!res.ok || !payload || !(payload as CheckoutResponse).checkout_url) {
        const message = (payload && "error" in payload && payload.error) || `Checkout failed: ${res.status}`
        throw new Error(message)
      }
      const { checkout_url } = payload as CheckoutResponse
      window.location.href = checkout_url
    } catch (err: any) {
      alert(err?.message || "Unable to start checkout")
    } finally {
      setLoadingPlan(null)
    }
  }

  const params = useSearchParams()
  const success = params?.get("status") === "success"

  return (
    <section className="py-20">
      <div className="container">
        {success ? (
          <div className="max-w-3xl mx-auto mb-6">
            <Alert>
              <AlertDescription>Payment completed. Your purchase was successful.</AlertDescription>
            </Alert>
          </div>
        ) : null}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-accent/50 text-accent-foreground border-accent">
            <Sparkles className="mr-1 h-3 w-3" />
            Flexible pricing for everyone
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Pricing</h1>
          <p className="text-muted-foreground text-balance leading-relaxed">
            Choose a plan that fits your workflow. Switch between monthly and yearly billing anytime.
          </p>

          <div className="mt-6 inline-flex items-center rounded-full border bg-background p-1">
            <button
              className={`px-4 py-1.5 text-sm rounded-full ${
                billing === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-1.5 text-sm rounded-full ${
                billing === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.key}
              className={`p-6 relative ${plan.popular ? "border-2 border-primary shadow-lg" : ""}`}
            >
              {plan.popular ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              ) : null}

              <div className="mb-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.tagline}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">${billing === "monthly" ? plan.price.monthly : plan.price.yearly}</span>
                <span className="text-sm text-muted-foreground ml-1">/ {billing}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loadingPlan === plan.key}
                onClick={() => handleCheckout(plan.key)}
              >
                {loadingPlan === plan.key ? "Redirecting..." : plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">Prices in USD. Taxes may apply.</p>
      </div>
    </section>
  )
}