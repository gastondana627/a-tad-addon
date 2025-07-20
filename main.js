console.log('🚀 A Tad is running!');

let urlCount = 0;

// Handle Quick Input Submission
const quickInput = document.getElementById('quickInput');
const submitBtn = document.getElementById('submit-btn');

if (quickInput && submitBtn) {
  submitBtn.addEventListener('click', () => {
    const inputValue = quickInput.value.trim();
    alert(inputValue ? `You typed: ${inputValue}` : '⚠️ Please type something!');
  });
}

// Handle Generate Button with animation
const generateBtn = document.getElementById('generate-btn');
const urlInput = document.getElementById('urlInput');
const userPrompt = document.getElementById('userPrompt');
const resultDiv = document.getElementById('result');
const animation = document.getElementById('assistant-animation');
const counter = document.getElementById('url-counter');

if (generateBtn && urlInput && userPrompt && resultDiv) {
  generateBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    const prompt = userPrompt.value.trim();

    if (!url || !prompt) {
      resultDiv.innerText = '🚨 Please provide both a URL and a prompt.';
      return;
    }

    animation.classList.remove('hidden');
    resultDiv.innerText = '';

    try {
      const res = await fetch('/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, prompt })
      });

      const data = await res.json();

      if (data.error) {
        resultDiv.innerText = `❌ ${data.error}`;
      } else {
        resultDiv.innerText = `✅ ${data.title ? data.title : 'Data processed successfully!'}`;
        urlCount += 1;
        counter.innerText = urlCount;
      }
    } catch (err) {
      console.error('Fetch error:', err);
      resultDiv.innerText = '❌ Failed to fetch data from server.';
    } finally {
      animation.classList.add('hidden');
    }
  });
}

// Chat Widget Toggle Logic
const chatWidget = document.getElementById('chatWidget');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');

if (chatWidget && chatBox) {
  chatWidget.addEventListener('click', () => {
    chatBox.classList.remove('hidden');
  });
}

if (closeChat) {
  closeChat.addEventListener('click', () => {
    chatBox.classList.add('hidden');
  });
}