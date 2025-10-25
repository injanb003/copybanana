import { NextRequest, NextResponse } from "next/server"
import { createSupabaseRouteClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseRouteClient()
  const { origin } = new URL(request.url)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: "read:user user:email",
      queryParams: {
        prompt: "select_account",
      },
    },
  })

  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message ?? "Unable to start GitHub authentication" }, { status: 500 })
  }

  return NextResponse.redirect(data.url)
}
