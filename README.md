# Fotaza

Aplicación web para almacenar, ordenar, buscar y compartir fotografías. Los usuarios pueden publicar imágenes con licencias, comentarlas, valorarlas con estrellas, y seguir a otros usuarios.

## Estructura del Proyecto

```
tp-integrador/
├── app.js                  # Entry point: Express, sesión, rutas, conexión BD
├── package.json
├── .env.example
├── config/
│   ├── cloudinary.js        # SDK de Cloudinary
│   └── config.json          # Placeholder de Sequelize CLI
├── models/
│   ├── config.js            # Conexión Sequelize (PostgreSQL + Neon SSL)
│   ├── index.js             # Asociaciones y connectDatabase()
│   ├── User.js / Post.js / Image.js / Tag.js
│   └── Comment.js / Valoration.js / Interest.js / Follow.js
├── controllers/
│   ├── auth.js              # Login, signup, logout
│   ├── feed.js              # Feed público con orden
│   ├── posts.js             # CRUD posts, comentarios, rating, interés
│   ├── search.js            # Búsqueda con filtros
│   ├── users.js             # Seguir/dejar de seguir
│   └── profile.js           # Perfil y following
├── routes/
│   ├── auth.js / posts.js / search.js
│   ├── users.js / profile.js / following.js
├── views/
│   ├── layout.pug           # Layout raíz
│   ├── index.pug            # Landing
│   ├── feedBrowser.pug / following.pug / search.pug / profile.pug
│   ├── auth/                # login.pug, signup.pug
│   ├── posts/               # detail.pug, new.pug
│   ├── mixins/              # nav, alert, feed, postCard, commentCard, filterByOrderBar
│   └── partials/            # searchBar
├── middlewares/
│   └── auth.js              # authMiddleware, loadCurrentUser
├── scripts/
│   ├── initDb.js            # npm run db:init
│   ├── seed.js (seeders/)   # npm run db:seed
│   ├── exportSeed.js        # npm run db:export-seed
│   ├── clearDb.js           # npm run db:clear
│   └── migrateUploads.js    # npm run db:migrate-uploads
├── public/
│   ├── styles/output.css    # Tailwind compilado
│   └── imgs/                # defaultUser.jpg
└── diagrams/                # Diagramas del TP
```

## Stack

| Herramienta | Propósito |
|---|---|
| **Express** | Framework HTTP para el servidor y enrutamiento |
| **Pug** | Motor de plantillas que compila vistas HTML con herencia, mixins y lógica embebida |
| **PostgreSQL + Sequelize** | Base de datos relacional con ORM que abstrae consultas SQL y sincroniza esquemas |
| **Tailwind CSS v4** | Framework CSS utility-first para diseño responsivo sin CSS propio |
| **bcrypt** | Librería de hash de contraseñas con salt automático para almacenamiento seguro en BD |
| **express-session** | Middleware de sesiones del lado del servidor para persistir autenticación vía cookies |
| **Cloudinary + Sharp** | Servicio externo de almacenamiento de imágenes + procesamiento de imágenes (buffers, resize) |
| **Multer** | Middleware de subida de archivos que captura imágenes en memoria (memoryStorage) |
| **dotenv** | Carga variables de entorno desde `.env` a `process.env` en desarrollo |

## Rutas (Endpoints)

| Ruta | Método | Controlador | Middleware | Descripción |
|---|---|---|---|---|
| `/` | GET | — (inline) | — | Landing page pública |
| `/feed` | GET | `feed.feed` | — | Feed de publicaciones con orden por fecha/rating/más votado (default) |
| `/auth/login` | GET / POST | `auth.loginForm` / `auth.login` | — | Mostrar / procesar login |
| `/auth/signup` | GET / POST | `auth.signupForm` / `auth.signup` | — | Mostrar / procesar registro |
| `/auth/logout` | POST | `auth.logout` | — | Destruir sesión |
| `/posts/new` | GET | `posts.createForm` | `authMiddleware` | Formulario de nueva publicación |
| `/posts/new` | POST | `posts.create` | `authMiddleware` + multer | Crear publicación con imágenes y etiquetas |
| `/posts/:postId` | GET | `posts.detail` | — | Detalle de publicación con imágenes, valoraciones y comentarios |
| `/posts/:postId/images/:imageId/comments` | POST | `posts.addComment` | `authMiddleware` | Agregar comentario a una imagen |
| `/posts/:postId/images/:imageId/rate` | POST | `posts.rateImage` | `authMiddleware` | Valorar imagen (1-5 estrellas) |
| `/posts/:postId/images/:imageId/interest` | POST | `posts.toggleInterest` | `authMiddleware` | Activar/desactivar "me interesa" |
| `/posts/:postId/images/:imageId/close-comments` | POST | `posts.closeComments` | `authMiddleware` | Cerrar comentarios de una imagen (solo autor) |
| `/posts/:postId/images/:imageId/open-comments` | POST | `posts.openComments` | `authMiddleware` | Reabrir comentarios de una imagen (solo autor) |
| `/search` | GET | `search.search` | — | Buscar publicaciones por título, autor o etiqueta |
| `/users/:userId/follow` | POST | `users.toggleFollow` | `authMiddleware` | Seguir / dejar de seguir a un usuario |
| `/profile` | GET | `profile.profile` | `authMiddleware` | Perfil del usuario logueado (seguidores/seguidos) |
| `/following` | GET | `profile.following` | `authMiddleware` | Publicaciones de usuarios seguidos |

## Modelos (BD)

