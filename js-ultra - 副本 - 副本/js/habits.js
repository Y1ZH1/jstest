// 等待DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // ========== DOM元素引用 ==========
    // 集中管理所有需要操作的DOM元素
    const elements = {
        timerDisplay: document.querySelector('.posture-timer #timer-display'), // 计时器显示区域
        timeButtons: document.querySelectorAll('.posture-timer .timer-button[data-time]'), // 时间选择按钮组
        customTimeBtn: document.querySelector('.posture-timer #custom-time'), // 自定义时间按钮
        startTimerBtn: document.querySelector('.posture-timer #start-timer'), // 开始按钮
        pauseTimerBtn: document.querySelector('.posture-timer #pause-timer'), // 暂停按钮
        resetTimerBtn: document.querySelector('.posture-timer #reset-timer'), // 重置按钮
        testTimerBtn: document.querySelector('.posture-timer #test-timer'), // 测试按钮
        notification: document.querySelector('.timer-notification'), // 通知弹窗
        closeNotificationBtn: document.querySelector('.timer-notification #close-notification'), // 关闭通知按钮
        postureGuides: document.querySelectorAll('.posture-guide') // 姿势指导元素
    };

    // ========== 元素存在性检查 ==========
    // 定义必须存在的元素列表
    const requiredElements = ['timerDisplay', 'timeButtons', 'customTimeBtn', 'startTimerBtn', 
                            'pauseTimerBtn', 'resetTimerBtn', 'testTimerBtn', 'notification', 
                            'closeNotificationBtn'];
    
    // 检查缺少的元素
    const missingElements = requiredElements.filter(key => !elements[key] || 
        (key === 'timeButtons' && !elements[key].length));
    
    // 如果有缺少的元素，输出错误并停止执行
    if (missingElements.length > 0) {
        console.error('缺少必需的DOM元素:', missingElements.join(', '));
        return;
    }

    // ========== 计时器状态管理 ==========
    const state = {
        timerInterval: null, // 存储计时器interval ID
        isRunning: false, // 计时器是否正在运行
        remainingTime: 20 * 60, // 剩余时间(秒)，默认20分钟
        selectedTime: 20 // 当前选择的时间(分钟)
    };

    // ========== 工具函数 ==========

    /**
     * 将秒数格式化为MM:SS格式
     * @param {number} seconds - 总秒数
     * @returns {string} 格式化后的时间字符串
     */
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60); // 计算分钟数
        const secs = seconds % 60; // 计算剩余秒数
        // 使用padStart确保两位数显示
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    /**
     * 更新计时器显示
     */
    const updateTimerDisplay = () => {
        elements.timerDisplay.textContent = formatTime(state.remainingTime);
    };

    // ========== 计时器核心控制 ==========

    /**
     * 开始计时器
     * @param {boolean} [isTestMode=false] - 是否为测试模式(3秒)
     */
    const startTimer = (isTestMode = false) => {
        if (state.isRunning) return; // 如果已经在运行，则不做任何操作

        const originalTime = state.remainingTime; // 保存原始时间
        if (isTestMode) state.remainingTime = 3; // 测试模式设置为3秒

        updateTimerDisplay(); // 立即更新显示
        
        // 设置计时器，每秒执行一次
        state.timerInterval = setInterval(() => {
            state.remainingTime--; // 减少剩余时间
            updateTimerDisplay(); // 更新显示

            // 当时间耗尽时
            if (state.remainingTime <= 0) {
                clearInterval(state.timerInterval); // 清除计时器
                state.isRunning = false; // 更新状态
                showNotification(); // 显示通知
                playAlertSound(); // 播放提示音
                // 恢复时间(测试模式恢复原时间，否则恢复选择的时间)
                state.remainingTime = isTestMode ? originalTime : state.selectedTime * 60;
                updateTimerDisplay(); // 更新显示
            }
        }, 1000); // 每秒执行一次

        state.isRunning = true; // 更新运行状态
    };

    /**
     * 暂停计时器
     */
    const pauseTimer = () => {
        if (state.isRunning) {
            clearInterval(state.timerInterval); // 清除计时器
            state.isRunning = false; // 更新状态
        }
    };

    /**
     * 重置计时器
     */
    const resetTimer = () => {
        pauseTimer(); // 先暂停计时器
        state.remainingTime = state.selectedTime * 60; // 重置剩余时间
        updateTimerDisplay(); // 更新显示
    };

    // ========== 通知系统 ==========

    /**
     * 显示通知(页面通知和系统通知)
     */
    const showNotification = () => {
        elements.notification.classList.add('show'); // 显示页面通知

        // 检查浏览器通知API是否可用且已授权
        if ('Notification' in window && Notification.permission === 'granted') {
            // 显示系统通知
            new Notification('体态提醒', {
                body: '是时候检查你的姿势了！请站起来活动一下，调整坐姿。',
                // icon: '/favicon.ico' // 可以取消注释并设置图标路径
            });
        } else if (Notification.permission !== 'denied') {
            // 请求通知权限
            Notification.requestPermission();
        }
    };

    /**
     * 播放提示音(使用Web Audio API)
     */
    const playAlertSound = () => {
        try {
            // 创建音频上下文
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // 创建振荡器(声音源)
            const oscillator = audioContext.createOscillator();
            // 创建增益节点(控制音量)
            const gainNode = audioContext.createGain();

            // 配置振荡器
            oscillator.type = 'sine'; // 正弦波
            oscillator.frequency.value = 880; // 频率880Hz (A5音)
            gainNode.gain.value = 0.3; // 音量30%

            // 连接音频节点
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // 播放第一个音
            oscillator.start();
            setTimeout(() => {
                oscillator.stop(); // 停止第一个音
                // 播放第二个音(高音)
                const oscillator2 = audioContext.createOscillator();
                oscillator2.type = 'sine';
                oscillator2.frequency.value = 1046.5; // 频率1046.5Hz (C6音)
                oscillator2.connect(gainNode);
                oscillator2.start();
                setTimeout(() => oscillator2.stop(), 500); // 0.5秒后停止
            }, 500); // 0.5秒后切换
        } catch (error) {
            console.log('无法播放提示音:', error);
            alert('姿势提醒：是时候检查你的姿势了！'); // 备用提醒方式
        }
    };

    // ========== 事件处理函数 ==========

    /**
     * 处理时间选择按钮点击
     * @param {HTMLElement} button - 被点击的按钮元素
     */
    const handleTimeButtonClick = (button) => {
        // 移除所有按钮的active类
        elements.timeButtons.forEach(btn => btn.classList.remove('active'));
        // 为当前按钮添加active类
        button.classList.add('active');
        // 更新选择的时间
        state.selectedTime = parseInt(button.dataset.time);
        // 重置计时器
        resetTimer();
    };

    /**
     * 处理自定义时间按钮点击
     */
    const handleCustomTime = () => {
        // 移除所有按钮的active类
        elements.timeButtons.forEach(btn => btn.classList.remove('active'));
        // 为自定义按钮添加active类
        elements.customTimeBtn.classList.add('active');

        // 显示输入对话框
        const customMinutes = prompt('请输入提醒时间（分钟）：', '20');
        if (customMinutes !== null) { // 用户没有取消
            const minutes = parseInt(customMinutes);
            // 验证输入
            if (!isNaN(minutes) && minutes > 0) {
                state.selectedTime = minutes;
                resetTimer(); // 重置计时器
            } else {
                alert('请输入有效的分钟数！');
                // 恢复之前的选择
                elements.customTimeBtn.classList.remove('active');
                const prevButton = document.querySelector(`.posture-timer .timer-button[data-time="${state.selectedTime}"]`);
                if (prevButton) prevButton.classList.add('active');
            }
        }
    };

    // ========== 事件监听器绑定 ==========
    // 为所有时间选择按钮添加点击事件
    elements.timeButtons.forEach(button => {
        button.addEventListener('click', () => handleTimeButtonClick(button));
    });

    // 为其他按钮添加事件监听
    elements.customTimeBtn.addEventListener('click', handleCustomTime);
    elements.startTimerBtn.addEventListener('click', () => startTimer());
    elements.pauseTimerBtn.addEventListener('click', pauseTimer);
    elements.resetTimerBtn.addEventListener('click', resetTimer);
    elements.testTimerBtn.addEventListener('click', () => startTimer(true)); // 测试模式
    elements.closeNotificationBtn.addEventListener('click', () => {
        elements.notification.classList.remove('show'); // 关闭通知
    });

    // ========== 初始化设置 ==========
    updateTimerDisplay(); // 初始化显示
    
    // 请求通知权限(如果尚未请求过)
    if ('Notification' in window && Notification.permission !== 'granted' && 
        Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
});