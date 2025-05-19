document.addEventListener('DOMContentLoaded', () => {
    const bmiForm = document.getElementById('bmi-form');
    const resultsSection = document.getElementById('results');
    
    const validateForm = () => {
        let isValid = true;
        
        const height = document.getElementById('height');
        const weight = document.getElementById('weight');
        
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        if (!height.value) {
            document.getElementById('height-error').textContent = '请输入身高';
            isValid = false;
        } else if (height.value < 100 || height.value > 220) {
            document.getElementById('height-error').textContent = '身高必须在100-220厘米之间';
            isValid = false;
        }
        
        if (!weight.value) {
            document.getElementById('weight-error').textContent = '请输入体重';
            isValid = false;
        } else if (weight.value < 25 || weight.value > 120) {
            document.getElementById('weight-error').textContent = '体重必须在25-120公斤之间';
            isValid = false;
        }
        
        return isValid;
    };
    
    const calculateBMI = (height, weight) => {
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
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
    
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const height = parseInt(document.getElementById('height').value);
        const weight = parseInt(document.getElementById('weight').value);
        
        const bmi = calculateBMI(height, weight);
        const bmiStatus = getBMIStatus(bmi);
        
        document.getElementById('bmi-result').textContent = bmi.toFixed(1);
        document.getElementById('bmi-status').textContent = bmiStatus;
        
        resultsSection.classList.add('show');
    });
    
    const init = () => {
    };
    
    init();
});