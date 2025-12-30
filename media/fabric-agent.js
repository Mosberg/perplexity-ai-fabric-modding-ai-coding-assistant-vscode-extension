(function () {
  "use strict";

  // VSCode API
  const vscode = acquireVsCodeApi();

  // State
  let currentChatId = null;
  let chatSessions = new Map();
  let isGenerating = false;
  let currentProvider = "perplexity";
  let currentModel = "sonar-pro";
  let currentTab = "main";

  // DOM elements
  const elements = {
    tabs: document.getElementById("tabs"),
    newChatBtn: document.getElementById("new-chat-btn"),
    mainContent: document.getElementById("main-content"),
    chatContent: document.getElementById("chat-content"),
    messages: document.getElementById("messages"),
    messageInput: document.getElementById("message-input"),
    sendBtn: document.getElementById("send-btn"),
    providerSelect: document.getElementById("provider-select"),
    modelSelect: document.getElementById("model-select"),
    modeToggle: document.getElementById("mode-toggle"),
    statusBar: document.getElementById("status-bar"),
    apiStatus: document.getElementById("api-status"),
  };

  // Initialize
  init();

  function init() {
    setupEventListeners();
    updateModeToggle();
    loadChatHistory();
    checkApiKeyStatus();
    setInterval(checkApiKeyStatus, 30000); // Check every 30s
  }

  function setupEventListeners() {
    // Send message
    elements.sendBtn.addEventListener("click", sendMessage);
    elements.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    elements.messageInput.addEventListener("input", () => {
      elements.messageInput.style.height = "auto";
      elements.messageInput.style.height =
        elements.messageInput.scrollHeight + "px";
    });

    // New chat
    elements.newChatBtn.addEventListener("click", createNewChatTab);

    // Provider/Model changes
    elements.providerSelect.addEventListener("change", (e) => {
      currentProvider = e.target.value;
      updateModelOptions();
    });
    elements.modelSelect.addEventListener("change", (e) => {
      currentModel = e.target.value;
    });

    // Mode toggle
    elements.modeToggle.addEventListener("click", toggleMode);

    // Tab switching
    elements.tabs.addEventListener("click", (e) => {
      if (e.target.classList.contains("tab")) {
        switchTab(e.target.getAttribute("data-tab"));
      }
    });

    // VSCode messages
    window.addEventListener("message", handleExtensionMessage);
  }

  function switchTab(tabName) {
    currentTab = tabName;

    // Update tab active state
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
      if (tab.getAttribute("data-tab") === tabName) {
        tab.classList.add("active");
      }
    });

    // Show/hide content
    if (tabName === "main") {
      elements.mainContent.style.display = "block";
      elements.chatContent.style.display = "none";
    } else {
      elements.mainContent.style.display = "none";
      elements.chatContent.style.display = "flex";
      elements.messageInput.focus();
    }

    if (tabName !== "main") {
      loadChatMessages(tabName);
    }
  }

  function createNewChatTab() {
    const chatId = `chat-${Date.now()}`;
    const chatName = `Chat ${chatSessions.size + 1}`;
    const session = {
      id: chatId,
      name: chatName,
      messages: [],
      provider: currentProvider,
      model: currentModel,
    };

    chatSessions.set(chatId, session);

    // Create tab
    const tab = document.createElement("button");
    tab.className = "tab";
    tab.setAttribute("data-tab", chatId);
    tab.textContent = chatName;
    elements.tabs.insertBefore(tab, elements.newChatBtn);

    // Switch to new tab
    switchTab(chatId);
    vscode.postMessage({ command: "saveChatSession", session });
  }

  async function sendMessage() {
    if (isGenerating) {
      return;
    }

    const text = elements.messageInput.value.trim();
    if (!text) {
      return;
    }

    // Ensure we're in a chat tab
    if (currentTab === "main") {
      createNewChatTab();
    }

    // Clear empty state
    const emptyState = elements.messages.querySelector(".empty-state");
    if (emptyState) {
      emptyState.remove();
    }

    // Add user message
    const messageId = appendMessage("user", text);
    elements.messageInput.value = "";
    elements.messageInput.style.height = "auto";

    // Set generating state
    isGenerating = true;
    updateSendButton(true);

    // Add typing indicator
    const assistantMessageId = Date.now();
    appendMessage("assistant", "", assistantMessageId);
    window.lastAssistantMessageId = assistantMessageId;

    // Send to extension
    vscode.postMessage({
      command: "sendMessage",
      chatId: currentTab,
      text,
      provider: currentProvider,
      model: currentModel,
      messageId: assistantMessageId,
    });
  }

  function appendMessage(role, content, messageId = null) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}`;
    if (messageId) {
      messageDiv.setAttribute("data-message-id", messageId);
    }

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    if (content) {
      contentDiv.innerHTML = formatMessageContent(content);
    } else {
      // Typing indicator
      contentDiv.innerHTML = `
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            `;
    }

    messageDiv.appendChild(contentDiv);

    const timeDiv = document.createElement("div");
    timeDiv.className = "message-time";
    timeDiv.textContent = new Date().toLocaleTimeString();
    messageDiv.appendChild(timeDiv);

    elements.messages.appendChild(messageDiv);
    scrollToBottom();

    // Save to session
    if (currentTab !== "main") {
      const session = chatSessions.get(currentTab);
      if (session) {
        session.messages.push({
          role,
          content,
          timestamp: new Date(),
        });
        vscode.postMessage({ command: "saveChatSession", session });
      }
    }

    return messageId || Date.now();
  }

  function updateMessage(messageId, content) {
    const messageDiv = document.querySelector(
      `[data-message-id="${messageId}"]`
    );
    if (messageDiv) {
      const contentDiv = messageDiv.querySelector(".message-content");
      const currentContent = contentDiv.textContent.replace(/\n/g, "");
      contentDiv.innerHTML = formatMessageContent(currentContent + content);
      scrollToBottom();
    }
  }

  // VSCode message handler
  function handleExtensionMessage(event) {
    const message = event.data;

    switch (message.command) {
      case "streamChunk":
        if (window.lastAssistantMessageId) {
          updateMessage(window.lastAssistantMessageId, message.content);
        }
        break;

      case "streamEnd":
        isGenerating = false;
        updateSendButton(false);
        if (window.lastAssistantMessageId) {
          const messageDiv = document.querySelector(
            `[data-message-id="${window.lastAssistantMessageId}"]`
          );
          if (messageDiv) {
            const timeDiv = messageDiv.querySelector(".message-time");
            timeDiv.textContent = new Date().toLocaleTimeString();
          }
        }
        elements.messageInput.focus();
        break;

      case "error":
        showStatus(message.error, "error");
        isGenerating = false;
        updateSendButton(false);
        break;

      case "apiKeyStatus":
        if (!message.hasKey) {
          showStatus("Please set your API key first!", "warning");
        }
        break;

      case "chatHistory":
        chatSessions = new Map();
        message.sessions.forEach((session) => {
          chatSessions.set(session.id, session);
        });
        break;
    }
  }

  function formatMessageContent(content) {
    // Code blocks
    content = content.replace(/``````/g, (match, lang, code) => {
      return `<pre><code class="language-${lang || "java"}">${escapeHtml(
        code.trim()
      )}</code></pre>`;
    });

    // Inline code
    content = content.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bold/Italic
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Line breaks
    content = content.replace(/\n/g, "<br>");

    return content;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function scrollToBottom() {
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function updateSendButton(generating) {
    elements.sendBtn.disabled = generating;
    elements.sendBtn.textContent = generating ? "Generating..." : "Send";
  }

  function updateModelOptions() {
    elements.modelSelect.innerHTML = "";
    if (currentProvider === "perplexity") {
      addModelOption("sonar-pro", "Sonar Pro (Fast)");
      addModelOption("sonar-research", "Sonar Research");
    } else {
      addModelOption("deepseek-v3", "DeepSeek V3");
      addModelOption("deepseek-r1", "DeepSeek R1");
    }
    elements.modelSelect.value = currentModel;
  }

  function addModelOption(value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    elements.modelSelect.appendChild(option);
  }

  function updateModeToggle() {
    // Implementation for agent/chat mode toggle
  }

  function toggleMode() {
    const isAgentMode = elements.modeToggle.classList.toggle("agent-mode");
    elements.modeToggle.textContent = isAgentMode ? "Agent Mode" : "Chat Mode";
    showStatus(
      isAgentMode
        ? "Agent mode: AI can edit files"
        : "Chat mode: Conversational only",
      "info"
    );
  }

  // Quick action handlers
  window.generateMod = () => vscode.postMessage({ command: "generateMod" });
  window.generateEntity = () =>
    vscode.postMessage({ command: "generateEntity" });
  window.generateBlock = () => vscode.postMessage({ command: "generateBlock" });
  window.generateItem = () => vscode.postMessage({ command: "generateItem" });
  window.generateCommand = () =>
    vscode.postMessage({ command: "generateCommand" });
  window.generateRenderer = () =>
    vscode.postMessage({ command: "generateRenderer" });
  window.generateScreen = () =>
    vscode.postMessage({ command: "generateScreen" });
  window.generateOverlay = () =>
    vscode.postMessage({ command: "generateOverlay" });
  window.generateConfig = () =>
    vscode.postMessage({ command: "generateConfig" });
  window.generateMixin = () => vscode.postMessage({ command: "generateMixin" });

  function loadChatHistory() {
    vscode.postMessage({ command: "getChatHistory" });
  }

  function checkApiKeyStatus() {
    vscode.postMessage({ command: "getApiKeyStatus" });
  }

  function showStatus(message, type = "info") {
    elements.statusBar.textContent = message;
    elements.statusBar.className = `status-bar status-${type}`;
    elements.statusBar.style.display = "block";
    setTimeout(() => {
      elements.statusBar.style.display = "none";
    }, 4000);
  }

  function loadChatMessages(chatId) {
    elements.messages.innerHTML = "";
    const session = chatSessions.get(chatId);
    if (session && session.messages.length > 0) {
      session.messages.forEach((msg) => {
        appendMessage(msg.role, msg.content);
      });
    } else {
      elements.messages.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <div class="empty-state-title">Start a Conversation</div>
                    <div class="empty-state-description">
                        Ask me anything about Fabric modding!
                    </div>
                </div>
            `;
    }
  }
})();
