# Fotaza

Aplicación web para almacenar, ordenar, buscar y compartir fotografías. Los usuarios pueden publicar imágenes con licencias, comentarlas, valorarlas con estrellas, seguir a otros usuarios, crear colecciones, recibir notificaciones, enviar mensajes privados y reportar contenido.

## Stack

| Herramienta | Propósito |
|---|---|
| **Express 5** | Framework HTTP para el servidor y enrutamiento |
| **Pug** | Motor de plantillas con herencia, mixins y lógica embebida |
| **PostgreSQL + Sequelize 6** | Base de datos relacional con ORM |
| **Tailwind CSS v4** | Framework CSS utility-first |
| **bcrypt** | Hash de contraseñas con salt automático |
| **express-session** | Sesiones del lado del servidor vía cookies |
| **Cloudinary + Sharp** | Almacenamiento externo de imágenes + procesamiento (resize, watermark) |
| **Multer** | Subida de archivos en memoria (memoryStorage) |
| **Zod** | Validación de schemas en el servidor |
| **dotenv** | Variables de entorno |

## Estructura del Proyecto

```
tp-integrador/
├── app.js                    # Entry point: Express, sesiones, rutas, conexión BD
├── package.json
├── .env.example
├── AGENTS.MD                 # Consignas del TP
├── config/
│   ├── cloudinary.js          # SDK de Cloudinary
│   └── config.json            # Placeholder de Sequelize CLI
├── models/
│   ├── config.js              # Conexión Sequelize (PostgreSQL + Neon SSL)
│   ├── index.js               # Asociaciones entre modelos
│   ├── User.js / Post.js / Image.js / Tag.js
│   ├── Comment.js / Valoration.js / Interest.js / Follow.js
│   ├── Collection.js / CollectionPost.js
│   ├── Notification.js / Report.js / Message.js
├── controllers/
│   ├── auth.js                # Login, signup, logout
│   ├── feed.js                # Feed público con orden dinámico
│   ├── posts.js               # CRUD posts, comentarios, rating, interés, edición
│   ├── search.js              # Búsqueda con filtros combinables y paginación
│   ├── profile.js             # Perfil propio, perfil público, watermark
│   ├── users.js               # Seguir/dejar de seguir
│   ├── collections.js         # Colecciones y favoritos
│   ├── notifications.js       # Notificaciones (crear, listar, marcar leídas)
│   ├── messages.js            # Mensajería privada
│   ├── reports.js             # Denuncias de imágenes y comentarios
│   └── validator.js           # Panel de validador (dar de baja, desestimar)
├── routes/
│   ├── auth.js / posts.js / search.js
│   ├── users.js / profile.js / following.js
│   ├── collections.js / notifications.js / messages.js
│   ├── reports.js / validator.js
├── validators/
│   ├── auth.js                # Zod schema para login/signup
│   ├── post.js                # Zod schema para crear/editar posts
│   ├── comment.js             # Zod schema para comentarios
│   └── collection.js          # Zod schema para colecciones
├── middlewares/
│   ├── auth.js                # authMiddleware, loadCurrentUser
│   ├── upload.js              # Multer + validación de archivos
│   └── validator.js           # Restricción de rol validador/admin
├── views/
│   ├── layout.pug             # Layout raíz con nav
│   ├── index.pug              # Landing page
│   ├── feedBrowser.pug        # Feed público
│   ├── following.pug          # Publicaciones de seguidos
│   ├── search.pug             # Búsqueda con paginación
│   ├── profile.pug            # Perfil del usuario
│   ├── auth/                  # login.pug, signup.pug
│   ├── posts/                 # detail.pug, new.pug, edit.pug
│   ├── collections/           # index.pug, detail.pug, create.pug
│   ├── notifications/         # index.pug
│   ├── messages/              # inbox.pug, chat.pug
│   ├── validator/             # index.pug
│   ├── mixins/                # nav, alert, feed, postCard, commentCard, filterByOrderBar, reportModal, watermarkEditor
│   └── partials/              # searchBar
├── scripts/
│   ├── initDb.js              # npm run db:init
│   ├── seeders/seed.js        # npm run db:seed
│   ├── exportSeed.js          # npm run db:export-seed
│   ├── clearDb.js             # npm run db:clear
│   ├── migrateUploads.js      # npm run db:migrate-uploads
│   └── backfillThumbnails.js  # npm run db:backfill-thumbnails
├── public/
│   ├── styles/output.css      # Tailwind compilado
│   └── imgs/                  # defaultUser.jpg, fotazaCompressed.jpg
└── diagrams/                  # Diagramas del TP
```

## Rutas (Endpoints)

### Autenticación (`/auth`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/auth/login` | `auth.loginForm` | — | Mostrar login |
| POST | `/auth/login` | `auth.login` | — | Procesar login |
| GET | `/auth/signup` | `auth.signupForm` | — | Mostrar registro |
| POST | `/auth/signup` | `auth.signup` | — | Procesar registro |
| POST | `/auth/logout` | `auth.logout` | — | Destruir sesión |

