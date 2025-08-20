function moveButton() {
  const button = document.getElementById("not-interested");
  const container = document.querySelector(".buttons");

  if (!button.classList.contains("moved")) {
    const rect = button.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const offsetLeft = rect.left - containerRect.left;
    const offsetTop = rect.top - containerRect.top;

    button.style.position = "absolute";
    button.style.left = `${offsetLeft}px`;
    button.style.top = `${offsetTop}px`;

    button.classList.add("moved");
  }

  const maxX = container.clientWidth - button.offsetWidth;
  const maxY = container.clientHeight - button.offsetHeight;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  button.style.left = `${randomX}px`;
  button.style.top = `${randomY}px`;
}