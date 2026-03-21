import { useEffect } from 'react';

const useScrollReveal = (selector = '.reveal') => {
  useEffect(() => {
    const reveals = document.querySelectorAll(selector);

    const revealCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: Unobserve after revealing if you only want it to happen once
          // observer.unobserve(entry.target); 
        } else {
             // Optional: remove class when out of view to re-trigger animation
            entry.target.classList.remove('active');
        }
      });
    };

    const revealOptions = {
      threshold: 0.1, // Trigger when 10% of the element is visible
      rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    reveals.forEach((reveal) => {
      revealObserver.observe(reveal);
    });

    return () => {
      reveals.forEach((reveal) => {
        revealObserver.unobserve(reveal);
      });
    };
  }, [selector]); // Re-run if selector changes
};

export default useScrollReveal;
