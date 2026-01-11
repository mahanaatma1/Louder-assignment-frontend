/**
 * Events Store (Zustand)
 * State management for events
 */

import { create } from 'zustand';
import { fetchEvents } from '@/actions/actions';

export const useEventsStore = create((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await fetchEvents(params);
      if (result.success) {
        set({ events: result.data || [], isLoading: false });
      } else {
        set({ error: result.error || 'Failed to load events', isLoading: false });
      }
    } catch (error) {
      set({ error: error.message || 'An error occurred', isLoading: false });
    }
  },

  clearEvents: () => {
    set({ events: [], error: null });
  },
}));

