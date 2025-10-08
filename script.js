const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Netlify function for storing math logs
const SAVE_FUNCTION = "/.netlify/functions/saveMath";

// Load SymPy.js
let sympy;
SymPy.load().then((module) => {
  sympy = module;
  console.log("SymPy.js loaded!");
});

// Solve math question
async function solveMath(question) {
  if (!sympy) return { answer: "Loading SymPy...", notes: "" };

  let answer = "";
  let notes = "";

  try {
    const expr = sympy.parse(question);

    // Try derivative
    let derivative;
    try { derivative = expr.diff('x'); } catch {}
    // Try integral
    let integral;
    try { integral = expr.integrate('x'); } catch {}

    // Build answer and notes
    answer = derivative ? derivative.toString() : expr.toString();
    notes = `Expression: ${expr}\n` +
            (derivative ? `Derivative w.r.t x: ${derivative}\n` : "") +
            (integral ? `Integral w.r.t x: ${integral}` : "");
  } catch (err) {
    answer = "❌ Cannot process expression.";
    notes = "Try simpler algebra or arithmetic.";
  }

  return { answer, notes };
}

// Save to Netlify DB
async function saveToDB(question, answer, notes) {
  try {
    await fetch(SAVE_FUNCTION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, notes }),
    });
  } catch (err) {
    console.error("Failed to save to DB:", err);
  }
}

// Handle chat form
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, 'user');
  userInput.value = '';

  const { answer, notes } = await solveMath(question);
  addMessage(answer, 'bot');
  addMessage("📝 Notes:\n" + notes, 'bot');

  saveToDB(question, answer, notes);
});

// Animated chat messages
async function addMessage(message, type) {
  const div = document.createElement('div');
  div.classList.add('chat-message', type === 'user' ? 'user-message' : 'bot-message');

  if (type === 'bot') {
    div.textContent = "";
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    for (let i = 0; i < message.length; i++) {
      div.textContent += message[i];
      chatBox.scrollTop = chatBox.scrollHeight;
      await new Promise(r => setTimeout(r, 25));
    }
  } else {
    div.textContent = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
