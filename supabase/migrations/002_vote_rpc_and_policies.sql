-- Fix voting: products had no UPDATE policy for anon; direct updates were blocked by RLS.
-- Use SECURITY DEFINER RPC so only vote counters can change.

CREATE POLICY "Anyone can delete votes" ON votes FOR DELETE USING (true);

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
    SET upvotes = GREATEST(0, upvotes + p_delta)
    WHERE id = p_product_id;
  ELSIF p_direction = 'down' THEN
    UPDATE public.products
    SET downvotes = GREATEST(0, downvotes + p_delta)
    WHERE id = p_product_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.adjust_product_vote_count(uuid, text, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.adjust_product_vote_count(uuid, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_product_vote_count(uuid, text, integer) TO service_role;
