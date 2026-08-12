import { create } from 'zustand';
import type { NewsPromotion } from '@sanken/core';

import { api } from '@/lib/api';

interface NewsStoreState {
  news: NewsPromotion[];
  isLoading: boolean;
  load: () => Promise<void>;
}

export const useNewsStore = create<NewsStoreState>((set) => ({
  news: [],
  isLoading: false,
  load: async () => {
    set({ isLoading: true });
    const news = await api.get<NewsPromotion[]>('/news');
    set({ news, isLoading: false });
  },
}));
