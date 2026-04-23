# Pizza Store - TPI Programación IV (Primera Entrega)

## Descripción del Proyecto

**TPI_TIENDA** es una aplicación web de tienda online para una pizzería, 
desarrollada con el stack MERN (MongoDB, Express, React, Node.js). 
Esta primera entrega implementa la estructura inicial del backend, 
una interfaz básica de frontend para visualización de productos 
y la documentación técnica del sistema.

---

## Objetivos del Trabajo Práctico

---> Aplicar arquitectura cliente-servidor.
---> Implementar persistencia de datos en MongoDB.
---> Construir una API REST inicial.
---> Consumir datos desde una interfaz web React.
---> Documentar la solución propuesta.

---

## Requerimientos Funcionales Implementados



 |**RF01**  Catálogo Dinámico --- Visualización de productos desde MongoDB Atlas con nombre, imagen y precio |
 |**RF02**  Detalle del Producto --- DetalleProducto con descripción, categoría, precio y stock |
 |**RF03**  Registro de Usuarios --- Formulario de alta de clientes con validación |
 |**RF04**  Control de Stock --- Botón de compra deshabilitado cuando stock es 0 |
 |**RF05**  Gestión de Inventario --- Backend con validación para evitar stock negativo |
 |**RF06**  Administración de Productos --- Endpoints para edición y baja lógica (campo activo: false) |

---

## Requerimientos Técnicos Implementados

 **Uso de variables de entorno** (.env para PORT y MONGO_URI)
 **Manejo de errores** con try-catch y respuestas JSON estructuradas
 **Respuestas en formato JSON** en todos los endpoints
 **Separación en capas** (Modelos, Rutas, Controladores)
 **Modelos de datos** (Usuario, Producto, Carrito)

---

## Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENTE (Frontend)                    │
│              React.js + Bootstrap 5                     │
│              - Catálogo de productos                    │
│              - Registro de usuarios                     │
│              - Carrito de compra                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP
                     │
┌────────────────────▼────────────────────────────────────┐
│                  SERVIDOR (Backend)                     │
│          Node.js + Express.js (Patrón MVC)              │
│                                                         │
│           RUTAS → CONTROLADORES → MODELOS               │
│               - /api/productos                          │
│               - /api/usuarios                           │
│               - /api/carrito                           │
└────────────────────┬────────────────────────────────────┘
                     │ MongoDB 
                     │
┌────────────────────▼────────────────────────────────────┐
│              BASE DE DATOS (Persistencia)               │
│              MongoDB Atlas - Colecciones:               │
│               - productos                               │
│               - usuarios                                │
│               - carritos                                │
└─────────────────────────────────────────────────────────┘
```

---

## Modelos de Datos

### 1. Producto
```javascript
{
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  imagen: String,
  stock: Number,
  activo: Boolean (default: true)
}
```

### 2. Usuario
```javascript
const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String }
}, { timestamps: true });
```

### 3. Carrito
```javascript
{
  usuarioId: ObjectId (referencia a Usuario),
  productos: [
    {
      productoId: ObjectId (referencia a Producto),
      cantidad: Number,
      precioUnitario: Number
    }
  ],
  total: Number,
  descuento: Number (opcional),
  fechaCreacion: Date (default: now),
  activo: Boolean (default: true)
}
```

---

## API REST - Endpoints Implementados

### Productos

| **GET** | `/api/productos` | Obtener todos los productos |
| **GET** | `/api/productos/:id` | Obtener producto por ID |
| **POST** | `/api/productos` | Crear nuevo producto |
| **PUT** | `/api/productos/:id` | Editar producto |
| **DELETE** | `/api/productos/:id` | Baja lógica de producto (activo: false) |

### Usuarios

| **POST** | `/api/usuarios` | Registrar nuevo usuario |

### Carrito

| **POST** | `/api/carrito` | Crear carrito |
| **POST** | `/api/carrito/add` | Agregar producto al carrito |

---

## Guía de Uso de la API con Postman

### Configuración Inicial en Postman

1. **Crear nueva colección**: "Pizza Store API"
2. **Configurar URL base**: `http://localhost:5001`
3. **Headers comunes**:
   - Content-Type: application/json

### Endpoints de Productos

