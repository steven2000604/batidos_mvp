# Formulario de Registro de Ventas

Interfaz React para el alta de nuevos pedidos del módulo de Ventas (SCRUM-5).

Campos: **Fecha**, **Producto**, **Cantidad** y **Total Cobrado**. El botón
**Guardar Venta** valida los datos y registra la transacción en el sistema.

## Requisitos

- Node.js LTS (probado con v24)
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

## Conexión con el backend (PHP/MySQL)

Por defecto el formulario funciona en **modo local**: las ventas se guardan en
`localStorage`, para poder probar la pantalla sin servidor.

Para conectar el backend real, crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost/ventas-api
```

Con esa variable definida, el servicio usa:

- `GET  {VITE_API_URL}/ventas` → listado de ventas
- `POST {VITE_API_URL}/ventas` → registrar una venta

El `POST` recibe:

```json
{
  "id": "uuid",
  "fecha": "2026-11-03",
  "producto": "Laptop Lenovo IdeaPad",
  "cantidad": 2,
  "totalCobrado": 1450.0,
  "registradaEn": "2026-11-03T15:04:05.000Z"
}
```

## Estructura

```
src/
├── components/
│   ├── FormularioVenta.jsx   # Formulario, validación e historial
│   └── FormularioVenta.css
├── services/
│   └── ventas.js             # Registro/listado de ventas (API o localStorage)
├── App.jsx
├── main.jsx
└── index.css
```

## Reglas de validación

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
