import React from 'react';
import { User, Images, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InstagramUserData {
  username?: string;
  full_name?: string;
  biography?: string;
  followers?: number;
  following?: number;
  edge_followed_by?: { count?: number };
  edge_follow?: { count?: number };
  is_private?: boolean;
  is_verified?: boolean;
  profile_pic_url?: string;
  external_url?: string;
  media_count?: number;
  public_email?: string;
  public_phone_number?: string;
  public_phone_country_code?: string;
  business_contact_method?: string;
  business_address_json?: string;
  category_name?: string;
  business_category_name?: string;
}

interface Props {
  data: InstagramUserData;
}

const UserDataDisplay = ({ data }: Props) => {
  const formatNumber = (value: number | undefined) => {
    if (typeof value !== "number") return "0";
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const followersCount = data.followers || data.edge_followed_by?.count;
  const followingCount = data.following || data.edge_follow?.count;

  const hasContactInfo = data.public_email || 
    data.public_phone_number || 
    data.business_address_json || 
    data.external_url;

  const formatPhoneNumber = () => {
    if (!data.public_phone_number) return null;
    const countryCode = data.public_phone_country_code || '';
    return `+${countryCode} ${data.public_phone_number}`;
  };

  const formatAddress = () => {
    if (!data.business_address_json) return null;
    try {
      const address = JSON.parse(data.business_address_json);
      return address.street_address || address.formatted_address || JSON.stringify(address);
    } catch {
      return data.business_address_json;
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-white shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-4">
          {data.profile_pic_url ? (
            <img
              src={data.profile_pic_url}
              alt={data.username}
              className="w-20 h-20 rounded-full border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {data.username || "User"}
              {data.is_verified && (
                <span className="text-pink-500 text-sm bg-pink-50 px-2 py-1 rounded">
                  Verified
                </span>
              )}
            </CardTitle>
            {data.full_name && (
              <p className="text-gray-600 font-medium">{data.full_name}</p>
            )}
            {(data.category_name || data.business_category_name) && (
              <p className="text-gray-500 text-sm">
                {data.category_name || data.business_category_name}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center py-4 border-y">
          <div>
            <p className="text-2xl font-bold">{formatNumber(followersCount)}</p>
            <p className="text-gray-600 text-sm">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatNumber(followingCount)}</p>
            <p className="text-gray-600 text-sm">Following</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatNumber(data.media_count)}</p>
            <p className="text-gray-600 text-sm">Posts</p>
          </div>
        </div>

        {data.biography && (
          <div className="space-y-2">
            <p className="text-gray-800 whitespace-pre-wrap">{data.biography}</p>
          </div>
        )}

        {hasContactInfo && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold text-gray-800">Contact Information</h3>
            <div className="space-y-2">
              {data.public_email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${data.public_email}`} className="hover:text-pink-600">
                    {data.public_email}
                  </a>
                </div>
              )}
              
              {data.public_phone_number && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${formatPhoneNumber()}`} className="hover:text-pink-600">
                    {formatPhoneNumber()}
                  </a>
                </div>
              )}

              {formatAddress() && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{formatAddress()}</span>
                </div>
              )}

              {data.external_url && (
                <div className="flex items-center gap-2 text-gray-600">
                  <LinkIcon className="w-4 h-4" />
                  <a
                    href={data.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-600"
                  >
                    {data.external_url}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {data.is_private && (
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded">
            <Images className="w-5 h-5" />
            <p>This account is private</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDataDisplay;