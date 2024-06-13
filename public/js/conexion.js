const { MongoClient } = require('mongodb');

// URL del servidor de MongoDB
const url = 'mongodb://localhost:27017/';

// Nombre de la base de datos y colección
const dbName = 'intentoxd';
const collectionName = 'jugadores';

async function ConexionMongoDB(locacionesguar, nombresJugadores) {
    const client = new MongoClient(url);

    try {
        // Conexión al servidor
        await client.connect();
        console.log("Conexión establecida correctamente");

        // Selección de la base de datos y colección
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Preparar los documentos para insertar en MongoDB
        const documentos = [];
        for (let i = 0; i < locacionesguar.length; i++) {
            documentos.push({
                nombre: nombresJugadores[i].nombre,
                color: nombresJugadores[i].color,
                nivel: Math.floor(Math.random() * 100) + 1, // Ejemplo de nivel aleatorio
                clase: 'guerrero', // Ejemplo de clase estática
                ubicacion: locacionesguar[i]
            });
        }

        // Insertar documentos en la colección
        await collection.insertMany(documentos);
        console.log("Documentos insertados exitosamente en MongoDB");
    } catch (error) {
        console.error("Error al conectar o insertar datos en MongoDB:", error);
    } finally {
        // Cerrar la conexión
        await client.close();
        console.log("Conexión cerrada");
    }
}

module.exports = ConexionMongoDB;
