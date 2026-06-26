import type { Brand } from '@nexgenomics/core/brand'

/*
  brand.ts — THE BRAND SURFACE. The one file a partner edits to re-skin this
  template. Change the values here, swap public/brand/* assets, and recolor
  src/brand/tokens.css. Nothing brand-specific lives anywhere else — that is the
  property that makes a clone a clean re-brand rather than a fork.
*/
export const brand: Brand = {
  name: 'Hello AI',
  // Two-tone wordmark; segment texts concatenate to `name`. Flip the tones to
  // move the accent to the other half.
  wordmark: [
    { text: 'Nex', tone: 'fg' },
    { text: 'Genomics', tone: 'accent' },
  ],
  markSrc: '/brand/mark.png',
  themeColor: '#0f1115',
}
