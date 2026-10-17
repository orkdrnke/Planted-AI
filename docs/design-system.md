---
tool: code
figma_file: ""
pen_file: ""
platform_posture: responsive-both
token_source: app/globals.css
---

# Design system — planted-ai

> The design canon read by `ux-flows` (posture), `screens` (tool + inventory), `implement` and
> `review`. The code-side inventory lives in `docs/architecture-map.md` §Frontend / UI foundation;
> this file cites it and adds the design-side canon.

## Tool

`code` — no Figma or Pencil MCP was available when this canon was set. Screens are drawn as
inline markdown wireframes in `docs/features/{slug}/screens.md`. To switch tools later, re-run
`/sdd:design-system` and choose update.

## Platform posture

**Responsive-both.** Mobile and desktop are equally important. Every screen is specified at a
narrow (phone) and a wide (desktop) layout using Tailwind responsive utilities.

## Tokens

Source: `app/globals.css`.

| Group | Anchor |
|---|---|
| Token → Tailwind color/radius mapping (`@theme inline`) | `app/globals.css:6` |
| Light palette (oklch CSS variables, `--radius: 0.625rem`) | `app/globals.css:46` |
| Dark palette (`.dark`) | `app/globals.css:81` |
| Fonts: Geist Sans / Geist Mono (`--font-geist-sans`, `--font-geist-mono`) | `app/layout.tsx:6` |
| shadcn config: style `new-york`, base color `stone`, lucide icons | `components.json` |

Rules: use semantic tokens (`bg-background`, `text-muted-foreground`, `border`, `bg-destructive`),
never raw hex or palette colors. Compose class names with `cn()` (`lib/utils.ts`).

## Component inventory

Reuse first. A screen composes these before any new component is proposed.

| Component | Variants / parts | Source |
|---|---|---|
| Button | `default`, `destructive`, `outline`, `secondary`, ghost/link via `buttonVariants` | `components/ui/button.tsx:38` |
| Card | Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter | `components/ui/card.tsx:5` |
| Dialog | Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription | `components/ui/dialog.tsx:9` |
| Form | Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage (react-hook-form) | `components/ui/form.tsx:19` |
| Input | text input | `components/ui/input.tsx:5` |
| Label | field label | `components/ui/label.tsx:8` |
| Select | Select, SelectTrigger, SelectContent, SelectItem, SelectValue | `components/ui/select.tsx:9` |
| Sheet | side panel: Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle | `components/ui/sheet.tsx:9` |
| Table | Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption | `components/ui/table.tsx:7` |
| NavigationMenu | menu primitives | `components/ui/navigation-menu.tsx:8` |
| Header | app header | `components/header.tsx:5` |
| HeaderMenu | header navigation | `components/headerMenu.tsx:7` |

Not in the inventory yet (needed for the current UX work, so they would be new components):
Badge, Skeleton, Alert/inline error, Toast, Tooltip. `implement` registers them here when added.

## Cross-screen conventions

- **Screen precedents:** form → `app/addPlant/page.tsx`; detail → `app/myGarden/[id]/page.tsx`
  (Card sections + lucide icons); table → `app/myGarden/page.tsx`.
- **States:** every screen specifies default, loading, empty, error, success, and validation
  where relevant. Async AI states are `generating` / `ready` / `error`.
- **Icons:** `lucide-react` only.
- **Dark mode:** supported by the `.dark` palette; screens use tokens so both themes work.
- **Copy:** UI text in English.
