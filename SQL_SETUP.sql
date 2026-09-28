-- Crear tabla de distribuidores
CREATE TABLE public.distributors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  distributor_id text NOT NULL UNIQUE,
  level integer NOT NULL DEFAULT 1,
  is_admin boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Crear tabla de campañas
CREATE TABLE public.campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  start_date timestamp NOT NULL,
  end_date timestamp NOT NULL,
  goal_points integer DEFAULT 90,
  status text DEFAULT 'active',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Crear tabla de envíos/evidencias
CREATE TABLE public.submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  distributor_id uuid REFERENCES public.distributors(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  status text DEFAULT 'pending', -- pending, approved, rejected
  level integer NOT NULL DEFAULT 1,
  points integer DEFAULT 0,
  notes text,
  created_at timestamp DEFAULT now(),
  approved_at timestamp,
  updated_at timestamp DEFAULT now()
);

-- Crear índices para mejorar performance
CREATE INDEX idx_submissions_distributor_id ON public.submissions(distributor_id);
CREATE INDEX idx_submissions_campaign_id ON public.submissions(campaign_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_distributors_auth_id ON public.distributors(auth_id);

-- Habilitar RLS
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para distributors
CREATE POLICY "Distribuidores pueden ver sus propios datos"
  ON public.distributors FOR SELECT
  USING (auth_id = auth.uid());

CREATE POLICY "Admin puede ver todos los distribuidores"
  ON public.distributors FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.distributors
    WHERE auth_id = auth.uid() AND is_admin = true
  ));

-- Políticas RLS para submissions
CREATE POLICY "Distribuidores pueden ver sus propias evidencias"
  ON public.submissions FOR SELECT
  USING (
    distributor_id IN (
      SELECT id FROM public.distributors WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Distribuidores pueden crear evidencias"
  ON public.submissions FOR INSERT
  WITH CHECK (
    distributor_id IN (
      SELECT id FROM public.distributors WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Admin puede ver todas las evidencias"
  ON public.submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.distributors
    WHERE auth_id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admin puede actualizar evidencias"
  ON public.submissions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.distributors
    WHERE auth_id = auth.uid() AND is_admin = true
  ));

-- Crear bucket para imágenes
-- (Se hace desde el dashboard de Supabase)
-- Name: submissions
-- Public: true

-- Insertar campaña predeterminada
INSERT INTO public.campaigns (name, start_date, end_date, goal_points)
VALUES (
  'Viaje Punta Cana 2027',
  '2026-09-28',
  '2026-12-21',
  90
);
