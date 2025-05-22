document.addEventListener('DOMContentLoaded', () => {
    const tips = [
        "保持正确的坐姿：背部挺直，双脚平放地面",
        "使用电子设备时，保持屏幕与眼睛平行",
        "每30分钟起身活动5分钟",
        "保持适当的运动量，加强核心肌群训练",
        "注意背包重量，避免单肩背包"
    ];
    const tipsCarousel = document.querySelector('.tips-carousel');
    tipsCarousel.innerHTML = tips.map(tip => `<div class="tip">${tip}</div>`).join('');
    let currentTip = 0;
    const tipElements = document.querySelectorAll('.tip');
    if (tipElements.length > 0) {
        tipElements[0].classList.add('active');
        setInterval(() => {
            tipElements[currentTip].classList.remove('active');
            currentTip = (currentTip + 1) % tipElements.length;
            tipElements[currentTip].classList.add('active');
        }, 3000);
    }
});