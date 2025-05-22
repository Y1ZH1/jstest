document.addEventListener('DOMContentLoaded', () => {
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

    const state = {
        timerInterval: null,
        isRunning: false,
        remainingTime: 20 * 60,
        selectedTime: 20
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const updateTimerDisplay = () => {
        elements.timerDisplay.textContent = formatTime(state.remainingTime);
    };

    const startTimer = (isTestMode = false) => {
        if (state.isRunning) return;

        const originalTime = state.remainingTime;
        if (isTestMode) state.remainingTime = 3;

        updateTimerDisplay();

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
        pauseTimer();
        state.remainingTime = state.selectedTime * 60;
        updateTimerDisplay();
    };

    const showNotification = () => {
        elements.notification.classList.add('show');

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('体态提醒', {
                body: '是时候检查你的姿势了！请站起来活动一下，调整坐姿。'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    };

    const playAlertSound = () => {
        const audio = new Audio('../audio/alert.mp3');
        audio.volume = 0.8;
        audio.play();
    };

    const handleTimeButtonClick = (button) => {
        elements.timeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        state.selectedTime = parseInt(button.dataset.time);
        resetTimer();
    };

    const handleCustomTime = () => {
        elements.timeButtons.forEach(btn => btn.classList.remove('active'));
        elements.customTimeBtn.classList.add('active');

        const customMinutes = prompt('请输入提醒时间（分钟）：', '20');
        if (customMinutes !== null) {
            const minutes = parseInt(customMinutes);
            if (!isNaN(minutes) && minutes > 0) {
                state.selectedTime = minutes;
                resetTimer();
            } else {
                alert('请输入有效的分钟数！');
                elements.customTimeBtn.classList.remove('active');
                const prevButton = document.querySelector(`.timer-button[data-time="${state.selectedTime}"]`);
                if (prevButton) prevButton.classList.add('active');
            }
        }
    };

    elements.timeButtons.forEach(button => {
        button.addEventListener('click', () => handleTimeButtonClick(button));
    });

    elements.customTimeBtn.addEventListener('click', handleCustomTime);
    elements.startTimerBtn.addEventListener('click', () => startTimer());
    elements.pauseTimerBtn.addEventListener('click', pauseTimer);
    elements.resetTimerBtn.addEventListener('click', resetTimer);
    elements.testTimerBtn.addEventListener('click', () => startTimer(true));
    elements.closeNotificationBtn.addEventListener('click', () => {
        elements.notification.classList.remove('show');
    });

    updateTimerDisplay();

    if ('Notification' in window && Notification.permission !== 'granted' && 
        Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
});