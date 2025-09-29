const secretArea = document.getElementById("secretArea");

// LOGO → classified.html
document.getElementById("logoSecret").addEventListener("click", async () => {
  const res = await fetch("secrets/classified.html");
  secretArea.innerHTML = await res.text();
  secretArea.classList.add("glitch");
  setTimeout(() => secretArea.classList.remove("glitch"), 1200);
});
