// Checkout.jsx - Vista "Carrito de compra / datos de entrega" (paso de pago).
<<<<<<< HEAD
// Autor: César (conectado a ms-boletas por Katerine; manejo de sesión y errores por César)
=======
// Autor: César (modificado por Katerine para conectar con ms-boletas)
>>>>>>> 2daae4278814af8fc303cf0d34463c77d8af70dc
//
// Flujo al presionar "Pagar ahora":
//   1. validarCheckout()  -> errores por campo
//   2. POST /api/v1/boletas (ms-boletas) -> valida stock, procesa el pago simulado y guarda la boleta
//   3. pagada    -> vacía el carrito y va a /pago-correcto/:id
//      rechazada -> conserva el carrito y va a /pago-error/:id
//      error     -> 401 sesión vencida, 403 no es Cliente, 409 stock agotado: se muestra en pantalla
// La ruta exige rol Cliente (RutaPorRol); los datos del cliente y la dirección vienen prellenados.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import MensajeVacio from "../components/MensajeVacio.jsx";
import TablaItems from "../components/TablaItems.jsx";
import ResumenTotales from "../components/ResumenTotales.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { REGIONES, comunasDeRegion } from "../data/regiones.js";
import { COSTO_ENVIO_PREMIUM, formatearCLP } from "../data/carritoData.js";
import { METODOS_PAGO } from "../services/pago.js";
import { validarCheckout } from "../utils/formularios.js";

<<<<<<< HEAD
import { aSolicitudBoleta } from "../services/adapters.js";
import boletasService from "../services/boletas.js";
import { normalizarError } from "../services/errores.js";
=======
// IMPORTAMOS AXIOS
import api from "../services/api.js";
>>>>>>> 2daae4278814af8fc303cf0d34463c77d8af70dc

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
  const [cargando, setCargando] = useState(false); // Para deshabilitar el botón mientras carga
<<<<<<< HEAD
  const [errorEnvio, setErrorEnvio] = useState("");
=======
>>>>>>> 2daae4278814af8fc303cf0d34463c77d8af70dc

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

<<<<<<< HEAD
=======
  // AQUÍ ESTÁ LA MAGIA: Ahora es una función asíncrona que llama a la API
>>>>>>> 2daae4278814af8fc303cf0d34463c77d8af70dc
  const manejarEnvio = async (e) => {
    e.preventDefault();
    const erroresNuevos = validarCheckout(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

<<<<<<< HEAD
    setErrorEnvio("");
    setCargando(true);

    try {
      // ms-boletas toma el RUN del token (no del body) y recalcula precios y totales con el catálogo.
      const boleta = await boletasService.crear(aSolicitudBoleta({ items, valores }));

      if (boleta.estado === "pagada") {
        vaciar();
        navigate(`/pago-correcto/${boleta.id}`);
      } else {
        // Pago rechazado por la pasarela: se conserva el carrito y se permite reintentar.
        navigate(`/pago-error/${boleta.id}`, { state: { motivo: boleta.motivoRechazo } });
      }
    } catch (error) {
      const { mensaje, status, errores } = normalizarError(error);
      if (status === 400 && errores) setErrores(errores);
      if (status === 401) setErrorEnvio("Tu sesión expiró. Inicia sesión de nuevo para pagar.");
      else if (status === 403) setErrorEnvio("Tu cuenta no puede realizar compras: solo los clientes pueden pagar.");
      else setErrorEnvio(mensaje); // 409 stock agotado, 404 producto, 503 catálogo caído, red, etc.
=======
    // Si no hay usuario logueado, no dejamos comprar (Regla de negocio EV3)
    if (!usuario) {
      alert("Debes iniciar sesión para poder pagar.");
      navigate("/login");
      return;
    }

    setCargando(true);

    try {
      // 1. Armamos el body exactamente como lo espera tu DTO (CrearBoletaRequest)
      const requestBody = {
        items: items.map(item => ({
          productoId: item.id,
          cantidad: item.qty || 1
        })),
        despacho: valores.despacho,
        metodoPago: valores.metodoPago,
        cliente: {
          nombre: valores.nombre.trim(),
          apellidos: valores.apellidos.trim(),
          correo: valores.correo.trim()
        },
        direccion: {
          calle: valores.calle.trim(),
          departamento: valores.departamento.trim(),
          indicaciones: valores.indicaciones.trim(),
          region: valores.region,
          comuna: valores.comuna
        }
      };

      // 2. Llamamos a ms-boletas (el proxy de Vite lo redirige al puerto 8083)
      const respuesta = await api.post('/boletas', requestBody);
      const boleta = respuesta.data;

      // 3. Evaluamos la respuesta del backend
      if (boleta.estado === "pagada") {
        vaciar(); // Vaciamos el carrito
        navigate(`/pago-correcto/${boleta.id}`);
      } else {
        navigate(`/pago-error/${boleta.id}`, { state: { motivo: boleta.motivoRechazo } });
      }

    } catch (error) {
      console.error("Error al crear la boleta:", error);
      // Aquí atrapamos errores 401 (sin token), 403 (sin permisos) o 500 (error del server)
      if (error.response && error.response.status === 401) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        navigate("/login");
      } else {
        alert("Hubo un problema al procesar tu compra. Intenta nuevamente.");
      }
>>>>>>> 2daae4278814af8fc303cf0d34463c77d8af70dc
    } finally {
      setCargando(false);
    }
  };

  const opcionesRegion = REGIONES.map((r) => ({ valor: r.nombre, texto: r.nombre }));
  const opcionesComuna = comunasDeRegion(valores.region).map((c) => ({ valor: c, texto: c }));
  const opcionesPago = Object.entries(METODOS_PAGO).map(([valor, texto]) => ({ valor, texto }));

  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Finalizar compra</h1>
      {errorEnvio && <div className="alert alert-danger" role="alert">{errorEnvio}</div>}
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
                <button type="submit" className="btn btn-success w-100 mt-3" disabled={cargando}>
                  {cargando ? "Procesando pago..." : `Pagar ahora ${formatearCLP(total)}`}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}