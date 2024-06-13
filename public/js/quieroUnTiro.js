document.addEventListener("DOMContentLoaded", function () {
  const socket = io();

  var mapOptions = {
    center: [6.270434, -75.601172],
    zoom: 15,
  };

  var map = L.map("map", mapOptions);
  var layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
  map.addLayer(layer);

  var iconOptions = {
    iconUrl: "./img/logo.png",
    iconSize: [30, 30],
  };
  var customIcon = L.icon(iconOptions);

  var marcadorOptions = {
    title: "fija",
    clickable: true,
    draggable: false,
  };
  var marcador = L.marker([6.270434, -75.601172], marcadorOptions);
  marcador.bindPopup("nuestra ubicacion").openPopup();
  marcador.addTo(map);

  var locacionesguar = [];
  var nombresJugadores = [];
  var marcadoresDinamicos = []

  function crearMarcadores(count) {
    marcadoresDinamicos.forEach((marker) => map.removeLayer(marker));
    marcadoresDinamicos = [];
  
    console.log(`Marcadores a mostrar: ${count}`);
    for (let i = 0; i < count; i++) {
      let lat = 6.270434 + (Math.random() - 0.5) * 0.3;
      let lng = -75.601172 + (Math.random() - 0.5) * 0.3;
  
      var markerOptions = {
        title: `Marcador ${i + 1}`,
        clickable: true,
        draggable: true,
        icon: customIcon,
      };
  
      var marcadorNuevo = L.marker([lat, lng], markerOptions);
      marcadoresDinamicos.push(marcadorNuevo);
  
      var distance = map.distance(marcador.getLatLng(), marcadorNuevo.getLatLng());
      marcadorNuevo.bindPopup(`Marcador ${i + 1} está a ${distance.toFixed(2)} metros del centro`);
      marcadorNuevo.addTo(map);
  
      marcadorNuevo.on("dragend", function (e) {
        var nuevasCoordenadas = e.target.getLatLng();
        console.log(`Coordenadas para el marcador ${i + 1}:`, nuevasCoordenadas);
        locacionesguar.push(nuevasCoordenadas);
        console.log(`Se guardaron las nuevas coordenadas:`, locacionesguar);
      });
    }
  
    console.log("Nuevas locaciones guardadas:", locacionesguar);
  
    const socket = io();
    socket.emit("guardarJugadores", locacionesguar);
  }
  
  function crearParrafos(seccion) {
    console.log(`Se deben crear ${seccion} párrafos con selectores de color.`);
    var parrafosJugadores = document.getElementById("parrafosJugadores");
    parrafosJugadores.innerHTML = "";
  
    nombresJugadores = [];
  
    for (let j = 1; j <= seccion; j++) {
      var parrafo = document.createElement("p");
      var jugadorSpan = document.createElement("span");
      jugadorSpan.id = `player${j}`;
      jugadorSpan.className = "click";
      jugadorSpan.textContent = `player${j}`;
      parrafo.appendChild(jugadorSpan);
  
      var selectorColores = document.createElement("select");
      selectorColores.className = "selectorColor";
  
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
  
      colores.forEach(function (color) {
        var opcionColor = document.createElement("option");
        opcionColor.value = color;
        opcionColor.textContent = color;
        selectorColores.appendChild(opcionColor);
      });
  
      parrafo.appendChild(selectorColores);
      parrafosJugadores.appendChild(parrafo);
    }
  }
  

  var cant_players = document.getElementById("markerPlayerCount");

  if (cant_players) {
    cant_players.addEventListener("change", function () {
      var seccion = parseInt(cant_players.value);
      crearParrafos(seccion);
      locacionesguar = [];
      crearMarcadores(seccion);
    });
  }

  document
    .getElementById("parrafosJugadores")
    .addEventListener("click", function (event) {
      if (event.target.className === "click") {
        var playerId = event.target.id;
        nuevoNombre(playerId);
        console.log(`se escogió al jugador: ${playerId}`);
      }
    });

  document
    .getElementById("parrafosJugadores")
    .addEventListener("change", function (event) {
      if (event.target.classList.contains("selectorColor")) {
        let playerId = event.target.parentElement.querySelector(".click").id;
        cambioColor(playerId, event.target.value);
      }
    });

  const botonGuardar = document.getElementById("btnGuardar");
  botonGuardar.addEventListener("click", () => {
    guardarJugadores(locacionesguar, nombresJugadores);
  });

  function nuevoNombre(playerId) {
    var nombreJugador = prompt("Ingrese el nombre del jugador: ");
    if (nombreJugador) {
      var jugadorSpan = document.getElementById(playerId);
      jugadorSpan.textContent = nombreJugador;
      nombresJugadores.push({
        nombre: nombreJugador,
        color: jugadorSpan.style.backgroundColor,
      });
      console.log(`Nombre cambiado para ${playerId}: ${nombreJugador}`);
    } else {
      console.log(`No se ingresó ningún nombre.`);
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

  function guardarJugadores(locacionesguar, nombresJugadores) {
    socket.emit("guardarJugadores", { locacionesguar, nombresJugadores });
    console.log("Jugadores guardados:", { locacionesguar, nombresJugadores });
  }
});

