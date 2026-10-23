# Sistema de Reservas API — DAO & Repository

API REST desarrollada con **Node.js y Express** para administrar servicios y reservas. El proyecto utiliza archivos JSON como sistema de persistencia y una arquitectura por capas que separa las responsabilidades de cada componente.

## Repositorio

**GitHub:** https://github.com/moises2872024/sistema-reservas-api-dao-repository

## Tecnologías utilizadas

- Node.js
- Express
- JavaScript
- FileSystem (`fs`) para la persistencia de datos
- Archivos JSON
- dotenv para la configuración mediante variables de entorno
- Postman para las pruebas de la API

## Arquitectura del proyecto

El proyecto está organizado en capas para facilitar el mantenimiento, la reutilización del código y la separación de responsabilidades.

```text
sistema-reservas-api-dao-repository/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── controllers/
│   │   ├── services.controller.js
│   │   └── bookings.controller.js
│   ├── services/
│   │   ├── services.service.js
│   │   └── bookings.service.js
│   ├── repositories/
│   │   ├── services.repository.js
│   │   └── bookings.repository.js
│   ├── dao/
│   │   ├── services.dao.js
│   │   └── bookings.dao.js
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   ├── data/
│   │   ├── services.json
│   │   └── bookings.json
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Responsabilidades de cada capa

**1. Routes**

Define los endpoints de la API y conecta las solicitudes HTTP con los controladores correspondientes.

**2. Controllers**

Recibe las solicitudes HTTP, obtiene los parámetros y los datos enviados por el cliente, llama a los servicios y devuelve las respuestas correspondientes mediante `res.status().json()`.

**3. Services**

Contiene la lógica de negocio y las validaciones de los datos. Gestiona las operaciones relacionadas con servicios y reservas, incluyendo la disponibilidad de los servicios y el incremento de cantidades.

**4. Repositories**

Actúa como intermediario entre la capa de servicios y los DAO, proporcionando los métodos necesarios para acceder a los datos.

**5. DAO (Data Access Object)**

Se encarga del acceso a los archivos JSON, incluyendo la lectura, búsqueda, creación, actualización y eliminación de registros.

**6. Data**

Contiene los archivos JSON utilizados para almacenar los servicios y las reservas.

El flujo general de una solicitud es:

`Router → Controller → Service → Repository → DAO → JSON`

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/moises2872024/sistema-reservas-api-dao-repository.git
```

### 2. Entrar en la carpeta del proyecto

```bash
cd sistema-reservas-api-dao-repository
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

El proyecto incluye un archivo `.env.example` con la configuración de ejemplo:

```env
PORT=3000
```

Si necesitas configurar un archivo `.env`, puedes copiar la configuración de ejemplo y utilizar el puerto deseado.

### 5. Iniciar el servidor

Para desarrollo:

```bash
npm run dev
```

Para ejecutar el servidor normalmente:

```bash
npm start
```

Por defecto, la API queda disponible en:

`http://localhost:3000`

## Endpoints de la API

### Servicios

Base URL: `/api/services`

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Obtener todos los servicios |
| GET | `/api/services/:sid` | Obtener un servicio por su ID |
| POST | `/api/services` | Crear un servicio |
| PUT | `/api/services/:sid` | Actualizar un servicio |
| DELETE | `/api/services/:sid` | Eliminar un servicio |

Los servicios incluyen los siguientes campos:

- `id`: identificador generado automáticamente.
- `name`: nombre del servicio.
- `description`: descripción del servicio.
- `duration`: duración en minutos.
- `price`: precio del servicio.
- `category`: categoría del servicio.
- `available`: indica si el servicio está disponible.

Ejemplo de cuerpo para crear un servicio:

```json
{
  "name": "Masaje relajante",
  "description": "Masaje corporal de 30 minutos",
  "duration": 30,
  "price": 15000,
  "category": "Masajes",
  "available": true
}
```

El identificador se genera automáticamente y no debe enviarse en el cuerpo de la solicitud.

### Reservas

Base URL: `/api/bookings`

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crear una reserva |
| GET | `/api/bookings/:bid` | Obtener una reserva por su ID |
| POST | `/api/bookings/:bid/services/:sid` | Asociar un servicio a una reserva |

Las reservas incluyen los siguientes campos:

- `id`: identificador generado automáticamente.
- `clientName`: nombre del cliente.
- `clientEmail`: correo electrónico del cliente.
- `date`: fecha de la reserva.
- `time`: hora de la reserva.
- `status`: estado de la reserva.
- `services`: lista de servicios asociados y sus cantidades.