#### 1. Obtener Todos los Productos
- **Método**: GET
- **URL**: `http://localhost:5001/api/productos`
- **Descripción**: Lista todos los productos activos
- **Respuesta esperada**:
```json
[
  {
    "_id": "60d5ecb74bbcc72b8c8b4567",
    "nombre": "Pizza Margherita",
    "descripcion": "Pizza clásica con mozzarella y albahaca",
    "precio": 12.99,
    "categoria": "Pizzas",
    "imagen": "pizza-margherita.jpg",
    "stock": 25,
    "activo": true
  }
]
```

#### 2. Obtener Producto por ID
- **Método**: GET
- **URL**: `http://localhost:5001/api/productos/{id}`
- **Descripción**: Obtiene detalles de un producto específico
- **Ejemplo**: `http://localhost:5001/api/productos/60d5ecb74bbcc72b8c8b4567`

#### 3. Crear Nuevo Producto
- **Método**: POST
- **URL**: `http://localhost:5001/api/productos`
- **Headers**: Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "nombre": "Papas Fritas Provenzal",
  "descripcion": "Papas rústicas cortadas a mano, doble cocción, con abundante ajo, perejil fresco y sal marina.",
  "precio": 8.5,
  "categoria": "Acompañamientos",
  "imagenUrl": "papas-provenzal.jpg",
  "stock": 30
}
```

#### 4. Editar Producto
- **Método**: PUT
- **URL**: `http://localhost:5001/api/productos/{id}`("Papas Fritas Provenzal")
- **Headers**: Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "precio": 8500,
  "stock": 4
}
```

#### 5. Baja Lógica de Producto
- **Método**: DELETE
- **URL**: `http://localhost:5001/api/productos/{id}`("Papas Fritas Provenzal")
- **Descripción**: Marca el producto como inactivo (activo: false)

### Endpoints de Usuarios

#### 1. Registrar Usuario
- **Método**: POST
- **URL**: `http://localhost:5001/api/usuarios`
- **Headers**: Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "nombre": "Florencia",
  "apellido": "Alvarez",
  "email": "Florencia.Alvarez@email.com",
  "telefono": "+54911234567"
}
```

### Endpoints de Carrito

#### 1. Crear Carrito
- **Método**: POST
- **URL**: `http://localhost:5001/api/carrito`
- **Headers**: Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "usuarioId": "69e914b1778d3feda27047ab"
}
```

#### 2. Agregar Producto al Carrito
- **Método**: POST
- **URL**: `http://localhost:5001/api/carrito/add`
- **Headers**: Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "usuarioId": "69e914b1778d3feda27047ab",
  "productoId": "69c89e56e1ef798c37acd88d",
  "cantidad": 3

}
```

### Ejemplos de Uso en Postman

#### Flujo Completo de Prueba:

1. **Crear productos** (POST /api/productos)
2. **Registrar usuario** (POST /api/usuarios)
3. **Crear carrito** (POST /api/carrito)
4. **Agregar productos al carrito** (POST /api/carritos/add)
5. **Listar productos** (GET /api/productos)
6. **Editar producto** (PUT /api/productos/{id})
7. **Eliminar producto** (DELETE /api/productos/{id})

### Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos inválidos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor


## Estructura del Proyecto

```
tpi-tienda/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Archivo principal
│   │   ├── config/
│   │   │   └── db.js                 # Configuración de MongoDB
│   │   ├── models/
│   │   │   ├── Product.js            # Modelo de Producto
│   │   │   ├── User.js               # Modelo de Usuario
│   │   │   └── Cart.js               # Modelo de Carrito
│   │   ├── controllers/
│   │   │   ├── productController.js  # Lógica de productos
│   │   │   ├── userController.js     # Lógica de usuarios
│   │   │   └── cartController.js     # Lógica de carrito
│   │   └── routes/
│   │       ├── productRoutes.js      # Rutas de productos
│   │       ├── userRoutes.js         # Rutas de usuarios
│   │       └── cartRoutes.js         # Rutas de carrito
│   ├── package.json
│   └── .env                          # Variables de entorno
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── images/                   # Imágenes de productos
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.js                    # Componente principal
│   │   ├── App.css                   # Estilos generales
│   │   ├── index.js                  # Punto de entrada
│   │   ├── components/
│   │   │   ├── Navbar.js             # Barra de navegación
│   │   │   ├── ProductList.js        # Listado de productos
│   │   │   ├── CartPage.js           # Página del carrito
│   │   │   ├── Register.js           # Formulario de registro
│   │   │   ├── Contact.js            # Página de contacto
│   │   │   └── Footer.js             # Pie de página
│   ├── package.json
│   └── README.md
│
└── README.md                          # Este archivo
```

---

## Instalación y Configuración

### 1. Requisitos Previos
- **Node.js** v14 o superior
- **MongoDB Atlas** (cuenta con base de datos creada)
- **npm** 
- **Git**

### 2. Configuración del Backend

```bash
# Entrar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env con las variables:
# PORT=5001
# MONGO_URI=dummy

