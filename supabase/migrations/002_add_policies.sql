-- supabase/migrations/002_add_policies.sql

-- ============================================
-- POLÍTICAS PARA PRODUCTOS
-- ============================================

-- Lectura pública para productos activos
CREATE POLICY "Productos activos son públicos"
ON products FOR SELECT
USING (is_active = true);

-- Admins pueden todo
CREATE POLICY "Admins manejan productos"
ON products FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS PARA CATEGORÍAS
-- ============================================

CREATE POLICY "Categorías activas son públicas"
ON categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins manejan categorías"
ON categories FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS PARA ÓRDENES
-- ============================================

-- Clientes ven sus propias órdenes
CREATE POLICY "Clientes ven sus órdenes"
ON orders FOR SELECT
USING (
    auth.uid() = customer_id
    OR is_admin()
);

-- Solo el sistema puede crear órdenes (via service role)
CREATE POLICY "Sistema crea órdenes"
ON orders FOR INSERT
WITH CHECK (auth.role() = 'service_role' OR is_admin());

-- Admins pueden actualizar órdenes
CREATE POLICY "Admins actualizan órdenes"
ON orders FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS PARA ORDER ITEMS
-- ============================================

CREATE POLICY "Ver items de órdenes propias"
ON order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND (orders.customer_id = auth.uid() OR is_admin())
    )
);

-- ============================================
-- POLÍTICAS PARA CLIENTES
-- ============================================

CREATE POLICY "Clientes ven su propio perfil"
ON customers FOR SELECT
USING (auth.uid() = id OR is_admin());

CREATE POLICY "Clientes actualizan su perfil"
ON customers FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- POLÍTICAS PARA CONFIGURACIÓN
-- ============================================

CREATE POLICY "Configuración pública para lectura"
ON store_settings FOR SELECT
USING (true);

CREATE POLICY "Solo admins modifican configuración"
ON store_settings FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS PARA VARIANTES
-- ============================================

CREATE POLICY "Variantes de productos públicos"
ON product_variants FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM products
        WHERE products.id = product_variants.product_id
        AND products.is_active = true
    )
);

CREATE POLICY "Admins manejan variantes"
ON product_variants FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
