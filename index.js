const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Almacén temporal de datos
let datos = [];

// Obtener todos los elementos
app.get('/items', (req, res) => {
  res.json(datos);
});

// Obtener un elemento por ID
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = datos.find(item => item.id === id);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Elemento no encontrado' });
  }
});

// Crear un nuevo elemento
app.post('/items', (req, res) => {
  const newItem = req.body;
  newItem.id = datos.length + 1;
  datos.push(newItem);
  res.status(201).json(newItem);
});

// Actualizar un elemento por ID
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  const index = datos.findIndex(item => item.id === id);

  if (index !== -1) {
    datos[index] = { ...datos[index], ...updatedItem };
    res.json(datos[index]);
  } else {
    res.status(404).json({ message: 'Elemento no encontrado' });
  }
});

// Eliminar un elemento por ID
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  datos = datos.filter(item => item.id !== id);
  res.json({ message: 'Elemento eliminado correctamente' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});



