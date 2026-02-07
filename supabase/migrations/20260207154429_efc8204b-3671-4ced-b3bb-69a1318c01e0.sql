-- Update payment_transactions gateway check to remove razorpay
ALTER TABLE public.payment_transactions DROP CONSTRAINT IF EXISTS payment_transactions_gateway_check;
ALTER TABLE public.payment_transactions ADD CONSTRAINT payment_transactions_gateway_check CHECK (gateway IN ('stripe', 'cod'));