const ConexionMongoDB = require('./public/js/conexion'); //pedir la funcion

module.exports = function(io) {
    io.on('connection', function(socket) {
        // escucha el evento del index para guardar en el mongolitodb
        socket.on('guardarJugadores', function(jugadoresGuardados) {
            // Aquí guardas los datos recibidos en la base de datos
            ConexionMongoDB(jugadoresGuardados)
                .then(() => {
                    console.log('Datos de jugadores guardados exitosamente en la base de datos.');
                })
                .catch(error => {
                    console.error('Error al guardar datos de jugadores en la base de datos:', error);
                });
        });
    });
};
