// ==================== INICIALIZACIÓN AL CARGAR ====================
document.addEventListener("DOMContentLoaded", () => {

  console.log("Ruta JS cargado correctamente");         // Mensaje de depuración para ver que el script se ha cargado ya que este tampoco cargaba

  // ==================== MENÚ LATERAL ====================
  //             abrir y cerrar el menú lateral
  const menuBtn = document.getElementById("menuBtn");   // Selecciona el botón 
  const menu = document.getElementById("menu");         // Selecciona el contenedor del menú lateral
  const overlay = document.getElementById("overlay");   // Selecciona el fondo oscuro 

  menuBtn.addEventListener("click", () => {             // Cuando se pulsa el botón 
    menu.classList.add("active");                       // muestra el menú añadiendo la clase "active"
    overlay.classList.add("active");                    // muestra el fondo oscuro
  });

  overlay.addEventListener("click", () => {             // Cuando se pulsa fuera del botón
    menu.classList.remove("active");                    // oculta el menú
    overlay.classList.remove("active");                 // oculta el fondo oscuro
  });


  // ==================== MAPA ====================
  //       Abre el mapa usando Leaflet, ya que la de google maps no funcnionaba
  const map = L.map('map', { zoomControl: true });      // Crea el mapa en el div con id="map" y activa los controles de zoom

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',   // Créditos que deben aparecer en el mapa
    subdomains: 'abcd'                                  // Distribuye la carga de las imágenes
  }).addTo(map);                                        // Añade la capa de mapas al objeto map


  // ==================== DATOS DEL VIAJE ====================
  //            Recupera datos guardados desde la página anterior
  const dataStr = localStorage.getItem("viaje");              // Obtiene los datos guardados en almacenamiento local
  if (!dataStr) {                                             // Si no hay datos
    alert("No hay datos de viaje. Volviendo a planificar.");  // Muestra alerta
    window.location.href = "file:///android_asset/ruta.html";                 // Redirige a la página de planificar
    return;                                                   // Detiene la ejecución del código
  }

  const data = JSON.parse(dataStr);                           // Convierte el texto JSON guardado en un objeto JavaScript para apk


  // ==================== FUNCIONES AUXILIARES ====================
  //    Funciones para obtener coordenadas y nombres de lugares

  async function getCoords(ciudad) {                    // Función para obtener coordenadas de una ciudad
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ciudad)}&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'PlaniCamper/1.0' } });
      const result = await res.json();
      if (result && result.length > 0) {
        return [parseFloat(result[0].lat), parseFloat(result[0].lon)];        // Devuelve latitud, longitud
      }
    } catch (e) {
      console.error(e);                                                       // Si hay error lo muestra en consola, que no mostraba nada antes
    }
    return null;                                                              // Si falla devuelve null
  }

  async function getPlaceName(lat, lon) {                                     // Para obtener el nombre de un lugar a partir de coordenadas
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=12`;
      const res = await fetch(url, { headers: { 'User-Agent': 'PlaniCamper/1.0' } });
      const result = await res.json();
      if (result && result.display_name) {
        return result.display_name.split(',')[0];       // Devuelve la primera parte del nombre de la ciudad o lugar más cercano
      }
    } catch (e) {}
    return null;                                        // Si falla, devuelve null
  }

  function randomPointAround(lat, lon, maxOffset, direction) {                          // Función que genera un punto aleatorio alrededor de otro
    const offsetLat = (Math.random() * maxOffset * 2 - maxOffset) * direction[0];
    const offsetLon = (Math.random() * maxOffset * 2 - maxOffset) * direction[1];
    return [lat + offsetLat, lon + offsetLon];                                          // Devuelve nuevas coordenadas lat, lon
  }


  // ==================== RUTA ====================
  //              genera y dibuja la ruta
  async function initRuta() {
    let origenCoords = await getCoords(data.origen);    // Intenta obtener las coordenadas reales de la ciudad de origen
    if (!origenCoords) {
      origenCoords = [40.0, -3.0];                      // Si falla usa coordenadas aproximadas del centro de España
    }

    const directions = {                                // Dirección de desplazamiento según el tipo de viaje
      costa: [0.25, 0.90],
      montaña: [0.65, -0.60],
      naturaleza: [0.50, 0.40],
      pueblos: [0.40, 0.40]
    };

    const dir = directions[data.tipo] || [0.4, 0.35];   // Selecciona la dirección según el tipo elegido

    let ruta = [origenCoords];                          // Comienza la ruta con el punto de origen
    const maxOffset = 2.4;                              // Distancia máxima aproximada entre puntos aproximadamente masmenos 260 km que es lo 
                                                        // que configuramos para no estar todo el dia al volante
  

    for (let i = 1; i < data.dias; i++) {                                             // Genera puntos intermedios según el número de días
      const last = ruta[ruta.length - 1];
      ruta.push(randomPointAround(last[0], last[1], maxOffset, dir));
    }

    ruta.push(randomPointAround(origenCoords[0], origenCoords[1], 0.7, [0.3, 0.3]));  // Último punto: regreso cerca del origen


    // ==================== DIBUJAR LISTA Y MAPA ====================
    const routeList = document.getElementById("routeList");                   // Selecciona el contenedor de la lista de días
    routeList.innerHTML = "";                                                 // Limpia la lista antes de añadir nuevos elementos

    for (let i = 0; i < ruta.length; i++) {                                   // Recorre todos los puntos de la ruta
      const p = ruta[i];
      let nombre = data.origen;

      if (i === 0) nombre = `${data.origen} (Inicio)`;                        // Primer punto = Inicio
      else if (i === ruta.length - 1) nombre = `${data.origen} (Regreso)`;    // Último punto = Regreso
      else {
        const placeName = await getPlaceName(p[0], p[1]);                     // Intenta obtener nombre real del lugar
        nombre = placeName || `Destino ${i+1}`;                               // Si no lo consigue, usa Destino X
      }

      L.marker(p).addTo(map).bindPopup(`<b>Día ${i+1}</b><br>${nombre}`);   // Añade marcador en el mapa

      const div = document.createElement("div");            // Crea un elemento para la lista
      div.className = "route-day";                          // Le asigna la clase CSS
                                                            // Inserta el HTML del día
      div.innerHTML = `                                     
        <div class="dot"></div>
        <p><strong>Día ${i + 1}</strong><br>${nombre}</p>
      `;
      div.addEventListener("click", () => map.flyTo(p, 11)); // Al hacer clic en un día, centra el mapa en ese punto
      routeList.appendChild(div);                            // Añade el elemento a la lista
    }

    L.polyline(ruta, {                                       // Dibuja la línea que une todos los puntos
      color: "#8e44ad",
      weight: 5
    }).addTo(map);

    map.fitBounds(ruta, { padding: [60, 60] });             // Ajusta el zoom para que se vean todos los puntos

    setTimeout(() => map.invalidateSize(), 300);            // Fuerza que el mapa se redibuje correctamente
  }

  initRuta();                                               // Ejecuta la función principal para generar la ruta


  // ==================== BOTÓN VER MAPA FULL SCREEN ====================
  //                   Ver el mapa en pantalla completa
  document.getElementById("verMapa").onclick = () => {
    document.getElementById("panel").style.display = "none";          // Oculta el panel inferior
    document.querySelector(".bottom-nav").style.display = "none";     // Oculta la barra de navegación inferior
    const mapEl = document.getElementById("map");                     // Selecciona el contenedor del mapa
    mapEl.style.height = "100vh";                                     // Hace que ocupe toda la altura de la pantalla
    mapEl.classList.add("fullscreen");                                // Añade clase para estilos adicionales

    let closeBtn = document.createElement("button");                  // Crea botón de cerrar
    closeBtn.id = "closeMapBtn";
    closeBtn.innerHTML = "✕";                                         // Texto del botón (una X)
    closeBtn.style.cssText = `                                        
      position:fixed;
      top:15px;
      right:15px;
      z-index:1000;
      background:black;
      color:white;
      border:none;
      font-size:24px;
      width:40px;
      height:40px;
      border-radius:50%;
    `;
    document.body.appendChild(closeBtn);                              // Añade el botón al body

    closeBtn.onclick = () => {                                        // Al pulsar el botón de cerrar
      location.reload();                                              // Recarga la página completa 
    };
  };

});