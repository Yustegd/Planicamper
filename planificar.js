// ==================== INICIALIZACIÓN CUANDO LA PÁGINA CARGA ====================
//          esperamos a que el HTML esté cargado antes de ejecutar nada

document.addEventListener("DOMContentLoaded", () => {

  console.log("Planificar JS cargado correctamente");     // Mensaje en consola para confirmar que el script se ha cargado
                                                          // Ya que me estaba dando errores de carga y habia que verificar qeu cargara

  // ==================== MENÚ LATERAL ====================
  //            abrir y cerrar el menú deslizante
  const menuBtn = document.getElementById("menuBtn");     // Selecciona el botón del menú
  const menu = document.getElementById("menu");           // Selecciona el contenedor del menú
  const overlay = document.getElementById("overlay");     // Selecciona el fondo oscuro al abrir el menú

  menuBtn.addEventListener("click", () => {               // Cuando se hace clic en el botón del menú:
    menu.classList.add("active");                         //    -añade la clase active para mostrar el menú
    overlay.classList.add("active");                      //    -muestra el fondo oscuro
  });

  overlay.addEventListener("click", () => {               // Cuando se hace clic en el fondo oscuro:
    menu.classList.remove("active");                      //    -oculta el menú
    overlay.classList.remove("active");                   //    -oculta el fondo oscuro
  });


  // ==================== ORIGEN ====================
  //             campo de ciudad de origen
  const inputOrigen = document.querySelector("input[type='text']");   // Selecciona el input de texto para el origen
  inputOrigen.value = "Cuenca";                                       // Establece Cuenca como valor por defecto
                                                                      // Para no dehar el campo valor vacío

  // ==================== DÍAS ====================
  // Control del selector de número de días
  let dias = 5;                                               // Variable que guarda la cantidad de días, valor inicial = 5
  const diasSpan = document.getElementById("dias");           // Selecciona el elemento donde se muestra el número
  diasSpan.textContent = dias;                                // Muestra el valor inicial en pantalla

  document.querySelectorAll(".plan-days button").forEach(btn => {   // Selecciona los botones dentro del contenedor de días
    if (btn.textContent.trim() === "+") {                           // Si el botón es el de +
      btn.addEventListener("click", () => {                         // Añade evento de clic
        dias++;                                                     // Incrementa el contador de días
        diasSpan.textContent = dias;                                // Actualiza el número en pantalla
      });
    }
    if (btn.textContent.trim() === "-") {                           // Si el botón es el de -
      btn.addEventListener("click", () => {                         // Eevento de clic
        if (dias > 1) {                                             // Evita que baje de 1 día
          dias--;                                                   // Decrementa el contador
          diasSpan.textContent = dias;                              // Actualiza el número mostrado
        }
      });
    }
  });


  // ==================== TIPO DE VIAJE ====================
  //            Selección de tipo de viaje 
  let tipoSeleccionado = null;                                // Variable que guardará el tipo seleccionado
  const cards = document.querySelectorAll(".plan-card");      // Selecciona todas las tarjetas de tipo de viaje

  cards.forEach(card => {                                                               // Para cada tarjeta
    card.addEventListener("click", () => {                                              // Cuando se hace clic en ella
      cards.forEach(c => c.classList.remove("active"));                                 // Quita la clase active de las tarjetas
      card.classList.add("active");                                                     // Añade la clase active a la seleccionada
      tipoSeleccionado = card.querySelector("span").textContent.toLowerCase().trim();   // Guarda el texto del span en minúsculas
      console.log("Tipo seleccionado:", tipoSeleccionado);                              // Muestra en consola qué tipo se seleccionó
    });
  });


  // ==================== BOTÓN CONTINUAR - CORREGIDO PARA APK ====================
  //                              Click en el botón "CONTINUAR"
  document.getElementById("continuar").addEventListener("click", () => {   // Cuando se pulsa continuar 
    const origen = inputOrigen.value.trim();                               // Obtiene el valor del campo origen y elimina espacios

    if (!origen) {                                                         // Si el campo origen está vacío
      alert("Por favor, introduce la ciudad de origen");                   // Muestra alerta
      return;                                                              // Detiene la ejecución
    }

    if (!tipoSeleccionado) {                                               // Si no se ha seleccionado tipo de viaje
      alert("Por favor, selecciona un tipo de viaje");                     // Muestra alerta
      return;                                                              // Detiene la ejecución
    }

    localStorage.setItem("viaje", JSON.stringify({                         // Guarda los datos en localStorage
      origen: origen,
      dias: dias,
      tipo: tipoSeleccionado
    }));

    console.log("Datos guardados:", origen, dias, tipoSeleccionado);       // Muestra en consola los datos guardados

    // Para poder exportar a APK, que da error al abrir la página ruta.html desde apk
    window.location.replace("ruta.html");                                  // Redirige a ruta.html
  });

});