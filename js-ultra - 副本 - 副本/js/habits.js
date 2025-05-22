// 等待DOM内容完全加载后执行（避免操作未加载的元素）
document.addEventListener('DOMContentLoaded', () => {
    // ========== 【1. DOM元素引用】 ==========
    // 集中管理所有需要操作的DOM元素，便于维护和重用
    const elements = {
        // 计时器显示区域（显示剩余时间）
        timerDisplay: document.querySelector('.posture-timer #timer-display'),
        // 所有预设时间选择按钮（20/30/40分钟等）
        timeButtons: document.querySelectorAll('.posture-timer .timer-button[data-time]'),
        // 自定义时间按钮
        customTimeBtn: document.querySelector('.posture-timer #custom-time'),
        // 开始计时按钮
        startTimerBtn: document.querySelector('.posture-timer #start-timer'),
        // 暂停计时按钮
        pauseTimerBtn: document.querySelector('.posture-timer #pause-timer'),
        // 重置计时按钮
        resetTimerBtn: document.querySelector('.posture-timer #reset-timer'),
        // 测试按钮（快速触发3秒计时，用于调试）
        testTimerBtn: document.querySelector('.posture-timer #test-timer'),
        // 计时结束时的通知弹窗
        notification: document.querySelector('.timer-notification'),
        // 关闭通知的按钮
        closeNotificationBtn: document.querySelector('.timer-notification #close-notification'),
        // 姿势指导提示元素（可选功能）
        postureGuides: document.querySelectorAll('.posture-guide')
    };

    // ========== 【2. 计时器状态管理】 ==========
    const state = {
        timerInterval: null,     // 存储计时器的interval ID（用于清除）
        isRunning: false,       // 标记计时器是否正在运行
        remainingTime: 20 * 60, // 剩余时间（秒），默认20分钟
        selectedTime: 20        // 用户选择的时间（分钟）
    };

    // ========== 【3. 工具函数】 ==========

    /**
     * 将秒数格式化为 MM:SS 的显示格式
     * @param {number} seconds - 总秒数
     * @returns {string} 格式化后的时间字符串（如 "05:30"）
     */
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60); // 计算分钟部分
        const secs = seconds % 60;               // 计算剩余秒数
        // 使用 padStart 补零（如 5 → "05"）
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    /**
     * 更新计时器显示（同步到页面）
     */
    const updateTimerDisplay = () => {
        elements.timerDisplay.textContent = formatTime(state.remainingTime);
    };

    // ========== 【4. 计时器核心控制】 ==========

    /**
     * 开始计时器
     * @param {boolean} [isTestMode=false] - 是否为测试模式（3秒快速触发）
     */
    const startTimer = (isTestMode = false) => {
        if (state.isRunning) return; // 防止重复启动

        const originalTime = state.remainingTime; // 保存原始时间
        if (isTestMode) state.remainingTime = 3;  // 测试模式设为3秒

        updateTimerDisplay(); // 立即更新显示

        // 启动计时器（每秒执行一次）
        state.timerInterval = setInterval(() => {
            state.remainingTime--;    // 减少剩余时间
            updateTimerDisplay();     // 更新显示

            // 时间耗尽时触发结束逻辑
            if (state.remainingTime <= 0) {
                clearInterval(state.timerInterval); // 停止计时
                state.isRunning = false;
                showNotification();   // 显示通知
                playAlertSound();     // 播放提示音
                // 恢复时间（测试模式还原，否则重置为选择的时间）
                state.remainingTime = isTestMode ? originalTime : state.selectedTime * 60;
                updateTimerDisplay(); // 更新显示
            }
        }, 1000); // 1000ms = 1秒

        state.isRunning = true; // 标记为运行状态
    };

    /**
     * 暂停计时器
     */
    const pauseTimer = () => {
        if (state.isRunning) {
            clearInterval(state.timerInterval); // 清除计时器
            state.isRunning = false;            // 更新状态
        }
    };

    /**
     * 重置计时器（恢复初始状态）
     */
    const resetTimer = () => {
        pauseTimer(); // 先暂停（如果正在运行）
        state.remainingTime = state.selectedTime * 60; // 重置为选择的时间
        updateTimerDisplay(); // 更新显示
    };

    // ========== 【5. 通知系统】 ==========

    /**
     * 显示通知（页面弹窗 + 系统通知）
     */
    const showNotification = () => {
        // 显示页面通知弹窗
        elements.notification.classList.add('show');

        // 检查浏览器通知权限并发送系统通知
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('体态提醒', {
                body: '是时候检查你的姿势了！请站起来活动一下，调整坐姿。'
            });
        } else if (Notification.permission !== 'denied') {
            // 如果未请求过权限，则请求
            Notification.requestPermission();
        }
    };

    /**
     * 播放提示音（使用Web Audio API生成双音效）
     */
    const playAlertSound = () => {
        try {
            // 创建音频上下文
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // 创建振荡器（声音源）
            const oscillator = audioContext.createOscillator();
            // 创建增益节点（控制音量）
            const gainNode = audioContext.createGain();

            // 配置声音
            oscillator.type = 'sine';       // 正弦波
            oscillator.frequency.value = 880; // 频率880Hz (A5音高)
            gainNode.gain.value = 0.3;      // 音量30%

            // 连接音频节点
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // 播放第一个音（持续0.5秒）
            oscillator.start();
            setTimeout(() => {
                oscillator.stop(); // 停止第一个音

                // 播放第二个更高音（C6音高）
                const oscillator2 = audioContext.createOscillator();
                oscillator2.type = 'sine';
                oscillator2.frequency.value = 1046.5; // 1046.5Hz
                oscillator2.connect(gainNode);
                oscillator2.start();
                setTimeout(() => oscillator2.stop(), 500); // 0.5秒后停止
            }, 500); // 0.5秒后切换
        } catch (error) {
            console.error('音频播放失败:', error);
            // 降级方案：使用浏览器alert
            alert('姿势提醒：是时候检查你的姿势了！');
        }
    };

    // ========== 【6. 事件处理函数】 ==========

    /**
     * 处理预设时间按钮点击
     * @param {HTMLElement} button - 被点击的按钮元素
     */
    const handleTimeButtonClick = (button) => {
        // 移除所有按钮的active样式
        elements.timeButtons.forEach(btn => btn.classList.remove('active'));
        // 为当前按钮添加active样式
        button.classList.add('active');
        // 更新选择的时间（从data-time属性获取）
        state.selectedTime = parseInt(button.dataset.time);
        // 重置计时器
        resetTimer();
    };

    /**
     * 处理自定义时间按钮点击
     */
    const handleCustomTime = () => {
        // 移除所有预设按钮的active样式
        elements.timeButtons.forEach(btn => btn.classList.remove('active'));
        // 标记自定义按钮为active
        elements.customTimeBtn.classList.add('active');

        // 弹出输入框让用户输入分钟数
        const customMinutes = prompt('请输入提醒时间（分钟）：', '20');
        if (customMinutes !== null) { // 用户未点击取消
            const minutes = parseInt(customMinutes);
            // 验证输入是否有效
            if (!isNaN(minutes) && minutes > 0) {
                state.selectedTime = minutes;
                resetTimer(); // 重置计时器
            } else {
                alert('请输入有效的分钟数！');
                // 恢复之前的选择
                elements.customTimeBtn.classList.remove('active');
                const prevButton = document.querySelector(`.timer-button[data-time="${state.selectedTime}"]`);
                if (prevButton) prevButton.classList.add('active');
            }
        }
    };

    // ========== 【7. 事件监听器绑定】 ==========
    // 绑定预设时间按钮点击事件
    elements.timeButtons.forEach(button => {
        button.addEventListener('click', () => handleTimeButtonClick(button));
    });

    // 绑定其他按钮事件
    elements.customTimeBtn.addEventListener('click', handleCustomTime);
    elements.startTimerBtn.addEventListener('click', () => startTimer());
    elements.pauseTimerBtn.addEventListener('click', pauseTimer);
    elements.resetTimerBtn.addEventListener('click', resetTimer);
    elements.testTimerBtn.addEventListener('click', () => startTimer(true)); // 测试模式
    elements.closeNotificationBtn.addEventListener('click', () => {
        elements.notification.classList.remove('show'); // 关闭通知
    });

    // ========== 【8. 初始化设置】 ==========
    updateTimerDisplay(); // 初始化显示时间

    // 请求通知权限（如果尚未请求）
    if ('Notification' in window && Notification.permission !== 'granted' && 
        Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
});