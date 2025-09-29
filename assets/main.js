// === Utility: Base64 <-> ArrayBuffer ===
function b64ToArrayBuffer(b64){
  const bin = atob(b64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i=0;i<len;i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}
function arrayBufferToStr(buf){
  return new TextDecoder().decode(buf);
}

// === Derive AES-GCM key with PBKDF2 ===
async function deriveKey(pass, saltB64){
  const saltBuf = b64ToArrayBuffer(saltB64);
  const enc = new TextEncoder();
  const keyMat = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    {name:'PBKDF2', salt: saltBuf, iterations: 100000, hash: 'SHA-256'},
    keyMat,
    {name:'AES-GCM', length:256},
    false,
    ['decrypt']
  );
  return key;
}

// === Decrypt payload JSON {salt, iv, ct, tag} ===
async function decryptPayloadJson(obj, pass){
  try {
    const key = await deriveKey(pass, obj.salt);
    const ivBuf = b64ToArrayBuffer(obj.iv);
    const ctBuf = b64ToArrayBuffer(obj.ct);
    const tagBuf = b64ToArrayBuffer(obj.tag);
    // Many libs output ct and tag separately; WebCrypto expects combined ct+tag
    const combined = new Uint8Array(ctBuf.byteLength + tagBuf.byteLength);
    combined.set(new Uint8Array(ctBuf), 0);
    combined.set(new Uint8Array(tagBuf), ctBuf.byteLength);
    const plainBuf = await crypto.subtle.decrypt({name:'AES-GCM', iv: new Uint8Array(ivBuf)}, key, combined.buffer);
    return arrayBufferToStr(plainBuf);
  } catch (e) {
    // fallback: if ct already has tag attached (rare with our generator)
    try {
      const key = await deriveKey(pass, obj.salt);
      const ivBuf = b64ToArrayBuffer(obj.iv);
      const ctBuf = b64ToArrayBuffer(obj.ct);
      const plainBuf = await crypto.subtle.decrypt({name:'AES-GCM', iv: new Uint8Array(ivBuf)}, key, ctBuf);
      return arrayBufferToStr(plainBuf);
    } catch (err) {
      return null;
    }
  }
}

// === UI Helper ===
const secretArea = document.getElementById('secretArea');
function showTempGlitch(el){
  el.classList.add('glitch');
  setTimeout(()=>el.classList.remove('glitch'), 900);
}

// === 1) LOGO trigger -> classified (no heading) ===
const logoEl = document.getElementById('logoSecret');
logoEl.addEventListener('click', async () => {
  try {
    const res = await fetch('secrets/classified.html');
    if (!res.ok) throw new Error('fetch failed');
    const html = await res.text();
    // Show raw redacted content (no heading)
    secretArea.innerHTML = html;
    showTempGlitch(secretArea);
  } catch (e) {
    secretArea.textContent = 'Unable to load classified content.';
  }
});

// === 2) Hover NOTICE -> encrypted_message.json (decrypt with omega-key) ===
const hoverNotice = document.getElementById('hoverNotice');
let hoverTimer = null;
hoverNotice.addEventListener('mouseenter', ()=>{
  hoverTimer = setTimeout(async ()=>{
    try {
      const r = await fetch('secrets/encrypted_message.json');
      if (!r.ok) throw new Error('fetch failed');
      const obj = await r.json();
      const key = prompt('Enter decryption key:');
      if (!key) return;
      const dec = await decryptPayloadJson(obj, key);
      if (dec !== null) {
        secretArea.innerText = dec;
        showTempGlitch(secretArea);
      } else {
        secretArea.innerHTML = '<div class="clearance-panel denied"><h2>DECRYPTION FAILED</h2><p>Unable to decode message with that key.</p><div class="stamp denied">SECURITY</div></div>';
        showTempGlitch(secretArea);
      }
    } catch (e) {
      secretArea.textContent = 'Encrypted message unavailable.';
    }
  }, 650);
});
hoverNotice.addEventListener('mouseleave', ()=>{ clearTimeout(hoverTimer); });

// === 3) Alt+Shift+G -> conspiracy page ===
window.addEventListener('keydown', async (e)=>{
  if (e.altKey && e.shiftKey && e.key.toLowerCase()==='g'){
    try {
      const r = await fetch('secrets/conspiracy.html');
      if (!r.ok) throw new Error('fetch failed');
      const html = await r.text();
      secretArea.innerHTML = html;
      showTempGlitch(secretArea);
    } catch (err) {
      secretArea.textContent = 'Unable to fetch report.';
    }
  }
});

// === 4) Login button -> decrypt login_secret.json; show ACCESS GRANTED / DENIED panel ===
document.getElementById('loginBtn').addEventListener('click', async ()=>{
  const pass = prompt('Enter employee password:');
  if (!pass) return;
  try {
    const r = await fetch('secrets/login_secret.json');
    if (!r.ok) throw new Error('fetch failed');
    const obj = await r.json();
    const dec = await decryptPayloadJson(obj, pass);
    if (dec !== null) {
      secretArea.innerHTML = `<div class="clearance-panel success"><h2>ACCESS GRANTED</h2><pre style="white-space:pre-wrap;text-align:left">${escapeHtml(dec)}</pre><div class="stamp clearance">LEVEL 7 CLEARANCE</div></div>`;
      showTempGlitch(secretArea);
    } else {
      // play alarm beep
      playAlarm();
      secretArea.innerHTML = `<div class="clearance-panel denied"><h2>ACCESS DENIED</h2><p>Unauthorized attempt detected. This incident will be reported.</p><div class="stamp denied">SECURITY ALERT</div></div>`;
      showTempGlitch(secretArea);
    }
  } catch (e) {
    secretArea.textContent = 'Authentication service unavailable.';
  }
});

// === 5) Keyboard mini-game: type PAPERCLIP quickly to open vault ===
const sequence = 'PAPERCLIP';
let seqIndex = 0;
let seqTimer = null;
window.addEventListener('keypress', (e)=>{
  const ch = e.key.toUpperCase();
  if (ch === sequence[seqIndex]) {
    seqIndex++;
    clearTimeout(seqTimer);
    seqTimer = setTimeout(()=>{ seqIndex = 0; }, 1200);
    if (seqIndex === sequence.length) {
      seqIndex = 0;
      // vault opened: fetch classified and append a reward
      fetch('secrets/classified.html').then(r=>r.ok? r.text() : Promise.reject()).then(html=>{
        secretArea.innerHTML = html + '\n\n[VAULT] Mini-game reward: You discovered the PAPERCLIP vault.';
        showTempGlitch(secretArea);
      }).catch(()=>{ secretArea.textContent = 'Vault content unavailable.'; });
    }
  } else {
    seqIndex = 0;
  }
});

// === Helpers: escape HTML for safe insertion ===
function escapeHtml(str){
  return str.replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

// === Simple alarm sound (for Access Denied) ===
function playAlarm(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = 440;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    o.start();
    // sweep down
    o.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
    g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.6);
    o.stop(ctx.currentTime + 0.61);
  }catch(e){}
}
