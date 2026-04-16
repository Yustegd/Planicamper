const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");

// abrir menú
menuBtn.addEventListener("click", () => {
  menu.classList.add("active");
  overlay.classList.add("active");
});

// cerrar menú
overlay.addEventListener("click", () => {
  menu.classList.remove("active");
  overlay.classList.remove("active");
});