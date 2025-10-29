import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-10">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="text-2xl">🍌</span>
            <span>© 2025 copybanana. All rights reserved.</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
            <Link href="/refund" className="hover:text-foreground transition-colors">Refund Application</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
