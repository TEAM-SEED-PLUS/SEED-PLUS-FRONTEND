import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadGoogleAnalytics, trackPageView } from '@/utils/analytics';

let lastTrackedPath = '';

const GoogleAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    loadGoogleAnalytics();
  }, []);

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`;

    if (currentPath === lastTrackedPath) {
      return;
    }

    lastTrackedPath = currentPath;
    trackPageView(currentPath);
  }, [location.pathname, location.search]);

  return null;
};

export default GoogleAnalyticsTracker;
