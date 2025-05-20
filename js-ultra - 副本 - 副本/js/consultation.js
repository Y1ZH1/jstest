// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // ========== 配置部分 ==========
    // API密钥 - 注意：实际项目中不应在前端暴露API密钥
    const API_KEY = 'sk-b76b984cb4f54d56ab97568bd10378cb';
    // DeepSeek API的端点URL
    const API_URL = 'https://api.deepseek.com/v1/chat/completions';
    // 使用的模型名称
    const MODEL_NAME = 'deepseek-chat';
    
    // ========== 对话历史记录 ==========
    // 初始化对话历史，包含系统提示
    let conversationHistory = [
        {
            role: "system",  // 系统角色消息
            content: "你是一个专业的青少年体态健康顾问，擅长回答关于脊柱健康、姿势矫正、体态改善的问题。请用简单易懂的中文回答用户的问题，并给出实用的建议。"
        }
    ];
    
    // ========== DOM元素引用 ==========
    // 聊天消息容器
    const chatContainer = document.getElementById('chat-container');
    // 用户输入框
    const userInput = document.getElementById('user-input');
    // 发送按钮
    const sendButton = document.getElementById('send-button');
    // 状态显示区域
    const statusDisplay = document.getElementById('status');
    
    // ========== 功能函数 ==========
    
    function addMessage(role, content) {
        // 创建消息div元素
        const messageDiv = document.createElement('div');
        // 设置CSS类名，区分用户和AI消息
        messageDiv.className = `message ${role}-message`;
        
        // 格式化内容中的换行符为HTML换行标签
        const formattedContent = content.replace(/\n/g, '<br>');
        // 设置HTML内容
        messageDiv.innerHTML = formattedContent;
        
        // 将消息添加到聊天容器
        chatContainer.appendChild(messageDiv);
        // 滚动到最新消息
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    /**
     * 添加"正在输入"指示器
     */
    function addTypingIndicator() {
        // 创建指示器div
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.id = 'typing-indicator';  // 设置ID以便后续移除
        // 包含动画点的HTML内容
        typingDiv.innerHTML = 'AI正在思考<div class="typing-indicator"><span></span><span></span><span></span></div>';
        chatContainer.appendChild(typingDiv);
        // 滚动到最新消息
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    /**
     * 移除"正在输入"指示器
     */
    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }
    
    /**
     * 发送消息到DeepSeek API并处理响应
     */
    async function sendMessage() {
        // 获取并清理用户输入
        const message = userInput.value.trim();
        // 如果消息为空则不做任何操作
        if (!message) return;
        
        // ========== UI状态更新 ==========
        // 禁用输入和按钮防止重复提交
        userInput.disabled = true;
        sendButton.disabled = true;
        // 更新状态显示
        statusDisplay.textContent = 'AI 正在思考...';
        
        // ========== 对话历史管理 ==========
        // 添加用户消息到历史记录
        conversationHistory.push({
            role: "user",
            content: message
        });
        // 在界面上显示用户消息
        addMessage('user', message);
        
        // 清空输入框
        userInput.value = '';
        
        // 显示"正在输入"指示器
        addTypingIndicator();
        
        try {
            // ========== API请求 ==========
            // 使用fetch API发送POST请求
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`  // 添加认证头
                },
                body: JSON.stringify({
                    model: MODEL_NAME,  // 指定模型
                    messages: conversationHistory,  // 发送整个对话历史
                    temperature: 0.7,  // 控制回复的随机性
                    max_tokens: 1000  // 限制回复的最大长度
                })
            });
            
            // 移除"正在输入"指示器
            removeTypingIndicator();
            
            // 检查响应状态
            if (!response.ok) {
                // 尝试解析错误信息
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP 错误! 状态码: ${response.status}`);
            }
            
            // ========== 处理成功响应 ==========
            // 解析JSON响应
            const data = await response.json();
            // 获取AI回复内容
            const aiResponse = data.choices[0].message.content;
            
            // 添加AI响应到历史记录
            conversationHistory.push({
                role: "assistant",
                content: aiResponse
            });
            // 在界面上显示AI回复
            addMessage('ai', aiResponse);
            
            // 更新状态显示
            statusDisplay.textContent = '准备就绪';
            
        } catch (error) {
            // ========== 错误处理 ==========
            console.error('请求出错:', error);
            // 在状态栏显示错误
            statusDisplay.textContent = `错误: ${error.message}`;
            
            // 移除"正在输入"指示器
            removeTypingIndicator();
            
            // 在聊天界面显示错误信息
            addMessage('ai', `抱歉，出错了: ${error.message}。请稍后再试，或者尝试刷新页面。`);
            
        } finally {
            // ========== 清理工作 ==========
            // 重新启用输入和按钮
            userInput.disabled = false;
            sendButton.disabled = false;
            // 聚焦到输入框方便继续输入
            userInput.focus();
        }
    }
    
    // ========== 初始化函数 ==========
    /**
     * 初始化聊天界面
     */
    const init = () => {
        // 显示欢迎消息
        addMessage('ai', '你好！我是体态健康AI顾问，很高兴为你解答关于青少年体态健康的问题。你可以询问我关于体态健康、姿势矫正、体态改善的任何问题！');
        
        // 绑定发送按钮点击事件
        sendButton.addEventListener('click', sendMessage);
        
        // 绑定输入框回车键事件
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    };
    
    // 执行初始化
    init();
});