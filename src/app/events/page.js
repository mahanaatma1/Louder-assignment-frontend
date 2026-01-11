/**
 * Events Page
 * Main page displaying all events
 */

'use client';

import { useEffect, useState } from 'react';
import { EventGrid } from '@/components/events/EventGrid';
import { fetchEvents } from '@/actions/actions';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2, XCircle, Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 12;

  // Quick date presets
  const setDatePreset = (preset) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (preset) {
      case 'today':
        setSelectedDate(today.toISOString().split('T')[0]);
        break;
      case 'thisWeek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        setSelectedDate(startOfWeek.toISOString().split('T')[0]);
        break;
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setSelectedDate(startOfMonth.toISOString().split('T')[0]);
        break;
      case 'nextMonth':
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        setSelectedDate(nextMonthStart.toISOString().split('T')[0]);
        break;
      default:
        break;
    }
    setCurrentPage(1); // Reset to first page when date changes
  };

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: eventsPerPage,
      };
      if (selectedDate) {
        params.startDate = selectedDate;
        // Set endDate to same day (end of day) - format as YYYY-MM-DD
        params.endDate = selectedDate;
      }
      
      console.log('Loading events with params:', params);
      const result = await fetchEvents(params);
      
      if (result.success) {
        const eventsData = result.data || [];
        setEvents(eventsData);
        
        // Get pagination data from response
        // Backend returns: { success: true, data: [...], total: X, totalPages: Y, page: Z, limit: W }
        let total = result.total;
        let totalPages = result.totalPages;
        
        // If pagination data is missing, calculate it
        if (total === undefined || total === null) {
          total = eventsData.length;
        }
        
        if (totalPages === undefined || totalPages === null) {
          // Calculate totalPages based on total and eventsPerPage
          totalPages = total > 0 ? Math.ceil(total / eventsPerPage) : 1;
        }
        
        // Ensure minimum values
        total = Math.max(0, total);
        totalPages = Math.max(1, totalPages);
        
        console.log('Pagination Data:', {
          receivedTotal: result.total,
          receivedTotalPages: result.totalPages,
          calculatedTotal: total,
          calculatedTotalPages: totalPages,
          currentPage,
          eventsPerPage,
          eventsCount: eventsData.length,
          fullResponse: result
        });
        
        setTotalPages(totalPages);
        setTotalEvents(total);
      } else {
        setError(result.error || 'Failed to load events');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [currentPage, selectedDate]);

  // Auto-refresh every 10 minutes (independent of page/date changes)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing events...');
      loadEvents();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    return () => clearInterval(interval);
  }, []); // Run once on mount

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadEvents();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-8">
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
                  Showing {events.length} event{events.length !== 1 ? 's' : ''}
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

          {/* Filters Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              {/* Date Filter - Inline Layout */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium whitespace-nowrap">Date:</Label>
                </div>
                
                {/* Quick Presets */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDatePreset('today')}
                    className="h-8 text-xs"
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDatePreset('thisWeek')}
                    className="h-8 text-xs"
                  >
                    This Week
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDatePreset('thisMonth')}
                    className="h-8 text-xs"
                  >
                    This Month
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDatePreset('nextMonth')}
                    className="h-8 text-xs"
                  >
                    Next Month
                  </Button>
                </div>

                {/* Single Date Input */}
                <div className="flex items-center gap-2">
                  <Input
                    id="selected-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-8 w-40"
                  />
                </div>

                {/* Clear Button */}
                {selectedDate && (
                  <>
                    <Separator orientation="vertical" className="h-6" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDate('');
                        setCurrentPage(1);
                      }}
                      className="h-8 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <EventGrid events={events} isLoading={isLoading} error={error} />

        {/* Pagination - Sticky/Fixed Bottom */}
        {!isLoading && events.length > 0 && (
          <div className="sticky bottom-0 left-0 right-0 z-50 sm:fixed sm:bottom-6 sm:left-1/2 sm:transform sm:-translate-x-1/2 transition-all duration-300 opacity-100 translate-y-0 sm:opacity-100 sm:translate-y-0">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pl-0 pr-2 py-2 sm:pl-0 sm:pr-3 sm:py-3 flex flex-col sm:flex-row items-center justify-between sm:justify-center gap-2 sm:gap-0 sm:space-x-3">
              {/* Page Info */}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center sm:text-left pl-2 sm:pl-3">
                Page {currentPage} of {Math.max(1, totalPages)} • {Math.max(0, totalEvents)} total
              </span>
              
              {/* Vertical Divider - Hidden on mobile */}
              <div className="hidden sm:block h-3 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Pagination Controls */}
              <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    setCurrentPage(newPage);
                  }}
                  disabled={currentPage <= 1 || isLoading}
                  className="h-7 px-2 text-xs"
                >
                  <ChevronLeft className="w-3 h-3 mr-0.5" />
                  Previous
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    const maxPage = Math.max(1, totalPages);
                    const newPage = Math.min(maxPage, currentPage + 1);
                    setCurrentPage(newPage);
                  }}
                  disabled={currentPage >= Math.max(1, totalPages) || isLoading}
                  className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                >
                  Next
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

