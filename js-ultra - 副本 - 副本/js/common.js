/**
 * 更新页脚时间显示的函数
 * 功能：获取当前时间并格式化为 YYYY-MM-DD HH:MM:SS 格式，每秒更新一次
 */
const updateFooterTime = () => {
    // 获取页脚时间显示元素
    const footerTime = document.getElementById('footer-time');
    
    // 如果元素不存在，则直接返回（防御性编程）
    // if (!footerTime) return;

    /**
     * 更新时间显示的内部函数
     * 功能：获取当前时间，格式化后更新到页脚元素
     */
    const updateTime = () => {
        // 创建一个新的Date对象表示当前时间
        const now = new Date();
        
        // 获取时间的各个组成部分
        const year = now.getFullYear(); // 年（4位数）
        // 月（0-11），所以需要+1，并格式化为2位数
        const month = String(now.getMonth() + 1).padStart(2, '0');
        // 日（1-31），格式化为2位数
        const day = String(now.getDate()).padStart(2, '0');
        // 小时（0-23），格式化为2位数
        const hour = String(now.getHours()).padStart(2, '0');
        // 分钟（0-59），格式化为2位数
        const minute = String(now.getMinutes()).padStart(2, '0');
        // 秒（0-59），格式化为2位数
        const second = String(now.getSeconds()).padStart(2, '0');

        // 拼接成格式化的时间字符串（YYYY-MM-DD HH:MM:SS）
        const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        
        // 更新页脚元素的文本内容
        footerTime.textContent = formattedTime;
    };

    // 立即执行一次更新时间（避免初始加载时1秒的空白）
    updateTime();
    
    // 设置定时器，每秒（1000毫秒）更新一次时间
    // 将定时器ID存储在变量中，以便需要时可以取消（虽然这里没有取消的需求）
    const timeInterval = setInterval(updateTime, 1000);
    
    // 如果需要停止定时器，可以调用 clearInterval(timeInterval);
};
    updateFooterTime();
