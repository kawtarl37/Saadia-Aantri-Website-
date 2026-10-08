# Saadia Aantri — editorial prototype

React + TypeScript + Vite. French and Arabic pages at `/fr/home` and `/ar/home`. All forms and enrollment actions are demonstrations; they do not send data. Lesson completion is stored only in the current browser. Copy requires editorial approval before publication.

## Development

Install with `pnpm install`, then `pnpm dev`. Build with `pnpm build`. If the package manager requires build approval, approve only the installed esbuild dependency.

The original supplied portraits are preserved in `public`. Structured bilingual content lives in `src/catalog.ts` and `src/content.ts`. Programs, topics, courses, events, articles, and resources share these collections across conventional listings and artistic navigation. Content is maintained in source for this prototype; there is no publishing CMS yet.

## Creative interactions

The communication tree has six branch selectors and eighteen topic routes, with equivalent text links. Three.js, React Three Fiber, and Drei progressively enhance desktop apples; mobile, reduced-motion, WebGL failure, and artwork failure retain functional SVG/HTML navigation. The balance medallion explores mind, heart, soul, and body without collecting responses. Selected branches and dimensions are preserved across language switching through URL query parameters.

Personal coaching is described as an average of 6–8 one-to-one sessions. Professional training lasts three days; its example daily outline is explicitly illustrative. Prices, dates, formats, and locations remain unconfirmed. Resource records accept a file URL, but no downloads are exposed until a real resource is supplied. All prototype article copy requires Saadia's review.

The generated botanical illustration and final prompt are documented in [ARTWORK.md](ARTWORK.md).

## Browser verification

Start the development server, then run `pnpm exec playwright install chromium` once and `pnpm test`. To use an existing Chrome installation, set `PLAYWRIGHT_CHANNEL=chrome`. Set `TEST_ORIGIN` to test another local server.

The verification checks 98 French/Arabic routes at desktop, tablet, and mobile sizes plus key journeys, search, filters, form validation, progress persistence, RTL, reduced motion, missing artwork, WebGL fallback, and keyboard skip navigation. Screenshots are saved under ignored `.qa/`.

