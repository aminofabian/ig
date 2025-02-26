import { NextResponse } from 'next/server';

interface InstagramError {
  message: string;
  status?: number;
}

interface InstagramUser {
  pk: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
}

interface InstagramItem {
  id: string;
  code?: string;
  taken_at?: number;
  pk?: string;
  media_type?: number;
  caption?: {
    text: string;
  };
  like_count?: number;
  comment_count?: number;
  image_versions2?: {
    candidates?: Array<{
      url: string;
    }>;
  };
  thumbnail_url?: string;
  video_url?: string;
  user?: InstagramUser;
}

interface InstagramApiResponse {
  data?: {
    additional_data?: {
      formatted_media_count?: string;
      media_count?: number;
      name?: string;
      subtitle?: string;
    };
    items: InstagramItem[];
    next_page_token?: string;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hashtag = searchParams.get('hashtag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const pageToken = searchParams.get('next_page_token') || '';

    if (!hashtag) {
      return NextResponse.json({ error: 'Hashtag parameter is required' }, { status: 400 });
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_HOST;

    if (!rapidApiKey || !rapidApiHost) {
      console.error('Missing required environment variables:');
      console.error('RAPIDAPI_KEY:', !!rapidApiKey);
      console.error('RAPIDAPI_HOST:', !!rapidApiHost);
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }

    console.log('Using API Host:', rapidApiHost);
    console.log('API Key length:', rapidApiKey.length, 'First 4 chars:', rapidApiKey.substring(0, 4));

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost,
        'Accept': 'application/json'
      }
    };

    // Build the URL with pagination parameters
    let apiUrl = `https://${rapidApiHost}/v1/hashtag?hashtag=${encodeURIComponent(hashtag)}`;
    
    // Add pagination parameters if available from RapidAPI
    if (pageToken) {
      apiUrl += `&page_token=${encodeURIComponent(pageToken)}`;
    }
    
    // Add limit parameter if the API supports it
    apiUrl += `&limit=${limit}`;
    
    console.log('Fetching from URL:', apiUrl);

    const response = await fetch(apiUrl, options);
    console.log('API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Instagram API responded with status: ${response.status}`);
    }

    const rawResponse = await response.text();
    console.log('Raw Response Length:', rawResponse.length);

    try {
      const data: InstagramApiResponse = JSON.parse(rawResponse);
      console.log('Raw API response data:', data);

      // Store the next page token if it exists
      const nextPageToken = data.data?.next_page_token || '';

      // Ensure we have the correct data structure
      const responseData: InstagramApiResponse['data'] = {
        additional_data: {
          formatted_media_count: data.data?.additional_data?.formatted_media_count || '0',
          media_count: data.data?.additional_data?.media_count || 0,
          name: data.data?.additional_data?.name || hashtag,
          subtitle: data.data?.additional_data?.subtitle
        },
        items: (data.data?.items?.map((item: InstagramItem) => ({
          id: item.id,
          code: item.code,
          taken_at: item.taken_at,
          pk: item.pk,
          media_type: item.media_type,
          caption_text: item.caption?.text || '',
          like_count: item.like_count,
          comment_count: item.comment_count,
          thumbnail_url: item.image_versions2?.candidates?.[0]?.url || item.thumbnail_url,
          video_url: item.video_url,
          user: item.user ? {
            pk: item.user.pk,
            username: item.user.username,
            full_name: item.user.full_name,
            profile_pic_url: item.user.profile_pic_url
          } : undefined
        })) || []), // Ensure items is always an array
        next_page_token: nextPageToken
      };

      console.log('Transformed response:', {
        additional_data_count: responseData.additional_data?.media_count || 0,
        items_count: responseData.items.length, // Now safe to access length
        has_next_page: !!responseData.next_page_token
      });

      if (data.data?.items?.[0]) {
        console.log('Sample item comparison:', {
          original: data.data.items[0],
          transformed: responseData.items[0]
        });
      }
      
      // Add pagination metadata to the response
      return NextResponse.json({ 
        data: responseData,
        pagination: {
          current_page: page,
          limit: limit,
          next_page_token: nextPageToken,
          has_next_page: !!nextPageToken
        }
      });

    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Raw response:', rawResponse.substring(0, 200) + '...');
      return NextResponse.json({ error: 'Invalid API response format' }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    const errorResponse: InstagramError = {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 500
    };
    return NextResponse.json({ error: errorResponse.message }, { status: errorResponse.status });
  }
}

// Function to fetch all pages of results (can be used on server side)
export async function fetchAllHashtagPosts(hashtag: string, limit: number = 100) {
  const allItems: any[] = [];
  let nextPageToken = '';
  let page = 1;
  
  try {
    do {
      // Build the URL to call our own API endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      let apiUrl = `${baseUrl}/api/instagram?hashtag=${encodeURIComponent(hashtag)}&limit=${limit}&page=${page}`;
      
      if (nextPageToken) {
        apiUrl += `&next_page_token=${encodeURIComponent(nextPageToken)}`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data?.items) {
        allItems.push(...data.data.items);
      }
      
      nextPageToken = data.pagination?.next_page_token || '';
      page++;
      
      // Optional: Add a delay to avoid rate limiting
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } while (nextPageToken && allItems.length < 1000); // Set a reasonable maximum
    
    return {
      items: allItems,
      total_count: allItems.length
    };
    
  } catch (error) {
    console.error('Error fetching all hashtag posts:', error);
    throw error;
  }
}
// import { NextResponse } from 'next/server';

// interface InstagramError {
//   message: string;
//   status?: number;
// }

// interface InstagramUser {
//   pk: string;
//   username: string;
//   full_name: string;
//   profile_pic_url: string;
// }

// interface InstagramItem {
//   id: string;
//   code?: string;
//   taken_at?: number;
//   pk?: string;
//   media_type?: number;
//   caption?: {
//     text: string;
//   };
//   like_count?: number;
//   comment_count?: number;
//   image_versions2?: {
//     candidates?: Array<{
//       url: string;
//     }>;
//   };
//   thumbnail_url?: string;
//   video_url?: string;
//   user?: InstagramUser;
// }

// interface InstagramApiResponse {
//   data?: {
//     additional_data?: {
//       formatted_media_count?: string;
//       media_count?: number;
//       name?: string;
//       subtitle?: string;
//     };
//     items: InstagramItem[]; 
//   };
// }

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const hashtag = searchParams.get('hashtag');
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '30');

//     if (!hashtag) {
//       return NextResponse.json({ error: 'Hashtag parameter is required' }, { status: 400 });
//     }

//     const rapidApiKey = process.env.RAPIDAPI_KEY;
//     const rapidApiHost = process.env.RAPIDAPI_HOST;

//     if (!rapidApiKey || !rapidApiHost) {
//       console.error('Missing required environment variables:');
//       console.error('RAPIDAPI_KEY:', !!rapidApiKey);
//       console.error('RAPIDAPI_HOST:', !!rapidApiHost);
//       return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
//     }

//     console.log('Using API Host:', rapidApiHost);
//     console.log('API Key length:', rapidApiKey.length, 'First 4 chars:', rapidApiKey.substring(0, 4));

//     const options = {
//       method: 'GET',
//       headers: {
//         'X-RapidAPI-Key': rapidApiKey,
//         'X-RapidAPI-Host': rapidApiHost,
//         'Accept': 'application/json'
//       }
//     };

//     // Use the correct endpoint format according to RapidAPI docs
//     const apiUrl = `https://${rapidApiHost}/v1/hashtag?hashtag=${encodeURIComponent(hashtag)}`;
//     console.log('Fetching from URL:', apiUrl);

//     const response = await fetch(apiUrl, options);
//     console.log('API Response Status:', response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('API Error Response:', errorText);
//       throw new Error(`Instagram API responded with status: ${response.status}`);
//     }

//     const rawResponse = await response.text();
//     console.log('Raw Response Length:', rawResponse.length);

//     try {
//       const data: InstagramApiResponse = JSON.parse(rawResponse);
//       console.log('Raw API response data:', data);

//       // Ensure we have the correct data structure
//       const responseData: InstagramApiResponse['data'] = {
//         additional_data: {
//           formatted_media_count: data.data?.additional_data?.formatted_media_count || '0',
//           media_count: data.data?.additional_data?.media_count || 0,
//           name: data.data?.additional_data?.name || hashtag,
//           subtitle: data.data?.additional_data?.subtitle
//         },
//         items: (data.data?.items?.map((item: InstagramItem) => ({
//           id: item.id,
//           code: item.code,
//           taken_at: item.taken_at,
//           pk: item.pk,
//           media_type: item.media_type,
//           caption_text: item.caption?.text || '',
//           like_count: item.like_count,
//           comment_count: item.comment_count,
//           thumbnail_url: item.image_versions2?.candidates?.[0]?.url || item.thumbnail_url,
//           video_url: item.video_url,
//           user: item.user ? {
//             pk: item.user.pk,
//             username: item.user.username,
//             full_name: item.user.full_name,
//             profile_pic_url: item.user.profile_pic_url
//           } : undefined
//         })) || []) // Ensure items is always an array
//       };

//       console.log('Transformed response:', {
//         additional_data_count: responseData.additional_data?.media_count || 0,
//         items_count: responseData.items.length // Now safe to access length
//       });

//       if (data.data?.items?.[0]) {
//         console.log('Sample item comparison:', {
//           original: data.data.items[0],
//           transformed: responseData.items[0]
//         });
//       }
      
//       return NextResponse.json({ data: responseData });

//     } catch (parseError) {
//       console.error('Parse error:', parseError);
//       console.error('Raw response:', rawResponse.substring(0, 200) + '...');
//       return NextResponse.json({ error: 'Invalid API response format' }, { status: 500 });
//     }

//   } catch (error) {
//     console.error('API error:', error);
//     const errorResponse: InstagramError = {
//       message: error instanceof Error ? error.message : 'An unexpected error occurred',
//       status: 500
//     };
//     return NextResponse.json({ error: errorResponse.message }, { status: errorResponse.status });
//   }
// }
