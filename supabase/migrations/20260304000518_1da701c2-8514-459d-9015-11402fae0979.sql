
CREATE TABLE public.project_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  land_location JSONB,
  land_area NUMERIC,
  shape TEXT DEFAULT 'rectangle',
  max_floors INTEGER DEFAULT 10,
  restrictions TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'processing',
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own plans" ON public.project_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own plans" ON public.project_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own plans" ON public.project_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own plans" ON public.project_plans FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_project_plans_updated_at BEFORE UPDATE ON public.project_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
