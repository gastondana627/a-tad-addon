console.log('🚀 A Tad is running!');

// SECTION 1: Handle Quick Input Submission
const quickInput = document.getElementById('quickInput');
const submitBtn = document.getElementById('submit-btn');

if (quickInput && submitBtn) {
  submitBtn.addEventListener('click', () => {
    const inputValue = quickInput.value.trim();
    alert(inputValue ? `You typed: ${inputValue}` : '⚠️ Please type something!');
  });
} else {
  console.warn('⚠️ Quick input or submit button not found.');
}

// SECTION 2: Handle Generate Video (Backend API Call + Animation)
const generateBtn = document.getElementById('generate-btn');
const urlInput = document.getElementById('urlInput');
const userPrompt = document.getElementById('userPrompt');
const resultDiv = document.getElementById('result');
const assistantAnim = document.getElementById('assistant-animation');

if (generateBtn && urlInput && userPrompt && resultDiv && assistantAnim) {
  generateBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    const prompt = userPrompt.value.trim();

    if (!url || !prompt) {
      resultDiv.innerText = '🚨 Please provide both a URL and a prompt.';
      return;
    }

    // START animation
    assistantAnim.classList.remove('hidden');
    resultDiv.innerText = '⏳ Processing...';

    try {
      const res = await fetch('http://localhost:5000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, prompt })
      });

      const result = await res.json();
      resultDiv.innerText = `✅ ${result.message || 'Video generated successfully.'}`;
    } catch (err) {
      console.error('❌ Error from backend:', err);
      resultDiv.innerText = '❌ Failed to fetch data from server.';
    } finally {
      // END animation
      assistantAnim.classList.add('hidden');
    }
  });
} else {
  console.warn('⚠️ Elements for video generation or animation not found.');
}

// SECTION 3: Chat Widget Toggle
const chatIcon = document.querySelector('.chat-widget');
const chatBox = document.querySelector('.chatbox');
const chatCloseBtn = document.getElementById('chatbox-close');

if (chatIcon && chatBox) {
  chatIcon.addEventListener('click', () => {
    chatBox.classList.remove('hidden');
  });
}

if (chatCloseBtn) {
  chatCloseBtn.addEventListener('click', () => {
    chatBox.classList.add('hidden');
  });
}