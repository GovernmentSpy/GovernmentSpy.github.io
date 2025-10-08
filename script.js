const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const SAVE_FUNCTION = "/.netlify/functions/saveMath";
const FETCH_HISTORY = "/.netlify/functions/fetchMath";

// Load SymPy.js
let sympy;
SymPy.load().then(module => {
  sympy = module;
  console.log("SymPy.js loaded!");
  loadHistory(); // Load previous questions on startup
});

// Solve math question
async function solveMath(question) {
  if (!sympy) return { answer: "Loading SymPy...", notes: "" };

  let answer = "";
  let notes = "";

  try {
    const expr = sympy.parse(question);

    let derivative, integral;
    try { derivative = expr.diff('x'); } catch {}
    try { integral = expr.integrate('x'); } catch {}

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
    console.error("Failed to save:", err);
  }
}

// Fetch previous chat history
async function loadHistory() {
  try {
    const res = await fetch(FETCH_HISTORY);
    const data = await res.json();
    if (data && data.logs) {
      data.logs.forEach(log => {
        addMessage(log.question, 'user');
        addMessage(log.answer, 'bot', log.notes);
      });
    }
  } catch (err) {
    console.error("Failed to load history:", err);
  }
}

// Handle chat form
chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, 'user');
  userInput.value = '';

  const { answer, notes } = await solveMath(question);
  addMessage(answer, 'bot', notes);

  saveToDB(question, answer, notes);
});

// Add message with optional collapsible notes
async function addMessage(message, type, notesText) {
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

    if (notesText) {
      const notesDiv = document.createElement('div');
      notesDiv.classList.add('notes');
      notesDiv.textContent = notesText;
      notesDiv.addEventListener('click', () => notesDiv.classList.toggle('expanded'));
      chatBox.appendChild(notesDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

  } else {
    div.textContent = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
