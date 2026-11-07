import { useEffect, useMemo, useState } from 'react'
import { listarVentas, registrarVenta } from '../services/ventas'
import './FormularioVenta.css'

const formateadorMoneda = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
})

function fechaDeHoy() {
  const ahora = new Date()
  const desfaseZona = ahora.getTimezoneOffset() * 60000
  return new Date(ahora.getTime() - desfaseZona).toISOString().slice(0, 10)
}

function estadoInicial() {
  return { fecha: fechaDeHoy(), producto: '', cantidad: '', totalCobrado: '' }
}

function validar(datos) {
  const errores = {}

  if (!datos.fecha) {
    errores.fecha = 'Selecciona la fecha de la venta.'
  }

  if (datos.producto.trim().length < 2) {
    errores.producto = 'Ingresa el producto (mínimo 2 caracteres).'
  }

  const cantidad = Number(datos.cantidad)
  if (!datos.cantidad || !Number.isInteger(cantidad) || cantidad <= 0) {
    errores.cantidad = 'La cantidad debe ser un entero mayor a 0.'
  }

  const total = Number(datos.totalCobrado)
  if (datos.totalCobrado === '' || Number.isNaN(total) || total < 0) {
    errores.totalCobrado = 'Ingresa un total cobrado válido.'
  }

  return errores
}

export default function FormularioVenta() {
  const [datos, setDatos] = useState(estadoInicial)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [ventas, setVentas] = useState([])

  useEffect(() => {
    let activo = true

    listarVentas()
      .then((registradas) => {
        if (activo) setVentas(registradas)
      })
      .catch(() => {
        if (activo) {
          setMensaje({ tipo: 'error', texto: 'No se pudo cargar el historial de ventas.' })
        }
      })

    return () => {
      activo = false
    }
  }, [])

  const totalAcumulado = useMemo(
    () => ventas.reduce((suma, venta) => suma + Number(venta.total || 0), 0),
    [ventas],
  )

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos((previos) => ({ ...previos, [name]: value }))
    setErrores((previos) => ({ ...previos, [name]: undefined }))
    setMensaje(null)
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()

    const erroresEncontrados = validar(datos)
    setErrores(erroresEncontrados)

    if (Object.keys(erroresEncontrados).length > 0) {
      setMensaje({ tipo: 'error', texto: 'Revisa los campos marcados antes de guardar.' })
      return
    }

    setEnviando(true)
    setMensaje(null)

    try {
      const venta = await registrarVenta(datos)
      setVentas((previas) => [...previas, venta])
      setDatos((previos) => ({ ...estadoInicial(), fecha: previos.fecha }))
      setMensaje({
        tipo: 'exito',
        texto: `Venta de "${venta.producto}" registrada correctamente.`,
      })
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="ventas">
      <header className="ventas__cabecera">
        <span className="ventas__etiqueta">Módulo de ventas</span>
        <h1 className="ventas__titulo">Registro de Ventas</h1>
        <p className="ventas__descripcion">
          Alta de nuevos pedidos. Completa fecha, producto, cantidad y total cobrado para
          registrar la transacción en el sistema.
        </p>
      </header>

      <form className="ventas__formulario" onSubmit={manejarEnvio} noValidate>
        <div className="ventas__campos">
          <div className="campo">
            <label htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              value={datos.fecha}
              onChange={manejarCambio}
              aria-invalid={Boolean(errores.fecha)}
              aria-describedby={errores.fecha ? 'error-fecha' : undefined}
            />
            {errores.fecha && (
              <p className="campo__error" id="error-fecha">
                {errores.fecha}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="producto">Producto</label>
            <input
              id="producto"
              name="producto"
              type="text"
              placeholder="Ej. Laptop Lenovo IdeaPad"
              value={datos.producto}
              onChange={manejarCambio}
              aria-invalid={Boolean(errores.producto)}
              aria-describedby={errores.producto ? 'error-producto' : undefined}
            />
            {errores.producto && (
              <p className="campo__error" id="error-producto">
                {errores.producto}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              min="1"
              step="1"
              placeholder="Ej. 2"
              value={datos.cantidad}
              onChange={manejarCambio}
              aria-invalid={Boolean(errores.cantidad)}
              aria-describedby={errores.cantidad ? 'error-cantidad' : undefined}
            />
            {errores.cantidad && (
              <p className="campo__error" id="error-cantidad">
                {errores.cantidad}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="totalCobrado">Total cobrado (USD)</label>
            <input
              id="totalCobrado"
              name="totalCobrado"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej. 1450.00"
              value={datos.totalCobrado}
              onChange={manejarCambio}
              aria-invalid={Boolean(errores.totalCobrado)}
              aria-describedby={errores.totalCobrado ? 'error-totalCobrado' : undefined}
            />
            {errores.totalCobrado && (
              <p className="campo__error" id="error-totalCobrado">
                {errores.totalCobrado}
              </p>
            )}
          </div>
        </div>

        {mensaje && (
          <p
            className={`ventas__mensaje ventas__mensaje--${mensaje.tipo}`}
            role={mensaje.tipo === 'error' ? 'alert' : 'status'}
          >
            {mensaje.texto}
          </p>
        )}

        <div className="ventas__acciones">
          <button type="submit" className="boton boton--primario" disabled={enviando}>
            {enviando ? 'Guardando…' : 'Guardar Venta'}
          </button>
        </div>
      </form>

      <section className="historial">
        <div className="historial__cabecera">
          <h2>Ventas registradas</h2>
          <span className="historial__total">
            Total acumulado: <strong>{formateadorMoneda.format(totalAcumulado)}</strong>
          </span>
        </div>

        {ventas.length === 0 ? (
          <p className="historial__vacio">Aún no hay ventas registradas.</p>
        ) : (
          <div className="historial__tabla-contenedor">
            <table className="historial__tabla">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Producto</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Total cobrado</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr key={venta.id}>
                    <td>{venta.fecha}</td>
                    <td>{venta.producto}</td>
                    <td>{venta.cantidad}</td>
                    <td>{formateadorMoneda.format(Number(venta.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}