### Posts (`/posts`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/posts/new` | `posts.createForm` | auth | Formulario de nueva publicación |
| POST | `/posts/new` | `posts.create` | auth + upload | Crear publicación con imágenes |
| GET | `/posts/:postId` | `posts.detail` | — | Detalle de publicación |
| GET | `/posts/:postId/edit` | `posts.editForm` | auth | Formulario de edición (solo autor, sin reportes) |
| POST | `/posts/:postId/edit` | `posts.update` | auth | Procesar edición de título/descripción |
| POST | `/posts/:postId/images/:imageId/comments` | `posts.addComment` | auth | Agregar comentario |
| POST | `/posts/:postId/images/:imageId/comments/:commentId/delete` | `posts.deleteComment` | auth | Borrar comentario (solo autor del post) |
| POST | `/posts/:postId/images/:imageId/rate` | `posts.rateImage` | auth | Valorar imagen (1-5) |
| POST | `/posts/:postId/images/:imageId/interest` | `posts.toggleInterest` | auth | Me interesa / No me interesa |
| POST | `/posts/:postId/images/:imageId/close-comments` | `posts.closeComments` | auth | Cerrar comentarios (solo autor) |
| POST | `/posts/:postId/images/:imageId/open-comments` | `posts.openComments` | auth | Reabrir comentarios (solo autor) |
| POST | `/posts/:postId/favorite` | `collections.toggleFavorite` | auth | Agregar/quitar de favoritos |

### Búsqueda (`/search`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/search` | `search.search` | — | Buscar con filtros y paginación (12 por página) |

### Usuarios (`/users`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/users/:userId` | `profile.publicProfile` | — | Perfil público de usuario |
| POST | `/users/:userId/follow` | `users.toggleFollow` | auth | Seguir / dejar de seguir |

### Perfil (`/profile`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/profile` | `profile.profile` | auth | Perfil propio con contadores |
| POST | `/profile/watermark` | `profile.updateWatermark` | auth | Actualizar texto de marca de agua |

### Following (`/following`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/following` | `profile.following` | auth | Posts de usuarios seguidos |

### Colecciones (`/collections`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/collections` | `collections.index` | auth | Listar colecciones del usuario |
| GET | `/collections/create` | `collections.createForm` | auth | Formulario de nueva colección |
| POST | `/collections` | `collections.create` | auth | Crear colección |
| GET | `/collections/:id` | `collections.detail` | auth | Detalle de colección con posts |
| POST | `/collections/:id/posts/:postId` | `collections.addPost` | auth | Agregar post a colección |
| POST | `/collections/:id/posts/:postId/delete` | `collections.removePost` | auth | Quitar post de colección |
| POST | `/collections/:id/delete` | `collections.destroy` | auth | Eliminar colección |

### Notificaciones (`/notifications`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/notifications` | `notifications.index` | auth | Listar notificaciones |
| POST | `/notifications/:id/read` | `notifications.markAsRead` | auth | Marcar como leída |
| POST | `/notifications/read-all` | `notifications.markAllAsRead` | auth | Marcar todas como leídas |

### Mensajes (`/messages`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/messages` | `messages.index` | auth | Bandeja de entrada |
| GET | `/messages/:userId` | `messages.chat` | auth | Conversación con un usuario |
| POST | `/messages/:userId` | `messages.send` | auth | Enviar mensaje |

### Denuncias (`/reports`)

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| POST | `/reports/images/:imageId` | `reports.reportImage` | auth | Denunciar imagen |
| POST | `/reports/comments/:commentId` | `reports.reportComment` | auth | Denunciar comentario |

