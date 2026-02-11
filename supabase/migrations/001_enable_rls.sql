-- supabase/migrations/001_enable_rls.sql

-- ============================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREAR FUNCIÓN HELPER PARA ADMINS
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
RETURN EXISTS (
SELECT 1
FROM public.admins
WHERE id = auth.uid()
);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
user_role text;
BEGIN
SELECT role INTO user_role
FROM public.admins
WHERE id = auth.uid();

    IF user_role IS NOT NULL THEN
        RETURN user_role;
    END IF;

    IF auth.uid() IS NOT NULL THEN
        RETURN 'customer';
    END IF;

    RETURN 'anonymous';
END;
$$;
