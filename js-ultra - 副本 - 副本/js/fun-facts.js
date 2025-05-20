// 等待DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 体态问题数据数组
    const postureProblems = [
        {
            title: "驼背",
            shortDesc: "一种常见的体态问题，主要表现为背部向前弯曲",
            details: "驼背通常是由于长期保持不良姿势导致的。预防方法包括：保持正确的坐姿、加强背部肌肉锻炼、定期进行伸展运动。"
        },
        {
            title: "圆肩",
            shortDesc: "肩膀向前倾斜，使胸部看起来凹陷",
            details: "圆肩多由长时间使用电子设备或伏案工作引起。改善方法：进行肩部伸展运动、加强背部肌肉、注意保持正确的坐姿。"
        },
        {
            title: "骨盆前倾",
            shortDesc: "骨盆向前倾斜，导致腹部突出",
            details: "骨盆前倾常与久坐不动有关。建议：加强核心肌群训练、保持正确的站姿、定期进行骨盆矫正运动。"
        },
        {
            title: "高低肩",
            shortDesc: "两侧肩膀高度不一致",
            details: "高低肩可能由背包习惯、运动习惯等导致。改善方法：平衡背包重量、进行对称性运动、注意保持正确的站姿。"
        },
        {
            title: "头前倾",
            shortDesc: "头部向前突出，颈部过度前伸",
            details: "头前倾常见于长时间使用手机或电脑的人群。预防方法：保持屏幕与眼睛平行、定期进行颈部伸展、加强颈部肌肉。"
        }
    ];

    // 获取问题列表容器元素
    const problemsContainer = document.querySelector('.posture-problems');
    
    // 渲染问题卡片
    problemsContainer.innerHTML = postureProblems.map(problem => `
        <div class="problem-card">
            <h3>${problem.title}</h3>
            <p class="short-desc">${problem.shortDesc}</p>
            <div class="problem-details hidden">
                <p>${problem.details}</p>
            </div>
        </div>
    `).join('');

    // 为每个问题卡片添加点击事件
    document.querySelectorAll('.problem-card').forEach(card => {
        card.addEventListener('click', () => {
            const details = card.querySelector('.problem-details');
            details.classList.toggle('hidden');
            card.classList.toggle('expanded');
        });
    });
});