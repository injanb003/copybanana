import crypto from "node:crypto"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

function timingSafeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

function verifySignature(rawBody: string, secret: string, signature?: string | null) {
  if (!signature) return false
  try {
    const h = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
    return timingSafeEqual(h, signature)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  try {
    const secret = process.env.CREEM_WEBHOOK_SECRET
    if (!secret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Read raw body for HMAC verification
    const raw = await req.text()

    const sig = req.headers.get("x-creem-signature")
    const pass = verifySignature(raw, secret, sig) || req.headers.get("x-webhook-secret") === secret
    if (!pass) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(raw || "{}") as any

    // Minimal normalization
    const type: string | undefined = event?.type || event?.event || event?.object
    const status: string | undefined = event?.status || event?.data?.status
    const checkoutId: string | undefined = event?.id || event?.data?.id
    const productId: string | undefined = event?.product_id || event?.data?.product_id || event?.product?.id
    const plan: string | undefined = event?.metadata?.plan || event?.data?.metadata?.plan
    const billing: string | undefined = event?.metadata?.billing || event?.data?.metadata?.billing
    const customer = event?.customer || event?.data?.customer
    const customer_email: string | undefined = customer?.email
    const customer_id: string | undefined = customer?.id

    // Persist
    const supabase = createSupabaseAdminClient()

    // 1) Store raw event
    await supabase.from("billing_events").insert({
      type,
      data: event,
    })

    // 2) Upsert subscription by checkout_id (unique)
    await supabase.from("subscriptions").upsert(
      {
        checkout_id: checkoutId,
        product_id: productId,
        status,
        plan,
        billing,
        customer_id,
        customer_email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "checkout_id" },
    )

    return NextResponse.json({ ok: true, type, status, checkoutId, productId })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Webhook error" }, { status: 500 })
  }
}