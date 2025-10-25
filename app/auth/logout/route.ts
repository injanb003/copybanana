import { NextRequest, NextResponse } from "next/server"
import { createSupabaseRouteClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseRouteClient()
  await supabase.auth.signOut()
  const { origin } = new URL(request.url)
  return NextResponse.redirect(origin)
}
