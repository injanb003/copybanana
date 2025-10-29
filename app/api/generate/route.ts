import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "copybanana"

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": SITE_NAME,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageUrl, imageData } = (await req.json()) as {
      prompt?: string
      imageUrl?: string
      imageData?: string | null
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 })
    }

    if (!prompt || (!imageUrl && !imageData)) {
      return NextResponse.json({ error: "Missing prompt or image reference" }, { status: 400 })
    }

    const trimmedImageUrl = typeof imageUrl === "string" ? imageUrl.trim() : ""
    const trimmedImageData = typeof imageData === "string" ? imageData.trim() : ""

    const hasDataUrl = trimmedImageData.length > 0 && trimmedImageData.startsWith("data:")
    const hasRemoteHttpUrl = /^https?:\/\//i.test(trimmedImageUrl)
    const isLocalHttp = hasRemoteHttpUrl && /localhost|127\.0\.0\.1|^http:\/\/0\.0\.0\.0/i.test(trimmedImageUrl)

    if (!hasDataUrl) {
      if (!hasRemoteHttpUrl || isLocalHttp) {
        return NextResponse.json({ error: "imageUrl must be a public http(s) URL when no data URL is provided" }, { status: 400 })
      }
    }

    const userContent: any[] = []
    const seenContent = new Set<string>()
    const pushContent = (part: any) => {
      if (!part) return
      const key = JSON.stringify(part)
      if (seenContent.has(key)) return
      seenContent.add(key)
      userContent.push(part)
    }

    pushContent({ type: "text", text: `${prompt}\nReturn only an image.` })

    if (hasDataUrl) {
      pushContent({ type: "image_url", image_url: trimmedImageData })
      pushContent({ type: "image_url", image_url: { url: trimmedImageData } })
    }

    if (hasRemoteHttpUrl && !isLocalHttp) {
      pushContent({ type: "image_url", image_url: trimmedImageUrl })
      pushContent({ type: "image_url", image_url: { url: trimmedImageUrl } })
    }

    const completion = await client.chat.completions.create({
      model: "google/gemini-2.5-flash-image-preview",
      modalities: ["image"],
      max_output_tokens: 4096,
      messages: [
        {
          role: "user",
          content: userContent as any,
        },
      ],
    } as any)

    const images: string[] = []
    let text: string | null = null

    const choice = completion.choices?.[0]
    const message = (choice?.message ?? {}) as any
    const seen = new Set<string>()

    const addImage = (value?: string | null) => {
      if (!value) return
      const trimmed = value.trim()
      if (!trimmed) return
      if (!trimmed.startsWith("data:") && !/^https?:\/\//i.test(trimmed)) return
      if (seen.has(trimmed)) return
      seen.add(trimmed)
      images.push(trimmed)
    }

    const collectImagePayload = (payload: any) => {
      if (!payload) return
      if (typeof payload === "string") {
        addImage(payload)
        return
      }

      addImage(typeof payload.url === "string" ? payload.url : undefined)
      addImage(typeof payload.image_url === "string" ? payload.image_url : undefined)
      addImage(typeof payload.image_url?.url === "string" ? payload.image_url.url : undefined)

      const b64Candidate =
        typeof payload.b64_json === "string"
          ? payload.b64_json
          : typeof payload.image_b64 === "string"
            ? payload.image_b64
            : typeof payload.image_base64 === "string"
              ? payload.image_base64
              : typeof payload.image?.b64_json === "string"
                ? payload.image.b64_json
                : typeof payload.image?.base64 === "string"
                  ? payload.image.base64
                  : undefined

      if (typeof b64Candidate === "string" && b64Candidate.trim()) {
        const trimmedB64 = b64Candidate.trim()
        const normalized = trimmedB64.startsWith("data:")
          ? trimmedB64
          : `data:image/png;base64,${trimmedB64}`
        addImage(normalized)
      }

      if (Array.isArray(payload.images)) {
        for (const nested of payload.images) {
          collectImagePayload(nested)
        }
      }
    }

    const parts: any[] | string | undefined = message.content as any
    if (Array.isArray(parts)) {
      for (const part of parts) {
        if (part?.type === "output_image" || part?.type === "image_url") {
          collectImagePayload(part)
        } else if (part?.type === "text" && typeof part.text === "string" && part.text.trim()) {
          text = text ? `${text}\n${part.text}` : part.text
        }
      }
    } else if (typeof parts === "string" && parts.trim()) {
      text = parts.trim()
    }

    if (Array.isArray(message.images)) {
      for (const img of message.images) {
        collectImagePayload(img)
      }
    } else if (message.image) {
      collectImagePayload(message.image)
    }

    if (images.length === 0) {
      return NextResponse.json({ error: "Model did not return output_image" }, { status: 502 })
    }

    return NextResponse.json({ images, text })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
}
