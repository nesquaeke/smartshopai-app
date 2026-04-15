-- Optional: reset all product vote/engagement counters and clear vote rows.
-- Run once in Supabase SQL Editor if you want every listing to show 0° / 0 interactions from DB.
-- Safe to re-run.

UPDATE public.products
SET upvotes = 0, downvotes = 0, engagement = 0;

DELETE FROM public.votes;
