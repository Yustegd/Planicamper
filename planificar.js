document.addEventListener("DOMContentLoaded", () => {

  console.log("Planificar JS cargado correctamente");

  // ==================== MENÚ ====================
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

  // ==================== ORIGEN ====================
  const inputOrigen = document.querySelector("input[type='text']");
  inputOrigen.value = "Cuenca";

  // ==================== DÍAS ====================
  let dias = 5;
  const diasSpan = document.getElementById("dias");
  diasSpan.textContent = dias;

  document.querySelectorAll(".plan-days button").forEach(btn => {
    if (btn.textContent.trim() === "+") {
      btn.addEventListener("click", () => {
        dias++;
        diasSpan.textContent = dias;
      });
    }
    if (btn.textContent.trim() === "-") {
      btn.addEventListener("click", () => {
        if (dias > 1) {
          dias--;
          diasSpan.textContent = dias;
        }
      });
    }
  });

  // ==================== TIPO DE VIAJE ====================
  let tipoSeleccionado = null;
  const cards = document.querySelectorAll(".plan-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      tipoSeleccionado = card.querySelector("span").textContent.toLowerCase().trim();
      console.log("Tipo seleccionado:", tipoSeleccionado);
    });
  });

  // ==================== BOTÓN CONTINUAR - CORREGIDO PARA APK ====================
  document.getElementById("continuar").addEventListener("click", () => {
    const origen = inputOrigen.value.trim();

    if (!origen) {
      alert("Por favor, introduce la ciudad de origen");
      return;
    }

    if (!tipoSeleccionado) {
      alert("Por favor, selecciona un tipo de viaje");
      return;
    }

    localStorage.setItem("viaje", JSON.stringify({
      origen: origen,
      dias: dias,
      tipo: tipoSeleccionado
    }));

    console.log("Datos guardados:", origen, dias, tipoSeleccionado);

    // Versión más compatible con WebView / APK
    window.location.replace("ruta.html");
  });

});