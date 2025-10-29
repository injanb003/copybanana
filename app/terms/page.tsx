import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | copybanana",
  description: "Terms and conditions for using copybanana (operated by Jianbo Ying)",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: 29 Oct 2025</p>

          <div className="prose prose-neutral max-w-none text-left">
            <h2>1. Agreement and Parties</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of copybanana (the "Service"), operated by
              <strong className="ml-1">Jianbo Ying</strong> at
              <strong className="ml-1">Room 602, No. 7 Longbai Fourth Village, Minhang District, Shanghai</strong>.
              By using the Service you accept these Terms.
            </p>

            <h2>2. The Service</h2>
            <p>
              The Service provides AI‑assisted image editing based on your prompts and reference images. Features may
              change over time and some may be offered as beta or experimental.
            </p>

            <h2>3. Eligibility and Accounts</h2>
            <ul>
              <li>You must be at least 13 years old (or the minimum age required by your jurisdiction).</li>
              <li>You are responsible for safeguarding your account and for all activity under it.</li>
              <li>We may suspend or terminate accounts that violate these Terms.</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <ul>
              <li>No illegal, harmful, or infringing content; respect the rights of others.</li>
              <li>No attempts to bypass rate limits, probe infrastructure, or misuse the Service.</li>
              <li>Comply with any usage policies of third‑party model or hosting providers we rely on.</li>
            </ul>

            <h2>5. Content and Ownership</h2>
            <ul>
              <li>You retain ownership of inputs you upload.</li>
              <li>Subject to law and third‑party terms, you may use outputs for personal and commercial purposes.</li>
              <li>We and our licensors own the Service, including software, designs, and trademarks.</li>
            </ul>

            <h2>6. License to Us</h2>
            <p>
              You grant us a limited license to process your inputs and outputs for operating the Service, preventing
              abuse, and improving quality (including using aggregated or de‑identified data).
            </p>

            <h2>7. Payments and Refunds</h2>
            <p>
              Where pricing applies, fees are displayed at checkout and processed by our payment partners. Our
              <a className="ml-1 underline" href="/refund-policy">Refund Policy</a> describes when refunds may be
              available.
            </p>

            <h2>8. Third‑Party Services</h2>
            <p>
              We may integrate third‑party services (e.g., authentication, hosting, model inference). Your use of those
              services may be subject to their terms.
            </p>

            <h2>9. Availability and Changes</h2>
            <p>
              We may modify, suspend, or discontinue parts of the Service at any time. We will endeavor to provide
              reasonable notice of material changes.
            </p>

            <h2>10. Warranty Disclaimer</h2>
            <p>
              THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we are not liable for indirect, incidental, special,
              consequential, or punitive damages, or for loss of profits, data, or goodwill.
            </p>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless copybanana and its operator from claims arising from your use of
              the Service or breach of these Terms.
            </p>

            <h2>13. Termination</h2>
            <p>We may suspend or terminate access immediately for violations or risk to the Service.</p>

            <h2>14. Governing Law</h2>
            <p>These Terms are governed by applicable local law unless otherwise required.</p>

            <h2>15. Changes</h2>
            <p>We may update these Terms. Continued use after changes constitutes acceptance.</p>

            <h2>16. Contact</h2>
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
