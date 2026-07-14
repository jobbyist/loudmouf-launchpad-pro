
CREATE TABLE public.member_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  typed_signature TEXT NOT NULL,
  agreement_version TEXT NOT NULL,
  signature_hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  acceptance_statements JSONB NOT NULL DEFAULT '[]'::jsonb,
  accepted_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.member_signatures TO service_role;

ALTER TABLE public.member_signatures ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated — writes and reads only via service_role
-- (server route uses supabaseAdmin). Signatures are legally sensitive records.
CREATE INDEX member_signatures_accepted_at_idx ON public.member_signatures (accepted_at DESC);
CREATE INDEX member_signatures_hash_idx ON public.member_signatures (signature_hash);
