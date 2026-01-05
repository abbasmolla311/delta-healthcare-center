-- Create storage bucket for prescriptions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for prescription uploads
CREATE POLICY "Users can upload prescriptions" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for viewing prescriptions
CREATE POLICY "Users can view own prescriptions" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);