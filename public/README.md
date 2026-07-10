# Public Assets Directory

This directory contains all static assets served directly by the web server.

## Required Assets

Place the following files in this directory structure:

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

## Asset Guidelines

- Use lowercase filenames for Linux compatibility
- Optimize images before uploading (compress, appropriate dimensions)
- PNG for logos and graphics with transparency
- JPG for photos
- WebP for modern optimized images
- Keep video files under 10MB when possible

See `ASSET_MIGRATION_README.md` in the root for complete migration instructions.
