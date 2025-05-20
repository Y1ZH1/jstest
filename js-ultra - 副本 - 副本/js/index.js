// 等待DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 体态小贴士数据
    const tips = [
        "保持正确的坐姿：背部挺直，双脚平放地面",
        "使用电子设备时，保持屏幕与眼睛平行",
        "每30分钟起身活动5分钟",
        "保持适当的运动量，加强核心肌群训练",
        "注意背包重量，避免单肩背包"
    ];

    // 获取小贴士轮播容器
    const tipsCarousel = document.querySelector('.tips-carousel');
    
    // 渲染小贴士内容
    tipsCarousel.innerHTML = tips.map(tip => `<div class="tip">${tip}</div>`).join('');

    // 自动切换小贴士
    let currentTip = 0;
    const tipElements = document.querySelectorAll('.tip');
    
    // 设置第一个提示为活动状态
    if (tipElements.length > 0) {
        tipElements[0].classList.add('active');
        
        // 设置定时器自动切换
        setInterval(() => {
            tipElements[currentTip].classList.remove('active');
            currentTip = (currentTip + 1) % tipElements.length;
            tipElements[currentTip].classList.add('active');
        }, 3000);
    }
});