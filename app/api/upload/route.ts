import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"

export const runtime = "nodejs"

const MIME_LOOKUP: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = (file.name.split(".").pop() || "png").toLowerCase()
    const allowed = ["png", "jpg", "jpeg", "webp"]
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`
    const filepath = path.join(uploadsDir, filename)
    await fs.writeFile(filepath, buffer)

    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin
    const url = `${origin.replace(/\/$/, "")}/uploads/${filename}`

    const mime = MIME_LOOKUP[ext] || "image/png"
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`

    return NextResponse.json({ url, dataUrl })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 })
  }
}
