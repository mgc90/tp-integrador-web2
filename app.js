import 'dotenv/config';
import { connectDatabase } from './models/index.js';
import { feed } from './controllers/feed.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import searchRouter from './routes/search.js';
import usersRouter from './routes/users.js';
import profileRouter from './routes/profile.js';
import followingRouter from './routes/following.js';
import collectionsRouter from './routes/collections.js';
import notificationsRouter from './routes/notifications.js';
import { loadCurrentUser } from './middlewares/auth.js';
import session from 'express-session';

import express from 'express';
var app = express();

const PORT = process.env.PORT;



app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// SESION
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_dev',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));


// MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');

// MIDDLEWARE GLOBAL - carga currentUser desde la sesion
app.use(loadCurrentUser);

// currentPath para resaltar link activo en el nav
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// RUTAS
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/feed', feed);


app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/search', searchRouter);
app.use('/users', usersRouter);
app.use('/profile', profileRouter);
app.use('/following', followingRouter);
app.use('/collections', collectionsRouter);
app.use('/notifications', notificationsRouter);


// CONEXION A BD
connectDatabase()
  .then(() => {
    app.listen(PORT, (err) => {
      if(err) {
        console.error('Error al iniciar el servidor:', err);
        return;
      }
      console.log(`Servidor activo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error sincronizando con bd:', err)
  })