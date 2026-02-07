-- Fix prescription storage security - make bucket private and add RLS
UPDATE storage.buckets SET public = false WHERE id = 'prescriptions';

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can upload own prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all prescriptions" ON storage.objects;

-- Users can upload prescriptions to their own folder
CREATE POLICY "Users can upload own prescriptions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'prescriptions' AND
  auth.uid() IS NOT NULL
);

-- Users can view their own prescriptions
CREATE POLICY "Users can view own prescriptions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'prescriptions' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view all prescriptions
CREATE POLICY "Admins can view all prescriptions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'prescriptions' AND
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Add explicit deny for anonymous users on sensitive tables
-- Update profiles RLS to be more explicit
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- Update appointments RLS to deny anonymous access
DROP POLICY IF EXISTS "Deny anonymous access to appointments" ON public.appointments;
CREATE POLICY "Deny anonymous access to appointments"
ON public.appointments
FOR ALL
TO anon
USING (false);