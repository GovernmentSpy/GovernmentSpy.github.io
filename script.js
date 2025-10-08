const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Use your Render backend URL
const API_URL = "https://governmentspy-github-io-1.onrender.com/ask";

// Load SymPy.js
let sympy;
SymPy.load().then(module => {
  sympy = module;
  console.log("SymPy loaded");
});

// Parse natural language
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

// Generate steps
function generateSteps(parsed, type, result) {
  const steps = [];
  if (type === "diff") {
    steps.push({ icon: "🟢", text: `Differentiate: ${parsed}`, cls: "derivative" });
    steps.push({ icon: "🟢", text: `Result: ${result}`, cls: "derivative" });
  } else if (type === "int") {
    steps.push({ icon: "🔵", text: `Integrate: ${parsed}`, cls: "integral" });
    steps.push({ icon: "🔵", text: `Result: ${result}`, cls: "integral" });
  } else {
    steps.push({ icon: "⚪", text: `Simplified: ${result}`, cls: "simplify" });
  }
  return steps;
}

// Try backend, fallback to local SymPy
async function solveMath(question) {
  // Try backend
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (res.ok) {
      const obj = await res.json();
      if (obj.answer !== undefined && obj.notes !== undefined) {
        // If backend returns structured answer + notes
        // We expect obj.answer (string) and obj.notes (something)
        // Convert notes to the same steps format if needed
        let steps = obj.notes;
        if (!Array.isArray(steps)) {
          // If notes is a text string, parse it
          steps = generateSteps(obj.notes, "eval", obj.answer);
        }
        return { answer: obj.answer, steps: steps };
      }
    }
  } catch (e) {
    console.warn("Backend API failed, falling back:", e);
  }

  // Fallback local SymPy
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
    return { answer: result, steps: steps };
  } catch (err) {
    return {
      answer: "❌ Error",
      steps: [{ icon: "⚪", text: "Could not parse expression", cls: "simplify" }],
    };
  }
}

// Form submission
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;
  userInput.value = "";
  addMessage(question, "user");
  const { answer, steps } = await solveMath(question);
  addMessage(answer, "bot", steps);
});

// Add message to UI
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
      await new Promise(r => setTimeout(r, 20));
    }
    if (steps.length > 0) {
      const notesDiv = document.createElement("div");
      notesDiv.classList.add("notes");
      steps.forEach(step => {
        const stepDiv = document.createElement("div");
        stepDiv.classList.add("note-step", step.cls);
        stepDiv.innerHTML = `<span class="icon">${step.icon}</span> ${step.text}`;
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
