package cl.grwu.catalogo.service;

import cl.grwu.catalogo.dto.CategoriaRequest;
import cl.grwu.catalogo.dto.CategoriaResponse;
import cl.grwu.catalogo.entity.Categoria;
import cl.grwu.catalogo.exception.ConflictoException;
import cl.grwu.catalogo.exception.RecursoNoEncontradoException;
import cl.grwu.catalogo.repository.CategoriaRepository;
import cl.grwu.catalogo.repository.ProductoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

/**
 * Reglas de negocio de las categorias del catalogo.
 */
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository,
                            ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(CategoriaResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponse obtenerPorId(String id) {
        return CategoriaResponse.desde(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public CategoriaResponse obtenerPorSlug(String slug) {
        return CategoriaResponse.desde(categoriaRepository.findBySlug(normalizarSlug(slug))
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoria no encontrada: " + slug)));
    }

    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        String slug = normalizarSlug(request.slug());

        if (categoriaRepository.existsBySlug(slug)) {
            throw new ConflictoException("Ya existe una categoria con el slug " + slug);
        }

        Categoria categoria = new Categoria();
        categoria.setId(siguienteId());
        aplicar(categoria, request, slug);
        return CategoriaResponse.desde(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponse actualizar(String id, CategoriaRequest request) {
        Categoria categoria = buscarPorId(id);
        String slug = normalizarSlug(request.slug());

        if (categoriaRepository.existsBySlugAndIdNot(slug, id)) {
            throw new ConflictoException("Ya existe una categoria con el slug " + slug);
        }

        aplicar(categoria, request, slug);
        return CategoriaResponse.desde(categoriaRepository.save(categoria));
    }

    /**
     * Borrado fisico: CATEGORIA no tiene columna activo.
     * Si la categoria tiene productos asociados se responde 409 para no romper
     * la relacion real PRODUCTO -> CATEGORIA.
     */
    @Transactional
    public void eliminar(String id) {
        Categoria categoria = buscarPorId(id);

        if (productoRepository.existsByCategoriaId(id)) {
            throw new ConflictoException("No se puede eliminar la categoria " + id
                    + ": tiene productos asociados");
        }

        categoriaRepository.delete(categoria);
    }

    private Categoria buscarPorId(String id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoria no encontrada: " + id));
    }

    private void aplicar(Categoria categoria, CategoriaRequest request, String slug) {
        categoria.setSlug(slug);
        categoria.setNombre(request.nombre().trim());
        categoria.setDescripcion(recortar(request.descripcion()));
        categoria.setImagen(recortar(request.imagen()));
        categoria.setGenero(recortar(request.genero()) == null
                ? null
                : request.genero().trim().toLowerCase(Locale.ROOT));
    }

    private String normalizarSlug(String slug) {
        return slug == null ? "" : slug.trim().toLowerCase(Locale.ROOT);
    }

    private String recortar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private String siguienteId() {
        Long maximo = categoriaRepository.maxNumero();
        return String.format("c-%03d", (maximo == null ? 0L : maximo) + 1);
    }
}
