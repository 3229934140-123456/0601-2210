import { Exhibit } from '@/types';

export const exhibits: Exhibit[] = [
  {
    id: 'ex1',
    name: '商代青铜方鼎',
    description:
      '此鼎铸造于商代晚期，通高58厘米，口沿外折，方形腹，四圆柱形足。鼎身饰有精美的饕餮纹和云雷纹，是商代青铜器的代表作之一，具有极高的历史价值和艺术价值。鼎在古代是重要的礼器，象征着权力与地位。',
    image: 'https://picsum.photos/id/3/600/400',
    hallId: 'hall1',
    hallName: '第一展厅·青铜文明',
    category: '青铜器',
    era: '商代晚期',
    audioLanguages: ['中文', 'English', '日本語'],
    isCollected: true,
    hasQuiz: true,
    position: { x: 150, y: 200 },
    views: 12890,
  },
  {
    id: 'ex2',
    name: '唐三彩骆驼载乐俑',
    description:
      '唐三彩是唐代低温铅质彩釉陶器的总称，这件骆驼载乐俑是唐三彩中的精品。骆驼昂首挺立，背上平台坐有乐工七人，各持乐器，中间立一女子似在翩翩起舞，生动再现了唐代丝绸之路的文化交流场景。',
    image: 'https://picsum.photos/id/1082/600/400',
    hallId: 'hall1',
    hallName: '第一展厅·青铜文明',
    category: '陶瓷器',
    era: '唐代',
    audioLanguages: ['中文', 'English'],
    isCollected: false,
    hasQuiz: true,
    position: { x: 350, y: 280 },
    views: 15432,
  },
  {
    id: 'ex3',
    name: '青花缠枝莲纹瓶',
    description:
      '青花瓷是中国瓷器的主流品种之一，属釉下彩瓷。此瓶器型端庄典雅，通体绘缠枝莲花纹，青花发色纯正，层次分明。缠枝莲纹寓意吉祥，是明清时期瓷器装饰的常见题材。此瓶为明代永乐年间官窑精品。',
    image: 'https://picsum.photos/id/103/600/400',
    hallId: 'hall2',
    hallName: '第二展厅·瓷器珍品',
    category: '瓷器',
    era: '明代永乐',
    audioLanguages: ['中文', 'English', 'Français'],
    isCollected: true,
    hasQuiz: true,
    position: { x: 200, y: 180 },
    views: 9876,
  },
  {
    id: 'ex4',
    name: '顾恺之《洛神赋图》摹本',
    description:
      '《洛神赋图》是东晋画家顾恺之根据曹植的《洛神赋》创作的绘画作品，原作已佚，现存为宋代摹本。画卷以连续的画面展现了曹植与洛神之间的爱情故事，人物刻画细腻，线条优美流畅，是中国绘画史上的经典之作。',
    image: 'https://picsum.photos/id/106/600/400',
    hallId: 'hall2',
    hallName: '第二展厅·瓷器珍品',
    category: '书画',
    era: '宋代摹本',
    audioLanguages: ['中文', 'English'],
    isCollected: false,
    hasQuiz: true,
    position: { x: 450, y: 220 },
    views: 18654,
  },
  {
    id: 'ex5',
    name: '玉璧',
    description:
      '玉璧是一种中央有穿孔的扁平状圆形玉器，为中国传统玉礼器之一。此玉璧为战国时期制品，玉质温润，呈青白色，璧面雕刻有精美的谷纹和云纹。玉璧在古代用于祭祀、朝聘、丧葬等重要场合，象征着天圆地方的宇宙观。',
    image: 'https://picsum.photos/id/119/600/400',
    hallId: 'hall3',
    hallName: '第三展厅·玉器瑰宝',
    category: '玉器',
    era: '战国',
    audioLanguages: ['中文', 'English'],
    isCollected: false,
    hasQuiz: true,
    position: { x: 180, y: 320 },
    views: 8765,
  },
  {
    id: 'ex6',
    name: '鎏金铜佛像',
    description:
      '此佛像为北魏时期作品，通高32厘米，佛像面容慈祥，眉目清秀，衣纹流畅自然。通体鎏金，虽历经千年仍金光灿灿。佛教自东汉传入中国后，在北魏时期得到了极大的发展，佛像艺术也达到了极高的水平。',
    image: 'https://picsum.photos/id/160/600/400',
    hallId: 'hall3',
    hallName: '第三展厅·玉器瑰宝',
    category: '佛教造像',
    era: '北魏',
    audioLanguages: ['中文', 'English', '日本語'],
    isCollected: false,
    hasQuiz: false,
    position: { x: 400, y: 260 },
    views: 11234,
  },
  {
    id: 'ex7',
    name: '编钟',
    description:
      '编钟是中国古代重要的打击乐器，由若干大小不同的钟按次序排列悬挂在木架上组成。这套编钟共24件，分三层悬挂，形制规范，纹饰精美。每件钟都能发出两个乐音，音域宽广，音色优美，充分体现了古代先民的音乐智慧。',
    image: 'https://picsum.photos/id/201/600/400',
    hallId: 'hall4',
    hallName: '第四展厅·古代科技',
    category: '乐器',
    era: '战国',
    audioLanguages: ['中文', 'English'],
    isCollected: true,
    hasQuiz: true,
    position: { x: 300, y: 180 },
    views: 20345,
  },
  {
    id: 'ex8',
    name: '司南',
    description:
      '司南是中国古代发明的最早的磁性指向器，被认为是指南针的始祖。司南由青铜地盘和磁勺组成，磁勺在地磁场的作用下，勺柄会指向南方。司南的发明对人类航海和地理探索产生了深远影响。',
    image: 'https://picsum.photos/id/1/600/400',
    hallId: 'hall4',
    hallName: '第四展厅·古代科技',
    category: '科技',
    era: '汉代',
    audioLanguages: ['中文', 'English'],
    isCollected: false,
    hasQuiz: true,
    position: { x: 500, y: 280 },
    views: 17654,
  },
  {
    id: 'ex9',
    name: '缂丝花鸟图轴',
    description:
      '缂丝是中国传统丝绸艺术品中的精华，有"一寸缂丝一寸金"的说法。此图轴采用缂丝工艺织造而成，画面描绘了鸟语花香的春景，色彩丰富，层次分明，织造工艺精湛，是清代缂丝艺术的代表作品。',
    image: 'https://picsum.photos/id/225/600/400',
    hallId: 'hall5',
    hallName: '第五展厅·织绣华章',
    category: '织绣',
    era: '清代',
    audioLanguages: ['中文', 'English'],
    isCollected: false,
    hasQuiz: false,
    position: { x: 220, y: 240 },
    views: 7654,
  },
  {
    id: 'ex10',
    name: '紫砂茶壶',
    description:
      '紫砂壶是中国特有的手工制造陶土工艺品，始于北宋，盛于明清。此壶为明代制壶大师时大彬的作品，壶身古朴典雅，造型端庄，泥色温润如玉。紫砂壶因其独特的透气性能，能最大限度地保留茶香，深受历代文人雅士喜爱。',
    image: 'https://picsum.photos/id/220/600/400',
    hallId: 'hall5',
    hallName: '第五展厅·织绣华章',
    category: '紫砂器',
    era: '明代',
    audioLanguages: ['中文', 'English', '日本語'],
    isCollected: false,
    hasQuiz: true,
    position: { x: 450, y: 320 },
    views: 9234,
  },
  {
    id: 'ex11',
    name: '文徵明《山水图》',
    description:
      '文徵明是明代著名画家、书法家，"明四家"之一。此幅《山水图》是其晚年精品，画面构图严谨，笔墨苍润，意境清幽。画中峰峦叠嶂，溪水潺潺，古木参天，亭台掩映，充分展现了文人画的审美追求。',
    image: 'https://picsum.photos/id/1025/600/400',
    hallId: 'hall6',
    hallName: '第六展厅·翰墨丹青',
    category: '书画',
    era: '明代',
    audioLanguages: ['中文', 'English'],
    isCollected: true,
    hasQuiz: true,
    position: { x: 280, y: 200 },
    views: 14567,
  },
  {
    id: 'ex12',
    name: '雕漆山水纹盘',
    description:
      '雕漆是在漆器胎骨上反复髹漆几十层甚至上百层，待半干时雕刻纹样的传统工艺。此盘在红漆上雕刻山水楼阁、人物故事，刀法快利，藏锋清晰，层次丰富，是明代永乐年间雕漆工艺的杰出代表。',
    image: 'https://picsum.photos/id/250/600/400',
    hallId: 'hall6',
    hallName: '第六展厅·翰墨丹青',
    category: '漆器',
    era: '明代永乐',
    audioLanguages: ['中文', 'English'],
    isCollected: false,
    hasQuiz: false,
    position: { x: 480, y: 260 },
    views: 6543,
  },
];

export const getExhibitById = (id: string): Exhibit | undefined =>
  exhibits.find((e) => e.id === id);

export const searchExhibits = (keyword: string): Exhibit[] => {
  if (!keyword) return exhibits;
  const kw = keyword.toLowerCase();
  return exhibits.filter(
    (e) =>
      e.name.toLowerCase().includes(kw) ||
      e.category.toLowerCase().includes(kw) ||
      e.era.toLowerCase().includes(kw) ||
      e.description.toLowerCase().includes(kw)
  );
};
