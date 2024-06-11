const ConexionMongoDB = require('./public/js/conexion');

module.exports = function(io) {
    io.on('connection', function(socket) {
        // Escucha un evento desde el cliente que indica que se deben guardar los datos en la base de datos
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
