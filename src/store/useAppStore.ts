import { create } from 'zustand';
import { UserProgress, UserProfile } from '@/types';

interface AppState {
  userProfile: UserProfile;
  userProgress: UserProgress;
  currentHallId: string;
  searchKeyword: string;
  isPlayingAudio: boolean;
  currentExhibitId: string;
  setCurrentHall: (id: string) => void;
  setSearchKeyword: (keyword: string) => void;
  toggleCollectExhibit: (id: string) => void;
  markExhibitVisited: (id: string) => void;
  collectBadge: (id: string) => void;
  completeQuiz: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setAudioPlaying: (playing: boolean) => void;
  setCurrentExhibit: (id: string) => void;
  addPoints: (points: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userProfile: {
    nickname: '文化探索者',
    avatar: 'https://picsum.photos/id/64/200/200',
    level: 3,
    points: 580,
    preferredLanguage: 'zh',
    accessibilityMode: false,
    closingReminder: true,
  },
  userProgress: {
    visitedHalls: ['hall1', 'hall2'],
    visitedExhibits: ['ex1', 'ex2', 'ex3', 'ex5'],
    collectedBadges: ['badge1', 'badge3'],
    completedQuizzes: ['quiz1', 'quiz2'],
    totalVisitTime: 125,
    savedRoutes: ['route1'],
  },
  currentHallId: 'hall1',
  searchKeyword: '',
  isPlayingAudio: false,
  currentExhibitId: '',
  setCurrentHall: (id) => set({ currentHallId: id }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  toggleCollectExhibit: (id) => {
    console.log('[Store] toggleCollectExhibit:', id);
  },
  markExhibitVisited: (id) =>
    set((state) => ({
      userProgress: {
        ...state.userProgress,
        visitedExhibits: state.userProgress.visitedExhibits.includes(id)
          ? state.userProgress.visitedExhibits
          : [...state.userProgress.visitedExhibits, id],
      },
    })),
  collectBadge: (id) =>
    set((state) => ({
      userProgress: {
        ...state.userProgress,
        collectedBadges: state.userProgress.collectedBadges.includes(id)
          ? state.userProgress.collectedBadges
          : [...state.userProgress.collectedBadges, id],
      },
    })),
  completeQuiz: (id) =>
    set((state) => ({
      userProgress: {
        ...state.userProgress,
        completedQuizzes: state.userProgress.completedQuizzes.includes(id)
          ? state.userProgress.completedQuizzes
          : [...state.userProgress.completedQuizzes, id],
      },
    })),
  updateProfile: (profile) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...profile },
    })),
  setAudioPlaying: (playing) => set({ isPlayingAudio: playing }),
  setCurrentExhibit: (id) => set({ currentExhibitId: id }),
  addPoints: (points) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        points: state.userProfile.points + points,
      },
    })),
}));
