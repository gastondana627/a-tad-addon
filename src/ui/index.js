console.log('🚀 A Tad is running!');

// --- Smart Configuration for API Endpoint ---
// This block automatically detects if you are running locally or in production/Adobe.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// --- CORRECTED RENDER URL ---
// This now points to your actual Render backend service.
const API_BASE_URL = isLocal ? 'https://localhost:5151' : 'https://a-tad-addon.onrender.com'; 
const API_ENDPOINT = `${API_BASE_URL}/api/process-url`;

console.log(`API requests will be sent to: ${API_ENDPOINT}`);


// SECTION 1: Handle Generate Button (Main Application Logic)
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

    assistantAnim.classList.remove('hidden');
    resultDiv.innerText = '⏳ Processing... Contacting the creative assistant.';

    try {
      // The fetch call now uses our smart API_ENDPOINT variable
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, prompt })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Server responded with status: ${res.status}`);
      }

      const result = await res.json();

      if (result.success && result.ai_response) {
        resultDiv.innerText = result.ai_response;
        console.log("Scraped Metadata:", result.scraped_metadata);
      } else {
        throw new Error(result.error || 'The response from the server was not successful.');
      }

    } catch (err) {
      console.error('❌ Error processing request:', err);
      resultDiv.innerText = `❌ An error occurred: ${err.message}`;
    } finally {
      assistantAnim.classList.add('hidden');
    }
  });
} else {
  console.warn('⚠️ One or more elements for the generation flow were not found.');
}

// SECTION 2: Chat Widget Toggle
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



