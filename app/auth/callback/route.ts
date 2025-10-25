import { NextRequest, NextResponse } from "next/server"
import { createSupabaseRouteClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseRouteClient()
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  const errorDescription = searchParams.get("error_description")

  if (errorDescription) {
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(errorDescription)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=missing_code`)
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
