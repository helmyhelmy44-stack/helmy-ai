const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

let settings = {
    apiKey: localStorage.getItem('apiKey') || '',
    model: localStorage.getItem('model') || 'google/gemini-2.0-flash-exp:free'
};

let history = [];

function togglePanel() {
    document.getElementById('panel').classList.toggle('show');
    document.getElementById('overlay').classList.toggle('show');
}

function saveSettings() {
    settings.apiKey = document.getElementById('apiKey').value.trim();
    settings.model = document.getElementById('model').value;
    localStorage.setItem('apiKey', settings.apiKey);
    localStorage.setItem('model', settings.model);
    togglePanel();
    alert('✅ تم حفظ الإعدادات بنجاح');
}

function addMessage(text, isUser) {
    const chat = document.getElementById('chat');
    const div = document.createElement('div');
    div.className = `msg ${isUser ? 'user' : 'ai'}`;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    history.push({ role: isUser ? 'user' : 'assistant', content: text });
    if (history.length > 12) history.shift();
}

async function send() {
    const input = document.getElementById('input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'msg ai';
    loadingDiv.textContent = 'جاري التفكير...';
    document.getElementById('chat').appendChild(loadingDiv);
    chat.scrollTop = chat.scrollHeight;

    if (!settings.apiKey) {
        loadingDiv.remove();
        addMessage('يرجى إضافة مفتاح OpenRouter API من الإعدادات ⚙️ للحصول على إجابات ذكية.', false);
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${settings.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'Helmy AI'
            },
            body: JSON.stringify({
                model: settings.model,
                messages: history,
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        loadingDiv.remove();

        if (!response.ok) throw new Error('خطأ في الاتصال');

        const data = await response.json();
        const reply = data.choices[0].message.content;
        addMessage(reply, false);

    } catch (error) {
        loadingDiv.remove();
        addMessage('❌ حدث خطأ: ' + error.message, false);
    }
}

// تهيئة عند تحميل الصفحة
window.onload = () => {
    const welcome = document.querySelector('.welcome');
    if (welcome) welcome.style.display = 'block';
}; script.js with AI functionality
