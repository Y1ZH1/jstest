document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'sk-b76b984cb4f54d56ab97568bd10378cb';
    const API_URL = 'https://api.deepseek.com/v1/chat/completions';
    const MODEL_NAME = 'deepseek-chat';
    
    let conversationHistory = [
        {
            role: "system",
            content: "你是一个专业的青少年体态健康顾问，擅长回答关于脊柱健康、姿势矫正、体态改善的问题。请用简单易懂的中文回答用户的问题，并给出实用的建议。"
        }
    ];
    
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const statusDisplay = document.getElementById('status');
    
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        const formattedContent = content.replace(/\n/g, '<br>');
        messageDiv.innerHTML = formattedContent;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = 'AI正在思考<div class="typing-indicator"><span></span><span></span><span></span></div>';
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }
    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        userInput.disabled = true;
        sendButton.disabled = true;
        statusDisplay.textContent = 'AI 正在思考...';
        
        conversationHistory.push({
            role: "user",
            content: message
        });
        addMessage('user', message);
        
        userInput.value = '';
        addTypingIndicator();
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: conversationHistory,
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            
            removeTypingIndicator();
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP 错误! 状态码: ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            conversationHistory.push({
                role: "assistant",
                content: aiResponse
            });
            addMessage('ai', aiResponse);
            
            statusDisplay.textContent = '准备就绪';
            
        } catch (error) {
            console.error('请求出错:', error);
            statusDisplay.textContent = `错误: ${error.message}`;
            removeTypingIndicator();
            addMessage('ai', `抱歉，出错了: ${error.message}。请稍后再试，或者尝试刷新页面。`);
            
        } finally {
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        }
    }
    
    const init = () => {
        addMessage('ai', '你好！我是体态健康AI顾问，很高兴为你解答关于青少年体态健康的问题。你可以询问我关于体态健康、姿势矫正、体态改善的任何问题！');
        
        sendButton.addEventListener('click', sendMessage);
        
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    };
    
    init();
});