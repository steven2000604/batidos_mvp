import { leerInventario, calcularDescuento, descontarInventario, guardarInventario } from './inventario'
const CLAVE_ALMACEN = 'ventas_registradas'

/**
 * URL del backend PHP/MySQL. Si no se define VITE_API_URL, las ventas se
 * guardan en localStorage para poder probar el formulario sin servidor.
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
    const respuesta = await fetch(`${API_URL}/ventas`)
    if (!respuesta.ok) {
      throw new Error('No se pudo obtener el listado de ventas.')
    }
    return respuesta.json()
  }

  return leerVentasLocales()
}

export async function registrarVenta(datos) {
  const venta = {
    id: crypto.randomUUID(),
    fecha: datos.fecha,
    producto: datos.producto.trim(),
    cantidad: Number(datos.cantidad),
    totalCobrado: Number(datos.totalCobrado),
    registradaEn: new Date().toISOString(),
  }

  if (API_URL) {
    // El descuento en MySQL debe implementarse en el backend con una transacción.
    const respuesta = await fetch(`${API_URL}/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta),
    })

    if (!respuesta.ok) {
      throw new Error('El servidor no pudo registrar la venta. Intenta nuevamente.')
    }

    return respuesta.json()
  }

  // Sprint 1: transacción local demostrativa; NO reemplaza una transacción SQL.
  const inventario = leerInventario()
  const detalle = calcularDescuento(venta.producto, venta.cantidad, inventario)
  const inventarioNuevo = descontarInventario(inventario, detalle)
  const ventas = leerVentasLocales()
  const ventaConDetalle = { ...venta, detalle_insumos: detalle }
  ventas.push(ventaConDetalle)
  // Guardamos primero la venta: no descontamos stock si falla el guardado.
  guardarVentasLocales(ventas)
  guardarInventario(inventarioNuevo)
  return ventaConDetalle
}
