import { create } from "zustand";

interface UIStore {
  cartOpen: boolean;
  onboardingOpen: boolean;
  articleModalOpen: boolean;
  currentArticleSlug: string | null;
  openArticleModal: (slug: string) => void;
  closeArticleModal: () => void;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (v: boolean) => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  setOnboardingOpen: (v: boolean) => void;
  /** True once the user has completed onboarding this session/persisted. */
  memberVerified: boolean;
  setMemberVerified: (v: boolean) => void;
}

const STORAGE_KEY = "loudmouf-member-verified";

function readVerified(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export const useUIStore = create<UIStore>((set) => ({
  cartOpen: false,
  onboardingOpen: false,
  memberVerified: readVerified(),
  articleModalOpen: false,
  currentArticleSlug: null,
  openArticleModal: (slug) => set({ articleModalOpen: true, currentArticleSlug: slug }),
  closeArticleModal: () => set({ articleModalOpen: false, currentArticleSlug: null }),
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  setCartOpen: (v) => set({ cartOpen: v }),
  openOnboarding: () => set({ onboardingOpen: true }),
  closeOnboarding: () => set({ onboardingOpen: false }),
  setOnboardingOpen: (v) => set({ onboardingOpen: v }),
  setMemberVerified: (v) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, v ? "true" : "false");
      } catch {
        // ignore
      }
    }
    set({ memberVerified: v });
  },
}));
