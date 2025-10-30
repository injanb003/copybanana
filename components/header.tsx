import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function Header() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold text-foreground">copybanana</span>
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
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <form action="/auth/logout" method="post">
              <Button type="submit" variant="ghost" size="sm">
                Sign Out
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <form action="/auth/login" method="get">
                <Button type="submit" variant="ghost" size="sm">Sign In with GitHub</Button>
              </form>
              <form action="/auth/login/google" method="get">
                <Button type="submit" variant="ghost" size="sm">Sign In with Google</Button>
              </form>
            </div>
          )}
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="#editor">Launch Now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

