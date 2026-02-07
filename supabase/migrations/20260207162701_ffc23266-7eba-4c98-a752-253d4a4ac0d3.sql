-- Fix anonymous access policies on storage.objects
-- Update prescription policies to require authentication explicitly

DROP POLICY IF EXISTS "Users can view own prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own prescriptions" ON storage.objects;

-- Users can upload prescriptions only when authenticated
CREATE POLICY "Authenticated users can upload prescriptions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'prescriptions' AND
  auth.uid() IS NOT NULL
);

-- Users can view their own prescriptions only when authenticated  
CREATE POLICY "Authenticated users can view own prescriptions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'prescriptions' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Add UPDATE policy for doctors on appointments
CREATE POLICY "Doctors can update their appointments" 
ON public.appointments FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.doctors d 
    WHERE d.id = appointments.doctor_id AND d.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.doctors d 
    WHERE d.id = appointments.doctor_id AND d.user_id = auth.uid()
  )
);

-- Restrict admin_settings to authenticated users only (not public)
DROP POLICY IF EXISTS "Admin settings are publicly readable" ON public.admin_settings;

CREATE POLICY "Admin settings readable by authenticated users" 
ON public.admin_settings 
FOR SELECT 
TO authenticated
USING (true);