### Validador (`/validator`) — solo rol `validator` o `admin`

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/validator` | `validator.dashboard` | auth + validator | Panel con denuncias pendientes |
| POST | `/validator/posts/:id/takedown` | `validator.takeDownPost` | auth + validator | Dar de baja publicación (3 bajas → cuenta inactiva) |
| POST | `/validator/posts/:id/dismiss` | `validator.dismissPostReports` | auth + validator | Desestimar denuncias del post |
| POST | `/validator/comments/:id/delete` | `validator.deleteReportedComment` | auth + validator | Eliminar comentario denunciado |
| POST | `/validator/comments/:id/dismiss` | `validator.dismissCommentReports` | auth + validator | Desestimar denuncias del comentario |

### Generales

| Método | Ruta | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| GET | `/` | — (inline) | — | Landing page |
| GET | `/feed` | `feed.feed` | — | Feed público con orden (default: más votado) |

## Modelos (BD)

| Modelo | Tabla | Columnas clave | Asociaciones |
|---|---|---|---|
| **User** | `users` | id, firstName, lastName, email, password, avatar, watermarkText, rol, isActive, deletedAt | hasMany Post/Comment/Valoration/Interest, belongsToMany User (Follow) |
| **Post** | `posts` | id, title, description, userId, status, deletedAt | belongsTo User, hasMany Image, belongsToMany Tag |
| **Image** | `images` | id, postId, url, thumbnailUrl, altText, license, commentsEnabled, deletedAt | belongsTo Post, hasMany Comment/Valoration/Interest/Report |
| **Tag** | `tags` | id, name, deletedAt | belongsToMany Post |
| **Comment** | `comments` | id, imageId, userId, content, deletedAt | belongsTo Image/User, hasMany Report |
| **Valoration** | `valorations` | id, imageId, userId, value (1-5), deletedAt | belongsTo Image/User. Unique (imageId, userId) |
| **Interest** | `interests` | id, imageId, userId, activo | belongsTo Image/User. Unique (imageId, userId) |
| **Follow** | `follows` | id, followerId, followedId, deletedAt | belongsTo User. Unique (followerId, followedId) |
| **Collection** | `collections` | id, userId, name, description, isDefault | belongsTo User, belongsToMany Post |
| **CollectionPost** | `collection_posts` | id, collectionId, postId | belongsTo Collection/Post. Unique (collectionId, postId) |
| **Notification** | `notifications` | id, userId, type, relatedUserId, postId, imageId, read | belongsTo User/Post/Image |
| **Report** | `reports` | id, imageId, commentId, userId, motivo, descripcion, status, resolvedBy, resolvedAt | belongsTo Image/Comment/User |
| **Message** | `messages` | id, senderId, receiverId, content, read | belongsTo User (sender/receiver) |

## Funcionalidades

- **Registro y login** con bcrypt + sesiones (express-session)
- **Publicaciones**: título, descripción, 1-3 imágenes, etiquetas, licencia por imagen (copyright / no-copyright)
- **Edición de publicaciones**: solo título y descripción, bloqueada si hay denuncias pendientes
- **Marca de agua**: imágenes con copyright obtienen watermark SVG con texto personalizable por el usuario
- **Comentarios** por imagen, el autor puede cerrarlos/reactivarlos
- **Valoración**: 1-5 estrellas, una vez por usuario, el autor no puede votar, muestra promedio y cantidad
- **"Me interesa"**: toggle + notificación + mensaje automático al autor
- **Licencias**: copyright (marca de agua, bloqueado para anónimos) y no-copyright (público)
- **Feed público** con orden dinámico: más reciente, más antiguo, mejor valorado, más votado (default)
- **Búsqueda** con filtros combinables (título, autor, etiqueta) y paginación (12 por página)
- **Seguimiento**: follow/unfollow con soft-delete, no self-follow, perfil con contadores
- **Feed de seguidos**: `/following` muestra posts de usuarios seguidos
- **Colecciones**: CRUD, colección default "Favoritos", sin duplicados
- **Notificaciones**: eventos (comment, valoration, interest, follow), marcar leídas, marcar todas leídas
- **Denuncias**: imágenes y comentarios con motivo + descripción, sin duplicados por usuario
- **Validador**: panel con reportes (3+ denuncias), dar de baja o desestimar, 3 bajas → cuenta inactiva
- **Autor de post**: ve denuncias de comentarios y puede borrarlos
- **Mensajería privada**: inbox con conversaciones, envío automático al clickear "me interesa"
- **Cloudinary + thumbnails**: imágenes subidas a Cloudinary con thumbnail (200x200)
- **Validación Zod**: schemas en auth, posts, comentarios y colecciones

## Middleware

| Middleware | Descripción |
|---|---|
| `loadCurrentUser` (global) | Carga usuario desde sesión a `res.locals.currentUser` |
| `authMiddleware` | Protege rutas, redirige a login si no hay sesión |
| `uploadImages` | Multer con memoryStorage, 5MB máx, formatos jpeg/png/gif/webp |
| `validatorMiddleware` | Restringe acceso a usuarios con rol `validator` o `admin` |

## Requisitos

- Node.js 18+
- PostgreSQL (local o Neon)
- Cuenta en [Cloudinary](https://cloudinary.com)
- Cuenta en [Neon](https://neon.tech) (opcional, para producción)

## Configuración

1. Clonar el repositorio y ejecutar `npm install`
2. Copiar `.env.example` a `.env` y completar variables
3. Tener PostgreSQL corriendo en local
4. Ejecutar `npm run db:init` para crear tablas
5. Ejecutar `npm run db:seed` para poblar la BD con datos demo
6. `npm run dev` para desarrollo
7. `npm start` para producción

## Variables de Entorno (`.env`)

```
PORT=4000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=fotaza
DB_PORT=5432
SESSION_SECRET=clave_aleatoria
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Desarrollo con Tailwind watch + BrowserSync + nodemon |
| `npm run db:init` | Crea/actualiza tablas con `alter: true` |
| `npm run db:seed` | Pobla la BD con datos demo |
| `npm run db:export-seed` | Exporta datos actuales a `seeders/seed.js` |
| `npm run db:clear` | Vacía todas las tablas (truncate) |
| `npm run db:migrate-uploads` | Migra imágenes locales a Cloudinary |
| `npm run db:backfill-thumbnails` | Genera thumbnails faltantes |

## Deploy en Render + Neon

1. Crear proyecto en Neon, copiar connection string, extraer host/user/password/database
2. En Render crear Web Service. Build Command: `npm install`, Start Command: `npm start`
3. Agregar variables de entorno en Render
4. En el dashboard de Render, ejecutar una shell y correr `npm run db:seed` para primera carga de datos
