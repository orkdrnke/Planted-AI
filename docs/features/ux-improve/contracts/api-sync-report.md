# API sync report — ux-improve

> Contract: [openapi.yaml](./openapi.yaml). Interface kind: HTTP, one existing route. `data-model.md` is absent: legal fast-lane skip (no schema change, no datastore). Fields are derived from the existing code that defines the shapes (there is no database schema). `sad.md` `target_surfaces` is `[web-frontend]`, which normally only consumes a contract; this contract was written because the owner chose it (2026-10-17) to record the ADR-0001 change to a route that has no contract yet.

## A. Field origins

| schema_path | origin | confidence |
|---|---|---|
| generateCareTips.request.name | existing code — `app/api/ai-care-guide/route.ts` `CareGuideRequestSchema` (trim, min 1) | high |
| generateCareTips.request.type | existing code — same schema (optional string) | high |
| generateCareTips.request.dest | existing code — same schema (optional string) | high |
| CareTips.botanicalName, wateringFrequency, sunlightNeeds, soilType, temperatureRange, careTips | existing code — `schemas/careTipsSchema.ts` `CareTipsSchema` | high |
| CareTips.wateringShort, sunlightShort | ADR-0001 — not yet in `CareTipsSchema`; length limit unverified | medium |
| Error.error | existing code — `route.ts` JSON bodies for 400 / 502 / 500 | high |
| Error.issues | existing code — `route.ts` `input.error.flatten().fieldErrors` on invalid body | high |

## B. Drift checklist

1. **Endpoint ↔ data-model** — ✓ (existing-source fallback). The one operation reads and writes no stored entity; its response is the care-tips shape stored on `TPlant` (`types/plant.ts`) by the store.
2. **Error code ↔ repo error definition** — n/a, recorded: no error registry exists and the route returns `{ error }` strings, not codes. Nothing in the contract invents codes.
3. **Validation ↔ constraint** — ✓ with one open item: `name` min 1 matches the route. `maxLength: 40` on the two short fields is the ADR-0001 intent but the installed `openai` ^6.7.0 / model may not enforce it in structured output (SAD §11). Until verified, treat it as a prompt-level target plus a client-side check.
4. **OpenAPI ↔ sequence** *(supporting)* — ✓. SAD §6 Flow 2 and Flow 4 show success and "failure or invalid response", which the contract covers with 502 / 500 (and 400 for a request the client should never send). No flow draws the 400 branch; it is a defensive response, not a user-reachable path.

## Back-feed (coverage)

| Spec item | Operation or response |
|---|---|
| US-01 / AC-01, AC-02 (tips, pending or unavailable) | `generateCareTips` 200 and failure responses |
| US-03 / AC-06 (failure sentence and retry) | `generateCareTips` 502 / 500 (the UI shows one fixed sentence, never the `error` text) |
| AC-03, AC-04, AC-05, AC-07, AC-08, AC-09, AC-10, AC-11 | no operation: dashboard, status, removal and layout are client-side |
| `generateCareTips` | maps to US-01 and US-03; no orphan operation |

No sequence gap found.

## Accepted deviations from the api-skill defaults

Chosen by the owner on 2026-10-17 ("minimal openapi for one route, errors as they are in code"). None changes route behaviour.

| Default | In this contract | Reason |
|---|---|---|
| URL versioning `/api/v1/...` | `/api/ai-care-guide` | Existing path used by the store |
| Error envelope `{code, message, details?}` | `{ error, issues? }` | Existing behaviour, not changed in this feature |
| BearerAuth global | `security: []` | The route has no auth today (architecture-map tech-debt); arrives with roadmap steps 3 and 5 |
| `Idempotency-Key` on retriable writes | none | The route is stateless generation; the duplicate-request guard is in the store (known limit) |

These are reconciled when the route moves behind the backend (roadmap step 5, open decision D3).

## Open items

- Verify that the length limit on `wateringShort` / `sunlightShort` can be enforced (ADR-0001, SAD §11), then keep or relax `maxLength: 40`.
- `info.version` stays `0.1.0`; bump with a CHANGELOG line when the field change ships.
- `spectral lint contracts/openapi.yaml` is suggested; no linter is wired in this repo.
