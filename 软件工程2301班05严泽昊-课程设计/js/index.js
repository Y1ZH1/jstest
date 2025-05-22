document.addEventListener('DOMContentLoaded', () => {
    const initChart = () => {
        const chartContainer = document.getElementById('posture-chart');
        if (!chartContainer) return;
        
        const myChart = echarts.init(chartContainer);

        const option = {
            title: {
                text: '常见体态问题发生率',
                left: 'center',
                textStyle: {
                    color: '#333'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['颈椎病', '腰椎间盘突出', '脊柱侧弯', '驼背', '骨盆前倾'],
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                name: '发生率(%)',
                max: 100
            },
            series: [
                {
                    name: '发生率',
                    type: 'bar',
                    data: [47.2, 49.5, 31.5, 27.1, 40.1],
                    barWidth: '40%',
                    itemStyle: {
                        color: '#5cbf5e'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}%'
                    }
                }
            ]
        };

        myChart.setOption(option);
        
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    };
    
    const addAnimationEffects = () => {
        const caseCards = document.querySelectorAll('.case');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        caseCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    };
    
    const initSwiper = () => {
        const swiper = new Swiper('.health-swiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'slide',
            speed: 800,
            slidesPerView: 1,
            spaceBetween: 30,
        });
    };
    
    const init = () => {
        initChart();
        initSwiper();
        addAnimationEffects();
    };
    
    init();
});