-- Create atomic function to deduct coins safely
CREATE OR REPLACE FUNCTION public.deduct_coin_if_available(
  p_user_id UUID
)
RETURNS TABLE(
  success BOOLEAN,
  new_balance INTEGER,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_coins INTEGER;
  v_new_coins INTEGER;
BEGIN
  -- Lock the row and get current balance
  SELECT coins INTO v_current_coins
  FROM public.user_coins
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Check if user exists
  IF NOT FOUND THEN
    -- Create user with 10 coins if doesn't exist
    INSERT INTO public.user_coins (user_id, coins)
    VALUES (p_user_id, 10)
    RETURNING coins INTO v_current_coins;
  END IF;

  -- Check if enough coins
  IF v_current_coins < 1 THEN
    RETURN QUERY SELECT false, v_current_coins, 'Insufficient coins'::TEXT;
  END IF;

  -- Deduct 1 coin
  v_new_coins := v_current_coins - 1;

  UPDATE public.user_coins
  SET coins = v_new_coins
  WHERE user_id = p_user_id;

  RETURN QUERY SELECT true, v_new_coins, NULL::TEXT;
END;
$$;
