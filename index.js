const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Definición de opciones para Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Proyecto CRUD API',
      version: '1.0.0',
      description: 'API para un proyecto CRUD en Node.js y Express',
    },
  },
  apis: ['./index.js'], // Archivo principal que contiene las rutas
};

// Configuración de Swagger con las opciones
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Almacén temporal de datos
let datos = [];

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único del elemento
 *         name:
 *           type: string
 *           description: Nombre del elemento
 *         description:
 *           type: string
 *           description: Descripción del elemento
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Obtener todos los elementos
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get('/items', (req, res) => {
  res.json(datos);
});

// Resto de rutas y lógica CRUD

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Crear un nuevo elemento
 *     requestBody:
 *       description: Datos del nuevo elemento
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       '201':
 *         description: Elemento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */
app.post('/items', (req, res) => {
  const newItem = req.body;
  newItem.id = datos.length + 1;
  datos.push(newItem);
  res.status(201).json(newItem);
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Actualizar un elemento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del elemento a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos actualizados del elemento
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       '200':
 *         description: Elemento actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       '404':
 *         description: Elemento no encontrado
 */
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

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Eliminar un elemento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del elemento a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Elemento eliminado correctamente
 *       '404':
 *         description: Elemento no encontrado
 */
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  datos = datos.filter(item => item.id !== id);
  res.json({ message: 'Elemento eliminado correctamente' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
