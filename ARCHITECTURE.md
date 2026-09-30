# Civics Plus Architecture

Civics Plus is a React/Vite civic-intelligence prototype. The active application lives at the repository root; legacy Python/Streamlit and duplicate JanSetu artifacts are not part of the current runtime.

## Runtime flow

```text
User -> React UI -> CivicMapDashboard / citizen intake / evidence -> Ask Civics Plus -> src/lib/gemini.ts -> Gemini 2.5 Flash (when configured) or local civic fallback -> civic guidance -> React UI
```

## Main layers

- **Presentation:** `src/main.tsx`, `src/App.tsx`, `src/components/CivicMapDashboard.tsx`, and `src/index.css`.
- **AI:** `src/lib/gemini.ts` wraps `@google/genai` and calls `gemini-2.5-flash` when `VITE_GEMINI_API_KEY` is available. It falls back to deterministic local civic guidance if Gemini is unavailable.
- **Civic insight:** the current prototype presents seeded civic signals, hotspot summaries, recommendations, evidence filtering, citizen intake, and a human-review status flow. These are prototype behaviors, not a live municipal database.
- **Deployment:** standard Vite static build with `npm run build` producing `dist/`; `netlify.toml` provides minimal Netlify configuration. No Cloud Run, Firebase, or separate production API server is required by the current root build.

## AI and data limitations

- `VITE_GEMINI_API_KEY` is exposed to client-side code, so this is prototype/demo configuration rather than a protected production secret.
- Dashboard records are seeded/demo data, not a verified live government feed.
- AI responses may be incomplete or incorrect and should not be treated as official government decisions.
- Consequential civic actions should remain subject to authorized human review.

## Future production architecture

Move Gemini access behind a server-side API, add authenticated verified data ingestion, persistent audit logs, observability/rate limiting, and keep human authorization for consequential actions.
