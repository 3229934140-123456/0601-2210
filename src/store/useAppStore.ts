import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { UserProgress, UserProfile } from '@/types';
import { exhibits } from '@/data/exhibits';

const taroStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const res = await Taro.getStorage({ key: name });
      return (res?.data ?? null);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await Taro.setStorage({ key: name, data: value });
    } catch (e) {
      console.warn('[zustand persist setItem failed:', e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await Taro.removeStorage({ key: name });
    } catch (e) {
      console.warn('[zustand persist removeItem failed:', e);
    }
  },
};

interface AppState {
  userProfile: UserProfile;
  userProgress: UserProgress;
  currentHallId: string;
  searchKeyword: string;
  isPlayingAudio: boolean;
  currentExhibitId: string;
  collectedExhibits: string[];
  savedRoutes: string[];
  currentFloor: number;
  setCurrentHall: (id: string) => void;
  setCurrentFloor: (floor: number) => void;
  setSearchKeyword: (keyword: string) => void;
  clearSearchKeyword: () => void;
  toggleCollectExhibit: (id: string) => void;
  isExhibitCollected: (id: string) => boolean;
  markExhibitVisited: (id: string) => void;
  collectBadge: (id: string) => void;
  completeQuiz: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setAudioPlaying: (playing: boolean) => void;
  setCurrentExhibit: (id: string) => void;
  addPoints: (points: number) => void;
  toggleSaveRoute: (id: string) => void;
  isRouteSaved: (id: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
      currentHallId: '',
      currentFloor: 1,
      searchKeyword: '',
      isPlayingAudio: false,
      currentExhibitId: '',
      collectedExhibits: ['ex1', 'ex3', 'ex7', 'ex11'],
      savedRoutes: ['route1'],

      setCurrentHall: (id) => set({ currentHallId: id }),
      setCurrentFloor: (floor) => {
        set({ currentFloor: floor });
        const hallsOnFloor = exhibits.filter((e) => {
          const hallNum = parseInt(e.hallId.replace('hall', ''));
          return Math.ceil(hallNum / 2) === floor;
        });
        if (hallsOnFloor.length > 0) {
          const firstHallId = hallsOnFloor[0].hallId;
          if (firstHallId !== get().currentHallId && get().currentHallId) {
          }
        }
      },

      setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
      clearSearchKeyword: () => set({ searchKeyword: '' }),

      toggleCollectExhibit: (id) =>
        set((state) => ({
          collectedExhibits: state.collectedExhibits.includes(id)
            ? state.collectedExhibits.filter((x) => x !== id)
            : [...state.collectedExhibits, id],
        })),
      isExhibitCollected: (id) => get().collectedExhibits.includes(id),

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

      toggleSaveRoute: (id) =>
        set((state) => ({
          savedRoutes: state.savedRoutes.includes(id)
            ? state.savedRoutes.filter((r) => r !== id)
            : [...state.savedRoutes, id],
        })),
      isRouteSaved: (id) => get().savedRoutes.includes(id),
    }),
    {
      name: 'digital-museum-app',
      storage: createJSONStorage(() => taroStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
        userProgress: state.userProgress,
        collectedExhibits: state.collectedExhibits,
        savedRoutes: state.savedRoutes,
        currentFloor: state.currentFloor,
      }),
      version: 1,
    }
  )
);
