"use client"

import { useState } from "react"

export default function RefundApplicationPage() {
  const [email, setEmail] = useState("")
  const [orderId, setOrderId] = useState("")
  const [reason, setReason] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent("Refund Application")
    const body = encodeURIComponent(`Email: ${email}\nOrder ID: ${orderId}\nReason:\n${reason}`)
    window.location.href = `mailto:support@boboshixiong.com?subject=${subject}&body=${body}`
  }

  return (
    <main className="min-h-screen py-16">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Refund Application</h1>
          <div className="prose prose-neutral max-w-none text-left">
            <p className="text-sm text-muted-foreground mb-6">
              Fill out the form below to request a refund under our Refund Policy. We typically reply within 3 business
              days.
            </p>
          </div>

          <form onSubmit={submit} className="grid gap-4 max-w-xl mx-auto text-left">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input id="email" className="border border-border rounded-md p-3" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label className="text-sm font-medium" htmlFor="order">Order ID</label>
            <input id="order" className="border border-border rounded-md p-3" placeholder="ch_123... or order-0001" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />

            <label className="text-sm font-medium" htmlFor="reason">Reason</label>
            <textarea id="reason" className="border border-border rounded-md p-3 min-h-32" placeholder="Describe the problem and desired outcome" value={reason} onChange={(e) => setReason(e.target.value)} required />

            <button type="submit" className="bg-primary text-primary-foreground rounded-md p-3 hover:bg-primary/90">
              Submit Request
            </button>
          </form>

          <div className="prose prose-neutral max-w-none text-left">
            <p className="text-sm text-muted-foreground mt-8">
              Prefer email? Contact <a className="underline" href="mailto:support@boboshixiong.com">support@boboshixiong.com</a> · Phone:
              <a className="ml-1 underline" href="tel:+8618621994917">+86 18621994917</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
