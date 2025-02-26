// lib/instagram.ts
export async function fetchAllHashtagPosts(hashtag: string, limit: number = 100) {
    const allItems: any[] = [];
    let nextPageToken = '';
    let page = 1;
    
    try {
      do {
        // Build the URL to call our own API endpoint
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        let apiUrl = `${baseUrl}/api/instagram/hashtag?hashtag=${encodeURIComponent(hashtag)}&limit=${limit}&page=${page}`;
        
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