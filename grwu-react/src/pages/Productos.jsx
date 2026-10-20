import { useMemo, useState } from 'react';
import { listarProductos } from '../data/productosData';
import { listarCategorias } from '../data/categoriasData';
import ProductCard from '../components/ProductCard';

export default function Productos() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState('relevancia');

  const categorias = listarCategorias();
  const productos = listarProductos();

  const filtrados = useMemo(() => {
    let lista = productos;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter((p) => p.nombre.toLowerCase().includes(q));
    }
    if (categoria) lista = lista.filter((p) => p.categoria === categoria);
    if (orden === 'precio-asc') lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (orden === 'precio-desc') lista = [...lista].sort((a, b) => b.precio - a.precio);
    return lista;
  }, [productos, busqueda, categoria, orden]);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Productos</h1>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar producto"
          />
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.slug}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-4">
          <select
            className="form-select"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            aria-label="Ordenar"
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="text-center text-muted py-5">No se encontraron productos.</p>
      ) : (
        <div className="row g-4">
          {filtrados.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}