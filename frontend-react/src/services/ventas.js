const CLAVE_ALMACEN = 'ventas_registradas'

/**
 * URL de la API PHP/MySQL (carpeta backend-php servida por WampServer).
 * Si no se define VITE_API_URL, las ventas se guardan en localStorage para
 * poder probar la pantalla sin servidor.
 */
const API_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '') ?? ''

function leerVentasLocales() {
  try {
    const crudo = window.localStorage.getItem(CLAVE_ALMACEN)
    const ventas = crudo ? JSON.parse(crudo) : []
    return Array.isArray(ventas) ? ventas : []
  } catch {
    return []
  }
}

function guardarVentasLocales(ventas) {
  window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(ventas))
}

export async function listarVentas() {
  if (API_URL) {
    const respuesta = await fetch(`${API_URL}/ventas.php`)
    if (!respuesta.ok) {
      throw new Error('No se pudo obtener el listado de ventas.')
    }
    return respuesta.json()
  }

  return leerVentasLocales()
}

export async function registrarVenta(datos) {
  // La tabla `ventas` de batidos_mvp usa: fecha, producto, cantidad, total.
  const venta = {
    id: crypto.randomUUID(),
    fecha: datos.fecha,
    producto: datos.producto.trim(),
    cantidad: Number(datos.cantidad),
    total: Number(datos.totalCobrado),
    registradaEn: new Date().toISOString(),
  }

  if (API_URL) {
    const respuesta = await fetch(`${API_URL}/ventas.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta),
    })

    if (!respuesta.ok) {
      throw new Error('El servidor no pudo registrar la venta. Intenta nuevamente.')
    }

    return respuesta.json()
  }

  const ventas = leerVentasLocales()
  ventas.push(venta)
  guardarVentasLocales(ventas)
  return venta
}
