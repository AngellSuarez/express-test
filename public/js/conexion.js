const { MongoClient } = require('mongodb');

// URL del servidor de MongoDB
const url = 'mongodb://localhost:27017/';

// Nombre de la base de datos
const dbName = 'intento1';

// Función para conectar y guardar datos en MongoDB
async function ConexionMongoDB(jugadoresGuardados) {
    const client = new MongoClient(url);

    try {
        // Conexión al servidor
        await client.connect();
        console.log("Conexión establecida correctamente");

        // Selección de la base de datos
        const db = client.db(dbName);

        // Selección de la colección
        const collection = db.collection("intentoxd");

        // Insertar múltiples documentos en la colección
        await collection.insertMany(jugadoresGuardados);
        console.log("Documentos insertados exitosamente");
    } catch (error) {
        console.error("Error al conectar o insertar datos en MongoDB:", error);
    } finally {
        // Cerrar la conexión
        await client.close();
        console.log("Conexión cerrada");
    }
}

module.exports = ConexionMongoDB;
