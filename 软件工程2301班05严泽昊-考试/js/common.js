const updateFooterTime = () => {
    const footerTime = document.getElementById('footer-time');
    
    const updateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        footerTime.textContent = formattedTime;
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
};

updateFooterTime();