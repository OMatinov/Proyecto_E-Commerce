// AdminReportes.jsx - Panel de reportes con gráficos (chart.js).
// Muestra: ventas reales y meta mensual, top 3 de productos, ventas por mes (barras)
// y ventas por categoría (torta). Los cálculos están en utils/reportes.js.

import { useMemo } from 'react';
import { listarOrdenes } from '../../data/ordenesData';
import { obtenerProducto } from '../../data/productosData';
import { obtenerCategoriaPorSlug } from '../../data/categoriasData';
import { formatearCLP } from '../../data/carritoData';
import GraficoChart from '../../components/GraficoChart.jsx';
import {
  SIN_CATEGORIA,
  ordenesDeVenta,
  productosMasVendidos,
  totalVentas,
  ventasPorCategoria,
  ventasPorMes
} from '../../utils/reportes';

const META_MENSUAL = 2000000;

// Nombre de la categoría de un ítem de orden (el ítem guarda el id del producto).
function categoriaDeItem(item) {
  const producto = obtenerProducto(item.id);
  const categoria = producto ? obtenerCategoriaPorSlug(producto.categoria) : null;
  return categoria ? categoria.nombre : SIN_CATEGORIA;
}

const AdminReportes = () => {
  const reporte = useMemo(() => {
    const ordenes = listarOrdenes();
    return {
      totalVentas: totalVentas(ordenes),
      totalOrdenes: ordenesDeVenta(ordenes).length,
      masVendidos: productosMasVendidos(ordenes, 3),
      porMes: ventasPorMes(ordenes),
      porCategoria: ventasPorCategoria(ordenes, categoriaDeItem)
    };
  }, []);

  const avance = Math.min(Math.round((reporte.totalVentas / META_MENSUAL) * 100), 100);

  return (
    <div>
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Reportes</h1>
        <p className="text-muted mb-0">Resumen de rendimiento de la tienda</p>
      </div>

      <div className="row g-4">
        {/* Ventas reales */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 p-4">
            <h5 className="fw-bold mb-3">Ventas Reales</h5>
            <h2 className="display-5 fw-bold mb-0" style={{ color: 'var(--color-primario)' }}>
              {formatearCLP(reporte.totalVentas)}
            </h2>
            <p className="text-muted small mb-4">Basado en {reporte.totalOrdenes} órdenes pagadas, enviadas o entregadas</p>

            <div className="mb-2 d-flex justify-content-between small fw-bold">
              <span>Meta Mensual ({formatearCLP(META_MENSUAL)})</span>
              <span>{avance}%</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${avance}%`, backgroundColor: 'var(--color-primario)' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Top 3 productos */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 p-4">
            <h5 className="fw-bold mb-3">Top 3 Productos Más Vendidos</h5>
            {reporte.masVendidos.length === 0 ? (
              <p className="text-muted small mt-3">Aún no hay ventas registradas.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {reporte.masVendidos.map((prod, index) => (
                  <li key={prod.nombre} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    {index + 1}. {prod.nombre}
                    <span className="badge bg-dark rounded-pill">{prod.cantidad} unidades</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Gráfico: ventas por mes */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-primary text-white fw-bold">Ventas por mes</div>
            <div className="card-body">
              <GraficoChart
                tipo="bar"
                titulo="Ventas por mes"
                descripcion="Gráfico de barras con las ventas por mes"
                etiquetas={reporte.porMes.etiquetas}
                valores={reporte.porMes.valores}
                mensajeVacio="Aún no hay ventas para graficar por mes."
              />
            </div>
          </div>
        </div>

        {/* Gráfico: ventas por categoría */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold">Ventas por categoría</div>
            <div className="card-body">
              <GraficoChart
                tipo="pie"
                titulo="Ventas por categoría"
                descripcion="Gráfico de torta con las ventas por categoría"
                etiquetas={reporte.porCategoria.etiquetas}
                valores={reporte.porCategoria.valores}
                mensajeVacio="Aún no hay ventas para graficar por categoría."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportes;
