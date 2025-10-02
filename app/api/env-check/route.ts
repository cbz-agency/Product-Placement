import { NextResponse } from "next/server"

// This endpoint reports which env vars are present (boolean only), no secrets are returned.
export async function GET() {
  const checks = {
    GOOGLE_AI_STUDIO_API_KEY: Boolean(process.env.GOOGLE_AI_STUDIO_API_KEY),
    NANOBANANA_API_KEY: Boolean(process.env.NANOBANANA_API_KEY),
    NANOBANANA_MODEL_ID: Boolean(process.env.NANOBANANA_MODEL_ID),
    NANOBANANA_API_BASE: Boolean(process.env.NANOBANANA_API_BASE),
    // Placement providers (MVP pick one)
    OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
    REPLICATE_API_TOKEN: Boolean(process.env.REPLICATE_API_TOKEN),
  }

  return NextResponse.json({ defined: checks }, {
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
