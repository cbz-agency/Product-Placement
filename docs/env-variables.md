# Environment Variables (MVP)

Store real secrets in a local file (not committed), e.g. `.env.local`. This repo currently ignores all `.env*` files via `.gitignore`.

If you want a committed example file, I can add an exception to `.gitignore` and create `.env.example`.

## Nano Banana / Google AI Studio
- NANOBANANA_API_KEY=
- GOOGLE_AI_STUDIO_API_KEY=  # If Nano Banana requires Google AI Studio/Gemini key
- NANOBANANA_API_BASE=       # Optional base URL if non-default
- NANOBANANA_MODEL_ID=       # Optional model identifier

## Product Placement Provider (choose one)
Option A — OpenAI Images API
- OPENAI_API_KEY=

Option B — Replicate (Stable Diffusion / ControlNet / Inpainting)
- REPLICATE_API_TOKEN=

## Supabase (storage + optional DB)
- SUPABASE_URL=
- SUPABASE_ANON_KEY=
- SUPABASE_SERVICE_ROLE_KEY=   # server-only if needed
- SUPABASE_BUCKET=mockups

## App Config
- NEXT_PUBLIC_APP_URL=         # optional for local dev
# If accessing Supabase client-side, prefer public variants:
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=

---

## Suggested file usage
- Local development: `.env.local` (untracked)
- Production (Vercel): set via Project Settings → Environment Variables

---

## API route contract (planned)
`POST /api/generate`
Body JSON:
```json
{
  "image": "data:image/png;base64,...", 
  "config": {
    "gender": "",
    "age": "",
    "nationality": "",
    "action": "",
    "background": ""
  },
  "provider": "openai" | "replicate"
}
```
Response JSON:
```json
{
  "outputUrl": "https://.../mockups/123.png",
  "modelUrl": "https://.../model/abc.png"   
}
```
