import { useState, useEffect } from "react";

export function useReveal(elementId) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

      observer.observe(element);
    }, 100);

    return () => clearTimeout(timer);
  }, [elementId]);

  return isVisible;
}