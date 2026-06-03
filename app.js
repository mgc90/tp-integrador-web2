import { connectDatabase } from './models/index.js';

import express from 'express';
var app = express();

const PORT = process.env.PORT;



app.use(express.static('public'));

// MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index');
})



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