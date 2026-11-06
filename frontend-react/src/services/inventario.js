// SCRUM-6: demostración local. No representa todavía una transacción en MySQL.
export const CLAVE_INVENTARIO = 'batidos_inventario_scrum6_v1'
export const INVENTARIO_INICIAL = [
  { id: 1, nombre: 'Pulpa de Frutilla', stock_actual: 15, unidad_medida: 'unidades', stock_minimo: 5 },
  { id: 2, nombre: 'Leche Entera', stock_actual: 20, unidad_medida: 'litros', stock_minimo: 5 },
  { id: 3, nombre: 'Vasos 16oz', stock_actual: 100, unidad_medida: 'unidades', stock_minimo: 20 },
]

// Receta DEMOSTRATIVA: confirmar cantidades reales con el grupo.
// Nótese que la pulpa está medida en unidades, conforme al SQL de Steven.
export const RECETAS_INICIALES = {
  'Batido de frutilla': [
    { insumo_id: 1, cantidad: 1 },
    { insumo_id: 2, cantidad: 0.2 },
    { insumo_id: 3, cantidad: 1 },
  ],
}

export function leerInventario() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_INVENTARIO))
    return Array.isArray(guardado) ? guardado : INVENTARIO_INICIAL.map((x) => ({ ...x }))
  } catch {
    return INVENTARIO_INICIAL.map((x) => ({ ...x }))
  }
}

export function guardarInventario(insumos) {
  window.localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(insumos))
  window.dispatchEvent(new Event('inventario-actualizado'))
}

export function guardarInsumo(datos) {
  const nombre = String(datos.nombre ?? '').trim()
  const unidad = String(datos.unidad_medida ?? '').trim()
  const stock = Number(datos.stock_actual)
  const minimo = Number(datos.stock_minimo)
  if (!nombre || !unidad || !Number.isFinite(stock) || stock < 0 || !Number.isFinite(minimo) || minimo < 0) {
    throw new Error('Ingresa nombre, unidad y cantidades válidas (iguales o mayores a cero).')
  }
  const actual = leerInventario()
  const id = Math.max(0, ...actual.map((i) => Number(i.id))) + 1
  guardarInventario([...actual, { id, nombre, unidad_medida: unidad, stock_actual: stock, stock_minimo: minimo }])
}

export function calcularDescuento(producto, cantidad, inventario = leerInventario()) {
  const receta = RECETAS_INICIALES[String(producto).trim()]
  if (!receta) throw new Error('No existe una receta para este producto. Usa "Batido de frutilla" o configura una receta antes de vender.')
  const unidades = Number(cantidad)
  if (!Number.isInteger(unidades) || unidades <= 0) throw new Error('La cantidad de batidos debe ser un entero positivo.')
  return receta.map(({ insumo_id, cantidad: porBatido }) => {
    const insumo = inventario.find((item) => item.id === insumo_id)
    if (!insumo) throw new Error(`Falta el insumo con ID ${insumo_id}.`)
    const usada = Math.round(porBatido * unidades * 100) / 100
    if (Number(insumo.stock_actual) < usada) throw new Error(`Stock insuficiente de ${insumo.nombre}. Disponible: ${insumo.stock_actual} ${insumo.unidad_medida}.`)
    return { insumo_id, cantidad_usada: usada }
  })
}

export function descontarInventario(inventario, detalle) {
  return inventario.map((insumo) => {
    const usado = detalle.find((d) => d.insumo_id === insumo.id)?.cantidad_usada ?? 0
    return { ...insumo, stock_actual: Math.round((Number(insumo.stock_actual) - usado) * 100) / 100 }
  })
}

export function etiquetaStock(insumo) {
  return Number(insumo.stock_actual) <= Number(insumo.stock_minimo) ? 'Bajo Stock' : 'Suficiente'
}
