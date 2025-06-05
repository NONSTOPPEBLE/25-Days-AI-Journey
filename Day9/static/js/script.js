const chatBox = document.getElementById("chatBox");
const inputBox = document.getElementById("inputBox");
const sendBtn = document.getElementById("sendBtn");

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = inputBox.value.trim();
  if (!message) return;

  appendMessage("You", message);
  inputBox.value = "";
  sendBtn.disabled = true;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    appendMessage("Bot", data.reply);
  } catch {
    appendMessage("Bot", "❌ Server error.");
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.onclick = sendMessage;
inputBox.onkeydown = e => { if (e.key === "Enter") sendMessage(); };
