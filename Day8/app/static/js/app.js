// Global Variables
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");
const imageOutput = document.getElementById("image-output");

// Load Chat History
function loadHistory() {
  const history = JSON.parse(localStorage.getItem("asknova-history") || "[]");
  history.forEach(({ role, content }) => renderMessage(role, content));
}

// Save Chat History
function saveMessage(role, content) {
  const history = JSON.parse(localStorage.getItem("asknova-history") || "[]");
  history.push({ role, content });
  localStorage.setItem("asknova-history", JSON.stringify(history));
}

// Render Message
function renderMessage(role, content) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}`;
  if (role === "ai" && content.includes("```")) {
    // Code block detection
    const parts = content.split("```");
    messageDiv.innerHTML = `<strong>Nova:</strong><pre><code>${parts[1]}</code></pre>`;
  } else {
    messageDiv.innerHTML = `<strong>${role === "user" ? "You" : "Nova"}:</strong> ${content}`;
  }
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send Chat Message
async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;
  renderMessage("user", msg);
  saveMessage("user", msg);
  userInput.value = "";
  typingIndicator.style.display = "block";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg }),
  });
  const data = await res.json();
  typingIndicator.style.display = "none";
  renderMessage("ai", data.reply);
  saveMessage("ai", data.reply);
}

// Image Generation
async function generateImage(prompt) {
  const res = await fetch("/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  const img = document.createElement("img");
  img.src = data.image_url;
  imageOutput.innerHTML = "";
  imageOutput.appendChild(img);
}

// Send on Enter
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
sendBtn.onclick = sendMessage;

loadHistory();
