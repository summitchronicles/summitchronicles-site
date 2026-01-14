import { useState, useEffect } from 'react';

export interface InstagramPost {
  id: string;
  caption: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REEL';
  thumbnail_url?: string;
  isPinned?: boolean;
}

interface UseInstagramFeedResult {
  posts: InstagramPost[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  usingFallback: boolean;
}

export function useInstagramFeed(): UseInstagramFeedResult {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false); // Reset fallback status

      // Fetch 2 real-time posts
      const response = await fetch('/api/instagram');
      const data = await response.json();

      let realTimePosts: InstagramPost[] = [];

      if (data.data && response.ok) {
        // Check response.ok for successful API call
        realTimePosts = data.data.slice(0, 2); // Ensure max 2
      } else {
        // API returned error or no token, use fallback for the "dynamic" slots
        console.warn(
          'Instagram API fetch failed or returned no data, using fallback posts.'
        );
        setUsingFallback(true);
        realTimePosts = getFallbackDynamicPosts();
      }

      // Merge: 2 Real-Time + 2 Pinned
      const combinedPosts = [...realTimePosts, ...getPinnedPosts()];
      setPosts(combinedPosts);
    } catch (err) {
      console.error('Error fetching Instagram feed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setUsingFallback(true);
      // On error, use full fallback set
      setPosts([...getFallbackDynamicPosts(), ...getPinnedPosts()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refresh = () => {
    fetchPosts();
  };

  return {
    posts,
    loading,
    error,
    refresh,
    usingFallback,
  };
}

// These represent the "Real-Time" posts if the API fails or is not configured
function getFallbackDynamicPosts(): InstagramPost[] {
  return [
    {
      id: 'fallback-1',
      caption:
        '[TRANS_LOG 409.3] - Coordinates: 27.9881° N, 86.9250° E. Acclimatization rotation complete. Oxygen levels stable at 65%. #Everest2026 #MissionControl',
      media_url: '/stories/everest-prep.jpeg',
      permalink: 'https://www.instagram.com/summitchronicles/',
      timestamp: new Date().toISOString(), // Simulating "Now"
      media_type: 'IMAGE',
    },
    {
      id: 'fallback-2',
      caption:
        '[TRANS_LOG 409.4] - Gear Check: Secure. Icefall conditions monitoring active. Proceeding to Camp 1 at 0400 hours. #Alpinism #TechnicalClimbing',
      media_url: '/stories/denali.jpg',
      permalink: 'https://www.instagram.com/summitchronicles/',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // Simulating "Yesterday"
      media_type: 'IMAGE',
    },
  ];
}

// These are the "Constant" posts that ALWAYS appear at position 3 and 4
function getPinnedPosts(): InstagramPost[] {
  return [
    {
      id: 'pinned-1',
      caption:
        '[ARCHIVE_LOG 001.A] - The Beginning. Kilimanjaro Summit, 2023. Where the Seven Summits dream first took flight. 19,341 ft of pure realization. #SevenSummits #Kilimanjaro',
      media_url: '/stories/kilimanjaro.jpg',
      permalink: 'https://www.instagram.com/summitchronicles/',
      timestamp: '2023-10-15T09:15:00Z',
      media_type: 'IMAGE',
      isPinned: true,
    },
    {
      id: 'pinned-2',
      caption:
        "[ARCHIVE_LOG 004.B] - Denali Expedition. Nothing prepares you for the cold of North America's highest peak. A pivotal test of endurance. #Denali #Alpinism",
      media_url: '/stories/denali.jpg', // Reusing asset for now, typically would be distinct
      permalink: 'https://www.instagram.com/summitchronicles/',
      timestamp: '2025-06-20T14:30:00Z',
      media_type: 'IMAGE',
      isPinned: true,
    },
  ];
}
