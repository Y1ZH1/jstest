// 等待DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取BMI表单元素
    const bmiForm = document.getElementById('bmi-form');
    // 获取结果展示区域元素
    const resultsSection = document.getElementById('results');
    
    const validateForm = () => {
        let isValid = true; // 默认假设表单有效
        
        // 获取身高和体重输入框元素
        const height = document.getElementById('height');
        const weight = document.getElementById('weight');
        
        // 清除所有之前的错误信息
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        // 验证身高输入
        if (!height.value) {
            // 如果身高为空，显示错误信息
            document.getElementById('height-error').textContent = '请输入身高';
            isValid = false;
        } else if (height.value < 100 || height.value > 220) {
            // 如果身高不在合理范围内，显示错误信息
            document.getElementById('height-error').textContent = '身高必须在100-220厘米之间';
            isValid = false;
        }
        
        // 验证体重输入
        if (!weight.value) {
            // 如果体重为空，显示错误信息
            document.getElementById('weight-error').textContent = '请输入体重';
            isValid = false;
        } else if (weight.value < 25 || weight.value > 120) {
            // 如果体重不在合理范围内，显示错误信息
            document.getElementById('weight-error').textContent = '体重必须在25-120公斤之间';
            isValid = false;
        }
        
        return isValid; // 返回验证结果
    };
    

    const calculateBMI = (height, weight) => {
        const heightInMeters = height / 100; // 将厘米转换为米
        return weight / (heightInMeters * heightInMeters); // BMI公式: 体重(kg)/身高(m)^2
    };

    const getBMIStatus = (bmi) => {
        if (bmi < 18.5) {
            return '体重过轻';
        } else if (bmi < 24) {
            return '正常范围';
        } else if (bmi < 28) {
            return '超重';
        } else {
            return '肥胖';
        }
    };
    
    // 为表单添加提交事件监听器
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        
        // 验证表单，如果无效则停止执行
        if (!validateForm()) {
            return;
        }
        
        // 获取输入的身高和体重值
        const height = parseInt(document.getElementById('height').value);
        const weight = parseInt(document.getElementById('weight').value);
        
        // 计算BMI和获取健康状态
        const bmi = calculateBMI(height, weight);
        const bmiStatus = getBMIStatus(bmi);
        
        // 显示计算结果
        document.getElementById('bmi-result').textContent = bmi.toFixed(1); // 保留1位小数
        document.getElementById('bmi-status').textContent = bmiStatus;
        
        // 显示结果区域
        resultsSection.classList.add('show');
    });
});