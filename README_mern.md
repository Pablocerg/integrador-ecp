# Pizzería KONE — Trabajo Práctico Integrador MERN

Aplicación web full-stack de tienda online para una pizzería, construida con **MongoDB, Express.js, React y Node.js**.

## Requisitos implementados

### 1. Autenticación y autorización
- Registro de usuarios con validaciones
- Inicio de sesión con JWT (expiración 1 día)
- Encriptación de contraseñas con bcryptjs
- Middleware de autenticación (`isAuth`)
- Middleware de autorización por roles (`isAdmin`)
- Recuperación de contraseña mediante email (token criptográfico SHA-256, expira 20 min)
- Roles: `user` (cliente) y `admin` (administrador)
- Frontend: login, register, forgot/reset password, protección de rutas

### 2. Gestión de productos
- CRUD completo con baja lógica (campo `activo`)
- Restauración de productos dados de baja
- Control de stock
- Imágenes servidas desde el backend (`/images/`)
- Operaciones de creación, edición y baja protegidas para administradores
- Frontend: catálogo con infinite scroll, detalle de producto, stock visible con colores

### 3. Gestión de usuarios
- Perfil propio: consulta y edición de datos personales
- Administrador: listar, editar, cambiar rol, baja lógica y restauración de usuarios
- Endpoint de autopromoción a admin (`/api/users/self-admin`)

### 4. Gestión de carrito (backend + frontend)
- Modelo `Cart` persistido en MongoDB (un carrito por usuario)
- Agregar/quitar productos, modificar cantidades, vaciar carrito
- Validación de stock antes de agregar
- Sincronización automática entre frontend y backend cuando el usuario está autenticado
- Fallback a localStorage cuando el usuario no está logueado
- Migración automática del carrito local al backend al iniciar sesión

### 5. Órdenes de compra
- Creación de pedidos autenticados con items, total, datos de facturación y entrega
- Descuento de stock al confirmar la orden
- Tipos de entrega: retiro en local / envío a domicilio
- Medios de pago: transferencia / efectivo
- Historial de pedidos del usuario
- Administrador: ver todas las órdenes, cambiar estado (pendiente → pagado → enviado → entregado)

### 6. Catálogo de productos en frontend
- Lista de productos con nombre, precio, categoría, descripción, stock
- Infinite scroll (carga 6 productos a la vez)
- Página de detalle de producto (`/producto/:id`)
- Agregar al carrito desde catálogo o detalle

### 7. Panel administrador
- Gestión de productos (crear, editar, eliminar, restaurar)
- Gestión de usuarios (editar, cambiar rol, eliminar, restaurar)
- Gestión de órdenes (ver todas, cambiar estado)
- Toggle entre activos/inactivos para productos y usuarios

### 8. Persistencia en MongoDB con Mongoose
- Modelos: `User`, `Product`, `Order`, `Cart`
- Conexión configurada en `backend/config/db.js`
- Validaciones a nivel de esquema y controladores

### 9. Estado global con Context API
- Carrito de compras con persistencia en localStorage (no autenticado)
- Sincronización con backend (autenticado)
- React Context + custom hook (`useCart`)

### 10. Consumo de API REST
- Cliente HTTP con fetch (`frontend/src/api/pizzaApi.js`)
- Headers de autenticación automáticos con JWT
- Manejo de errores centralizado

### 11. Organización modular
- Backend: `routes/`, `controllers/`, `models/`, `middlewares/`, `config/`
- Frontend: `pages/`, `components/`, `contexts/`, `hooks/`, `api/`, `utils/`

## Estructura del proyecto

