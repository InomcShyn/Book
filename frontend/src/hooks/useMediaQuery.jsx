import { useEffect, useState } from 'react';

export const mediaQueryPoints = {
  superXs: 375,
  xs: 480, // Extra small devices (phones)
  sm: 640, // Small devices (landscape phones)
  md: 768, // Medium devices (tablets)
  mdPlus: 992,
  lg: 1024, // Large devices (laptops)
  xl: 1280, // Extra large devices (desktops)
  '2xl': 1536, // 2x large desktops / large monitors
  '3xl': 1920, // Ultra-wide screens
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Define the listener as a separate function to avoid recreating it on each render
    const listener = () => setMatches(media.matches);

    // Use 'change' instead of 'resize' for better performance
    media.addEventListener('change', listener);

    // Cleanup function to remove the event listener
    return () => media.removeEventListener('change', listener);
  }, [matches, query]); // Only recreate the listener when 'matches' or 'query' changes

  return matches;
};

export default useMediaQuery;
