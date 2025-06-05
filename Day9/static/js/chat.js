const chatBox = document.getElementById('chatBox');
const inputBox = document.getElementById('inputBox');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('msg');
  msgDiv.classList.add(sender === 'You' ? 'user' : 'bot');
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = inputBox.value.trim();
  if (!text) return;

  appendMessage('You', text);
  inputBox.value = '';
  sendBtn.disabled = true;

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    appendMessage('Bot', data.reply);
  } catch (error) {
    appendMessage('Bot', 'Error: Could not reach server.');
  } finally {
    sendBtn.disabled = false;
    inputBox.focus();
  }
}

sendBtn.addEventListener('click', sendMessage);
inputBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
