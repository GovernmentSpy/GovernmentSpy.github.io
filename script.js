const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Your Render backend URL
const API_URL = "https://governmentspy-github-io.onrender.com/ask";

// Load SymPy.js from CDN
let sympy;
SymPy.load().then((module) => {
  sympy = module;
  console.log("✅ SymPy.js loaded successfully");
});

// Parse natural language
function parseMathInput(input) {
  input = input.toLowerCase();
  if (input.startsWith("derivative of"))
    return { expr: input.replace("derivative of", "").trim(), type: "diff" };
  if (input.startsWith("integrate"))
    return { expr: input.replace("integrate", "").trim(), type: "int" };
  return { expr: input, type: "eval" };
}

// Generate AI-style steps
function generateSteps(parsed, type, result) {
  const steps = [];
  if (type === "diff") {
    steps.push({
      icon: "🟢",
      text: `Identifying function to differentiate: ${parsed}`,
      class: "derivative",
    });
    steps.push({
      icon: "🟢",
      text: "Applying derivative rules (power, sum, constants)...",
      class: "derivative",
    });
    steps.push({ icon: "🟢", text: `Result: ${result}`, class: "derivative" });
  } else if (type === "int") {
    steps.push({
      icon: "🔵",
      text: `Identifying function to integrate: ${parsed}`,
      class: "integral",
    });
    steps.push({
      icon: "🔵",
      text: "Applying integration rules (power, trig, constants)...",
      class: "integral",
    });
    steps.push({
      icon: "🔵",
      text: "Add constant of integration (C).",
      class: "integral",
    });
    steps.push({ icon: "🔵", text: `Result: ${result}`, class: "integral" });
  } else {
    steps.push({
      icon: "⚪",
      text: `Simplified: ${result}`,
      class: "simplify",
    });
  }
  return steps;
}

// Solve using Render backend OR fallback to SymPy
async function solveMath(question) {
  if (!question) return;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.result)
        return { answer: data.result, steps: data.notes || [] };
    }
  } catch (e) {
    console.warn("⚠️ Backend unreachable, using local SymPy...");
  }

  // Local SymPy fallback
  if (!sympy) return { answer: "Loading SymPy...", steps: [] };
  try {
    const { expr, type } = parseMathInput(question);
    const parsed = sympy.parse(expr);
    let result;
    switch (type) {
      case "diff":
        result = parsed.diff("x").toString();
        break;
      case "int":
        result = parsed.integrate("x").toString();
        break;
      default:
        result = parsed.toString();
    }
    const steps = generateSteps(parsed, type, result);
    return { answer: result, steps };
  } catch (err) {
    return {
      answer: "❌ Cannot process expression.",
      steps: [{ icon: "⚪", text: "Try simpler arithmetic.", class: "simplify" }],
    };
  }
}

// Send message
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;
  userInput.value = "";
  addMessage(question, "user");
  const { answer, steps } = await solveMath(question);
  addMessage(answer, "bot", steps);
});

// Add messages to chat
async function addMessage(message, type, steps = []) {
  const div = document.createElement("div");
  div.classList.add("chat-message", type === "user" ? "user-message" : "bot-message");

  if (type === "bot") {
    div.textContent = "";
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    for (let i = 0; i < message.length; i++) {
      div.textContent += message[i];
      chatBox.scrollTop = chatBox.scrollHeight;
      await new Promise((r) => setTimeout(r, 15));
    }

    if (steps.length > 0) {
      const notesDiv = document.createElement("div");
      notesDiv.classList.add("notes");
      steps.forEach((step) => {
        const stepDiv = document.createElement("div");
        stepDiv.classList.add("note-step", step.class);
        stepDiv.innerHTML = `<span class="icon">${step.icon}</span>${step.text}`;
        notesDiv.appendChild(stepDiv);
      });
      notesDiv.addEventListener("click", () => notesDiv.classList.toggle("expanded"));
      chatBox.appendChild(notesDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  } else {
    div.textContent = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