```
PizeriaKONE/
├── backend/
│   ├── config/
│   │   ├── db.js              # Conexión MongoDB
│   │   └── mailer.js           # Transporter Nodemailer
│   ├── controllers/
│   │   ├── userController.js   # Auth, perfil, recuperación, contacto
│   │   ├── productController.js# CRUD productos + restore
│   │   ├── orderController.js  # Órdenes, historial, admin
│   │   └── cartController.js   # Carrito backend persistente
│   ├── images/                 # Imágenes estáticas
│   ├── middlewares/
│   │   └── authMiddleware.js   # isAuth, isAdmin
│   ├── models/
│   │   ├── User.js             # usuario, email, password, rol, resetToken
│   │   ├── Product.js          # nombre, precio, stock, activo, etc.
│   │   ├── Order.js            # items, total, entrega, pago, estado
│   │   └── Cart.js             # items por usuario
│   ├── routes/
│   │   ├── index.js            # Agregador de rutas
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── cartRoutes.js
│   ├── .env                    # Variables de entorno
│   ├── cargarPizzas.js         # Seed de datos
│   ├── server.js               # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── pizzaApi.js     # Cliente HTTP
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navegación con carrito badge
│   │   │   ├── Hero.jsx        # Landing hero
│   │   │   ├── Specialties.jsx # Grilla de productos
│   │   │   ├── Features.jsx    # Sección características
│   │   │   ├── Benefits.jsx    # Beneficios
│   │   │   ├── Location.jsx    # Ubicación + mapa
│   │   │   ├── ContactForm.jsx # Formulario de contacto
│   │   │   ├── Cart.jsx        # Vista del carrito
│   │   │   ├── Footer.jsx      # Pie de página
│   │   │   └── ProtectedRoute.jsx  # Router protector
│   │   ├── contexts/
│   │   │   ├── cartContext.js  # Context definition
│   │   │   └── CartContext.jsx # Provider con sync backend
│   │   ├── hooks/
│   │   │   └── useCart.js      # Hook del carrito
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── MiPerfil.jsx
│   │   │   ├── DetalleProducto.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── utils/
│   │   │   └── auth.js         # Helpers JWT
│   │   ├── App.jsx             # Routes + Layout
│   │   ├── main.jsx            # Entry point React
│   │   └── index.css           # Tailwind + estilos
│   ├── .env                    # VITE_API_BASE_URL
│   └── package.json
├── README_mern.md
└── README_PIZZERIA.md
```

## Cómo ejecutar el proyecto

### Requisitos previos
- Node.js v18 o superior
- npm v9 o superior
- Conexión a Internet (MongoDB Atlas)

### Backend
```bash
cd backend
npm install
npm run seed         # (opcional) Siembra 5 productos + admin
npm run dev          # nodemon, hot-reload en :5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # Vite dev server en :5173
```

### Build producción
```bash
cd frontend
npm run build        # Genera dist/
```

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor Express | `5000` |
| `MONGO_URI` | URI de conexión a MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `JWT_SECRET` | Clave secreta para firmar JWT | `mi_clave_secreta_...` |
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Puerto SMTP | `587` |
| `SMTP_SECURE` | TLS seguro | `false` |
| `SMTP_USER` | Email del remitente | `pizzeriakone.soporte@gmail.com` |
| `SMTP_PASS` | Contraseña de aplicación SMTP | `xxxx` |
| `MAIL_FROM` | Dirección de origen del correo | `pizzeriakone.soporte@gmail.com` |
| `FRONTEND_URL` | URL del frontend para links en emails | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base de la API backend | `http://localhost:5000/api` |

## Dependencias principales

### Backend
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| express | ^4.19.2 | Framework web |
| mongoose | ^8.3.2 | ODM para MongoDB |
| jsonwebtoken | ^9.0.3 | JWT autenticación |
| bcryptjs | ^3.0.3 | Hash de contraseñas |
| nodemailer | ^8.0.10 | Envío de emails |
| cors | ^2.8.6 | CORS |
| dotenv | ^16.4.5 | Variables de entorno |
| nodemon (dev) | ^3.1.0 | Recarga automática |

### Frontend
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| react | ^19.2.4 | UI library |
| react-dom | ^19.2.4 | DOM rendering |
| react-router-dom | ^7.13.1 | Enrutamiento |
| react-toastify | ^11.1.0 | Notificaciones |
| lucide-react | ^0.577.0 | Iconos |
| tailwindcss | ^4.2.1 | Estilos CSS |
| vite | ^8.0.0 | Build tool |

## Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@pizeriakone.com` | `admin123` |
| Cliente | `juan@gmail.com` | `puntero123` |

## Endpoints de la API

