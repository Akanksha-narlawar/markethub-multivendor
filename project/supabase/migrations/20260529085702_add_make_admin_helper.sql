/*
  # Admin Role Bootstrap Helper

  Adds a helper function to promote any user to admin by email.
  Useful for setting up the first admin account.

  Usage (run in SQL editor):
    SELECT make_admin('your@email.com');
*/

CREATE OR REPLACE FUNCTION make_admin(user_email text)
RETURNS text AS $$
DECLARE
  target_id uuid;
BEGIN
  SELECT id INTO target_id FROM profiles WHERE email = user_email;
  IF target_id IS NULL THEN
    RETURN 'User not found: ' || user_email;
  END IF;
  UPDATE profiles SET role = 'admin', is_approved = true WHERE id = target_id;
  RETURN 'User ' || user_email || ' promoted to admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
