export interface Exhibit {
  id: string;
  name: string;
  description: string;
  image: string;
  hallId: string;
  hallName: string;
  category: string;
  era: string;
  audioLanguages: string[];
  isCollected: boolean;
  hasQuiz: boolean;
  position: { x: number; y: number };
  views: number;
}

export interface Hall {
  id: string;
  name: string;
  floor: number;
  description: string;
  theme: string;
  exhibitCount: number;
  isAccessible: boolean;
  mapImage: string;
}

export interface RouteNode {
  exhibitId: string;
  exhibitName: string;
  estimatedTime: number;
  isCompleted: boolean;
}

export interface Route {
  id: string;
  name: string;
  mode: 'children' | 'deep';
  description: string;
  duration: number;
  exhibitCount: number;
  nodes: RouteNode[];
  image: string;
  difficulty: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'gold' | 'silver' | 'bronze' | 'special';
  obtained: boolean;
  obtainedDate?: string;
  condition: string;
  rarity: string;
}

export interface Activity {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  availableSlots: number;
  totalSlots: number;
  isBooked: boolean;
}

export interface Guide {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  experience: number;
  rating: number;
  languages: string[];
  availableDates: string[];
  bio: string;
}

export interface Quiz {
  id: string;
  exhibitId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgress {
  visitedHalls: string[];
  visitedExhibits: string[];
  collectedBadges: string[];
  completedQuizzes: string[];
  totalVisitTime: number;
  savedRoutes: string[];
}

export interface UserProfile {
  nickname: string;
  avatar: string;
  level: number;
  points: number;
  preferredLanguage: string;
  accessibilityMode: boolean;
  closingReminder: boolean;
}
