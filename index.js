const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');
const ConexionMongoDB = require('./public/js/conexion'); // Importa la función de conexión a MongoDB

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar Express para usar EJS como motor de plantillas
app.set('view engine', 'ejs'); // Establece EJS como el motor de plantillas por defecto
app.set('views', __dirname + '/public/views/'); // Especifica el directorio donde se encuentran las vistas EJS

app.use(express.static(__dirname + '/public'));

// URL del servidor de MongoDB
const url = 'mongodb://localhost:27017/';
const dbName = 'intentoxd';
const collectionName = 'jugadores';

// Ruta para servir la página principal usando EJS
app.get('/', (req, res) => {
    res.render('index'); // Renderiza la vista 'index.ejs'
});

// Manejar conexiones de clientes mediante Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado.');

    // Escucha el evento "guardarJugadores" del cliente
    socket.on('guardarJugadores', ({ locacionesguar, nombresJugadores }) => {
        // Llama a la función de conexión a MongoDB para guardar los datos
        ConexionMongoDB(locacionesguar, nombresJugadores)
            .then(() => {
                console.log('Datos de jugadores guardados en MongoDB correctamente.');
            })
            .catch(error => {
                console.error('Error al guardar datos de jugadores en MongoDB:', error);
            });
    });

    // Nuevo evento para manejar la solicitud de datos
    socket.on('obtenerJugadores', async () => {
        const client = new MongoClient(url);
        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            const jugadores = await collection.find({}).toArray();
            socket.emit('jugadoresDatos', jugadores);
        } catch (error) {
            console.error('Error al obtener datos de jugadores de MongoDB:', error);
        } finally {
            await client.close();
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
