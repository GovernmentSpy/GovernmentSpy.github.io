const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Function to generate math answer & notes using math.js
async function solveMath(question) {
  let answer, notes;

  try {
    // Evaluate simple expressions
    answer = math.evaluate(question).toString();
    notes = `Step 1: Parsed expression "${question}"\nStep 2: Evaluated to ${answer}`;
  } catch {
    answer = "❌ Cannot solve this expression";
    notes = "Try a simpler arithmetic or algebra expression.";
  }

  return { answer, notes };
}

// Save question/answer/notes to Netlify DB via serverless function
async function saveToDB(question, answer, notes) {
  await fetch("/.netlify/functions/saveMath", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer, notes }),
  });
}

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, "user");
  userInput.value = "";

  const { answer, notes } = await solveMath(question);
  addMessage(answer, "bot");
  addMessage("📝 Notes:\n" + notes, "bot");

  await saveToDB(question, answer, notes);
});

// Add message with animation
async function addMessage(message, type) {
  const div = document.createElement("div");
  div.classList.add("chat-message", type === "user" ? "user-message" : "bot-message");

  if (type === "bot") {
    div.textContent = "";
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    for (let i = 0; i < message.length; i++) {
      div.textContent += message[i];
      chatBox.scrollTop = chatBox.scrollHeight;
      await new Promise((r) => setTimeout(r, 25));
    }
  } else {
    div.textContent = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
