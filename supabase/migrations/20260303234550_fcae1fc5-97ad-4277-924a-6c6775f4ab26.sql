
-- Opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  investment_type TEXT NOT NULL DEFAULT 'buy' CHECK (investment_type IN ('buy', 'develop', 'flip', 'rent')),
  property_type TEXT NOT NULL DEFAULT 'residential',
  location JSONB NOT NULL DEFAULT '{}',
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Iraq',
  entry_price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  estimated_dev_cost NUMERIC DEFAULT 0,
  expected_revenue NUMERIC DEFAULT 0,
  land_area NUMERIC DEFAULT 0,
  built_area NUMERIC DEFAULT 0,
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  floors INT DEFAULT 1,
  year_built INT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'under_review', 'closed', 'archived')),
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  investment_score INT DEFAULT 0,
  ai_analysis JSONB,
  legal_status TEXT,
  permit_status TEXT,
  zoning TEXT,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  timeline_months INT DEFAULT 12,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own opportunities" ON public.opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own opportunities" ON public.opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own opportunities" ON public.opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own opportunities" ON public.opportunities FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Development phases for tracking
CREATE TABLE public.development_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phase_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  start_date DATE,
  end_date DATE,
  actual_start DATE,
  actual_end DATE,
  budget NUMERIC DEFAULT 0,
  actual_cost NUMERIC DEFAULT 0,
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  notes TEXT,
  color TEXT DEFAULT '#0ea5e9',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.development_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own phases" ON public.development_phases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own phases" ON public.development_phases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own phases" ON public.development_phases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own phases" ON public.development_phases FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_phases_updated_at BEFORE UPDATE ON public.development_phases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Opportunity documents
CREATE TABLE public.opportunity_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT,
  doc_type TEXT DEFAULT 'other' CHECK (doc_type IN ('permit', 'contract', 'title', 'approval', 'plan', 'report', 'other')),
  extracted_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunity_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" ON public.opportunity_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own documents" ON public.opportunity_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.opportunity_documents FOR DELETE USING (auth.uid() = user_id);
