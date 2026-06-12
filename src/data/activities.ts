import { Activity, Guide } from '@/types';

export const activities: Activity[] = [
  {
    id: 'act1',
    title: '青铜器专题讲座',
    type: '讲座',
    date: '2024-06-15',
    time: '14:00-16:00',
    location: '多功能报告厅',
    description:
      '邀请考古学专家，带您深入了解中国古代青铜器的铸造工艺、纹饰寓意与历史文化内涵，解读青铜时代的社会风貌。',
    image: 'https://picsum.photos/id/3/600/360',
    availableSlots: 20,
    totalSlots: 80,
    isBooked: false,
  },
  {
    id: 'act2',
    title: '亲子陶艺体验',
    type: '互动体验',
    date: '2024-06-16',
    time: '10:00-12:00',
    location: '教育活动中心',
    description:
      '适合5-12岁亲子家庭参与，由专业陶艺老师指导，亲自动手制作一件属于自己的陶瓷作品，感受中国陶瓷文化的魅力。',
    image: 'https://picsum.photos/id/225/600/360',
    availableSlots: 6,
    totalSlots: 30,
    isBooked: true,
  },
  {
    id: 'act3',
    title: '古画临摹工坊',
    type: '工作坊',
    date: '2024-06-18',
    time: '14:00-17:00',
    location: '书画教室',
    description:
      '以馆藏名画为范本，在专业书画老师的指导下学习传统工笔画技法，体会古人的笔墨意境与审美情趣。',
    image: 'https://picsum.photos/id/1025/600/360',
    availableSlots: 12,
    totalSlots: 20,
    isBooked: false,
  },
  {
    id: 'act4',
    title: '古代科技探秘',
    type: '互动体验',
    date: '2024-06-20',
    time: '09:30-11:30',
    location: '第四展厅互动区',
    description:
      '通过可操作的模型，亲手体验中国古代的四大发明和其他重要科技成果，感受古人的智慧与创新精神。',
    image: 'https://picsum.photos/id/201/600/360',
    availableSlots: 28,
    totalSlots: 50,
    isBooked: false,
  },
  {
    id: 'act5',
    title: '夜场文化沙龙',
    type: '沙龙',
    date: '2024-06-22',
    time: '19:00-21:00',
    location: '文化艺术空间',
    description:
      '打破博物馆常规开放时间，在夜晚宁静的氛围中，与文化学者面对面交流，探讨传统文化的当代价值。',
    image: 'https://picsum.photos/id/106/600/360',
    availableSlots: 35,
    totalSlots: 60,
    isBooked: false,
  },
  {
    id: 'act6',
    title: '玉器鉴赏培训',
    type: '培训',
    date: '2024-06-25',
    time: '13:30-16:30',
    location: '第三展厅学习区',
    description:
      '从玉的种类、工艺、纹饰、年代等方面，系统学习玉器鉴赏知识，并上手观察馆藏玉器实物细节。',
    image: 'https://picsum.photos/id/119/600/360',
    availableSlots: 0,
    totalSlots: 25,
    isBooked: false,
  },
];

export const guides: Guide[] = [
  {
    id: 'guide1',
    name: '李明远',
    avatar: 'https://picsum.photos/id/91/200/200',
    specialty: '青铜器、玉器',
    experience: 15,
    rating: 4.9,
    languages: ['中文', 'English'],
    availableDates: ['周一', '周二', '周三', '周五', '周六'],
    bio: '考古学硕士，从事博物馆讲解工作15年，著有《中国古代青铜器鉴赏》一书，擅长以生动有趣的方式讲述文物背后的故事。',
  },
  {
    id: 'guide2',
    name: '王诗韵',
    avatar: 'https://picsum.photos/id/338/200/200',
    specialty: '书画、织绣',
    experience: 8,
    rating: 4.8,
    languages: ['中文', '日本語'],
    availableDates: ['周二', '周四', '周五', '周日'],
    bio: '美术史博士，专攻中国古代书画与工艺美术研究，曾多次参与国内外大型展览策展工作，讲解深入而富有感染力。',
  },
  {
    id: 'guide3',
    name: '张博文',
    avatar: 'https://picsum.photos/id/177/200/200',
    specialty: '古代科技、瓷器',
    experience: 12,
    rating: 4.9,
    languages: ['中文', 'English', 'Français'],
    availableDates: ['周一', '周三', '周四', '周六', '周日'],
    bio: '科技史专业毕业，对中国古代科技发明有深入研究，讲解风格风趣幽默，善于联系生活实际，深受观众喜爱。',
  },
  {
    id: 'guide4',
    name: '陈思雨',
    avatar: 'https://picsum.photos/id/1027/200/200',
    specialty: '儿童讲解、综合',
    experience: 6,
    rating: 5.0,
    languages: ['中文', 'English'],
    availableDates: ['周六', '周日', '节假日'],
    bio: '教育学专业背景，擅长儿童博物馆教育，善于用故事和互动的方式引导孩子探索文化世界，是小朋友们最喜爱的"故事姐姐"。',
  },
];

export const getActivityById = (id: string): Activity | undefined =>
  activities.find((a) => a.id === id);

export const getGuideById = (id: string): Guide | undefined => guides.find((g) => g.id === id);
