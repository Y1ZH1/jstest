// 等待DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // ========== DOM元素引用 ==========
    const elements = {
        timerDisplay: document.querySelector('.posture-timer #timer-display'),
        timeButtons: document.querySelectorAll('.posture-timer .timer-button[data-time]'),
        customTimeBtn: document.querySelector('.posture-timer #custom-time'),
        startTimerBtn: document.querySelector('.posture-timer #start-timer'),
        pauseTimerBtn: document.querySelector('.posture-timer #pause-timer'),
        resetTimerBtn: document.querySelector('.posture-timer #reset-timer'),
        testTimerBtn: document.querySelector('.posture-timer #test-timer'),
        notification: document.querySelector('.timer-notification'),
        closeNotificationBtn: document.querySelector('.timer-notification #close-notification'),
        postureGuides: document.querySelectorAll('.posture-guide')
    };

    // 检查必需的元素是否存在
    const requiredElements = ['timerDisplay', 'timeButtons', 'customTimeBtn', 'startTimerBtn', 
                            'pauseTimerBtn', 'resetTimerBtn', 'testTimerBtn', 'notification', 
                            'closeNotificationBtn'];
    
    const missingElements = requiredElements.filter(key => !elements[key] || 
        (key === 'timeButtons' && !elements[key].length));
    
    if (missingElements.length > 0) {
        console.error('缺少必需的DOM元素:', missingElements.join(', '));
        return;
    }

    // ========== 计时器状态 ==========
    const state = {
        timerInterval: null,
        isRunning: false,
        remainingTime: 20 * 60, // 默认20分钟
        selectedTime: 20
    };

    // ========== 工具函数 ==========
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const updateTimerDisplay = () => {
        elements.timerDisplay.textContent = formatTime(state.remainingTime);
    };

    // ========== 计时器控制 ==========
    const startTimer = (isTestMode = false) => {
        if (state.isRunning) return;

        const originalTime = state.remainingTime;
        if (isTestMode) {
            state.remainingTime = 3;
            updateTimerDisplay();
        }

        state.timerInterval = setInterval(() => {
            state.remainingTime--;
            updateTimerDisplay();

            if (state.remainingTime <= 0) {
                clearInterval(state.timerInterval);
                state.isRunning = false;
                showNotification();
                playAlertSound();
                state.remainingTime = isTestMode ? originalTime : state.selectedTime * 60;
                updateTimerDisplay();
            }
        }, 1000);

        state.isRunning = true;
    };

    const pauseTimer = () => {
        if (state.isRunning) {
            clearInterval(state.timerInterval);
            state.isRunning = false;
        }
    };

    const resetTimer = () => {
        clearInterval(state.timerInterval);
        state.isRunning = false;
        state.remainingTime = state.selectedTime * 60;
        updateTimerDisplay();
    };

    // ========== 通知功能 ==========
    const showNotification = () => {
        elements.notification.classList.add('show');

        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('体态提醒', {
                    body: '是时候检查你的姿势了！请站起来活动一下，调整坐姿。',
                    icon: '/favicon.ico'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
        }
    };

    const playAlertSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.3;

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                const oscillator2 = audioContext.createOscillator();
                oscillator2.type = 'sine';
                oscillator2.frequency.value = 1046.5;
                oscillator2.connect(gainNode);
                oscillator2.start();
                setTimeout(() => oscillator2.stop(), 500);
            }, 500);
        } catch (error) {
            console.log('无法播放提示音:', error);
            alert('姿势提醒：是时候检查你的姿势了！');
        }
    };

    // ========== 动画效果 ==========
    const initAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.postureGuides.forEach((guide, index) => {
            guide.style.opacity = '0';
            guide.style.transform = 'translateY(20px)';
            guide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            guide.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(guide);
        });
    };

    // ========== 事件处理 ==========
    const handleTimeButtonClick = (button) => {
        elements.timeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        state.selectedTime = parseInt(button.getAttribute('data-time'));
        state.remainingTime = state.selectedTime * 60;
        updateTimerDisplay();
    };

    const handleCustomTime = () => {
        elements.timeButtons.forEach(btn => btn.classList.remove('active'));
        elements.customTimeBtn.classList.add('active');

        const customMinutes = prompt('请输入提醒时间（分钟）：', '20');
        if (customMinutes !== null) {
            const minutes = parseInt(customMinutes);
            if (!isNaN(minutes) && minutes > 0) {
                state.selectedTime = minutes;
                state.remainingTime = minutes * 60;
                updateTimerDisplay();
            } else {
                alert('请输入有效的分钟数！');
                elements.customTimeBtn.classList.remove('active');
                const prevButton = document.querySelector(`.posture-timer .timer-button[data-time="${state.selectedTime}"]`);
                if (prevButton) prevButton.classList.add('active');
            }
        }
    };

    // ========== 事件监听 ==========
    elements.timeButtons.forEach(button => {
        button.addEventListener('click', () => handleTimeButtonClick(button));
    });

    elements.customTimeBtn.addEventListener('click', handleCustomTime);
    elements.startTimerBtn.addEventListener('click', () => startTimer());
    elements.pauseTimerBtn.addEventListener('click', pauseTimer);
    elements.resetTimerBtn.addEventListener('click', resetTimer);
    // elements.testTimerBtn.addEventListener('click', () => startTimer(true));
    elements.closeNotificationBtn.addEventListener('click', () => {
        elements.notification.classList.remove('show');
    });

    // ========== 初始化 ==========
    const init = () => {
        updateTimerDisplay();
        initAnimations();
        
        if ('Notification' in window && Notification.permission !== 'granted' && 
            Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    };

    init();
});