const justiceButton = document.getElementById("justice-button");
const wooo = document.getElementById("wooo");

justiceButton.addEventListener("click", () => {
  wooo.play();
});

window.onload = () => {
  const modal = new bootstrap.Modal('#courseModal');
  modal.show();
}

