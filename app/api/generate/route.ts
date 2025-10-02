import { NextResponse } from "next/server"
import OpenAI from "openai"

// Simple OpenAI-based image generation for MVP.
// It currently ignores the uploaded product image and generates a model
// holding a generic product based on the provided config.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { image: _imageDataUrl, config, productImage, modelImage, prompt: userPrompt } = body || {}

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

    let prompt = parts.join(" ")
    if (userPrompt && typeof userPrompt === 'string' && userPrompt.trim().length > 0) {
      prompt += `. ${userPrompt.trim()}`
    }

    // Allow overriding organization/project if needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      organization: process.env.OPENAI_ORG,
      project: process.env.OPENAI_PROJECT,
    })

    // Optional mock mode to avoid paid calls until verification is done
    if (process.env.MOCK_GENERATION === '1') {
      return NextResponse.json({ image: "/placeholder.jpg", provider: "mock" })
    }

    // Generate an image. If response_format is omitted, OpenAI returns a URL.
    // We'll support both URL and base64 response shapes.
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt || "Photo of a model holding a product, studio lighting",
      size: "1024x1024",
    })

    const item = result.data?.[0]
    let image: string | null = null

    if (item?.b64_json) {
      image = `data:image/png;base64,${item.b64_json}`
    } else if ((item as any)?.url) {
      image = (item as any).url as string
    }

    if (!image) {
      return NextResponse.json({ error: "No image returned from OpenAI" }, { status: 502 })
    }

    return NextResponse.json({ image, provider: "openai" })
  } catch (err: any) {
    // Improve diagnostics during local dev without leaking secrets
    const message = err?.message || "Unknown error"
    const status = err?.status || 500
    console.error("/api/generate error", message, err?.response?.data || "")
    return NextResponse.json({ error: message }, { status })
  }
}
