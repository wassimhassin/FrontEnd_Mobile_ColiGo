import { create } from 'zustand';
import { UserRole } from '../constants';

type AppScreen = 
  | 'splash'
  | 'onboarding'
  | 'terms'
  | 'role_selection'
  | 'login'
  | 'register'
  | 'forgot_password'
  | 'home';

interface AppStore {
  // State
  currentScreen: AppScreen;
  hasCompletedOnboarding: boolean;
  hasAcceptedTerms: boolean;
  selectedRole: UserRole | null;
  
  // Actions
  setScreen: (screen: AppScreen) => void;
  completeOnboarding: () => void;
  acceptTerms: () => void;
  setSelectedRole: (role: UserRole) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  currentScreen: 'splash',
  hasCompletedOnboarding: false,
  hasAcceptedTerms: false,
  selectedRole: null,

  // Actions
  setScreen: (currentScreen) => set({ currentScreen }),
  
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  
  acceptTerms: () => set({ hasAcceptedTerms: true }),
  
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  
  reset: () =>
    set({
      currentScreen: 'splash',
      hasCompletedOnboarding: false,
      hasAcceptedTerms: false,
      selectedRole: null,
    }),
}));
