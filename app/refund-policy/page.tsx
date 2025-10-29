import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy | copybanana",
  description: "Refund policy for copybanana (operated by Jianbo Ying)",
}

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Refund Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: 29 Oct 2025</p>

          <div className="prose prose-neutral max-w-none text-left">
            <p>
              We aim for every purchase to meet expectations. This policy describes when a refund may be offered and how
              to request one.
            </p>

            <h2>1. Eligibility</h2>
            <ul>
              <li>Accidental duplicate charges or mistaken repeat purchases.</li>
              <li>Persistent technical failure preventing use after reasonable troubleshooting.</li>
              <li>Unauthorized transactions, subject to investigation.</li>
            </ul>

            <h2>2. Not Eligible</h2>
            <ul>
              <li>Successful usage consistent with the product description.</li>
              <li>Abuse, policy violations, or fraud.</li>
              <li>Change of mind after substantial use.</li>
            </ul>

            <h2>3. Time Window</h2>
            <p>Submit your request within 7 days of purchase unless local law specifies otherwise.</p>

            <h2>4. How to Request</h2>
            <ol>
              <li>
                Use the <a className="underline" href="/refund">Refund Application</a> page to provide your order ID,
                email used at checkout, and a description of the issue; or
              </li>
              <li>
                Email <a href="mailto:support@boboshixiong.com" className="underline">support@boboshixiong.com</a> with the same details.
              </li>
            </ol>

            <h2>5. Processing</h2>
            <p>
              Approved refunds are issued to the original payment method by our payment partner. Bank timelines vary and
              are outside our control.
            </p>

            <h2>6. Chargebacks</h2>
            <p>
              Please contact us first. Unauthorized chargebacks may delay resolution and could result in account review.
            </p>

            <h2>7. Contact</h2>
            <p>
              Operator: <strong>Jianbo Ying</strong> · Address: <strong>Room 602, No. 7 Longbai Fourth Village, Minhang District, Shanghai</strong><br />
              Email: <a href="mailto:support@boboshixiong.com" className="underline">support@boboshixiong.com</a> · Phone: <a href="tel:+8618621994917" className="underline">+86 18621994917</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
