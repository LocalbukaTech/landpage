# Fonts Directory

## Adding the Hakuna Font

To use the actual Hakuna font for the LocalBuka logo:

1. Obtain the Hakuna font file (`.woff2` or `.woff` format is recommended)
2. Place the font file in this directory (e.g., `Hakuna.woff2`)
3. Update `/app/layout.tsx` to use the local font:

```typescript
import localFont from 'next/font/local';

const displayFont = localFont({
  src: './fonts/Hakuna.woff2',
  variable: '--font-display',
  fallback: ['Satisfy', 'cursive', 'sans-serif'],
});
```

Currently using **Satisfy** from Google Fonts as a temporary placeholder for the Hakuna font.
