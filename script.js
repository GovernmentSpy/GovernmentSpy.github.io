const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// CHANGE THIS TO YOUR DEPLOYED BACKEND API URL
const API_URL = "https://your-backend-api-url.com/ask";

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, 'user');
  userInput.value = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    addMessage(data.answer || "No answer from AI.", 'bot');
  } catch (err) {
    addMessage("Error connecting to AI backend.", 'bot');
    console.error(err);
  }
});

function addMessage(message, type) {
  const div = document.createElement('div');
  div.classList.add('chat-message', type === 'user' ? 'user-message' : 'bot-message');
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
