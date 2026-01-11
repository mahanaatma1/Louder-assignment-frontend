/**
 * Events Context
 * Provides events data to the application
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchEvents } from '@/actions/actions';

const EventsContext = createContext(undefined);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchEvents({ upcoming: true, limit: 100 });
      
      if (result.success) {
        setEvents(result.data || []);
      } else {
        setError(result.error || 'Failed to load events');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading events');
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await loadEvents();
  };

  return (
    <EventsContext.Provider value={{ events, isLoading, error, refetch }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEventsContext() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEventsContext must be used within an EventsProvider');
  }
  return context;
}

