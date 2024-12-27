import React from 'react';
import { Mail, Phone, MapPin, User, ExternalLink, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactInfo {
  username: string;
  full_name?: string;
  profile_pic_url?: string;
  business_email?: string;
  business_phone?: string;
  address?: string;
  website?: string;
  category?: string;
  business_category?: string;
  biography?: string;
  is_business?: boolean;
  is_verified?: boolean;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
}

interface Props {
  data: ContactInfo[];
}

const InstagramContactDisplay = ({ data }: Props) => {
  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {data.map((profile, index) => (
        <Card key={`${profile.username}-${index}`} className="bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              {profile.profile_pic_url ? (
                <img
                  src={profile.profile_pic_url}
                  alt={profile.username}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div>
                <CardTitle className="flex items-center gap-2">
                  @{profile.username}
                  {profile.is_verified && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                  {profile.is_business && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                      Business
                    </span>
                  )}
                </CardTitle>
                {profile.full_name && (
                  <p className="text-gray-600">{profile.full_name}</p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center border-y border-gray-100 py-3">
              <div>
                <p className="text-xl font-bold">{formatNumber(profile.follower_count)}</p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div>
                <p className="text-xl font-bold">{formatNumber(profile.following_count)}</p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
              <div>
                <p className="text-xl font-bold">{formatNumber(profile.media_count)}</p>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
            </div>

            {profile.biography && (
              <p className="text-gray-700 whitespace-pre-wrap">{profile.biography}</p>
            )}

            <div className="space-y-2">
              {(profile.category || profile.business_category) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{profile.category || profile.business_category}</span>
                </div>
              )}
              
              {profile.business_email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a 
                    href={`mailto:${profile.business_email}`}
                    className="hover:text-blue-600"
                  >
                    {profile.business_email}
                  </a>
                </div>
              )}

              {profile.business_phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a 
                    href={`tel:${profile.business_phone}`}
                    className="hover:text-blue-600"
                  >
                    {profile.business_phone}
                  </a>
                </div>
              )}

              {profile.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.address}</span>
                </div>
              )}

              {profile.website && (
                <div className="flex items-center gap-2 text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                  <a 
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InstagramContactDisplay;