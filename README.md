<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Helmy AI</title>
    <script src="https://js.puter.com/v2/"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0a0a;
            color: #ffd700;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border-bottom: 2px solid #ffd700;
            padding: 12px 15px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .logo {
            width: 40px; height: 40px;
            background: radial-gradient(circle, #ffd700, #b8860b);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            color: #000;
        }
        .header-text h1 { font-size: 18px; }
        .header-text p { font-size: 11px; color: #c0a040; }
        .stats {
            margin-right: auto;
            display: flex;
            gap: 8px;
            font-size: 11px;
        }
        .stat {
            background: rgba(255,215,0,0.1);
            border: 1px solid rgba(255,215,0,0.3);
            padding: 4px 10px;
            border-radius: 15px;
        }
        .chat {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 15px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }
        .user-msg {
            align-self: flex-start;
            background: #1a1a1a;
            border: 1px solid #ffd700;
            color: #ffd700;
        }
        .ai-msg {
            align-self: flex-end;
            background: rgba(255,215,0,0.15);
            border: 1px solid rgba(255,215,0,0.3);
            color: #ffd700;
        }
        .system-msg {
            align-self: center;
            color: #c0a040;
            font-size: 12px;
            padding: 5px;
        }
        .typing {
            align-self: flex-end;
            color: #c0a040;
            font-size: 13px;
            padding: 8px;
        }
        .input-area {
            background: #1a1a1a;
            border-top: 2px solid #ffd700;
            padding: 10px;
            display: flex;
            gap: 8px;
        }
        .input-area input {
            flex: 1;
            background: #0a0a0a;
            border: 1px solid #ffd700;
            border-radius: 20px;
            padding: 10px 15px;
            color: #ffd700;
            font-size: 14px;
        }
        .input-area button {
            width: 42px; height: 42px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #ffd700, #b8860b);
            color: #000;
            font-size: 16px;
            cursor: pointer;
        }
        .mode-btn {
            position: fixed;
            bottom: 70px;
            left: 10px;
            background: rgba(255,215,0,0.2);
            border: 1px solid #ffd700;
            color: #ffd700;
            padding: 6px 10px;
            border-radius: 15px;
            font-size: 11px;
            cursor: pointer;
        }
    </style>
</head>
<body>

<div class="header">
    <div class="logo">H</div>
    <div class="header-text">
        <h1>Helmy AI</h1>
        <p>مساعدك الذكي - مجاني 100%</p>
    </div>
    <div class="stats">
        <div class="stat">⚡ <span id="reqCount">0</span></div>
        <div class="stat">🟢 <span>مجاني</span></div>
    </div>
</div>

<div class="chat" id="chat">
    <div class="system-msg" style="text-align:center; padding:20px;">
        <h2 style="color:#ffd700; margin-bottom:10px;">👋 مرحباً في Helmy AI!</h2>
        <p>🎤 اضغط 🎤 للتحدث</p>
        <p>📝 اكتب في الحقل</p>
        <p>🟢 لا يحتاج مفاتيح API - مجاني!</p>
    </div>
</div>

<button class="mode-btn" onclick="clearChat()">🗑️ مسح</button>

<div class="input-area">
    <button onclick="toggleVoice()" id="voiceBtn">🎤</button>
    <input type="text" id="userInput" placeholder="اكتب هنا..." onkeypress="if(event.key==='Enter')send()">
    <button onclick="send()">➤</button>
</div>

<script>
let isListening = false;
let recognition = null;
let requestCount = 0;

function initVoice() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('المتصفح لا يدعم الصوت');
        return;
    }
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.onresult = (e) => {
        document.getElementById('userInput').value = e.results[0][0].transcript;
        send();
    };
    recognition.onend = () => {
        isListening = false;
        document.getElementById('voiceBtn').textContent = '🎤';
    };
}

function toggleVoice() {
    if (!recognition) initVoice();
    if (!recognition) return;
    if (isListening) {
        recognition.stop();
        isListening = false;
        document.getElementById('voiceBtn').textContent = '🎤';
    } else {
        recognition.start();
        isListening = true;
        document.getElementById('voiceBtn').textContent = '⏹️';
        addSystem('🎤 استمع...');
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ar-SA';
        window.speechSynthesis.speak(u);
    }
}

function addSystem(text) {
    const chat = document.getElementById('chat');
    const div = document.createElement('div');
    div.className = 'system-msg';
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function addMsg(text, isUser) {
    const chat = document.getElementById('chat');
    const div = document.createElement('div');
    div.className = 'msg ' + (isUser ? 'user-msg' : 'ai-msg');
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
    const chat = document.getElementById('chat');
    const div = document.createElement('div');
    div.className = 'typing';
    div.id = 'typing';
    div.textContent = '⏳ جاري...';
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function hideTyping() {
    const t = document.getElementById('typing');
    if (t) t.remove();
}

function clearChat() {
    document.getElementById('chat').innerHTML = '';
    addSystem('🗑️ تم مسح المحادثة');
}

async function send() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMsg(text, true);
    showTyping();

    try {
        const response = await puter.ai.chat(text, {
            model: 'cohere-command-r-plus',
            stream: false
        });

        hideTyping();
        requestCount++;
        document.getElementById('reqCount').textContent = requestCount;

        if (response && response.message && response.message.content) {
            const reply = response.message.content;
            addMsg(reply, false);
            speak(reply);
        } else {
            addMsg('⚠️ لم أتمكن من الحصول على رد', false);
        }
    } catch (err) {
        hideTyping();
        console.error('Error:', err);
        addMsg('⚠️ خطأ: ' + (err.message || 'خطأ في الاتصال'), false);
    }
}

puter.init();

addSystem('🟢 جاهز! اكتب أي سؤال...');
</script>

</body>
</html>
