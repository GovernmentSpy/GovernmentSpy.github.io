// =============== Utility: Base64 <-> ArrayBuffer ==================
function base64ToArrayBuffer(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}
function arrayBufferToString(buf) {
  return new TextDecoder().decode(buf);
}

// =============== AES-GCM Decryption ==================
async function decryptPayload(json, password) {
  const salt = base64ToArrayBuffer(json.salt);
  const iv = base64ToArrayBuffer(json.iv);
  const ct = base64ToArrayBuffer(json.ct);
  const tag = base64ToArrayBuffer(json.tag);

  // PBKDF2 -> AES key
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
  );
  const key = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  // concat ct+tag for AES-GCM
  const combined = new Uint8Array(ct.byteLength + tag.byteLength);
  combined.set(new Uint8Array(ct), 0);
  combined.set(new Uint8Array(tag), ct.byteLength);

  try {
    const plaintext = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      combined
    );
    return arrayBufferToString(plaintext);
  } catch (e) {
    alert("Decryption failed");
    return null;
  }
}

// =============== Easter Egg Triggers ==================
const secretArea = document.getElementById("secretArea");

// Dot click → classified.html
document.getElementById("dot").addEventListener("click", async () => {
  const res = await fetch("secrets/classified.html");
  secretArea.innerHTML = await res.text();
  secretArea.classList.add("glitch");
  setTimeout(()=>secretArea.classList.remove("glitch"),1000);
});

// Hover NOTICE → encrypted_message.json (omega-key)
document.querySelector(".hover-secret").addEventListener("mouseenter", async () => {
  const res = await fetch("secrets/encrypted_message.json");
  const data = await res.json();
  const key = prompt("Enter decryption key:");
  if (!key) return;
  const decrypted = await decryptPayload(data, key);
  if (decrypted) {
    secretArea.innerHTML = `<pre>${decrypted}</pre>`;
  }
});

// Key combo Alt+Shift+G → conspiracy.html
document.addEventListener("keydown", async (e) => {
  if (e.altKey && e.shiftKey && e.code === "KeyG") {
    const res = await fetch("secrets/conspiracy.html");
    secretArea.innerHTML = await res.text();
    secretArea.classList.add("glitch");
    setTimeout(()=>secretArea.classList.remove("glitch"),1500);
  }
});

// Login button → decrypt login_secret.json
document.getElementById("loginBtn").addEventListener("click", async () => {
  const password = prompt("Enter employee password:");
  if (!password) return;
  const res = await fetch("secrets/login_secret.json");
  const data = await res.json();
  const decrypted = await decryptPayload(data, password);
  if (decrypted) {
    secretArea.innerHTML = `<div class="classified">${decrypted}</div>`;
  }
});

// Keyboard mini-game: type "PAPERCLIP"
let buffer = "";
document.addEventListener("keydown", async (e) => {
  buffer += e.key.toUpperCase();
  if (buffer.endsWith("PAPERCLIP")) {
    buffer = "";
    secretArea.innerHTML = "<h3>Vault Opened</h3><p>Operation PAPERCLIP is now declassified.</p>";
    secretArea.classList.add("glitch");
    setTimeout(()=>secretArea.classList.remove("glitch"),1200);
  }
});
