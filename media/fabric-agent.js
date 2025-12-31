(function() {
  'use strict';

  const vscode = acquireVsCodeApi();
  let isStreaming = false;
  let currentTab = 'home';

  // DOM Elements
  const elements = {
    tabs: document.querySelectorAll('.tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    actionBtns: document.querySelectorAll('.action-btn'),
    chatInput: document.getElementById('chatInput'),
    sendBtn: document.getElementById('sendButton'),
    messages: document.getElementById('messages'),
    status: document.getElementById('status'),
    apiStatus: document.getElementById('apiStatus'),
    modId: document.getElementById('modId'),
    package: document.getElementById('package'),
    configModId: document.getElementById('configModId'),
    configPackage: document.getElementById('configPackage'),
    saveConfig: document.getElementById('saveConfig')
  };

  // Initialize
  init();

  function init() {
    setupEventListeners();
    loadConfig();
    updateStatus('🟢 Ready');
    requestAnimationFrame(updateStatusIndicator);
  }

  function setupEventListeners() {
    // Tab switching
    elements.tabs.forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Quick actions
    elements.actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        vscode.postMessage({ command: action });
        updateStatus(`Generating ${action.replace('generate', '').toUpperCase()}...`);
      });
    });

    // Chat
    elements.chatInput.addEventListener('input', toggleSendButton);
    elements.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    elements.sendBtn.addEventListener('click', sendMessage);

    // Config
    elements.saveConfig.addEventListener('click', saveConfig);

    // VSCode messages
    window.addEventListener('message', handleVscodeMessage);
  }

  function switchTab(tabId) {
    currentTab = tabId;

    // Update tabs
    elements.tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update content
    elements.tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabId + '-tab').classList.add('active');

    if (tabId === 'chat') {
      elements.chatInput.focus();
    }
  }

  async function sendMessage() {
    if (isStreaming) {return;}

    const message = elements.chatInput.value.trim();
    if (!message) {return;}

    // Add user message
    addMessage('user', message);
    elements.chatInput.value = '';
    toggleSendButton();

    // Send to extension
    isStreaming = true;
    updateStatus('🤖 AI thinking...');

    vscode.postMessage({
      command: 'sendMessage',
      text: message
    });
  }

  function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content || '';

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    elements.messages.appendChild(messageDiv);

    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function toggleSendButton() {
    const hasText = elements.chatInput.value.trim().length > 0;
    elements.sendBtn.disabled = !hasText || isStreaming;
  }

  function updateStatus(status) {
    elements.status.textContent = status;
  }

  function handleVscodeMessage(event) {
    const message = event.data;

    switch (message.command) {
      case 'streamChunk':
        // Append to last assistant message
        const lastMessage = elements.messages.lastElementChild;
        if (lastMessage && lastMessage.classList.contains('assistant')) {
          const content = lastMessage.querySelector('.message-content');
          content.textContent += message.content;
          elements.messages.scrollTop = elements.messages.scrollHeight;
        }
        break;

      case 'streamEnd':
        isStreaming = false;
        toggleSendButton();
        updateStatus('🟢 Ready');
        elements.chatInput.focus();
        break;

      case 'configLoaded':
        elements.modId.textContent = message.modId;
        elements.package.textContent = message.package;
        elements.configModId.value = message.modId;
        elements.configPackage.value = message.package;
        break;

      case 'status':
        updateStatus(message.text);
        break;
    }
  }

  async function saveConfig() {
    vscode.postMessage({
      command: 'saveConfig',
      modId: elements.configModId.value,
      package: elements.configPackage.value
    });
  }

  function updateStatusIndicator() {
    const indicator = document.getElementById('statusIndicator');
    if (isStreaming) {
      indicator.style.background = '#fbbf24';
    } else {
      indicator.style.background = '#4ade80';
    }
    requestAnimationFrame(updateStatusIndicator);
  }

  function loadConfig() {
    vscode.postMessage({ command: 'loadConfig' });
  }

})();
