"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, Sparkles, Download } from "lucide-react"

type UploadResponse = {
  url: string
  dataUrl?: string | null
}

type GenerateResponse = {
  images?: string[]
  text?: string | null
  error?: string
}

export function Editor() {
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [hostedImageUrl, setHostedImageUrl] = useState<string | null>(null)
  const [hostedImageData, setHostedImageData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [outputs, setOutputs] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState("")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(typeof reader.result === "string" ? reader.result : null)
    }
    reader.readAsDataURL(file)

    try {
      setUploading(true)
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const payload = (await res.json().catch(() => null)) as UploadResponse | { error?: string } | null

      if (!res.ok || !payload || typeof (payload as UploadResponse).url !== "string") {
        const message = (payload && "error" in payload && payload.error) || `Upload failed: ${res.status}`
        throw new Error(message)
      }

      setHostedImageUrl(payload.url)
      setHostedImageData(payload.dataUrl ?? null)
    } catch (err: any) {
      setError(err?.message || "Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleUseImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!/^https?:\/\//i.test(url)) {
      setError("Please enter a valid http(s) image URL.")
      return
    }
    setError(null)
    setHostedImageUrl(url)
    setHostedImageData(null)
    setSelectedImage(url)
  }

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setOutputs([])

      if (!hostedImageUrl && !hostedImageData) {
        setError("Please provide an image: upload or paste a public URL.")
        return
      }

      if (uploading) {
        setError("Image is uploading. Please wait...")
        return
      }

      const hasDataUrl = typeof hostedImageData === "string" && hostedImageData.startsWith("data:")
      const candidateUrlRaw = hostedImageUrl ?? imageUrlInput
      const candidateUrl = typeof candidateUrlRaw === "string" ? candidateUrlRaw.trim() : ""
      const hasRemoteHttp = /^https?:\/\//i.test(candidateUrl)
      const isLocalHttp = hasRemoteHttp && /localhost|127\.0\.0\.1|^http:\/\/0\.0\.0\.0/i.test(candidateUrl)
      const effectiveImageUrl = hasRemoteHttp && !isLocalHttp ? candidateUrl : null

      if (!hasDataUrl && !effectiveImageUrl) {
        setError("Image must be a public URL or an uploaded file.")
        return
      }

      if (!hostedImageUrl && effectiveImageUrl) {
        setHostedImageUrl(effectiveImageUrl)
      }
      if (!selectedImage && effectiveImageUrl) {
        setSelectedImage(effectiveImageUrl)
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          imageUrl: effectiveImageUrl,
          imageData: hasDataUrl ? hostedImageData : null,
        }),
      })

      const payload = (await res.json().catch(() => null)) as GenerateResponse | null

      if (!res.ok || !payload) {
        const message = payload?.error || `Request failed: ${res.status}`
        throw new Error(message)
      }

      const imgs = Array.isArray(payload.images) ? payload.images : []

      if (imgs.length > 0) {
        setOutputs(imgs)
      } else {
        setError("No image returned from the API.")
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadImage = async (src: string, index: number) => {
    try {
      const filename = `nano-banana-output-${index + 1}.png`

      if (src.startsWith("data:")) {
        const link = document.createElement("a")
        link.href = src
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return
      }

      const response = await fetch(src)
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`)
      }
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(objectUrl)
    } catch (err: any) {
      setError(err?.message || "Download failed")
    }
  }

  return (
    <section id="editor" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Try The AI Editor</h2>
          <p className="text-muted-foreground text-balance leading-relaxed">
            Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
            commands.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 border-2 border-accent/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Prompt Engine
              </h3>
              <p className="text-sm text-muted-foreground">Transform your image with AI-powered editing</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload" className="text-sm font-medium mb-2 block">
                  Reference Image
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {selectedImage ? (
                      <img src={selectedImage || "/placeholder.svg"} alt="Uploaded" className="max-h-48 mx-auto rounded-lg" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Add Image</p>
                        <p className="text-xs text-muted-foreground mt-1">Max 50MB</p>
                      </>
                    )}
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <Label htmlFor="image-url" className="text-xs text-muted-foreground">Or paste an image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-url"
                      placeholder="https://example.com/your-image.jpg"
                      value={imageUrlInput}
                      onChange={(event) => setImageUrlInput(event.target.value)}
                    />
                    <Button type="button" variant="secondary" onClick={handleUseImageUrl}>
                      Use URL
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="prompt" className="text-sm font-medium mb-2 block">
                  Main Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" onClick={handleGenerate} disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? "Generating..." : "Generate Now"}
              </Button>
              {uploading ? <p className="text-xs text-muted-foreground mt-2">Uploading image...</p> : null}
              {error ? <p className="text-sm text-red-500 mt-2">{error}</p> : null}
            </div>
          </Card>

          <Card className="p-6 border-2 border-accent/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Output Gallery</h3>
              <p className="text-sm text-muted-foreground">Your ultra-fast AI creations appear here instantly</p>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-96 bg-muted/20 place-content-start">
              {outputs.length === 0 && !isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16">
                  <div className="text-6xl mb-4 opacity-20">???</div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Ready for Instant generation</p>
                  <p className="text-xs text-muted-foreground text-center">Enter your prompt and unleash the power</p>
                </div>
              ) : null}

              {outputs.map((src, index) => (
                <div
                  key={index}
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-background min-h-[16rem]"
                >
                  <img src={src || "/placeholder.svg"} alt={`Output ${index + 1}`} className="h-full w-full object-contain" />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-3 right-3 flex items-center gap-1"
                    onClick={() => handleDownloadImage(src, index)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}


