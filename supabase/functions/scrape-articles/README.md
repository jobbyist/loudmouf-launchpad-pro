# Supabase Edge Functions Configuration
# Deploy with: supabase functions deploy scrape-articles

# Set up cron job for daily scraping at 4:20 AM SAST
# In Supabase Dashboard > Database > Extensions > pg_cron

# SQL to schedule the job:
# SELECT cron.schedule(
#   'scrape-articles-daily',
#   '20 2 * * *', -- 4:20 AM SAST = 2:20 AM UTC (SAST is UTC+2)
#   $$
#   SELECT net.http_post(url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/scrape-articles', headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb) AS request_id;
#   $$
# );
