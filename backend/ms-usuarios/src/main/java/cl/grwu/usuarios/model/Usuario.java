package cl.grwu.usuarios.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Tabla USUARIO del esquema grwu_usuarios (sección 7.2 del contexto).
 * La clave primaria es el RUN (sin puntos ni guion, con dígito verificador).
 * La contraseña NUNCA se guarda en texto plano: solo el hash BCrypt en clave_hash.
 */
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @Column(name = "run", length = 9)
    private String run;

    @Column(name = "nombre", nullable = false, length = 60)
    private String nombre;

    @Column(name = "apellidos", nullable = false, length = 80)
    private String apellidos;

    @Column(name = "correo", nullable = false, unique = true, length = 100)
    private String correo;

    /** Hash BCrypt (60 caracteres). */
    @Column(name = "clave_hash", nullable = false, length = 60)
    private String claveHash;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    /**
     * Se guarda como texto (VARCHAR). Sin @JdbcTypeCode, Hibernate 6 crearía en MySQL una columna ENUM nativa,
     * distinta al contrato (VARCHAR(20)).
     */
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "tipo_usuario", nullable = false, length = 20)
    private TipoUsuario tipoUsuario;

    @Column(name = "region", length = 80)
    private String region;

    @Column(name = "comuna", length = 80)
    private String comuna;

    @Column(name = "direccion", length = 150)
    private String direccion;

    @Column(name = "telefono", length = 20)
    private String telefono;

    /** Borrado lógico: un usuario desactivado no puede iniciar sesión ni aparece como activo. */
    @Column(name = "activo", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean activo = true;

    /**
     * Opción B del refresh token (decidida por el equipo): identificador (jti) del ÚLTIMO refresh token válido.
     * Cada /auth/refresh genera uno nuevo y lo guarda aquí (rotación); /auth/logout lo borra (null).
     * Un refresh token cuyo jti no coincide con este valor se rechaza. Columna de apoyo: no agrega tablas.
     */
    @Column(name = "refresh_jti", length = 36)
    private String refreshJti;

    public Usuario() {
        // Constructor vacío requerido por JPA.
    }

    public String getRun() { return run; }
    public void setRun(String run) { this.run = run; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getClaveHash() { return claveHash; }
    public void setClaveHash(String claveHash) { this.claveHash = claveHash; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public TipoUsuario getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(TipoUsuario tipoUsuario) { this.tipoUsuario = tipoUsuario; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public String getRefreshJti() { return refreshJti; }
    public void setRefreshJti(String refreshJti) { this.refreshJti = refreshJti; }
}
