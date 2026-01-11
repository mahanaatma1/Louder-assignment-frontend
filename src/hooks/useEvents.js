/**
 * Custom hook for fetching events
 */

import { useState, useEffect } from 'react';
import { fetchEvents } from '@/actions/actions';

export function useEvents(params = {}) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchEvents(params);
        
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

    loadEvents();
  }, [JSON.stringify(params)]);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchEvents(params);
      
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

  return { events, isLoading, error, refetch };
}

