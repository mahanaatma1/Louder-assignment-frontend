/**
 * Event Detail Page
 * Shows individual event details
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchEventById } from '@/actions/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, MapPin, ExternalLink, ArrowLeft, Loader2, DollarSign, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { EmailModal } from '@/components/events/EmailModal/EmailModal';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchEventById(params.id);
        
        if (result.success) {
          setEvent(result.data);
        } else {
          setError(result.error || 'Event not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

  const handleGetTickets = () => {
    setIsModalOpen(true);
  };

  const handleEmailSubmit = (email, optIn, ticketUrl) => {
    setIsModalOpen(false);
    if (ticketUrl) {
      window.open(ticketUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          <Alert variant="destructive">
            <AlertDescription>
              {error || 'Event not found'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'PPP');
  const formattedTime = format(eventDate, 'p');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <Card className="overflow-hidden">
          <div className="relative w-full h-96 bg-gray-200">
            {event.imageUrl && !imageError ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                <Calendar className="w-24 h-24 text-white opacity-50" />
              </div>
            )}
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
              {event.urgencySignal && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  {event.urgencySignal}
                </Badge>
              )}
              {event.isPromoted && (
                <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Promoted
                </Badge>
              )}
              {/* <Badge variant="secondary">
                {event.source}
              </Badge> */}
            </div>
          </div>

          <CardHeader>
            <CardTitle className="text-3xl mb-4">{event.title}</CardTitle>
            <CardDescription className="space-y-3">
              <div className="flex items-center gap-2 text-base">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate} at {formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-base">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
              {event.price && (
                <div className="flex items-center gap-2 text-base font-semibold text-primary">
                  <DollarSign className="w-5 h-5" />
                  <span>{event.price}</span>
                  {event.paidStatus && (
                    <Badge variant="outline" className="ml-2">
                      {event.paidStatus === 'paid' ? 'Paid Event' : 'Free Event'}
                    </Badge>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {event.hasPromoCode && (
                  <Badge variant="outline">
                    Promo Code Available
                  </Badge>
                )}
                {event.hasBogoLabel && (
                  <Badge variant="outline">
                    Buy One Get One
                  </Badge>
                )}
                {event.eventId && (
                  <Badge variant="outline" className="text-xs">
                    ID: {event.eventId}
                  </Badge>
                )}
              </div>
            </CardDescription>
          </CardHeader>

          {event.description && (
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            </CardContent>
          )}

          <CardContent>
            <Button
              onClick={handleGetTickets}
              className="w-full"
              size="lg"
            >
              Get Tickets
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <EmailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleEmailSubmit}
          eventTitle={event.title}
          eventId={event._id}
          ticketUrl={event.ticketUrl}
        />
      </div>
    </div>
  );
}

