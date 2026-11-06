import { useEffect, useState } from 'react'
import { etiquetaStock, guardarInsumo, leerInventario, RECETAS_INICIALES } from '../services/inventario'
import './PanelInventario.css'

const vacio = { nombre: '', unidad_medida: 'unidades', stock_actual: '', stock_minimo: '' }
export default function PanelInventario() {
  const [insumos, setInsumos] = useState(leerInventario)
  const [formulario, setFormulario] = useState(vacio)
  const [mensaje, setMensaje] = useState('')
  useEffect(() => {
    const actualizar = () => setInsumos(leerInventario())
    window.addEventListener('inventario-actualizado', actualizar)
    return () => window.removeEventListener('inventario-actualizado', actualizar)
  }, [])
  function guardar(evento) {
    evento.preventDefault()
    try {
      guardarInsumo(formulario)
      setFormulario(vacio)
      setMensaje('Insumo registrado correctamente.')
    } catch (error) {
      setMensaje(error.message)
    }
  }
  return (
    <section className="inventario" aria-label="Control de inventario">
      <h2>Inventario de insumos</h2>
      <p className="inventario__nota">Demostración local del Sprint 1: los datos se guardan en este navegador. La receta es de ejemplo y debe ser confirmada antes de usarla en un negocio real.</p>
      <div className="inventario__tabla"><table><thead><tr><th>Insumo</th><th>Disponible</th><th>Mínimo</th><th>Estado</th></tr></thead><tbody>
        {insumos.map((insumo) => <tr key={insumo.id}><td>{insumo.nombre}</td><td>{insumo.stock_actual} {insumo.unidad_medida}</td><td>{insumo.stock_minimo}</td><td><span className={etiquetaStock(insumo) === 'Bajo Stock' ? 'inventario__bajo' : 'inventario__bien'}>{etiquetaStock(insumo)}</span></td></tr>)}
      </tbody></table></div>
      <h3>Registrar insumo</h3>
      <form className="inventario__form" onSubmit={guardar}>
        <label>Nombre <input required value={formulario.nombre} onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}/></label>
        <label>Unidad <select value={formulario.unidad_medida} onChange={(e) => setFormulario({ ...formulario, unidad_medida: e.target.value })}><option>unidades</option><option>litros</option><option>gramos</option><option>kilogramos</option></select></label>
        <label>Stock inicial <input required type="number" min="0" step="0.01" value={formulario.stock_actual} onChange={(e) => setFormulario({ ...formulario, stock_actual: e.target.value })}/></label>
        <label>Stock mínimo <input required type="number" min="0" step="0.01" value={formulario.stock_minimo} onChange={(e) => setFormulario({ ...formulario, stock_minimo: e.target.value })}/></label>
        <button type="submit">Añadir insumo</button>
      </form>
      {mensaje && <p role="status">{mensaje}</p>}
      <p className="inventario__nota">Receta demostrativa disponible: <strong>{Object.keys(RECETAS_INICIALES).join(', ')}</strong>. Para probar el descuento escribe ese nombre exacto en el formulario de ventas.</p>
    </section>
  )
}
