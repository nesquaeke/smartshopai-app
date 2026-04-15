-- Fix voting: anon cannot UPDATE products (RLS). Use SECURITY DEFINER RPC for counters only.
-- Votes: allow DELETE so users can remove / toggle votes (001 had INSERT/UPDATE but no DELETE).
--
-- Supabase Dashboard → SQL Editor → New query → paste this file → Run.
-- Safe to re-run (idempotent).

DROP POLICY IF EXISTS "Anyone can delete votes" ON public.votes;
CREATE POLICY "Anyone can delete votes" ON public.votes FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.adjust_product_vote_count(
  p_product_id uuid,
  p_direction text,
  p_delta integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_direction = 'up' THEN
    UPDATE public.products
    SET upvotes = GREATEST(0, COALESCE(upvotes, 0) + p_delta)
    WHERE id = p_product_id;
  ELSIF p_direction = 'down' THEN
    UPDATE public.products
    SET downvotes = GREATEST(0, COALESCE(downvotes, 0) + p_delta)
    WHERE id = p_product_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.adjust_product_vote_count(uuid, text, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.adjust_product_vote_count(uuid, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_product_vote_count(uuid, text, integer) TO service_role;