Todos los endpoints están bajo el prefijo `/api`. El servidor corre en `http://localhost:5000`.

### Productos — `/api/products`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/products` | — | Listar productos activos. Query `?activo=false` para inactivos |
| GET | `/api/products/:id` | — | Obtener producto por ID |
| POST | `/api/products` | Admin | Crear producto |
| PUT | `/api/products/:id` | Admin | Actualizar producto |
| DELETE | `/api/products/:id` | Admin | Baja lógica (activo: false) |
| PUT | `/api/products/:id/restore` | Admin | Restaurar producto |

### Usuarios — `/api/users`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/users/register` | — | Registrar usuario |
| POST | `/api/users/login` | — | Iniciar sesión, devuelve JWT |
| POST | `/api/users/self-admin` | — | Autopromoción a admin |
| GET | `/api/users/me` | Auth | Perfil del usuario autenticado |
| PUT | `/api/users/me` | Auth | Editar perfil propio |
| GET | `/api/users` | Admin | Listar usuarios. Query `?activo=false` para inactivos |
| GET | `/api/users/:id` | Auth | Obtener usuario por ID |
| PUT | `/api/users/:id` | Admin | Actualizar usuario |
| DELETE | `/api/users/:id` | Admin | Baja lógica |
| PUT | `/api/users/:id/restore` | Admin | Restaurar usuario |
| PUT | `/api/users/:id/role` | Admin | Cambiar rol |
| POST | `/api/users/forgot-password` | — | Solicitar recuperación de contraseña |
| POST | `/api/users/reset-password/:token` | — | Restablecer contraseña |
| POST | `/api/users/contact` | — | Formulario de contacto |

### Órdenes — `/api/orders`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/orders` | Auth | Crear pedido |
| GET | `/api/orders/mis-pedidos` | Auth | Historial del usuario autenticado |
| GET | `/api/orders` | Admin | Listar todas las órdenes |
| GET | `/api/orders/:id` | Auth | Obtener orden por ID |
| PUT | `/api/orders/:id` | Admin | Actualizar estado |
| DELETE | `/api/orders/:id` | Admin | Eliminar orden |

### Carrito — `/api/cart`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/cart` | Auth | Obtener carrito del usuario autenticado |
| POST | `/api/cart/add` | Auth | Agregar producto (body: `{ producto, cantidad }`) |
| PUT | `/api/cart/update/:productId` | Auth | Modificar cantidad (body: `{ cantidad }`) |
| DELETE | `/api/cart/remove/:productId` | Auth | Eliminar producto del carrito |
| DELETE | `/api/cart/clear` | Auth | Vaciar carrito |

### Imágenes — `/images`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/images/:filename` | — | Servir imágenes estáticas |

## Rutas del frontend

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | Landing (Hero, Specialties, Features, Benefits, Location, Contact, Footer) | Público |
| `/producto/:id` | DetalleProducto | Público |
| `/cart` | Cart | Público |
| `/login` | Login | Público |
| `/register` | Register | Público |
| `/forgot-password` | ForgotPassword | Público |
| `/reset-password/:token` | ResetPassword | Público |
| `/checkout` | Checkout | Usuarios autenticados |
| `/orders` | OrderHistory | Usuarios autenticados |
| `/profile` | MiPerfil | Usuarios autenticados |
| `/admin` | AdminPanel | Administradores |

## Consideraciones de seguridad
- JWT con expiración diaria y middleware de validación
- Contraseñas hasheadas con bcrypt (salt rounds 10)
- Rutas sensibles protegidas por rol
- Token de recuperación criptográfico de un solo uso, con expiración de 20 minutos
- El endpoint forgot-password no revela si el email existe o no
- Validaciones de datos tanto en frontend como en backend
- Baja lógica en lugar de borrado físico para productos y usuarios

## Fuera del alcance
- Pasarela de pago real
- Autenticación con servicios externos (Google, GitHub)
- Despliegue en producción
- Dashboard con métricas avanzadas

---

**Materia:** Programación IV — TUP UTN FRCU 2026  
**Profesora:** Ing. Florencia Alvarez Vuille  
**Última actualización:** Junio 2026
