# Tabla de Contenido
- [Requerimientos](#requerimientos)
- [Configuracion base de datos](#configuración-de-la-base-de-datos-para-la-api-y-pruebas)
- [Ejecucion del Proyecto](#ejecución-del-proyecto)
- [Documentacion de la API de la libreria](#documentación-de-la-api)

# Requerimientos
  ```
    1. node v20.10.0
    2. npm v10.2.3
    3. PostgreSQL 14.12
  ```

# Configuración de la Base de Datos para la API y Pruebas

Para ejecutar correctamente las pruebas y la API, es necesario crear dos bases de datos: una para el entorno de ejecución y otra para las pruebas. Las bases de datos necesarias son:

1. Una base de datos llamada `libreria` que contiene las tablas `users` y `libros`.
2. Otra base de datos llamada `libreriatest` que contiene las mismas tablas.

## Crear las Bases de Datos

Para crear estas bases de datos, puedes ejecutar los siguientes comandos desde la consola de psql:

```sql
CREATE DATABASE libreria;
CREATE DATABASE libreriatest;

\c libreria

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS libros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    publicacion INT NOT NULL
);

\c libreriatest

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS libros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    publicacion INT NOT NULL
);
```

## Configuración de Archivos .env

Además, es necesario configurar los archivos `.env` y `.env.test` para apuntar a las bases de datos `libreria` y `libreriatest` correspondientemente.

### Archivo .env

El archivo `.env` debe contener la configuración para la base de datos del entorno de ejecución:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=libreria
```

### Archivo .env.test

El archivo `.env.test` debe contener la configuración para la base de datos de pruebas:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=libreriatest
```

# Ejecución del Proyecto

  ```
    1. npm install
    2. npm run start:dev
    3. npm run test:e2e
  ```

# Documentación de la API

Esta documentación describe los endpoints de la API para la gestión de usuarios y libros en tu aplicación. Se detallan los formatos de solicitud y respuesta, así como cualquier información adicional necesaria para su uso.

Para ver la informacion generada con swagger puedes ejecutar el proyecto y luego ir a la documentacion usando la siguiente ruta:
#### [http://localhost:3000/documentation](http://localhost:3000/documentation)

---

## **Usuarios**

### **Crear un Usuario**

**Endpoint**: POST /users

**Descripción**: Crea un nuevo usuario en la base de datos.

**Solicitud**:

- **URL**: http://localhost:3000/users
- **Método**: POST
- **Encabezados**:
  - Content-Type: application/json
- **Cuerpo**:
  ```json
  {
    "username": "testuser",
    "password": "password"
  }
  ```

**Respuesta**:

- **Código de estado**: 201 Created
- **Cuerpo**:
  ```json
  {
    "id": 1,
    "username": "testuser"
  }
  ```

### **Obtener un Usuario por Nombre de Usuario**

**Endpoint**: GET /users/:username

**Descripción**: Obtiene un usuario por su nombre de usuario.

**Solicitud**:

- **URL**: http://localhost:3000/users/:username
- **Método**: GET
- **Encabezados**: Ninguno
- **Parámetros de ruta**:
  - username: El nombre de usuario del usuario a obtener.

**Respuesta**:

- **Código de estado**: 200 OK
- **Cuerpo**:
  ```json
  {
    "id": 1,
    "username": "testuser",
    "password": "$2b$10$..."
  }
  ```

---

## **Autenticación**

### **Login de Usuario**

**Endpoint**: POST /auth/login

**Descripción**: Autentica a un usuario y devuelve un token JWT.

**Solicitud**:

- **URL**: http://localhost:3000/auth/login
- **Método**: POST
- **Encabezados**:
  - Content-Type: application/json
- **Cuerpo**:
  ```json
  {
    "username": "testuser",
    "password": "password"
  }
  ```

**Respuesta**:

- **Código de estado**: 201 Created
- **Cuerpo**:
  ```json
  {
    "access_token": "jwt_token"
  }
  ```

---

## **Libros**

### **Obtener Todos los Libros**

**Endpoint**: GET /libros

**Descripción**: Obtiene una lista de todos los libros.

**Solicitud**:

- **URL**: http://localhost:3000/libros
- **Método**: GET
- **Encabezados**:
  - Authorization: Bearer {jwt_token}

**Respuesta**:

- **Código de estado**: 200 OK
- **Cuerpo**:
  ```json
  [
    {
      "id": 1,
      "titulo": "Libro de Prueba 1",
      "autor": "Autor de Prueba 1",
      "publicacion": 2021
    },
    {
      "id": 2,
      "titulo": "Libro de Prueba 2",
      "autor": "Autor de Prueba 2",
      "publicacion": 2022
    }
  ]
  ```

### **Obtener un Libro por ID**

**Endpoint**: GET /libros/:id

**Descripción**: Obtiene un libro por su ID.

**Solicitud**:

- **URL**: http://localhost:3000/libros/:id
- **Método**: GET
- **Encabezados**:
  - Authorization: Bearer {jwt_token}
- **Parámetros de ruta**:
  - id: El ID del libro a obtener.

**Respuesta**:

- **Código de estado**: 200 OK
- **Cuerpo**:
  ```json
  {
    "id": 1,
    "titulo": "Libro de Prueba 1",
    "autor": "Autor de Prueba 1",
    "publicacion": 2021
  }
  ```

### **Crear un Nuevo Libro**

**Endpoint**: POST /libros

**Descripción**: Crea un nuevo libro.

**Solicitud**:

- **URL**: http://localhost:3000/libros
- **Método**: POST
- **Encabezados**:
  - Content-Type: application/json
  - Authorization: Bearer {jwt_token}
- **Cuerpo**:
  ```json
  {
    "titulo": "Nuevo Libro",
    "autor": "Nuevo Autor",
    "publicacion": 2023
  }
  ```

**Respuesta**:

- **Código de estado**: 201 Created
- **Cuerpo**:
  ```json
  {
    "id": 3,
    "titulo": "Nuevo Libro",
    "autor": "Nuevo Autor",
    "publicacion": 2023
  }
  ```

### **Actualizar un Libro por ID**

**Endpoint**: PUT /libros/:id

**Descripción**: Actualiza un libro existente por su ID.

**Solicitud**:

- **URL**: http://localhost:3000/libros/:id
- **Método**: PUT
- **Encabezados**:
  - Content-Type: application/json
  - Authorization: Bearer {jwt_token}
- **Cuerpo**:
  ```json
  {
    "titulo": "Libro Actualizado",
    "autor": "Autor Actualizado",
    "publicacion": 2024
  }
  ```

**Respuesta**:

- **Código de estado**: 200 OK
- **Cuerpo**:
  ```json
  {
    "id": 1,
    "titulo": "Libro Actualizado",
    "autor": "Autor Actualizado",
    "publicacion": 2024
  }
  ```

### **Eliminar un Libro por ID**

**Endpoint**: DELETE /libros/:id

**Descripción**: Elimina un libro por su ID.

**Solicitud**:

- **URL**: http://localhost:3000/libros/:id
- **Método**: DELETE
- **Encabezados**:
  - Authorization: Bearer {jwt_token}
- **Parámetros de ruta**:
  - id: El ID del libro a eliminar.

**Respuesta**:

- **Código de estado**: 200 OK
- **Cuerpo**:
  ```json
  {}
  ```

---

### Información Adicional

- **Autenticación**: Todos los endpoints de libros requieren un token JWT para la autenticación. El token se obtiene al hacer login y debe ser enviado en el encabezado Authorization de cada solicitud.
