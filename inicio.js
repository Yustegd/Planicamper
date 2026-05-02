// ==================== MENÚ LATERAL ====================
//                 abri y cerrar el menú lateral

const menuBtn = document.getElementById("menuBtn");     // Selecciona el botón del menú lateral
const menu = document.getElementById("menu");           // Selecciona el contenedor del menú lateral
const overlay = document.getElementById("overlay");     // Selecciona el fondo oscuro que aparece al abrir el menú

menuBtn.addEventListener("click", () => {               // Al hacer clic en el botón del menú:
  menu.classList.add("active");                         //    -añade la clase active al menú 
  overlay.classList.add("active");                      //    -añade la clase active al overlay
});

overlay.addEventListener("click", () => {               // Al hace click en el fondo:
  menu.classList.remove("active");                      //    -quita la clase active del menú 
  overlay.classList.remove("active");                   //    -quita la clase activedel overlay
});


// ==================== SCROLL CON RATÓN ====================
// para poder arrastrar horizontalmente los carruseles con el ratón o con el desplazamiento digitalytal

const sliders = document.querySelectorAll(".scroll-container");   // Selecciona todos los contenedores con scroll horizontal

sliders.forEach(slider => {                         // Por cada carrusel que encuenta:
  
  let isDown = false;                               // Variable para saber siel  ratón está presionado
  let startX;                                       // Posición inicial del ratón
  let scrollLeft;                                   // Posición inicial del scroll

  slider.addEventListener("mousedown", (e) => {     // Al pulsar el botón del ratón
    isDown = true;                                  // Activa el modo arrastre
    startX = e.pageX - slider.offsetLeft;           // Calcula la posición inicial del ratón respecto al carrusel
    scrollLeft = slider.scrollLeft;                 // Guarda la posición actual del scroll
  });

  slider.addEventListener("mouseleave", () => isDown = false);   // Si el ratón sale del carrusel desactiva el arrastre
  slider.addEventListener("mouseup", () => isDown = false);      // Cuando se suelta el botón del ratón desactiva el arrastre

  slider.addEventListener("mousemove", (e) => {     // Al mover el ratón
    if (!isDown) return;                            // Si no estamos en modo arrastre no hace nada
    e.preventDefault();                             // Evita comportamientos por defecto del navegador
    const x = e.pageX - slider.offsetLeft;          // Calcula la nueva posición del ratón
    const walk = (x - startX) * 2;                  // Calcula cuántos píxeles debe moverse el scroll. lo hace x2 para darle mas velocidad
    slider.scrollLeft = scrollLeft - walk;          // hace scroll horizontal
  });

});


// ==================== NAVEGACIÓN ====================
//              botón principal de Planificar 

document.querySelector(".primary-btn").addEventListener("click", () => {
  window.location.href = "planificar.html";                                 // Al hacer clic en el botón, lleva a la página de planificar
});