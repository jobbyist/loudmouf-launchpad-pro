# LOUDMOUF™ Newsroom Implementation

## Overview

This implementation adds a comprehensive newsroom section to the LOUDMOUF™ website, featuring cannabis culture & lifestyle content with automated scraping, social features, and SEO optimization.

## Features Implemented

### 1. Data Retention (POPIA Compliance)
- Updated Privacy Policy with 6-month inactivity data retention clause
- Automatic deletion notification system
- Account reactivation option

### 2. Newsroom Components

#### Homepage Newsroom Slider (`src/components/site/Newsroom.tsx`)
- Instagram Reels-style carousel with auto-rotation every 5 seconds
- Displays article cards with thumbnails, excerpts, reading time
- Shows persistent like and comment counts
- Pause on hover functionality
- Navigation arrows and slide indicators

#### Individual Article Pages (`src/routes/newsroom/$articleId.tsx`)
- Full article summary (1000-1500 words)
- Like button (authenticated users only, persistent)
- Bookmark button (authenticated users only)
- "Listen to this article" button (placeholder for text-to-speech)
- Link to original source
- Google Schema markup for SEO
- Thumbnail images with consistent brand design

#### Article Comments (`src/components/site/ArticleComments.tsx`)
- Production-ready comment section with Disqus-style UI
- Restricted to authenticated users (LOUDMOUF™ members only)
- Comment moderation system
- Community guidelines modal
- Persistent storage via Supabase

### 3. Database Schema

Created tables with Row Level Security:
- `articles` - Article content and metadata
- `article_likes` - User likes (authenticated users only)
- `article_bookmarks` - User bookmarks (authenticated users only)
- `article_comments` - User comments with moderation flags

### 4. Automated Content Scraping

#### Firecrawl Integration (`supabase/functions/scrape-articles/index.ts`)
- Scrapes 1-2 articles daily at 4:20 AM SAST
- Sources include:
  - Cannabis Culture
  - High Times
  - Leafly
  - MG Magazine
  - South African sources (25% of content): Dagga Magazine, Cannabis SA
- Generates article summaries (1000-1500 words)
- Calculates reading time
- Creates unique slugs
- Prevents duplicate articles

### 5. Brand Design System

#### Thumbnail Generator (`src/lib/articleThumbnails.ts`)
- Consistent thumbnail design using LOUDMOUF™ brand colors:
  - Yellow: #FFE047
  - Pink: #FF6B9D
  - Purple: #8B5CF6
  - Teal: #2DD4BF
- Gradient backgrounds based on article title hash
- Fallback to UI Avatars placeholder with brand colors

### 6. SEO Optimization

#### Schema Markup (`src/lib/schemaMarkup.ts`)
- Automatic Google Schema injection for all articles
- Article schema with:
  - Headline, description
  - Published/modified dates
  - Author and publisher information
  - Main entity of page
- Open Graph meta tags for social sharing

### 7. Additional Features

#### Community Guidelines Modal (`src/components/site/CommunityGuidelines.tsx`)
- Dismissible popup with standard community rules
- Accessible from comment section
- Covers respect, on-topic discussion, spam prevention, moderation policies

## Setup Instructions

### 1. Database Migration
```bash
# Run the migration to create tables
supabase migration up
```

### 2. Environment Variables
Add to your `.env` file:
```
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

### 3. Deploy Edge Function
```bash
supabase functions deploy scrape-articles
```

### 4. Schedule Cron Job
Run this SQL in Supabase Dashboard > SQL Editor:
```sql
SELECT cron.schedule(
  'scrape-articles-daily',
  '20 2 * * *', -- 4:20 AM SAST
  $$
  SELECT net.http_post(url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/scrape-articles', headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb) AS request_id;
  $$
);
```

## Navigation
- Homepage: Newsroom slider between "Community" and "FAQ" sections
- `/newsroom` - All articles archive
- `/newsroom/[slug]` - Individual article page
