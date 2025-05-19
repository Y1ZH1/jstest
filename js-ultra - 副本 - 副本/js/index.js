// 首页 JavaScript 文件

// 等待DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化页面动画效果
    const initAnimations = () => {
        const cards = document.querySelectorAll('.posture-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            observer.observe(card);
        });
    };

    // 初始化体态小贴士
    const initPostureTips = () => {
        const tips = [
            "保持正确的坐姿：背部挺直，双脚平放地面",
            "使用电子设备时，保持屏幕与眼睛平行",
            "每30分钟起身活动5分钟",
            "保持适当的运动量，加强核心肌群训练",
            "注意背包重量，避免单肩背包"
        ];

        const tipsCarousel = document.querySelector('.tips-carousel');
        tipsCarousel.innerHTML = tips.map(tip => `<div class="tip">${tip}</div>`).join('');

        // 自动切换小贴士
        let currentTip = 0;
        const tipElements = document.querySelectorAll('.tip');
        
        // 设置第一个提示为活动状态
        tipElements[0].classList.add('active');
        
        setInterval(() => {
            tipElements[currentTip].classList.remove('active');
            currentTip = (currentTip + 1) % tipElements.length;
            tipElements[currentTip].classList.add('active');
        }, 3000);
    };

    // 初始化所有功能
    const init = () => {
        initAnimations();
        initPostureTips();
    };

    // 执行初始化
    init();
});