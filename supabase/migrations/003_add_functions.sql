-- supabase/migrations/003_add_functions.sql

-- ============================================
-- FUNCIÓN: ACTUALIZAR STOCK DESPUÉS DE PAGO
-- ============================================

CREATE OR REPLACE FUNCTION public.update_stock_after_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
-- Solo cuando el pago es aprobado
IF NEW.payment_status = 'approved' AND
(OLD.payment_status IS NULL OR OLD.payment_status != 'approved') THEN

        -- Actualizar stock de productos
        UPDATE products p
        SET stock = GREATEST(0, p.stock - oi.quantity)
        FROM order_items oi
        WHERE oi.order_id = NEW.id
        AND oi.product_id = p.id
        AND p.track_inventory = true;

        -- Actualizar stock de variantes si existen
        UPDATE product_variants pv
        SET stock = GREATEST(0, pv.stock - oi.quantity)
        FROM order_items oi
        WHERE oi.order_id = NEW.id
        AND oi.variant_id = pv.id;

    END IF;

    RETURN NEW;
END;
$$;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_update_stock ON orders;
CREATE TRIGGER trigger_update_stock
    AFTER UPDATE OF payment_status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_stock_after_payment();

-- ============================================
-- FUNCIÓN: ESTADÍSTICAS DEL DASHBOARD
-- ============================================

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
stats json;
BEGIN
-- Verificar que es admin
IF NOT is_admin() THEN
RAISE EXCEPTION 'Unauthorized';
END IF;

    SELECT json_build_object(
        'total_products', (SELECT COUNT(*) FROM products WHERE is_active = true),
        'total_orders', (SELECT COUNT(*) FROM orders),
        'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
        'total_revenue', (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'approved'),
        'low_stock_products', (SELECT COUNT(*) FROM products WHERE stock < 5 AND track_inventory = true),
        'recent_orders', (
            SELECT json_agg(row_to_json(o))
            FROM (
                SELECT id, order_number, customer_name, total, status, created_at
                FROM orders
                ORDER BY created_at DESC
                LIMIT 5
            ) o
        )
    ) INTO stats;

    RETURN stats;
END;
$$;

-- ============================================
-- FUNCIÓN: BUSCAR PRODUCTOS
-- ============================================

CREATE OR REPLACE FUNCTION public.search_products(
    search_query text DEFAULT NULL,
    category_slug text DEFAULT NULL,
    brand_filter text DEFAULT NULL,
    min_price numeric DEFAULT NULL,
    max_price numeric DEFAULT NULL,
    sort_by text DEFAULT 'created_at',
    sort_order text DEFAULT 'desc'
)
RETURNS SETOF products
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
RETURN QUERY
SELECT p.*
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE
p.is_active = true
AND (search_query IS NULL OR
p.name ILIKE '%' || search_query || '%' OR
p.description ILIKE '%' || search_query || '%')
AND (category_slug IS NULL OR c.slug = category_slug)
AND (brand_filter IS NULL OR p.brand = brand_filter)
AND (min_price IS NULL OR p.price >= min_price)
AND (max_price IS NULL OR p.price <= max_price)
ORDER BY
CASE
WHEN sort_by = 'price' AND sort_order = 'asc' THEN p.price
WHEN sort_by = 'price' AND sort_order = 'desc' THEN -p.price
WHEN sort_by = 'name' AND sort_order = 'asc' THEN p.name
WHEN sort_by = 'created_at' AND sort_order = 'desc' THEN -EXTRACT(EPOCH FROM p.created_at)
ELSE -EXTRACT(EPOCH FROM p.created_at)
END;
END;
$$;
