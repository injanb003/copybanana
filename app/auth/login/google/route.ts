import { NextRequest, NextResponse } from "next/server"
import { createSupabaseRouteClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseRouteClient()
  const { origin, searchParams } = new URL(request.url)
  const next = searchParams.get("next") ?? "/"

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      // scopes: "openid email profile", // defaults are usually sufficient
      queryParams: {
        prompt: "select_account",
      },
    },
  })

  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message ?? "Unable to start Google authentication" }, { status: 500 })
  }

  return NextResponse.redirect(data.url)
}
