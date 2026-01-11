/**
 * Events Page
 * Main page displaying all events with infinite scroll
 */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { EventGrid } from '@/components/events/EventGrid';
import { fetchEvents } from '@/actions/actions';
import { Button } from '@/components/ui/button';
import { RefreshCw, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 12;
  const observerTarget = useRef(null);

  const loadEvents = useCallback(async (page = 1, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const params = {
        page,
        limit: eventsPerPage,
      };
      
      const result = await fetchEvents(params);
      
      if (result.success) {
        const eventsData = result.data || [];
        
        if (append) {
          setEvents(prev => [...prev, ...eventsData]);
        } else {
          setEvents(eventsData);
        }
        
        // Check if there are more pages
        const total = result.total || 0;
        const totalPages = result.totalPages || 1;
        setTotalEvents(total);
        setHasMore(page < totalPages);
      } else {
        setError(result.error || 'Failed to load events');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading events');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [eventsPerPage]);

  // Initial load
  useEffect(() => {
    loadEvents(1, false);
  }, [loadEvents]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          loadEvents(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [currentPage, hasMore, isLoading, isLoadingMore, loadEvents]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing events...');
      setCurrentPage(1);
      loadEvents(1, false);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [loadEvents]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    await loadEvents(1, false);
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Events in Sydney
              </h1>
              <p className="text-muted-foreground">
                Discover the best events happening in Sydney, Australia
              </p>
              {events.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {totalEvents} event{totalEvents !== 1 ? 's' : ''} total
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                variant="outline"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <EventGrid events={events} isLoading={isLoading} error={error} />

        {/* Infinite scroll trigger */}
        {hasMore && !isLoading && (
          <div ref={observerTarget} className="h-20 flex items-center justify-center">
            {isLoadingMore && (
              <div className="text-muted-foreground">Loading more events...</div>
            )}
          </div>
        )}

        {/* End of list message */}
        {!hasMore && events.length > 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            You've reached the end of the events list.
          </div>
        )}
      </div>
    </div>
  );
}
