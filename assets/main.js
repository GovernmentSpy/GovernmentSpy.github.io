// Login button → decrypt login_secret.json
document.getElementById("loginBtn").addEventListener("click", async () => {
  const password = prompt("Enter employee password:");
  if (!password) return;
  const res = await fetch("secrets/login_secret.json");
  const data = await res.json();
  const decrypted = await decryptPayload(data, password);

  if (decrypted) {
    // Success panel
    secretArea.innerHTML = `
      <div class="clearance-panel success">
        <h2>ACCESS GRANTED</h2>
        <p>${decrypted}</p>
        <div class="stamp clearance">LEVEL 7 CLEARANCE</div>
      </div>
    `;
    secretArea.classList.add("glitch");
    setTimeout(() => secretArea.classList.remove("glitch"), 1200);
  } else {
    // Failure panel
    secretArea.innerHTML = `
      <div class="clearance-panel denied">
        <h2>ACCESS DENIED</h2>
        <p>Unauthorized attempt detected. This incident will be reported.</p>
        <div class="stamp denied">SECURITY ALERT</div>
      </div>
    `;
    secretArea.classList.add("glitch");
    setTimeout(() => secretArea.classList.remove("glitch"), 1200);
  }
});
