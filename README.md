# Saadia Aantri — editorial prototype

React + TypeScript + Vite. French and Arabic pages at `/fr/home` and `/ar/home`. All forms and enrollment actions are demonstrations; they do not send data. Lesson completion is stored only in the current browser. Copy requires editorial approval before publication.

## Development

Install with `pnpm install`, then `pnpm dev`. Build with `pnpm build`. If the package manager requires build approval, approve only the installed esbuild dependency.

The original supplied portraits are preserved in `public`. Translations live in `src/content.ts`, with page-specific copy in `src/main.tsx`.

