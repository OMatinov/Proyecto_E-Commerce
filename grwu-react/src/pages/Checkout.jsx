// Checkout.jsx - Vista "Carrito de compra / datos de entrega" (paso de pago).
// Autor: César
//
// Flujo al presionar "Pagar ahora":
//   1. validarCheckout()  -> errores por campo
//   2. procesarPago()     -> aprobado / rechazado (simulado)
//   3. crearOrden()       -> se guarda SIEMPRE (pagada o rechazada)
//   4. aprobado -> vacía el carrito y va a /pago-correcto/:id
//      rechazado -> conserva el carrito y va a /pago-error/:id
// Si hay sesión iniciada, los datos del cliente y la dirección vienen prellenados.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import MensajeVacio from "../components/MensajeVacio.jsx";
import TablaItems from "../components/TablaItems.jsx";
import ResumenTotales from "../components/ResumenTotales.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { REGIONES, comunasDeRegion } from "../data/regiones.js";
import { crearOrden } from "../data/ordenesData.js";
import { COSTO_ENVIO_PREMIUM, formatearCLP } from "../data/carritoData.js";
import { procesarPago, METODOS_PAGO } from "../services/pago.js";
import { validarCheckout } from "../utils/formularios.js";

function valoresIniciales(usuario) {
  return {
    nombre: usuario?.nombre ?? "",
    apellidos: usuario?.apellidos ?? "",
    correo: usuario?.correo ?? "",
    calle: usuario?.direccion ?? "",
    departamento: "",
    region: usuario?.region ?? "",
    comuna: usuario?.comuna ?? "",
    indicaciones: "",
    despacho: "estandar",
    metodoPago: ""
  };
}

const OPCIONES_DESPACHO = [
  { valor: "estandar", texto: "Estándar (3 a 5 días hábiles)" },
  { valor: "premium", texto: `Premium (24 horas) — ${formatearCLP(COSTO_ENVIO_PREMIUM)}` }
];

export default function Checkout() {
  const { items, totales, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navigate = useNavigate();
  const [valores, setValores] = useState(() => valoresIniciales(usuario));
  const [errores, setErrores] = useState({});

  if (items.length === 0) {
    return (
      <MensajeVacio titulo="No hay productos para pagar" texto="Tu carrito está vacío."
        enlace="/" textoEnlace="Ver productos" />
    );
  }

  const { subtotal, envio, total } = totales(valores.despacho);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === "region") setValores({ ...valores, region: value, comuna: "" });
    else setValores({ ...valores, [name]: value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const erroresNuevos = validarCheckout(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    const pago = procesarPago({ metodoPago: valores.metodoPago, total });
    const orden = crearOrden({
      usuarioRun: usuario?.run ?? null,
      cliente: { nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim(), correo: valores.correo.trim() },
      direccion: {
        calle: valores.calle.trim(), departamento: valores.departamento.trim(),
        region: valores.region, comuna: valores.comuna, indicaciones: valores.indicaciones.trim()
      },
      items, subtotal, envio, total,
      despacho: valores.despacho,
      metodoPago: valores.metodoPago,
      estado: pago.aprobado ? "pagada" : "rechazada"
    });

    if (pago.aprobado) {
      vaciar();
      navigate(`/pago-correcto/${orden.id}`);
    } else {
      navigate(`/pago-error/${orden.id}`, { state: { motivo: pago.motivo } });
    }
  };

  const opcionesRegion = REGIONES.map((r) => ({ valor: r.nombre, texto: r.nombre }));
  const opcionesComuna = comunasDeRegion(valores.region).map((c) => ({ valor: c, texto: c }));
  const opcionesPago = Object.entries(METODOS_PAGO).map(([valor, texto]) => ({ valor, texto }));

  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Finalizar compra</h1>
      {!usuario && (
        <div className="alert alert-info">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link> y completaremos tus datos automáticamente.
        </div>
      )}
      <form onSubmit={manejarEnvio} noValidate>
        <div className="row g-4">
          <div className="col-lg-7">
            <h2 className="h5">Información del cliente</h2>
            <div className="row">
              <div className="col-md-6">
                <CampoFormulario id="nombre" etiqueta="Nombre" value={valores.nombre} onChange={manejarCambio} error={errores.nombre} />
              </div>
              <div className="col-md-6">
                <CampoFormulario id="apellidos" etiqueta="Apellidos" value={valores.apellidos} onChange={manejarCambio} error={errores.apellidos} />
              </div>
            </div>
            <CampoFormulario id="correo" etiqueta="Correo electrónico" type="email" value={valores.correo} onChange={manejarCambio} error={errores.correo} />

            <h2 className="h5 mt-4">Dirección de entrega</h2>
            <div className="row">
              <div className="col-md-8">
                <CampoFormulario id="calle" etiqueta="Calle y número" value={valores.calle} onChange={manejarCambio} error={errores.calle} />
              </div>
              <div className="col-md-4">
                <CampoFormulario id="departamento" etiqueta="Depto (opcional)" placeholder="Ej: 603" value={valores.departamento} onChange={manejarCambio} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <CampoFormulario id="region" etiqueta="Región" opciones={opcionesRegion} placeholderOpcion="-- Seleccione la región --"
                  value={valores.region} onChange={manejarCambio} error={errores.region} />
              </div>
              <div className="col-md-6">
                <CampoFormulario id="comuna" etiqueta="Comuna" opciones={opcionesComuna} placeholderOpcion="-- Seleccione la comuna --"
                  value={valores.comuna} onChange={manejarCambio} error={errores.comuna} disabled={!valores.region} />
              </div>
            </div>
            <CampoFormulario id="indicaciones" etiqueta="Indicaciones para la entrega (opcional)" placeholder="Ej: entre calles, color del edificio"
              value={valores.indicaciones} onChange={manejarCambio} />

            <h2 className="h5 mt-4">Despacho y pago</h2>
            <div className="row">
              <div className="col-md-6">
                <CampoFormulario id="despacho" etiqueta="Tipo de despacho" opciones={OPCIONES_DESPACHO} placeholderOpcion={null}
                  value={valores.despacho} onChange={manejarCambio} />
              </div>
              <div className="col-md-6">
                <CampoFormulario id="metodoPago" etiqueta="Método de pago" opciones={opcionesPago} placeholderOpcion="-- Seleccione --"
                  value={valores.metodoPago} onChange={manejarCambio} error={errores.metodoPago} />
              </div>
            </div>
          </div>

          <aside className="col-lg-5">
            <div className="card">
              <div className="card-body">
                <h2 className="h5">Resumen de tu compra</h2>
                <TablaItems items={items} />
                <ResumenTotales subtotal={subtotal} envio={envio} total={total} />
                <button type="submit" className="btn btn-success w-100 mt-3">Pagar ahora {formatearCLP(total)}</button>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}