Ejemplo de cuerpo para crear una reserva:

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@example.com",
  "date": "2026-11-15",
  "time": "10:30"
}
```

La reserva se crea inicialmente con el estado `pending` y una lista de servicios vacía.

### Relación entre reservas y servicios

Cada servicio asociado a una reserva se almacena utilizando su identificador y la cantidad correspondiente.

Ejemplo:

```json
{
  "service": "c0c259fe-86eb-4761-8de6-5aad83a73d05",
  "quantity": 2
}
```

Si se agrega nuevamente un servicio que ya está asociado a la misma reserva, su cantidad aumenta en lugar de generar una fila duplicada.

Además, la API verifica que el servicio exista y esté disponible antes de permitir su asociación.

## Pruebas realizadas en Postman

Las siguientes pruebas se ejecutaron contra el servidor local y se verificaron mediante las respuestas de la API.

### 1. Consulta inicial de servicios

**Solicitud:**

```http
GET http://localhost:3000/api/services
```

**Resultado:** `200 OK`.

La API devolvió una lista vacía cuando todavía no había servicios registrados.

### 2. Crear y consultar un servicio

Se creó el servicio `Corte de cabello`, con una duración de 30 minutos, precio de 10000 y categoría `Peluquería`.

**Solicitud:**

```http
POST http://localhost:3000/api/services
```

**Resultado:** creación exitosa.

Luego se comprobó que el servicio aparecía en el listado mediante `GET /api/services` y que podía consultarse individualmente mediante `GET /api/services/:sid`.

### 3. Actualizar y eliminar un servicio

Se modificaron los datos del servicio `Corte de cabello`. La actualización fue confirmada mediante una consulta posterior.

Después se eliminó el servicio y se intentó consultarlo nuevamente por su identificador.

**Resultados:**

- Actualización: exitosa.
- Eliminación: exitosa.
- Consulta posterior a la eliminación: `404 Not Found`.

### 4. Crear y consultar una reserva

Se creó una reserva para `Juan Pérez`, con fecha `2026-11-15` y hora `10:30`.

**Solicitud:**

```http
POST http://localhost:3000/api/bookings
```

La API creó la reserva con un identificador automático, estado `pending` y la lista `services` vacía.

Posteriormente, se utilizó `GET /api/bookings/:bid` para comprobar que la reserva se había guardado correctamente.

### 5. Asociar un servicio a una reserva

Se creó el servicio `Masaje relajante` y se asoció a la reserva existente.

**Solicitud:**

```http
POST http://localhost:3000/api/bookings/012e8a51-b577-480f-b16f-84d61150ae47/services/c0c259fe-86eb-4761-8de6-5aad83a73d05
```

La operación fue exitosa y el servicio quedó registrado con `quantity: 1`.

### 6. Incrementar la cantidad sin duplicar el servicio

Se repitió la solicitud de asociación para el mismo servicio y la misma reserva.

Al consultar nuevamente la reserva, se comprobó que el servicio aparecía una sola vez, con `quantity: 2`.

**Resultado:** comportamiento correcto. La cantidad se incrementó sin duplicar el registro.

### 7. Comprobar la persistencia después de reiniciar el servidor

Se detuvo el servidor y se inició nuevamente con `npm run dev`.

Después se consultó la reserva mediante `GET /api/bookings/:bid`.

**Resultado:** los datos seguían almacenados y el servicio conservaba `quantity: 2`.

Esta prueba confirmó la persistencia de los datos en los archivos JSON tras reiniciar el servidor.

### 8. Validar datos incorrectos

Se intentó crear un servicio con `duration: 0`.

**Solicitud:**

```http
POST http://localhost:3000/api/services
```

**Resultado:** `400 Bad Request`.

La API devolvió un error de validación que incluía el mensaje:

```json
{
  "status": "error",
  "message": "Datos del servicio inválidos",
  "errors": [
    "duration debe ser un número entero mayor que 0"
  ]
}
```

La validación impidió registrar el servicio con una duración no válida.

### 9. Impedir la asociación de un servicio no disponible

Se actualizó `Masaje relajante` mediante `PUT /api/services/:sid`, enviando todos sus campos y estableciendo `available: false`.

Después se intentó asociar nuevamente el servicio a la reserva.

**Resultado:** `409 Conflict`.

La API rechazó la operación porque el servicio no estaba disponible.

Finalmente, se consultó otra vez la reserva y se comprobó que la cantidad seguía siendo `2`, sin incrementos ni registros duplicados.

## Códigos de respuesta HTTP

| Código | Significado |
|---|---|
| `200 OK` | Solicitud procesada correctamente |
| `201 Created` | Recurso creado correctamente |
| `400 Bad Request` | Datos inválidos o error de validación |
| `404 Not Found` | Recurso no encontrado |
| `409 Conflict` | Operación no permitida por un conflicto, como un servicio no disponible |
| `500 Internal Server Error` | Error interno del servidor |

## Persistencia de datos

La API utiliza archivos JSON para guardar la información:

- `src/data/services.json`: almacena los servicios.
- `src/data/bookings.json`: almacena las reservas.

Las operaciones de lectura y escritura son gestionadas por la capa DAO. Los datos permanecen guardados en los archivos, por lo que no se pierden simplemente al detener y reiniciar el servidor.

## Objetivo del proyecto

El objetivo es implementar una API REST organizada en capas, separando las rutas, los controladores, la lógica de negocio, los repositorios y el acceso a los datos.

El proyecto permite practicar:

- Diseño y desarrollo de endpoints REST.
- Separación de responsabilidades.
- Validación de datos.
- Gestión de relaciones entre recursos.
- Manejo de errores y códigos HTTP.
- Persistencia mediante FileSystem y archivos JSON.
- Pruebas funcionales con Postman.

## Autor

Proyecto académico de desarrollo backend con Node.js y Express.

Repositorio: https://github.com/moises2872024/sistema-reservas-api-dao-repository
