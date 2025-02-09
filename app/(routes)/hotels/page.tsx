'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Hotel {
  name: string;
  phone_number: string;
  full_address: string;
  website: string;
  rating: number;
  review_count: number;
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('/api/fetch-hotels');
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setHotels(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">San Francisco Hotels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{hotel.name}</h2>
              <div className="space-y-2">
                {hotel.phone_number && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span>
                    <a href={`tel:${hotel.phone_number}`} className="text-pink-600 hover:underline">
                      {hotel.phone_number}
                    </a>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <span className="font-medium">Rating:</span>
                  <span>{hotel.rating} ⭐ ({hotel.review_count} reviews)</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Address:</span>
                  <span>{hotel.full_address}</span>
                </p>
                {hotel.website && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Website:</span>
                    <a 
                      href={hotel.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline truncate"
                    >
                      {hotel.website}
                    </a>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 