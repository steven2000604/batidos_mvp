# Batidos MVP · Frontend (React)

Interfaz del sistema de ventas de batidos. Incluye el **formulario de Registro de
Ventas** (tarea SCRUM-5): Fecha, Producto, Cantidad y Total Cobrado, con botón
**Guardar Venta**.

## Requisitos

- Node.js LTS
- npm

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Compilar para producción

```bash
npm run build
```

El resultado queda en `dist/`.

## Conexión con el backend PHP/MySQL

Por defecto trabaja en **modo local**: las ventas se guardan en `localStorage`
para probar la pantalla sin servidor.

Para conectar la API, crea un `.env` en esta carpeta:

```env
VITE_API_URL=http://localhost/batidos_mvp/backend-php
```

Con esa variable definida, el servicio usa:

- `GET  {VITE_API_URL}/ventas.php` → listado de ventas
- `POST {VITE_API_URL}/ventas.php` → registrar una venta

El `POST` envía los campos de la tabla `ventas` del esquema `batidos_mvp.sql`:

```json
{
  "id": "uuid",
  "fecha": "2026-11-06",
  "producto": "Batido de frutilla",
  "cantidad": 2,
  "total": 8.5,
  "registradaEn": "2026-11-06T15:04:05.000Z"
}
```

> Nota: el `id` y `registradaEn` los genera el frontend para el modo local; el
> backend debe ignorarlos y usar el `AUTO_INCREMENT` de la tabla.

## Estructura

```
frontend-react/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── components/
    │   ├── FormularioVenta.jsx   # Formulario, validación e historial
    │   └── FormularioVenta.css
    ├── services/
    │   └── ventas.js             # Registro/listado (API o localStorage)
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

## Validaciones

| Campo | Regla |
|---|---|
| Fecha | Obligatoria |
| Producto | Obligatorio, mínimo 2 caracteres |
| Cantidad | Entero mayor a 0 |
| Total cobrado | Número mayor o igual a 0 |

## Rama de trabajo

```bash
git checkout -b feature/SCRUM-5-ventas
```
