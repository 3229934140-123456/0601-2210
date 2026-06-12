import { Quiz } from '@/types';

export const quizzes: Quiz[] = [
  {
    id: 'quiz1',
    exhibitId: 'ex1',
    question: '商代青铜方鼎上最常见的纹饰是什么？',
    options: ['龙凤纹', '饕餮纹', '花鸟纹', '几何纹'],
    correctIndex: 1,
    explanation:
      '饕餮纹是商代青铜器上最具代表性的纹饰，是一种想象中的神秘怪兽纹样，古人认为它具有辟邪的功能。',
  },
  {
    id: 'quiz2',
    exhibitId: 'ex2',
    question: '唐三彩的"三彩"主要指哪三种颜色？',
    options: ['红、黄、蓝', '黄、绿、白', '青、赤、黄', '黑、白、灰'],
    correctIndex: 1,
    explanation:
      '唐三彩以黄、绿、白三色为主，故得名"三彩"。但实际上其釉色丰富，还包括蓝、赭、紫等多种色彩。',
  },
  {
    id: 'quiz3',
    exhibitId: 'ex3',
    question: '青花瓷的烧制需要多少度的高温？',
    options: ['约800度', '约1000度', '约1300度', '约1600度'],
    correctIndex: 2,
    explanation:
      '青花瓷属于高温釉下彩瓷器，需要在约1300度左右的高温下一次烧成，才能使青花料充分发色并与胎釉结合。',
  },
  {
    id: 'quiz4',
    exhibitId: 'ex4',
    question: '《洛神赋图》的作者是哪一位画家？',
    options: ['吴道子', '顾恺之', '张择端', '范宽'],
    correctIndex: 1,
    explanation:
      '《洛神赋图》是东晋著名画家顾恺之根据曹植的《洛神赋》创作的，是中国绘画史上的经典之作。',
  },
  {
    id: 'quiz5',
    exhibitId: 'ex5',
    question: '古代玉璧的主要用途是什么？',
    options: ['装饰佩戴', '祭祀礼器', '货币流通', '饮食器具'],
    correctIndex: 1,
    explanation:
      '玉璧是古代重要的礼器之一，主要用于祭祀天、朝聘、丧葬等重要礼仪场合，是权力与身份的象征。',
  },
  {
    id: 'quiz6',
    exhibitId: 'ex7',
    question: '一套完整的编钟最多能演奏出几个音？',
    options: ['单音', '双音', '三音', '四音'],
    correctIndex: 1,
    explanation:
      '中国古代编钟的神奇之处在于每件钟都能发出两个不同频率的乐音——正鼓音和侧鼓音，大大扩展了音域。',
  },
  {
    id: 'quiz7',
    exhibitId: 'ex8',
    question: '司南是什么的始祖？',
    options: ['钟表', '指南针', '地动仪', '算盘'],
    correctIndex: 1,
    explanation:
      '司南是中国古代发明的最早的磁性指向器，被认为是现代指南针的始祖，对世界航海史产生了深远影响。',
  },
  {
    id: 'quiz8',
    exhibitId: 'ex10',
    question: '紫砂壶最著名的产地在哪里？',
    options: ['景德镇', '宜兴', '德化', '龙泉'],
    correctIndex: 1,
    explanation:
      '江苏宜兴是紫砂壶的发源地和最著名产地，当地特有的紫砂泥料制成的茶壶具有良好的透气性能，被誉为"世间茶具称为首"。',
  },
  {
    id: 'quiz9',
    exhibitId: 'ex11',
    question: '文徵明是哪个朝代的画家？',
    options: ['元代', '明代', '清代', '宋代'],
    correctIndex: 1,
    explanation:
      '文徵明是明代著名的书画家，与沈周、唐寅、仇英并称"明四家"，是吴门画派的代表人物之一。',
  },
];

export const getQuizByExhibitId = (exhibitId: string): Quiz | undefined =>
  quizzes.find((q) => q.exhibitId === exhibitId);

export const getQuizById = (id: string): Quiz | undefined => quizzes.find((q) => q.id === id);
