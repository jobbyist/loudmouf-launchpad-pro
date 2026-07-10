# Asset Migration Guide for Loudmouf

## Overview

This document explains the asset routing fix that has been implemented to resolve image loading issues when deploying via GitHub → Vercel. All static assets have been migrated from the Lovable-generated `.asset.json` pattern to standard `/public` directory absolute paths.

## Changes Made

### 1. **Vite Configuration Updated** (`vite.config.ts`)

Added explicit configuration for SSR asset resolution:
```typescript
publicDir: "public",
server: {
  fs: { allow: ["."] },
}
```

### 2. **Component Updates**

All components now use absolute public paths instead of importing `.asset.json` files:

- **Logo.tsx**: Changed from `logoAsset.url` → `/logo.png`
- **ProductModal.tsx**: Changed from `trueGrade.url` → `/images/true-grade.webp`
- **index.tsx**: Updated all hero and OG image paths to use public paths

### 3. **Asset Validator Component** (New)

Created `src/components/site/AssetValidator.tsx` - a debug component that validates all static assets are loading correctly. This component:
- Displays a "Test Assets" button in the bottom-right corner
- Validates all images and videos load properly
- Shows ✅ for successful loads, ❌ for failures
- Can be removed after confirming assets work in production

### 4. **Cleanup**

Removed all `.asset.json` files from `src/assets/`:
- loudmouf-logo.png.asset.json
- hero-poster.png.asset.json
- hero.mp4.asset.json
- story.png.asset.json
- ad-creative.png.asset.json
- true-grade.webp.asset.json
- blueberry-hero.png.asset.json
- bubblegum.png.asset.json
- cheesecake-hero.png.asset.json
- products-hero.png.asset.json
- fb-ad.png.asset.json

## 🚨 ACTION REQUIRED: Move Assets to Public Directory

You need to manually move/copy the actual image files into the `/public` directory structure:

### Required Directory Structure

```
public/
├── logo.png                    # Main Loudmouf logo
├── robots.txt                  # Already exists
└── images/
    ├── hero-poster.png         # Hero section poster image
    ├── hero.mp4                # Hero section video
    ├── story.png               # Brand story image
    ├── ad-creative.png         # OG social media image
    └── true-grade.webp         # Quality badge overlay
```

### How to Move Assets

**Option 1: From Lovable Asset URLs**

If you have access to the Lovable platform, download the assets from the URLs in the old `.asset.json` files and place them in the public directory.

**Option 2: From Local Files**

If you have the original asset files locally, copy them to the appropriate locations in `/public`.

**Option 3: Download from Production**

If the site is currently running on Lovable, you can download the assets from the live URLs (check the old asset.json files for URLs like `/__l5e/assets-v1/...`).

### Asset Checklist

Before deploying, ensure these files exist:

- [ ] `/public/logo.png` - Loudmouf logo (used in header, footer, etc.)
- [ ] `/public/images/hero-poster.png` - Hero video poster frame
- [ ] `/public/images/hero.mp4` - Hero section video
- [ ] `/public/images/story.png` - Brand story section image
- [ ] `/public/images/ad-creative.png` - Social media OG image
- [ ] `/public/images/true-grade.webp` - Quality badge overlay (appears on product modals)

## Testing the Changes

### Local Development

1. Ensure all assets are in `/public` as described above
2. Run `npm run dev` or `bun run dev`
3. Visit http://localhost:3000
4. Click the "Test Assets" button in the bottom-right corner
5. Verify all assets show ✅ green checkmarks

### Production Testing

1. Deploy to Vercel via GitHub
2. Visit the preview URL
3. Click "Test Assets" button
4. All assets should load with green checkmarks
5. Verify images display correctly throughout the site:
   - Logo in header
   - Hero video/poster
   - Product images (from Shopify - should work automatically)
   - Brand story image
   - True Grade badge on product modals

## Path Reference

| Asset | Old Path (Lovable) | New Path (Public) |
|-------|-------------------|-------------------|
| Logo | `logoAsset.url` | `/logo.png` |
| Hero Poster | `heroPoster.url` | `/images/hero-poster.png` |
| Hero Video | `heroVideo.url` | `/images/hero.mp4` |
| Story Image | `storyImg.url` | `/images/story.png` |
| Ad Creative | `adCreative.url` | `/images/ad-creative.png` |
| True Grade | `trueGrade.url` | `/images/true-grade.webp` |

## Removing the Asset Validator

Once you've confirmed all assets are loading correctly in production:

1. Open `src/routes/index.tsx`
2. Remove the import: `import { AssetValidator } from "@/components/site/AssetValidator";`
3. Remove the component: `<AssetValidator />`
4. Delete the file: `src/components/site/AssetValidator.tsx`

## Troubleshooting

**Images not loading?**
- Check browser console for 404 errors
- Verify files are in correct `/public` locations
- Ensure filenames match exactly (case-sensitive on Linux/Vercel)
- Clear browser cache and hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

**Asset Validator shows red X marks?**
- Double-check file paths in `/public` directory
- Verify file extensions match (`.png`, `.webp`, `.mp4`)
- Check Vercel build logs for any asset-related errors

## Why This Change?

The previous implementation used Lovable's proprietary `.asset.json` files and special `/__l5e/` asset URLs that only work in the Lovable platform environment. When deployed to Vercel via GitHub:

1. These special URLs don't exist
2. The `.asset.json` files don't provide actual assets
3. Vite/TanStack Start SSR needs assets in `/public` for proper resolution

By moving to standard `/public` directory assets with absolute paths, the application works consistently across all environments (local dev, Lovable, Vercel, etc.).

## Additional Notes

- Product images come from Shopify API and don't need migration
- Background gradients are CSS-based and work fine
- Icons from `lucide-react` are SVG components (no changes needed)
- Ensure all assets are optimized for web before uploading (compressed, appropriate dimensions)

---

**Last Updated**: Applied in PR fixing asset routing for GitHub → Vercel deployments
