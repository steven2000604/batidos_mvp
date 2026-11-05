const opciones = [
  { id: 'venta', titulo: 'Registrar Venta', detalle: 'Anota una nueva venta', icono: '🥤', ruta: '/registro-ventas' },
  { id: 'inventario', titulo: 'Inventario', detalle: 'Stock de insumos', icono: '📦', ruta: '/inventario' },
  { id: 'rentabilidad', titulo: 'Rentabilidad', detalle: 'Ganancias y costos', icono: '📈', ruta: '/rentabilidad' },
  { id: 'historial', titulo: 'Historial', detalle: 'Ventas anteriores', icono: '🧾', ruta: '/historial' },
]

export default function App() {
  const irA = (ruta) => {
    // Por ahora solo muestra la ruta; se conectará con las otras pantallas del equipo.
    alert(`Ir a: ${ruta}`)
  }

  return (
    <main className="app">
      <header className="encabezado">
        <p className="mini">Negocio de Batidos</p>
        <h1>Inicio</h1>
        <p className="sub">Elige una opción para continuar</p>
      </header>

      <nav className="menu" aria-label="Menú principal">
        {opciones.map((op) => (
          <button key={op.id} className="boton" onClick={() => irA(op.ruta)}>
            <span className="icono" aria-hidden="true">{op.icono}</span>
            <span className="titulo">{op.titulo}</span>
            <span className="detalle">{op.detalle}</span>
          </button>
        ))}
      </nav>

      <footer className="pie">MVP · Sprint 1</footer>
    </main>
  )
}
