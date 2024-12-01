# Frontend para Renta de Libros y Recomendaciones

Este proyecto es una aplicación frontend desarrollada con [Remix](https://remix.run/). Permite a los usuarios buscar libros, rentarlos y ver recomendaciones personalizadas basadas en su historial de rentas. La aplicación está diseñada para ser intuitiva, rápida y completamente responsiva.

## Características

- **Inicio de Sesión y Registro**: Los usuarios pueden iniciar sesión o registrarse para acceder a todas las funcionalidades.
- **Renta de Libros**: Visualiza detalles de libros, selecciona cantidades y agrégalos a un carrito para completar la renta.
- **Recomendaciones**:
  - Para usuarios nuevos: Muestra los 6 libros más rentados de todos los tiempos.
  - Para usuarios activos: Recomendaciones personalizadas basadas en géneros más rentados.
- **Libros en Tendencia**:
  - Muestra los 3 libros más rentados de todos los tiempos y los 3 más rentados del último mes.
- **Gestión del Carrito**: Los usuarios pueden agregar, eliminar y confirmar rentas desde un carrito persistente entre las páginas.
- **Navegación Responsiva**: Incluye un menú optimizado para dispositivos móviles.

---

## Tecnologías Utilizadas

### Frontend
- **Remix**: Framework basado en React que prioriza velocidad y simplicidad.
- **TailwindCSS**: Framework de CSS para estilos rápidos y responsivos.
- **Styled Components**: Para estilos personalizados.
- **Vite**: Herramienta de construcción para desarrollo rápido y compilaciones optimizadas.

### Backend (Dependencia)
- Backend desarrollado con **NestJS** y alojado en **Azure Web App**, encargado de manejar la lógica de negocio, almacenamiento y recomendaciones. *(La documentación del backend está en otro repositorio.)*

---

## Requisitos Previos

1. **Node.js** (v16 o superior).
2. **NPM** (v7 o superior) o **Yarn**.
3. Conexión al backend (proporcionar la URL en las variables de entorno).

---

## Instalación

1. **Clona el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```
2. **Instalar dependencias**
3. **Configura el .env**
## Funcionalidades Principales

### Navegación
- **Navbar**:
  - **En pantallas grandes**: Muestra el nombre del sitio a la izquierda y botones para las rutas principales a la derecha.
  - **En móviles**: Muestra un menú tipo hamburguesa con las opciones disponibles.

### Gestión de Libros
- **Página de Libros**: Explora todos los libros disponibles con un filtro por género.
- **Detalles del Libro**: Página individual que muestra la sinopsis, disponibilidad y permite agregar el libro al carrito.

### Carrito
- **Carrito Persistente**: Los datos del carrito se guardan y mantienen al navegar entre diferentes páginas.
- **Confirmación de Rentas**: Permite a los usuarios revisar los libros seleccionados y confirmar la renta.

### Recomendaciones
- **Para Usuarios Nuevos**: Muestra los 6 libros más rentados de todos los tiempos.
- **Para Usuarios Activos**: Genera recomendaciones basadas en los géneros más rentados por el usuario.

### Libros en Tendencia
- **Top Libros de Todos los Tiempos**: Muestra los 3 libros más rentados históricamente.
- **Top Libros del Último Mes**: Muestra los 3 libros más rentados del último mes.

