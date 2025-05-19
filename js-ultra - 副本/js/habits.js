// 等待DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // ========== DOM元素引用 ==========
    const timerDisplay = document.getElementById('timer-display'); // 计时器显示
    const timeButtons = document.querySelectorAll('.timer-button[data-time]'); // 时间选择按钮
    const customTimeBtn = document.getElementById('custom-time'); // 自定义时间按钮
    const startTimerBtn = document.getElementById('start-timer'); // 开始按钮
    const pauseTimerBtn = document.getElementById('pause-timer'); // 暂停按钮
    const resetTimerBtn = document.getElementById('reset-timer'); // 重置按钮
    const testTimerBtn = document.getElementById('test-timer'); // 测试按钮
    const notification = document.getElementById('timer-notification'); // 通知面板
    const closeNotificationBtn = document.getElementById('close-notification'); // 关闭通知按钮
    
    // ========== 计时器状态变量 ==========
    let timerInterval; // 计时器间隔ID
    let timerRunning = false; // 计时器是否运行中
    let remainingTime = 20 * 60; // 剩余时间(秒)，默认20分钟
    let selectedTime = 20; // 当前选择的时间(分钟)
    
    // ========== 工具函数 ==========
    
    /**
     * 格式化时间为MM:SS格式
     * @param {number} seconds - 总秒数
     * @returns {string} 格式化后的时间字符串
     */
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        // 补零显示，确保两位数格式
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    /**
     * 更新计时器显示
     */
    const updateTimerDisplay = () => {
        timerDisplay.textContent = formatTime(remainingTime);
    };
    
    // ========== 时间选择功能 ==========
    
    // 为预设时间按钮添加点击事件
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            timeButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前按钮添加active类
            button.classList.add('active');
            // 更新选择的时间
            selectedTime = parseInt(button.getAttribute('data-time'));
            // 计算剩余秒数
            remainingTime = selectedTime * 60;
            // 更新显示
            updateTimerDisplay();
        });
    });
    
    /**
     * 自定义时间处理
     */
    customTimeBtn.addEventListener('click', () => {
        // 更新按钮状态
        timeButtons.forEach(btn => btn.classList.remove('active'));
        customTimeBtn.classList.add('active');
        
        // 弹出输入框获取自定义分钟数
        const customMinutes = prompt('请输入提醒时间（分钟）：', '20');
        
        if (customMinutes !== null && !isNaN(customMinutes) && customMinutes > 0) {
            // 有效输入处理
            selectedTime = parseInt(customMinutes);
            remainingTime = selectedTime * 60;
            updateTimerDisplay();
        } else if (customMinutes !== null) {
            // 无效输入处理
            alert('请输入有效的分钟数！');
            customTimeBtn.classList.remove('active');
            // 恢复之前选择的时间按钮状态
            document.querySelector(`.timer-button[data-time="${selectedTime}"]`)?.classList.add('active');
        }
    });
    
    // ========== 计时器控制函数 ==========
    
    /**
     * 启动计时器
     * @param {boolean} isTestMode - 是否为测试模式(默认false)
     */
    const startTimer = (isTestMode = false) => {
        // 如果计时器已在运行，则不做任何操作
        if (timerRunning) return;
        
        // 保存原始时间(用于测试模式后恢复)
        const originalTime = remainingTime;
        
        // 测试模式设置为3秒
        if (isTestMode) {
            remainingTime = 3;
            updateTimerDisplay();
        }
        
        // 设置计时器间隔(每秒执行)
        timerInterval = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();
            
            // 计时结束处理
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                
                // 触发提醒
                showNotification();
                playAlertSound();
                
                // 恢复时间设置
                remainingTime = isTestMode ? originalTime : selectedTime * 60;
                updateTimerDisplay();
            }
        }, 1000);
        
        timerRunning = true;
    };
    
    /**
     * 暂停计时器
     */
    const pauseTimer = () => {
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
        }
    };
    
    /**
     * 重置计时器
     */
    const resetTimer = () => {
        clearInterval(timerInterval);
        timerRunning = false;
        remainingTime = selectedTime * 60;
        updateTimerDisplay();
    };
    
    // ========== 提醒功能 ==========
    
    /**
     * 显示提醒通知
     */
    const showNotification = () => {
        // 显示页面通知面板
        notification.classList.add('show');
        
        // 检查并显示系统通知
        if ('Notification' in window && Notification.permission === 'granted') {
            const notif = new Notification('体态提醒', {
                body: '是时候检查你的姿势了！请站起来活动一下，调整坐姿。',
                icon: '/favicon.ico'
            });
            // 5秒后自动关闭通知
            setTimeout(() => notif.close(), 5000);
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            // 请求通知权限
            Notification.requestPermission();
        }
    };
    
    /**
     * 播放提醒音效
     */
    const playAlertSound = () => {
        try {
            // 创建音频上下文(兼容不同浏览器)
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // 创建振荡器(音源)
            const oscillator = audioContext.createOscillator();
            // 创建增益节点(控制音量)
            const gainNode = audioContext.createGain();
            
            // 配置正弦波
            oscillator.type = 'sine';
            oscillator.frequency.value = 880; // A5音高
            gainNode.gain.value = 0.3; // 30%音量
            
            // 连接音频节点
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 播放第一个音
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                // 播放第二个音(形成叮咚效果)
                const oscillator2 = audioContext.createOscillator();
                oscillator2.type = 'sine';
                oscillator2.frequency.value = 1046.5; // C6音高
                oscillator2.connect(gainNode);
                oscillator2.start();
                setTimeout(() => oscillator2.stop(), 500);
            }, 500);
        } catch (error) {
            console.log('无法播放提示音:', error);
            // 音频播放失败时使用alert作为后备
            alert('姿势提醒：是时候检查你的姿势了！');
        }
    };
    
    // ========== 动画效果 ==========
    
    /**
     * 添加姿势指导内容的滚动动画
     */
    const addAnimationEffects = () => {
        const postureGuides = document.querySelectorAll('.posture-guide');
        
        // 创建交叉观察器
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 元素进入视口时触发动画
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // 动画完成后停止观察该元素
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // 当10%的元素可见时触发
        
        // 为每个指导内容设置初始状态并开始观察
        postureGuides.forEach((guide, index) => {
            guide.style.opacity = '0';
            guide.style.transform = 'translateY(20px)';
            guide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            // 设置交错动画延迟
            guide.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(guide);
        });
    };
    
    // ========== 事件监听 ==========
    startTimerBtn.addEventListener('click', () => startTimer());
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    testTimerBtn.addEventListener('click', () => startTimer(true));
    closeNotificationBtn.addEventListener('click', () => notification.classList.remove('show'));
    
    // ========== 初始化函数 ==========
    const init = () => {
        // 初始化计时器显示
        updateTimerDisplay();
        
        // 请求通知权限(如果尚未请求)
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
        
        // 添加动画效果
        addAnimationEffects();
    };
    
    // 执行初始化
    init();
});