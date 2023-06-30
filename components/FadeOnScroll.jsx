import React, { useEffect, useRef, useState } from 'react';

const FadeOnScroll = ({ children }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const topPosition = sectionRef.current.getBoundingClientRect().top;
      const isVisible = topPosition < window.innerHeight * 0.8;
      setIsVisible(isVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`fade-on-scroll${isVisible ? ' visible' : ''}`}
    >
      {children}
    </div>
  );
};

export default FadeOnScroll;
