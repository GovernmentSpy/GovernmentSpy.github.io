const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const SAVE_FUNCTION = "/.netlify/functions/saveMath";
const FETCH_HISTORY = "/.netlify/functions/fetchMath";

let sympy;
SymPy.load().then(module => {
  sympy = module;
  console.log("SymPy.js loaded!");
  loadHistory();
});

// Parse natural language math (basic)
function parseMathInput(input) {
  input = input.toLowerCase();
  if (input.startsWith("derivative of")) {
    return { expr: input.replace("derivative of", "").trim(), type: "diff" };
  }
  if (input.startsWith("integrate")) {
    return { expr: input.replace("integrate", "").trim(), type: "int" };
  }
  return { expr: input, type: "eval" };
}

// Solve math
async function solveMath(question) {
  if (!sympy) return { answer: "Loading SymPy...", notes: "" };

  let answer = "", notes = "";

  try {
    const { expr, type } = parseMathInput(question);
    const parsed = sympy.parse(expr);

    switch (type) {
      case "diff":
        answer = parsed.diff('x').toString();
        notes = `Expression: ${parsed}\nDerivative w.r.t x: ${answer}`;
        break;
      case "int":
        answer = parsed.integrate('x').toString();
        notes = `Expression: ${parsed}\nIntegral w.r.t x: ${answer}`;
        break;
      default:
        answer = parsed.toString();
        notes = `Expression: ${parsed}`;
        break;
    }

  } catch (err) {
    answer = "❌ Cannot process expression.";
    notes = "Try simpler algebra or arithmetic.";
  }

  return { answer, notes };
}

// Save to DB
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

// Load history
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

// Form submission
chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;
  userInput.value = '';

  addMessage(question, 'user');

  const { answer, notes } = await solveMath(question);

  addMessage(answer, 'bot', notes);

  saveToDB(question, answer, notes);
});

// Add chat messages
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
      await new Promise(r => setTimeout(r, 20));
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
