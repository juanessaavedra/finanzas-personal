-- Seed file for development environment
-- This file is loaded when running: supabase db reset

-- ============================================================
-- TRUSTED USERS - Add your authorized email addresses here
-- ============================================================
-- IMPORTANT: Update these with your actual email addresses before deploying!

-- Example: Add trusted users
-- Replace these emails with real email addresses that should have access

INSERT INTO public.trusted_users (email, notes) VALUES
  ('admin@example.com', 'Administrator - Replace with real email'),
  ('user@example.com', 'Regular user - Replace with real email')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- DEVELOPMENT DATA (Optional - comment out for production)
-- ============================================================

-- Uncomment and modify if you want to seed development data
-- Note: You'll need to create the auth user first via Supabase Dashboard or API

/*
-- Example: Create a test user profile (assuming user already exists in auth.users)
-- First create user in Supabase Dashboard with email: admin@example.com
-- Then their profile will be auto-created by the handle_new_user trigger

-- Example: Add some categories for testing
-- Replace 'USER_UUID_HERE' with actual user UUID from auth.users
INSERT INTO public.categories (user_id, name, icon_name, color_hex, type) VALUES
  ('USER_UUID_HERE', 'Salario', 'attach_money', '#22C55E', 'income'),
  ('USER_UUID_HERE', 'Freelance', 'work', '#10B981', 'income'),
  ('USER_UUID_HERE', 'Comida', 'restaurant', '#EF4444', 'expense'),
  ('USER_UUID_HERE', 'Transporte', 'directions_car', '#F97316', 'expense'),
  ('USER_UUID_HERE', 'Vivienda', 'home', '#F59E0B', 'expense'),
  ('USER_UUID_HERE', 'Entretenimiento', 'sports_esports', '#8B5CF6', 'expense')
ON CONFLICT DO NOTHING;

-- Example: Add some transactions for testing
INSERT INTO public.transactions (user_id, category_id, type, amount, description, date) VALUES
  (
    'USER_UUID_HERE',
    (SELECT id FROM public.categories WHERE user_id = 'USER_UUID_HERE' AND name = 'Salario' LIMIT 1),
    'income',
    5000000.00,
    'Salario mensual',
    NOW() - INTERVAL '5 days'
  ),
  (
    'USER_UUID_HERE',
    (SELECT id FROM public.categories WHERE user_id = 'USER_UUID_HERE' AND name = 'Comida' LIMIT 1),
    'expense',
    250000.00,
    'Supermercado',
    NOW() - INTERVAL '2 days'
  )
ON CONFLICT DO NOTHING;
*/

-- ============================================================
-- HELPFUL QUERIES FOR MANAGING TRUSTED USERS
-- ============================================================

-- View all trusted users:
-- SELECT * FROM public.trusted_users ORDER BY added_at DESC;

-- Add a new trusted user:
-- SELECT public.add_trusted_user('newemail@example.com', 'New user added');

-- Remove (deactivate) a trusted user:
-- SELECT public.remove_trusted_user('email@example.com');

-- Reactivate a trusted user:
-- SELECT public.reactivate_trusted_user('email@example.com');

-- Check if an email is trusted:
-- SELECT public.is_trusted_user('email@example.com');
