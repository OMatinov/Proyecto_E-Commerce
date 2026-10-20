// CampoFormulario.jsx - Campo de formulario Bootstrap reutilizable (input o select).
// Autor: César
//
// Props:
//   id, etiqueta   -> vinculan el <label> con el control
//   error          -> si viene con texto, marca el campo en rojo y muestra el mensaje
//   opciones       -> si viene, renderiza un <select> con [{ valor, texto }]
//   placeholderOpcion -> texto de la primera opción vacía del <select> (null = sin opción vacía)
//   ...props       -> value, onChange, type, disabled, etc. se pasan al control

export default function CampoFormulario({ id, etiqueta, error, opciones, placeholderOpcion = "-- Seleccione --", ...props }) {
  const clases = `${opciones ? "form-select" : "form-control"}${error ? " is-invalid" : ""}`;

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      {opciones ? (
        <select id={id} name={id} className={clases} aria-invalid={Boolean(error)} {...props}>
          {placeholderOpcion !== null && <option value="">{placeholderOpcion}</option>}
            {opciones.map((op) => (
                <option key={op.valor} value={op.valor}>{op.texto}</option>
            ))}
        </select>
      ) : (
        <input id={id} name={id} className={clases} aria-invalid={Boolean(error)} {...props} />
      )}
      {error && <div className="invalid-feedback" role="alert">{error}</div>}
    </div>
  );
}
