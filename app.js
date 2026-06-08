import { connectDatabase } from './models/index.js';
import authRouter from './routes/auth.js';

import express from 'express';
var app = express();

const PORT = process.env.PORT;



app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');

// RUTAS
app.get('/', (req, res) => {
  res.render('index');
})


app.use('/auth', authRouter);


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