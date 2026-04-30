document.addEventListener("DOMContentLoaded", () => {

  console.log("Ruta JS cargado correctamente");

  // ==================== MENU ====================
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");

  menuBtn.addEventListener("click", () => {
    menu.classList.add("active");
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", () => {
    menu.classList.remove("active");
    overlay.classList.remove("active");
  });

  // ==================== MAPA ====================
  const map = L.map('map', { zoomControl: true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd'
  }).addTo(map);

  // ==================== DATOS ====================
  const dataStr = localStorage.getItem("viaje");

  if (!dataStr) {
    alert("No hay datos de viaje. Volviendo a planificar.");
    window.location.href = "planificar.html";
    return;
  }

  const data = JSON.parse(dataStr);

  // ==================== FUNCIONES ====================
  async function getCoords(ciudad) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ciudad)}&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'PlaniCamper/1.0' } });
      const result = await res.json();
      if (result && result.length > 0) {
        return [parseFloat(result[0].lat), parseFloat(result[0].lon)];
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  async function getPlaceName(lat, lon) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=12`;
      const res = await fetch(url, { headers: { 'User-Agent': 'PlaniCamper/1.0' } });
      const result = await res.json();
      if (result && result.display_name) {
        return result.display_name.split(',')[0];
      }
    } catch (e) {}
    return null;
  }

  function randomPointAround(lat, lon, maxOffset, direction) {
    const offsetLat = (Math.random() * maxOffset * 2 - maxOffset) * direction[0];
    const offsetLon = (Math.random() * maxOffset * 2 - maxOffset) * direction[1];
    return [lat + offsetLat, lon + offsetLon];
  }

  // ==================== RUTA ====================
  async function initRuta() {

    let origenCoords = await getCoords(data.origen);

    if (!origenCoords) {
      origenCoords = [40.0, -3.0];
    }

    const directions = {
      costa: [0.25, 0.90],
      montaña: [0.65, -0.60],
      naturaleza: [0.50, 0.40],
      pueblos: [0.40, 0.40]
    };

    const dir = directions[data.tipo] || [0.4, 0.35];

    let ruta = [origenCoords];
    const maxOffset = 2.4;

    for (let i = 1; i < data.dias; i++) {
      const last = ruta[ruta.length - 1];
      ruta.push(randomPointAround(last[0], last[1], maxOffset, dir));
    }

    ruta.push(randomPointAround(origenCoords[0], origenCoords[1], 0.7, [0.3, 0.3]));

    const routeList = document.getElementById("routeList");

    for (let i = 0; i < ruta.length; i++) {
      const p = ruta[i];

      let nombre = data.origen;

      if (i === 0) nombre = `${data.origen} (Inicio)`;
      else if (i === ruta.length - 1) nombre = `${data.origen} (Regreso)`;
      else {
        const placeName = await getPlaceName(p[0], p[1]);
        nombre = placeName || `Destino ${i+1}`;
      }

      L.marker(p).addTo(map).bindPopup(`<b>Día ${i+1}</b><br>${nombre}`);

      const div = document.createElement("div");
      div.className = "route-day";
      div.innerHTML = `
        <div class="dot"></div>
        <p><strong>Día ${i + 1}</strong><br>${nombre}</p>
      `;

      div.addEventListener("click", () => map.flyTo(p, 11));
      routeList.appendChild(div);
    }

    L.polyline(ruta, {
      color: "#8e44ad",
      weight: 5
    }).addTo(map);

    map.fitBounds(ruta, { padding: [60, 60] });

    setTimeout(() => map.invalidateSize(), 300);
  }

  initRuta();

  // ==================== FULL MAP ====================
  document.getElementById("verMapa").onclick = () => {

    document.getElementById("panel").style.display = "none";
    document.querySelector(".bottom-nav").style.display = "none";

    const mapEl = document.getElementById("map");
    mapEl.style.height = "100vh";

    let closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✕";
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

    document.body.appendChild(closeBtn);

    closeBtn.onclick = () => {
      location.reload();
    };
  };

});