import { NextResponse } from "next/server"
import OpenAI from "openai"

// Simple OpenAI-based image generation for MVP.
// It currently ignores the uploaded product image and generates a model
// holding a generic product based on the provided config.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { image: _imageDataUrl, config } = body || {}

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 500 })
    }

    // Build a descriptive prompt from config
    const gender = (config?.gender || '').trim()
    const age = (config?.age || '').trim()
    const nationality = (config?.nationality || '').trim()
    const action = (config?.action || '').trim()
    const background = (config?.background || '').trim()

    const parts: string[] = [
      "A high-quality, photo-realistic portrait of",
      gender && gender,
      age && age,
      nationality && nationality,
      "model",
      action && `(${action})`,
      "holding a product with hands clearly visible",
      background && `in a ${background} setting`,
      "studio lighting, shallow depth of field, detailed skin texture, 4k, crisp focus"
    ].filter(Boolean)

    const prompt = parts.join(" ")

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt || "Photo of a model holding a product, studio lighting",
      size: "1024x1024",
      response_format: "b64_json",
    })

    const b64 = result.data?.[0]?.b64_json
    if (!b64) {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 502 })
    }

    const dataUrl = `data:image/png;base64,${b64}`

    return NextResponse.json({ image: dataUrl, provider: "openai" })
  } catch (err: any) {
    console.error("/api/generate error", err)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
