import { Route } from '@/types';

export const routes: Route[] = [
  {
    id: 'route1',
    name: '亲子趣游路线',
    mode: 'children',
    description:
      '专为6-12岁儿童设计，精选趣味性强、互动性高的展品，配合故事化讲解和小任务，让孩子在玩乐中感受传统文化的魅力。全程节奏轻松，安排合理休息。',
    duration: 90,
    exhibitCount: 6,
    image: 'https://picsum.photos/id/237/600/360',
    difficulty: '轻松',
    nodes: [
      { exhibitId: 'ex1', exhibitName: '商代青铜方鼎', estimatedTime: 15, isCompleted: true },
      { exhibitId: 'ex2', exhibitName: '唐三彩骆驼载乐俑', estimatedTime: 15, isCompleted: true },
      { exhibitId: 'ex7', exhibitName: '编钟', estimatedTime: 20, isCompleted: false },
      { exhibitId: 'ex8', exhibitName: '司南', estimatedTime: 15, isCompleted: false },
      { exhibitId: 'ex10', exhibitName: '紫砂茶壶', estimatedTime: 15, isCompleted: false },
      { exhibitId: 'ex5', exhibitName: '玉璧', estimatedTime: 10, isCompleted: false },
    ],
  },
  {
    id: 'route2',
    name: '深度文化探索',
    mode: 'deep',
    description:
      '为对历史文化有浓厚兴趣的游客定制，涵盖各展厅代表文物，搭配深度学术讲解。适合希望系统了解中华五千年文明的资深爱好者。',
    duration: 180,
    exhibitCount: 10,
    image: 'https://picsum.photos/id/3/600/360',
    difficulty: '深度',
    nodes: [
      { exhibitId: 'ex1', exhibitName: '商代青铜方鼎', estimatedTime: 20, isCompleted: false },
      { exhibitId: 'ex2', exhibitName: '唐三彩骆驼载乐俑', estimatedTime: 18, isCompleted: false },
      { exhibitId: 'ex3', exhibitName: '青花缠枝莲纹瓶', estimatedTime: 18, isCompleted: false },
      { exhibitId: 'ex4', exhibitName: '顾恺之《洛神赋图》摹本', estimatedTime: 22, isCompleted: false },
      { exhibitId: 'ex5', exhibitName: '玉璧', estimatedTime: 15, isCompleted: false },
      { exhibitId: 'ex6', exhibitName: '鎏金铜佛像', estimatedTime: 18, isCompleted: false },
      { exhibitId: 'ex7', exhibitName: '编钟', estimatedTime: 25, isCompleted: false },
      { exhibitId: 'ex8', exhibitName: '司南', estimatedTime: 12, isCompleted: false },
      { exhibitId: 'ex11', exhibitName: '文徵明《山水图》', estimatedTime: 16, isCompleted: false },
      { exhibitId: 'ex12', exhibitName: '雕漆山水纹盘', estimatedTime: 16, isCompleted: false },
    ],
  },
  {
    id: 'route3',
    name: '艺术鉴赏之旅',
    mode: 'deep',
    description:
      '聚焦书画、织绣、瓷器等艺术品类，感受中国传统美学的独特韵味，适合艺术爱好者和专业人士参观。',
    duration: 120,
    exhibitCount: 6,
    image: 'https://picsum.photos/id/1025/600/360',
    difficulty: '中等',
    nodes: [
      { exhibitId: 'ex3', exhibitName: '青花缠枝莲纹瓶', estimatedTime: 20, isCompleted: false },
      { exhibitId: 'ex4', exhibitName: '顾恺之《洛神赋图》摹本', estimatedTime: 25, isCompleted: false },
      { exhibitId: 'ex9', exhibitName: '缂丝花鸟图轴', estimatedTime: 20, isCompleted: false },
      { exhibitId: 'ex11', exhibitName: '文徵明《山水图》', estimatedTime: 20, isCompleted: false },
      { exhibitId: 'ex12', exhibitName: '雕漆山水纹盘', estimatedTime: 15, isCompleted: false },
      { exhibitId: 'ex2', exhibitName: '唐三彩骆驼载乐俑', estimatedTime: 20, isCompleted: false },
    ],
  },
  {
    id: 'route4',
    name: '小小考古学家',
    mode: 'children',
    description:
      '通过互动体验和趣味问答，让小朋友化身小小考古学家，在探索中学习文物背后的故事，培养对历史文化的兴趣。',
    duration: 75,
    exhibitCount: 5,
    image: 'https://picsum.photos/id/718/600/360',
    difficulty: '轻松',
    nodes: [
      { exhibitId: 'ex5', exhibitName: '玉璧', estimatedTime: 15, isCompleted: false },
      { exhibitId: 'ex1', exhibitName: '商代青铜方鼎', estimatedTime: 18, isCompleted: false },
      { exhibitId: 'ex7', exhibitName: '编钟', estimatedTime: 18, isCompleted: false },
      { exhibitId: 'ex10', exhibitName: '紫砂茶壶', estimatedTime: 12, isCompleted: false },
      { exhibitId: 'ex8', exhibitName: '司南', estimatedTime: 12, isCompleted: false },
    ],
  },
];

export const getRouteById = (id: string): Route | undefined => routes.find((r) => r.id === id);
