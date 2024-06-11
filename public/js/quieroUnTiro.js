
document.addEventListener('DOMContentLoaded', function() {
    var mapOptions = {
      center: [6.270434, -75.601172],
      zoom: 13,
    }; // opciones del mapa
  
    var map = L.map("map", mapOptions);
    var layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
    map.addLayer(layer); // creación del mapa
  
    var iconOptions = {
      iconUrl: "./img/logo.png",
      iconSize: [30, 30],
    }; // opciones del icono
    var customIcon = L.icon(iconOptions);
  
    var marcadorOptions = {
      title: "fija",
      clickable: true,
      draggable: false,
      // icon: customIcon
    }; // opciones del marcador fijo
    var marcador = L.marker([6.270434, -75.601172], marcadorOptions);
    marcador.bindPopup("nuestra ubicacion").openPopup();
    marcador.addTo(map); // creación del marcador fijo
  
    var popup = L.popup();
    var lastCoordinates = null;
    var locacionesguar = [];
    var marcadoresDinamicos = [];
    var nombresJugadores = [];
  
    // Función para crear marcadores dinámicos
    function crearMarcadores(count) {
      marcadoresDinamicos.forEach(marker => map.removeLayer(marker));
      marcadoresDinamicos = [];
  
      console.log(`marcadores a mostrar ${count}`);
      for (let i = 0; i < count; i++) {
        let lat = 6.270434 + (Math.random() - 0.5) * 0.3;
        let lng = -75.601172 + (Math.random() - 0.5) * 0.3;
        var markerOptions = {
          title: `marcador ${i + 1}`,
          clickable: true,
          draggable: true,
          icon: customIcon,
        };
  
        var marcadoresNuevos = L.marker([lat, lng], markerOptions);
        marcadoresDinamicos.push(marcadoresNuevos);
        var distance = map.distance(marcador.getLatLng(), marcadoresNuevos.getLatLng());
        marcadoresNuevos.bindPopup(`marcador ${i + 1} está a ${distance.toFixed(2)} metros del centro`);
        marcadoresNuevos.addTo(map);
  
        marcadoresNuevos.on("dragend", function(e) {
          var nuevascoordenadas = e.target.getLatLng();
          console.log(`Coordenadas para el marcador ${i + 1}:`, nuevascoordenadas);
          locacionesguar.push(nuevascoordenadas);
          console.log(`Se guardaron las nuevas coordenadas:`, locacionesguar);
        });
      }
  
      console.log("nuevas locaciones guardadas:", locacionesguar);
  
      const socket = io();
      socket.emit('guardarJugadores', locacionesguar);
    }
  
    // Función para crear párrafos con selectores de color
    function crearParrafos(seccion) {
      console.log(`se deben crear ${seccion}`);
      var parrafosJugadores = document.getElementById('parrafosJugadores');
      parrafosJugadores.innerHTML = '';
  
      nombresJugadores = [];
  
      for (let j = 1; j <= seccion; j++) {
        var parrafo = document.createElement('p');
        var jugadorSpan = document.createElement('span');
        jugadorSpan.id = 'player' + j;
        jugadorSpan.className = 'click';
        jugadorSpan.textContent = 'player' + j;
        parrafo.appendChild(jugadorSpan);
  
        var selectorColores = document.createElement('select');
        selectorColores.className = 'selectorColor';
  
        var colores = [
          "defecto",
          "rojo",
          "naranja",
          "blanco",
          "negro",
          "rosado",
          "verde",
          "cafe",
          "gris",
          "morado",
          "amarillo",
        ];
        colores.forEach(function(color) {
          var opcionColor = document.createElement('option');
          opcionColor.value = color;
          opcionColor.textContent = color;
          selectorColores.appendChild(opcionColor);
        });
  
        parrafo.appendChild(selectorColores);
        parrafosJugadores.appendChild(parrafo);
      }
    }
  
    var cant_players = document.getElementById('markerPlayerCount');
  
    if (cant_players) {
      cant_players.addEventListener("change", function() {
        console.log("cambio el valor del select");
  
        var seccion = parseInt(cant_players.value);
        crearParrafos(seccion);
        locacionesguar = [];
        crearMarcadores(seccion);
      });
    }
  
    document.getElementById('parrafosJugadores').addEventListener('click', function(event) {
      if (event.target.className === 'click') {
        var playerId = event.target.id;
        nuevoNombre(playerId);
        console.log(`se escogió al jugador: ${playerId}`);
      }
    });
  
    document.getElementById('parrafosJugadores').addEventListener('change', function(event) {
      if (event.target.classList.contains('selectorColor')) {
        let playerId = event.target.parentElement.querySelector('.click').id;
        cambioColor(playerId, event.target.value);
      }
    });
  
    const botonGuardar = document.getElementById('btnGuardar');
    botonGuardar.addEventListener('click', () => {
      guardarJugadores(locacionesguar, nombresJugadores);
    });
  
    function nuevoNombre(playerId) {
      var nombreJugador = prompt("Ingrese el nombre del jugador: ");
      if (nombreJugador) {
        var jugadorSpan = document.getElementById(playerId);
        jugadorSpan.textContent = nombreJugador;
        console.log(`se cambió el nombre del jugador ${playerId} por ${nombreJugador}`);
        nombresJugadores.push({ nombre: nombreJugador, color: jugadorSpan.style.backgroundColor });
        console.log(`nombres acumulados ${nombresJugadores}`);
      } else {
        console.log(`nombre no ingresado`);
      }
    }
  
    function cambioColor(playerId, color) {
      var jugadorSpan = document.getElementById(playerId);
      switch (color) {
        case "defecto":
          jugadorSpan.style.backgroundColor = "";
          jugadorSpan.style.color = "";
          break;
        case "rojo":
          jugadorSpan.style.backgroundColor = "red";
          jugadorSpan.style.color = "white";
          break;
        case "naranja":
          jugadorSpan.style.backgroundColor = "orange";
          jugadorSpan.style.color = "white";
          break;
        case "blanco":
          jugadorSpan.style.backgroundColor = "white";
          jugadorSpan.style.color = "black";
          break;
        case "negro":
          jugadorSpan.style.backgroundColor = "black";
          jugadorSpan.style.color = "white";
          break;
        case "rosado":
          jugadorSpan.style.backgroundColor = "pink";
          jugadorSpan.style.color = "black";
          break;
        case "verde":
          jugadorSpan.style.backgroundColor = "green";
          jugadorSpan.style.color = "white";
          break;
        case "cafe":
          jugadorSpan.style.backgroundColor = "brown";
          jugadorSpan.style.color = "white";
          break;
        case "gris":
          jugadorSpan.style.backgroundColor = "gray";
          jugadorSpan.style.color = "white";
          break;
        case "morado":
          jugadorSpan.style.backgroundColor = "purple";
          jugadorSpan.style.color = "white";
          break;
        case "amarillo":
          jugadorSpan.style.backgroundColor = "yellow";
          jugadorSpan.style.color = "black";
          break;
      }
    }
  
    // Función para guardar jugadores
    const clases = ['mago', 'clerigo', 'enano', 'sanador', 'arquero', 'esclavo', 'asesino', 'escudero', 'explorador', 'guerrero'];
  
    const nivelRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const claseRandom = arr => Math.floor(Math.random() * arr.length);
  
    async function guardarJugadores(locacionesguar, elementosJugadores) {
      const jugadoresGuardados = [];
  
      elementosJugadores.forEach((elementoJugador, index) => {
        const nombreJugador = elementoJugador.nombre;
        const color = elementoJugador.color;
        const nivelJugador = nivelRandom(1, 100);
        const claseJugador = clases[claseRandom(clases)];
        const ubicacionJugador = locacionesguar[index];
  
        const jugador = {
          nombre: nombreJugador,
          color: color,
          nivel: nivelJugador,
          clase: claseJugador,
          ubicacion: ubicacionJugador
        };
        jugadoresGuardados.push(jugador);
      });
  
      console.log('jugadores guardados', jugadoresGuardados);
  
      // Código para guardar los datos en MongoDB
        try {
        // Llama a la función ConexionMongoDB y pasa los datos jugadoresGuardados
            await ConexionMongoDB(jugadoresGuardados);
            console.log('Jugadores guardados exitosamente en la base de datos.');
        } catch (error) {
            console.error('Error al guardar jugadores en la base de datos:', error);
        }
    }
});
  