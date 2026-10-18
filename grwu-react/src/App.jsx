// App.jsx - Rutas de la aplicación.
// VERSIÓN DE DEMO de César: solo conecta sus pantallas más piezas temporales (carpeta src/demo).
// Katerine: aquí van el layout real y el resto de rutas; las rutas de César se copian tal cual.

import { Outlet, Route, Routes } from "react-router-dom";
import DemoNavbar from "./demo/DemoNavbar.jsx";
import DemoInicio from "./demo/DemoInicio.jsx";
import DemoPendiente from "./demo/DemoPendiente.jsx";
import Login from "./pages/tienda/Login.jsx";
import Registro from "./pages/tienda/Registro.jsx";
import Carrito from "./pages/tienda/Carrito.jsx";
import Checkout from "./pages/tienda/Checkout.jsx";
import PagoCorrecto from "./pages/tienda/PagoCorrecto.jsx";
import PagoError from "./pages/tienda/PagoError.jsx";

function Layout() {
  return (
    <>
      <DemoNavbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DemoInicio />} />
        {/* ----- Rutas de César ----- */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago-correcto/:id" element={<PagoCorrecto />} />
        <Route path="/pago-error/:id" element={<PagoError />} />
        {/* ----- Pendientes ----- */}
        <Route path="/admin" element={<DemoPendiente titulo="Panel de administración" responsable="Katerine y César" />} />
        <Route path="/recuperar-clave" element={<DemoPendiente titulo="Recuperar contraseña" responsable="César" />} />
      </Route>
    </Routes>
  )
}