# Iniciar el servidor
npm start
```

**El servidor estará disponible en:** `http://localhost:5001`

### 3. Configuración del Frontend

```bash
# Entrar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar la aplicación
npm start
```

**La aplicación se abrirá en:** `http://localhost:3000`

### 4. Variables de Entorno (.env)

Crear archivo `.env` en la carpeta `backend`:

```
PORT=5001
MONGO_URI=dummy
```

---

## Evidencias de Funcionamiento

### Capturas de Postman (Backend)
- **A. Crear Producto** - Creación de nuevo producto
- **B. Obtener Todos los Productos** - Listado completo
- **C. Obtener Producto por ID** - Detalle específico
- **D. Editar Producto por ID** - Actualización de datos
- **E. Baja de Producto** - Baja lógica (activo: false)
- **F. Crear Usuario** - Registro de nuevo usuario
- **G. Crear Carrito** - Creación de carrito
- **H. Agregar Pizza al Carrito** - Operación de carrito



### Base de Datos MongoDB
- Colecciones creadas: productos, usuarios, carritos
- Documentos de ejemplo insertados
- Validaciones implementadas


### Diagramas de Arquitectura

- Arquitectura front-back-db
- Diagrama de capas
- Diagrama de 3 capas
- Flujo React-Node-DB

---

## Tecnologías Utilizadas

### Frontend
- **React.js** - Librería de interfaz
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **JavaScript ES6+**

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Mongoose** - ODM para MongoDB
- **dotenv** - Gestión de variables de entorno

### Base de Datos
- **MongoDB Atlas** - Base de datos NoSQL en la nube

---

## Flujo de Funcionamiento

### Visualización de Productos
1. Frontend solicita `/api/productos` al Backend
2. Backend consulta colección de productos en MongoDB
3. Backend retorna productos activos en formato JSON
4. Frontend renderiza catálogo con Bootstrap

### Registro de Usuario
1. Usuario completa formulario en Frontend
2. Frontend valida datos y envía POST a `/api/usuarios`
3. Backend valida y almacena en MongoDB
4. Frontend redirige a home si es exitoso

### Carrito de Compras
1. Usuario selecciona producto
2. Frontend envía POST a `/api/carrito/add`
3. Backend valida stock y agrega a carrito
4. Frontend actualiza visualización del carrito

---


## Integrantes del Grupo

| Nombre | Rol | GitHub |
|--------|-----|--------|
| Fernando Leguizamón | Desarrollo Full Stack | [GitHub](https://github.com) |
| Integrante 2 | Desarrollo Full Stack | [GitHub](https://github.com) |
| Integrante 3 | Desarrollo Full Stack | [GitHub](https://github.com) |
| Integrante 4 | Desarrollo Full Stack | [GitHub](https://github.com) |

---

## Profesor y Institución

**Profesora:** Ing. Florencia Alvarez Vuille --- TUP UTN FRCU 2026
**Materia:** Programación IV
**Entrega:** 30/04/2026

---

## Notas Importantes

- En esta etapa **no se requiere autenticación**
- Los productos se filtran por campo `activo: true`
- El stock se valida antes de agregar al carrito
- Las baja lógicas preservan información histórica

---

## Contacto y Soporte

Para consultas sobre el proyecto:
1. Revisar la documentación en `/diagramas/`
2. Consultar ejemplos en `/evidencias/`
3. Contactar al delegado del grupo

---

**Última actualización:** Abril 2026