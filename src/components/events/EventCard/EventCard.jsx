/**
 * Event Card Component
 * Displays individual event information
 */

'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, DollarSign, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailModal } from '../EmailModal/EmailModal';

export function EventCard({ event }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'PPP');
  const formattedTime = format(eventDate, 'p');

  const handleGetTickets = () => {
    setIsModalOpen(true);
  };

  const handleEmailSubmit = (email, optIn, ticketUrl) => {
    setIsModalOpen(false);
    if (ticketUrl) {
      window.open(ticketUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/events/${event._id}`)}>
        <div className="relative w-full h-48 bg-gray-200">
          {event.imageUrl && !imageError ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
              <Calendar className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          
          {/* Badges overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
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

        <CardHeader className="cursor-pointer" onClick={(e) => { e.stopPropagation(); router.push(`/events/${event._id}`); }}>
          <CardTitle className="line-clamp-2 hover:text-primary transition-colors">{event.title}</CardTitle>
          <CardDescription className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            {event.price && (
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <DollarSign className="w-4 h-4" />
                <span>{event.price}</span>
                {event.paidStatus && (
                  <Badge variant="outline" className="ml-1 text-xs">
                    {event.paidStatus === 'paid' ? 'Paid' : 'Free'}
                  </Badge>
                )}
              </div>
            )}
            {event.hasPromoCode && (
              <Badge variant="outline" className="w-fit text-xs">
                Promo Code Available
              </Badge>
            )}
          </CardDescription>
        </CardHeader>

        {event.description && (
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {event.description}
            </p>
          </CardContent>
        )}

        <CardFooter>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleGetTickets();
            }}
            className="w-full"
            size="lg"
          >
            Get Tickets
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmailSubmit}
        eventTitle={event.title}
        eventId={event._id}
        ticketUrl={event.ticketUrl}
      />
    </>
  );
}

