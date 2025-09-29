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
  return crypto.subtle.deriveKey(
    {name:'PBKDF2', salt: saltBuf, iterations: 100000, hash: 'SHA-256'},
    keyMat,
    {name:'AES-GCM', length:256},
    false,
    ['decrypt']
  );
}

// === Decrypt payload JSON {salt, iv, data} ===
async function decryptPayloadJson(obj, pass){
  try {
    const key = await deriveKey(pass, obj.salt);
    const ivBuf = b64ToArrayBuffer(obj.iv);
    const ctBuf = b64ToArrayBuffer(obj.data);
    const plainBuf = await crypto.subtle.decrypt(
      {name:'AES-GCM', iv: new Uint8Array(ivBuf)},
      key,
      ctBuf
    );
    return arrayBufferToStr(plainBuf);
  } catch (err) {
    return null;
  }
}

// === UI Helper ===
const secretArea = document.getElementById('secretArea');
function showTempGlitch(el){
  el.classList.add('glitch');
  setTimeout(()=>el.classList.remove('glitch'), 900);
}

// === 1) LOGO trigger -> classified ===
document.getElementById('logoSecret').addEventListener('click', async () => {
  try {
    const res = await fetch('secrets/classified.html');
    const html = await res.text();
    secretArea.innerHTML = html;
    showTempGlitch(secretArea);
  } catch (e) {
    secretArea.textContent = 'Unable to load classified content.';
  }
});

// === 2) NOTICE -> encrypted_message.json (click) ===
document.getElementById('hoverNotice').addEventListener('click', async ()=>{
  try {
    const r = await fetch('secrets/encrypted_message.json');
    const obj = await r.json();
    const key = prompt('Enter decryption key:');
    if (!key) return;
    const dec = await decryptPayloadJson(obj, key);
    if (dec !== null) {
      secretArea.innerText = dec;
      showTempGlitch(secretArea);
    } else {
      secretArea.innerHTML = '<div class="clearance-panel denied"><h2>DECRYPTION FAILED</h2><p>Invalid key.</p></div>';
      showTempGlitch(secretArea);
    }
  } catch (e) {
    secretArea.textContent = 'Encrypted message unavailable.';
  }
});

// === 3) Alt+Shift+G -> conspiracy page ===
window.addEventListener('keydown', async (e)=>{
  if (e.altKey && e.shiftKey && e.key.toLowerCase()==='g'){
    const r = await fetch('secrets/conspiracy.html');
    const html = await r.text();
    secretArea.innerHTML = html;
    showTempGlitch(secretArea);
  }
});

// === 4) Employee Login ===
document.getElementById('loginBtn').addEventListener('click', async ()=>{
  const pass = prompt('Enter employee password:');
  if (!pass) return;
  try {
    const r = await fetch('secrets/login_secret.json');
    const obj = await r.json();
    const dec = await decryptPayloadJson(obj, pass);
    if (dec !== null) {
      secretArea.innerHTML = `<div class="clearance-panel success"><h2>ACCESS GRANTED</h2><pre>${dec}</pre></div>`;
      showTempGlitch(secretArea);
    } else {
      playAlarm();
      secretArea.innerHTML = `<div class="clearance-panel denied"><h2>ACCESS DENIED</h2><p>Unauthorized attempt detected.</p></div>`;
      showTempGlitch(secretArea);
    }
  } catch (e) {
    secretArea.textContent = 'Login unavailable.';
  }
});

// === 5) Mini-game PAPERCLIP ===
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
      fetch('secrets/classified.html').then(r=>r.text()).then(html=>{
        secretArea.innerHTML = html + '\n\n[VAULT] PAPERCLIP vault unlocked!';
        showTempGlitch(secretArea);
      });
    }
  } else {
    seqIndex = 0;
  }
});

// === Alarm sound for Access Denied ===
function playAlarm(){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type='sawtooth';o.frequency.value=440;o.connect(g);g.connect(ctx.destination);
    g.gain.value=0.0001;g.gain.exponentialRampToValueAtTime(0.18,ctx.currentTime+0.02);
    o.start();
    o.frequency.exponentialRampToValueAtTime(220,ctx.currentTime+0.3);
    g.gain.exponentialRampToValueAtTime(0.00001,ctx.currentTime+0.6);
    o.stop(ctx.currentTime+0.61);
  }catch(e){}
}
