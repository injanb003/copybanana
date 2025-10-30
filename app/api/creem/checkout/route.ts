export async function GET(req: Request) {
  try {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const mapping = {
      BASIC_MONTHLY: !!process.env.CREEM_PRODUCT_ID_BASIC_MONTHLY,
      BASIC_YEARLY: !!process.env.CREEM_PRODUCT_ID_BASIC_YEARLY,
      PRO_MONTHLY: !!process.env.CREEM_PRODUCT_ID_PRO_MONTHLY,
      PRO_YEARLY: !!process.env.CREEM_PRODUCT_ID_PRO_YEARLY,
      TEAM_MONTHLY: !!process.env.CREEM_PRODUCT_ID_TEAM_MONTHLY,
      TEAM_YEARLY: !!process.env.CREEM_PRODUCT_ID_TEAM_YEARLY,
      DEFAULT: !!process.env.CREEM_DEFAULT_PRODUCT_ID,
    }

    // Optional diagnostics: /api/creem/checkout?diag=1
    const url = new URL(req.url)
    let diag: any = null
    if (url.searchParams.get("diag") === "1") {
      try {
        const r = await fetch(`${CREEM_API_BASE}/v1/products/search?limit=1`, {
          method: "GET",
          headers: {
            "x-api-key": process.env.CREEM_API_KEY || "",
          },
        })
        const j = await r.json().catch(() => ({} as any))
        diag = { ok: r.ok, status: r.status, base: CREEM_API_BASE, has_key: !!process.env.CREEM_API_KEY, first_id: j?.items?.[0]?.id, message: j?.error || j?.message }
      } catch (e: any) {
        diag = { ok: false, error: e?.message || String(e), code: e?.code, cause: e?.cause?.code }
      }
    }

    return NextResponse.json({ ok: true, site, mapping, diag })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { ProxyAgent, setGlobalDispatcher, request } from "undici"

export const runtime = "nodejs"

// Optional proxy support for environments that require a local HTTP(S) proxy
const PROXY_URL = process.env.CREEM_PROXY || process.env.CREEM_PROXY_URL || process.env.HTTPS_PROXY || process.env.HTTP_PROXY
if (PROXY_URL) {
  try {
    setGlobalDispatcher(new ProxyAgent(PROXY_URL))
  } catch {}
}

const CREEM_LIVE_API_BASE = "https://api.creem.io"
const CREEM_TEST_API_BASE = "https://test-api.creem.io"

function resolveCreemApiBase() {
  const explicit = process.env.CREEM_API_BASE || process.env.CREEM_API_BASE_URL || process.env.CREEM_API_URL || ""
  if (explicit.trim()) {
    const normalized = explicit.trim().replace(/\/+$/, "")
    if (normalized) return normalized
  }
  const key = process.env.CREEM_API_KEY || ""
  return key.startsWith("creem_test_") ? CREEM_TEST_API_BASE : CREEM_LIVE_API_BASE
}

const CREEM_API_BASE = resolveCreemApiBase()
const CREEM_API_TIMEOUT_MS = Number(process.env.CREEM_API_TIMEOUT_MS || 10000)

function env(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`${name} is not configured`)
  return v
}

function resolveProductId(plan: string, billing: string) {
  const key = `${plan}_${billing}`.toUpperCase() // e.g., PRO_MONTHLY
  const map: Record<string, string | undefined> = {
    BASIC_MONTHLY: process.env.CREEM_PRODUCT_ID_BASIC_MONTHLY,
    BASIC_YEARLY: process.env.CREEM_PRODUCT_ID_BASIC_YEARLY,
    PRO_MONTHLY: process.env.CREEM_PRODUCT_ID_PRO_MONTHLY,
    PRO_YEARLY: process.env.CREEM_PRODUCT_ID_PRO_YEARLY,
    TEAM_MONTHLY: process.env.CREEM_PRODUCT_ID_TEAM_MONTHLY,
    TEAM_YEARLY: process.env.CREEM_PRODUCT_ID_TEAM_YEARLY,
  }
  return map[key] || process.env.CREEM_DEFAULT_PRODUCT_ID
}

function priceCents(plan: string, billing: string) {
  const table: Record<string, number> = {
    BASIC_MONTHLY: 900,
    BASIC_YEARLY: 9000,
    PRO_MONTHLY: 1900,
    PRO_YEARLY: 19000,
    TEAM_MONTHLY: 4900,
    TEAM_YEARLY: 49000,
  }
  return table[`${plan}_${billing}`.toUpperCase()] ?? 1900
}

function billingPeriod(billing: string) {
  return billing === "yearly" ? "every-year" : "every-month"
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      plan?: string
      billing?: string
      units?: number
      discount_code?: string
      customer?: { id?: string; email?: string }
    } | null

    if (!body || !body.plan || !body.billing) {
      return NextResponse.json({ error: "Missing plan or billing" }, { status: 400 })
    }

    const plan = String(body.plan)
    const billing = String(body.billing)
    if (!/^(basic|pro|team)$/.test(plan) || !/^(monthly|yearly)$/.test(billing)) {
      return NextResponse.json({ error: "Invalid plan or billing" }, { status: 400 })
    }

    const configuredProductId = resolveProductId(plan, billing)

    const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const success_url = `${site}/pricing?status=success`

    async function creem<T>(path: string, init?: RequestInit) {
      // Use undici.request with timeout for clearer network errors
      const url = `${CREEM_API_BASE}${path}`
      const headerInit = init?.headers
      const headers: Record<string, string> = {
        "x-api-key": env("CREEM_API_KEY"),
      }
      if (headerInit) {
        if (headerInit instanceof Headers) {
          for (const [key, value] of headerInit.entries()) {
            headers[key] = value
          }
        } else if (Array.isArray(headerInit)) {
          for (const entry of headerInit) {
            const [key, value] = entry
            if (typeof key === "string" && typeof value === "string") {
              headers[key] = value
            }
          }
        } else {
          Object.assign(headers, headerInit as Record<string, string>)
        }
      }
      if (init?.body && !Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) {
        headers["content-type"] = "application/json"
      }
      const { statusCode, body } = await request(url, {
        method: (init?.method || "GET") as any,
        headers,
        body: init?.body as any,
        maxRedirections: 0,
        bodyTimeout: CREEM_API_TIMEOUT_MS,
        headersTimeout: CREEM_API_TIMEOUT_MS,
      })
      const text = await body.text()
      let json: any
      try { json = text ? JSON.parse(text) : {} } catch { json = { raw: text } }
      return { res: { ok: statusCode >= 200 && statusCode < 300, status: statusCode } as any, json } as any
    }

    // If product_id is not configured, auto-pick the first available product
    let effectiveProductId = configuredProductId
    if (!effectiveProductId) {
      try {
        const { res, json } = await creem<{ items?: Array<{ id: string }> }>(`/v1/products/search?limit=1`, {
          method: "GET",
        })
        if (res.ok && Array.isArray(json.items) && json.items[0]?.id) {
          effectiveProductId = json.items[0].id
        }
      } catch {}
    }

    // Still none? Auto-create a test product, then use it
    if (!effectiveProductId) {
      try {
        const autoType = (process.env.CREEM_AUTO_BILLING_TYPE || "recurring").toLowerCase()
        const isOnetime = autoType === "onetime" || autoType === "single" || autoType === "single_payment"
        const base: any = {
          name: `copybanana ${plan} (${billing})`,
          price: priceCents(plan, billing),
          currency: "USD",
          billing_type: isOnetime ? "onetime" : "recurring",
          default_success_url: `${site}/pricing?status=success`,
          description: `Auto-created plan ${plan}-${billing} for checkout`,
          tax_mode: "exclusive",
          tax_category: "saas",
        }
        if (!isOnetime) base.billing_period = billingPeriod(billing)

        const { res: cr, json: cj } = await creem<{ id?: string }>(`/v1/products`, {
          method: "POST",
          body: JSON.stringify(base),
        })
        if (cr.ok && cj?.id) {
          effectiveProductId = cj.id
        }
      } catch {}
    }

    if (!effectiveProductId) {
      const envKey = `${plan}_${billing}`.toUpperCase()
      return NextResponse.json(
        {
          error:
            `Product not configured and auto-create failed. Set CREEM_PRODUCT_ID_${envKey} or CREEM_DEFAULT_PRODUCT_ID, or manually create a product in Creem dashboard.`,
        },
        { status: 500 },
      )
    }

    const payload = {
      product_id: effectiveProductId,
      units: body.units ?? 1,
      discount_code: body.discount_code,
      customer: body.customer,
      success_url,
      metadata: { plan, billing },
    }

    let data: any = null
    try {
      let { res, json } = await creem(`/v1/checkouts`, { method: "POST", body: JSON.stringify(payload) })
      data = json
      if (!res.ok) {
        // If product invalid, try auto-pick and retry once
        const msg = (json && (json.error || json.message)) || `Creem error: ${res.status}`
        if (!configuredProductId && res.status >= 400 && res.status !== 403) {
          const { res: pr, json: pj } = await creem<{ items?: Array<{ id: string }> }>(`/v1/products/search?limit=1`, {
            method: "GET",
          })
          if (pr.ok && pj.items?.[0]?.id) {
            const retry = { ...payload, product_id: pj.items[0].id }
            const r2 = await creem(`/v1/checkouts`, { method: "POST", body: JSON.stringify(retry) })
            data = r2.json
            if (!r2.res.ok) {
              const m2 = (r2.json && (r2.json.error || r2.json.message)) || `Creem error: ${r2.res.status}`
              return NextResponse.json({ error: m2 }, { status: 400 })
            }
          } else {
            return NextResponse.json({ error: msg }, { status: 400 })
          }
        } else if (res.status === 403) {
          return NextResponse.json(
            { error: "Forbidden: invalid or wrong-mode API key. Use your Test API key and ensure the product belongs to this workspace." },
            { status: 403 },
          )
        } else {
          return NextResponse.json({ error: msg }, { status: 400 })
        }
      }
    } catch (e: any) {
      const details: any = {
        message: e?.message || String(e),
        code: e?.code,
        cause_code: e?.cause?.code,
        cause_errno: e?.cause?.errno,
        cause_syscall: e?.cause?.syscall,
        cause_message: e?.cause?.message,
      }
      if (process.env.NODE_ENV !== "production") {
        console.error("[creem/checkout] upstream error", details)
      }
      return NextResponse.json({ error: `Upstream fetch failed: ${details.message}`, details }, { status: 502 })
    }

    const checkout_url = data?.checkout_url
    const id = data?.id
    if (!checkout_url) {
      return NextResponse.json({ error: "No checkout_url in response" }, { status: 502 })
    }

    return NextResponse.json({ id, checkout_url })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}
