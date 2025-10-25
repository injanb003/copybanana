"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold text-foreground">Nano Banana</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#editor"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Image Editor
          </Link>
          <Link
            href="#examples"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Showcase
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Launch Now
          </Button>
        </div>
      </div>
    </header>
  )
}
