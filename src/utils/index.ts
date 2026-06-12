export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
};

export const getLevelName = (level: number): string => {
  const levels = ['', '初级访客', '文化爱好者', '资深观展人', '文博达人', '文化大使'];
  return levels[level] || '文化探索者';
};

export const getBadgeTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    gold: '#C9A859',
    silver: '#A8A9AD',
    bronze: '#CD7F32',
    special: '#E85D5D',
  };
  return colors[type] || '#8C8C8C';
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const getRandomId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