| Modelo | Tabla | Columnas | Asociaciones |
|---|---|---|---|
| **User** | `users` | id, firstName, lastName, email, password, avatar, watermarkText, deletedAt | hasMany Post, hasMany Comment, hasMany Valoration, hasMany Interest, belongsToMany User (Follow) |
| **Post** | `posts` | id, title, description, userId, deletedAt | belongsTo User, hasMany Image, belongsToMany Tag (PostTag) |
| **Image** | `images` | id, postId, url, thumbnailUrl, altText, license (enum), commentsEnabled | belongsTo Post, hasMany Comment, hasMany Valoration, hasMany Interest |
| **Tag** | `tags` | id, name | belongsToMany Post (PostTag) |
| **Comment** | `comments` | id, imageId, userId, content | belongsTo Image, belongsTo User |
| **Valoration** | `valorations` | id, imageId, userId, value (1-5) | belongsTo Image, belongsTo User. Unique (imageId, userId) |
| **Interest** | `interests` | id, imageId, userId, activo | belongsTo Image, belongsTo User. Unique (imageId, userId) |
| **Follow** | `follows` | id, followerId, followedId, deletedAt | belongsTo User (follower / followed). Unique (followerId, followedId) |

## Vistas (Pug)

| Archivo | Hereda de | Mixins incluidos | Descripción |
|---|---|---|---|
| `layout.pug` | — | nav, alert | Layout raíz con nav + alert + bloque hero/content |
| `index.pug` | layout | — | Landing page pública |
| `feedBrowser.pug` | layout | feed, filterByOrderBar | Feed público con barra de orden |
| `following.pug` | layout | feed, filterByOrderBar | Publicaciones de seguidos con barra de orden |
| `search.pug` | layout | feed, filterByOrderBar | Búsqueda con filtros y barra de orden |
| `profile.pug` | layout | — | Perfil del usuario (avatar, seguidores, seguidos) |
| `posts/detail.pug` | layout | commentCard | Detalle de post con imágenes, valoración, comentarios e interés |
| `posts/new.pug` | layout | — | Formulario de nueva publicación |
| `auth/login.pug` | layout | — | Formulario de inicio de sesión |
| `auth/signup.pug` | layout | — | Formulario de registro |
| `mixins/nav.pug` | — | — | Barra de navegación con enlaces según auth |
| `mixins/alert.pug` | — | — | Alertas de feedback (error/success) |
| `mixins/feed.pug` | — | postCard | Grid de tarjetas de publicaciones |
| `mixins/postCard.pug` | — | — | Tarjeta individual de publicación con botón seguir |
| `mixins/commentCard.pug` | — | — | Comentario con autor y contenido |
| `mixins/filterByOrderBar.pug` | — | — | Botones de orden (más reciente, más antiguo, mejor valorado, más votado) |
| `partials/searchBar.pug` | — | — | Barra de búsqueda global en el nav |

## Controladores

| Archivo | Funciones | Descripción |
|---|---|---|
| `auth.js` | loginForm, login, signupForm, signup, logout | Autenticación: mostrar formularios, validar credenciales, crear/destruir sesión |
| `feed.js` | feed | Feed público con orden dinámico (default: más votado) y estado de follow |
| `posts.js` | detail, createForm, create, addComment, rateImage, closeComments, openComments, toggleInterest | CRUD de publicaciones, comentarios por imagen, valoración, toggle "me interesa", cierre/apertura de comentarios |
| `search.js` | search | Búsqueda con filtros combinables (título, autor, etiqueta) y orden dinámico |
| `users.js` | toggleFollow | Seguir/dejar de seguir con soft-delete y restore |
| `profile.js` | profile, following | Perfil del usuario y feed de publicaciones de usuarios seguidos |

## Middleware

| Archivo | Función | Descripción |
|---|---|---|
| `middlewares/auth.js` | authMiddleware | Protege rutas: redirige a login si no hay sesión. Setea `res.locals.currentUser` |
| `middlewares/auth.js` | loadCurrentUser | Middleware global: carga usuario desde sesión en `res.locals.currentUser` si existe |
| — | express-session | Maneja sesiones con cookie firmada (24h de vida) |
| — | multer (memoryStorage) | Captura archivos en buffer para procesarlos con Sharp antes de subir a Cloudinary |

## Requisitos

- Node.js 18+
- PostgreSQL (local o Neon)
- Cuenta en [Cloudinary](https://cloudinary.com)
- Cuenta en [Neon](https://neon.tech) (producción)

## Configuración

1. Clonar el repositorio y ejecutar `npm install`
2. Copiar `.env.example` a `.env` y completar variables
3. Tener PostgreSQL corriendo en local
4. Ejecutar `npm run db:init` para crear tablas
5. Ejecutar `npm run db:seed` para poblar la BD con datos demo
6. `npm run dev` para desarrollo con Tailwind + BrowserSync
7. `npm start` para producción

## Variables de Entorno (`.env`)

```
PORT=4000
DB_HOST=localhost           # localhost en dev / ep-xxxx.neon.tech en prod
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
| `npm run db:init` | Crea tablas si no existen (seguro para producción) |
| `npm run db:seed` | Pobla la BD con datos (usa `force: true`, solo para BD vacía) |
| `npm run db:export-seed` | Exporta datos actuales a `seeders/seed.js` |
| `npm run db:clear` | Vacía todas las tablas (truncate) |
| `npm run db:migrate-uploads` | Migra imágenes locales (`public/uploads/`) a Cloudinary |

## Deploy en Render + Neon

1. Crear proyecto en Neon, copiar connection string, extraer host/user/password/database
2. En Render crear Web Service. Build Command: `npm install`, Start Command: `npm start`
3. Agregar variables de entorno en Render (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, SESSION_SECRET, Cloudinary vars)
4. En el dashboard de Render, ejecutar una sesión de shell y correr `npm run db:seed` para la primera población de datos
