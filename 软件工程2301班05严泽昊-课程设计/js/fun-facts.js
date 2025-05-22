document.addEventListener('DOMContentLoaded', () => {
    new Vue({
        el: '#vue-questions-app',
        data: {
            selectedCategory: 'all',
            categories: ['脊柱问题', '骨盆问题', '背部问题'],
            problems: [
                {
                    title: '脊柱侧弯',
                    category: '脊柱问题',
                    image: 'curly.png',
                    definition: '脊柱在冠状面上呈现"S"或"C"型弯曲。',
                    causes: '先天性发育异常、神经肌肉疾病、长期不良姿势等。',
                    symptoms: '站立时肩膀不平、腰部不对称、衣服穿着不均匀。',
                    risks: '轻度可引起背痛、疲劳，严重可影响心肺功能，造成呼吸困难。',
                    suggestions: [
                        '轻度侧弯可通过特定的矫正运动改善',
                        '保持良好的坐姿和站姿',
                        '定期进行背部肌肉强化训练',
                        '严重情况需就医，可能需要支具或手术治疗'
                    ],
                    isOpen: false
                },
                {
                    title: '骨盆前倾',
                    category: '骨盆问题',
                    image: 'front.png',
                    definition: '骨盆过度向前倾斜，导致腰椎前凸增加。',
                    causes: '腰部肌肉力量不足、髋关节屈肌紧张、长期不良坐姿。',
                    symptoms: '腹部前突、臀部后翘、腰椎过度弯曲。',
                    risks: '可导致腰痛、腰椎间盘突出、下肢疲劳等问题。',
                    suggestions: [
                        '强化腹部和臀部肌肉',
                        '拉伸髋屈肌和腰部肌肉',
                        '调整坐姿，避免久坐',
                        '使用人体工学椅和适当的腰部支撑'
                    ],
                    isOpen: false
                },
                {
                    title: '驼背',
                    category: '背部问题',
                    image: 'back.png',
                    definition: '胸椎过度后凸，上背部呈圆弧形。',
                    causes: '长期低头看手机/电脑、学习姿势不良、缺乏运动。',
                    symptoms: '头部前倾、肩膀内旋、上背部隆起。',
                    risks: '可引起颈肩痛、呼吸受限、自信心下降，长期可能导致胸椎结构改变。',
                    suggestions: [
                        '定期进行胸部拉伸和背部强化训练',
                        '调整电子设备使用姿势，保持屏幕与眼睛平行',
                        '使用人体工学椅和适当的腰部支撑',
                        '定期提醒自己保持挺胸抬头的姿势'
                    ],
                    isOpen: false
                }
            ]
        },
        computed: {
            filteredProblems() {
                if (this.selectedCategory === 'all') {
                    return this.problems;
                }
                return this.problems.filter(p => p.category === this.selectedCategory);
            }
        },
        methods: {
            toggleDetails(index) {
                this.$set(this.problems[index], 'isOpen', !this.problems[index].isOpen);
            }
        }
    });
});