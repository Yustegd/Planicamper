// MENU
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

// SCROLL CON RATÓN (para todos los carruseles)
const sliders = document.querySelectorAll(".scroll-container");

sliders.forEach(slider => {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => isDown = false);
  slider.addEventListener("mouseup", () => isDown = false);

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
});

// NAVEGACIÓN
document.querySelector(".primary-btn").addEventListener("click", () => {
  window.location.href = "planificar.html";
});