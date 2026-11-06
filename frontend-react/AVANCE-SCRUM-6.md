# Avance SCRUM-6 — módulo de inventario

- **SCRUM-17**: catálogo de insumos y cantidades iniciales tomadas del SQL del equipo; permite registrar insumos adicionales.
- **SCRUM-18**: al guardar una venta local del producto exacto `Batido de frutilla`, valida existencias y descuenta ingredientes. Registra `detalle_insumos` en la venta del navegador.
- **SCRUM-19**: muestra `Bajo Stock` si `stock_actual <= stock_minimo`, y `Suficiente` si es mayor.

## Alcance y limitaciones

**Es una demostración local**, usando `localStorage`, no una implementación completa con PHP/MySQL. Cuando se use `VITE_API_URL`, el servidor PHP deberá realizar el descuento de inventario dentro de una transacción MySQL y devolver errores de stock insuficiente. Las cantidades de receta son **ejemplos provisionales**, no datos confirmados por el negocio: 1 unidad de pulpa, 0,2 litros de leche y 1 vaso por batido.

El SQL original almacena pulpa en `unidades` y leche en `litros`; estos valores se han respetado. La tabla `detalle_ventas` proporciona las columnas `venta_id`, `insumo_id` y `cantidad_usada` que el backend podrá usar posteriormente.

## Cómo probar

1. Descomprimir el ZIP y abrir una terminal en `formulario-ventas`.
2. Ejecutar `npm install` y `npm run dev`.
3. En el formulario, registrar 1 unidad del producto **Batido de frutilla**.
4. Verificar que bajen las existencias en el panel de inventario.
5. Repetir hasta llegar al stock mínimo para comprobar la alerta. Intentar vender más que el stock disponible: debe mostrar un error y no registrar la venta.

No cargar este ejemplo en producción ni asumir que `localStorage` garantiza transacciones atómicas ante varias pestañas o usuarios.
