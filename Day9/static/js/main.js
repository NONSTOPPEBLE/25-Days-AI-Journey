// ─── Debug: verify JS is loaded ───────────────────────────────────────────────
console.log("🟢 main.js loaded");

const chatBox = document.getElementById('chatBox');
const inputBox = document.getElementById('inputBox');
const sendBtn = document.getElementById('sendBtn');

/**
 * Append a new message bubble to the chatBox
 * @param {string} sender – "You" or "Bot"
 * @param {string} text – the message text
 */
function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('msg');
  msgDiv.classList.add(sender === 'You' ? 'user' : 'bot');
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Send the user’s text to /chat and handle the response
 */
async function sendMessage() {
  const text = inputBox.value.trim();
  if (!text) return;

  // Show user message immediately
  appendMessage('You', text);
  inputBox.value = '';
  inputBox.disabled = true;

  // Show spinner on the Send button
  sendBtn.disabled = true;
  sendBtn.classList.add('loading');

  try {
    console.log("📡 Sending POST to /chat with:", text);
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    console.log("📥 Received response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("📬 JSON from server:", data);
    appendMessage('Bot', data.reply);
  } catch (error) {
    console.error("🚨 Fetch error:", error);
    appendMessage('Bot', 'Error: Could not reach server.');
  } finally {
    // Restore input & button
    sendBtn.disabled = false;
    sendBtn.classList.remove('loading');
    inputBox.disabled = false;
    inputBox.focus();
  }
}

// Attach event listeners
sendBtn.addEventListener('click', sendMessage);
inputBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
