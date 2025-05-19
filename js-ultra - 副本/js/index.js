// 首页 JavaScript 文件

// 等待DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    /**
     * 初始化体态问题统计图表
     * 功能：创建并配置一个绿色柱状图，展示常见体态问题的发生率
     */
    const initChart = () => {
        // 获取图表容器元素
        const chartContainer = document.getElementById('posture-chart');
        // 防御性编程：如果元素不存在则直接返回
        if (!chartContainer) return;
        
        // 初始化ECharts实例
        const myChart = echarts.init(chartContainer);

        // 图表配置项
        const option = {
            // 标题配置
            title: {
                text: '常见体态问题发生率',  // 主标题文本
                left: 'center',             // 标题水平居中
                textStyle: {
                    color: '#333'           // 标题文字颜色
                }
            },
            // 提示框配置
            tooltip: {
                trigger: 'axis',            // 触发类型为坐标轴触发
                axisPointer: {
                    type: 'shadow'          // 阴影指示器
                }
            },
            // 网格配置
            grid: {
                left: '3%',     // 左侧留白百分比
                right: '4%',    // 右侧留白百分比
                bottom: '3%',   // 底部留白百分比
                containLabel: true  // 包含坐标轴标签在内
            },
            // X轴配置
            xAxis: {
                type: 'category',  // 类目轴
                data: ['颈椎病', '腰椎间盘突出', '脊柱侧弯', '驼背', '骨盆前倾'],  // 类目数据
                axisLabel: {
                    interval: 0,    // 强制显示所有标签
                    rotate: 30      // 标签旋转30度（防止重叠）
                }
            },
            // Y轴配置
            yAxis: {
                type: 'value',      // 数值轴
                name: '发生率(%)',  // 轴名称
                max: 100            // 最大值设为100%
            },
            // 数据系列配置
            series: [
                {
                    name: '发生率',  // 系列名称
                    type: 'bar',    // 柱状图
                    data: [47.2, 49.5, 31.5, 27.1, 40.1],  // 数据值
                    barWidth: '40%',  // 柱条宽度
                    itemStyle: {
                        // 修改为单一绿色 #5cbf5e
                        color: '#5cbf5e'
                    },
                    // 标签配置
                    label: {
                        show: true,         // 显示标签
                        position: 'top',    // 标签位置在柱条顶部
                        formatter: '{c}%'   // 标签内容格式（显示数值加百分号）
                    }
                }
            ]
        };

        // 应用配置项
        myChart.setOption(option);
        
        // 监听窗口大小变化事件，重新调整图表大小
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    };
    
    /**
     * 添加动画效果
     * 功能：为案例卡片添加滚动进入视口时的淡入和上移动画
     */
    const addAnimationEffects = () => {
        // 获取所有案例卡片元素
        const caseCards = document.querySelectorAll('.case');
        
        // IntersectionObserver配置选项
        const observerOptions = {
            root: null,         // 相对于视口观察
            rootMargin: '0px',  // 无额外边距
            threshold: 0.1      // 当10%的元素可见时触发
        };
        
        // 创建IntersectionObserver实例
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 当元素进入视口时，应用动画效果
                    entry.target.style.opacity = '1';           // 完全显示
                    entry.target.style.transform = 'translateY(0)'; // 移动到原始位置
                    // 动画完成后停止观察该元素（性能优化）
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // 为每个卡片设置初始状态并开始观察
        caseCards.forEach(card => {
            card.style.opacity = '0';                   // 初始完全透明
            card.style.transform = 'translateY(20px)';  // 初始下移20像素
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';  // 过渡效果
            observer.observe(card);  // 开始观察元素
        });
    };
    
    /**
     * 初始化Swiper轮播图
     * 功能：创建自动轮播的健康知识展示区，带有分页器和导航按钮
     */
    const initSwiper = () => {
        // 创建Swiper实例
        const swiper = new Swiper('.health-swiper', {
            loop: true,  // 开启循环模式
            
            // 自动播放配置
            autoplay: {
                delay: 5000,  // 5秒切换一次
                disableOnInteraction: false,  // 用户操作后不停止自动播放
            },
            
            // 分页器配置
            pagination: {
                el: '.swiper-pagination',  // 分页器容器
                clickable: true,          // 分页器可点击
            },
            
            // 导航按钮配置
            navigation: {
                nextEl: '.swiper-button-next',  // 下一页按钮
                prevEl: '.swiper-button-prev',  // 上一页按钮
            },
            
            effect: 'slide',  // 切换效果为滑动
            speed: 800,       // 切换速度800ms
            slidesPerView: 1, // 每次显示1张幻灯片
            spaceBetween: 30, // 幻灯片间距30px
        });
    };
    
    /**
     * 初始化所有功能
     * 功能：集中调用各个初始化函数
     */
    const init = () => {
        initChart();            // 初始化图表
        initSwiper();           // 初始化轮播图
        addAnimationEffects();  // 添加动画效果
    };
    
    // 执行初始化
    init();
});