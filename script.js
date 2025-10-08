const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Handle form submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, 'user');
  userInput.value = '';

  // Solve math question
  try {
    const answer = solveMath(question);
    addMessage(answer, 'bot');
  } catch (err) {
    addMessage("❌ I can't solve that!", 'bot');
  }
});

// Add message to chat box with typing effect
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
      await new Promise(r => setTimeout(r, 25)); // typing speed
    }
  } else {
    div.textContent = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Simple math solver
function solveMath(input) {
  // Only allow digits, operators, parentheses, decimal
  if(!/^[0-9+\-*/().\s]+$/.test(input)) throw "Invalid input";
  return eval(input);
}
