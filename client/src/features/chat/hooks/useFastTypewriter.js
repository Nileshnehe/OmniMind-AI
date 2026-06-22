import { useState, useEffect, useRef } from 'react';

export const useFastTypewriter = (text, speed = 10, animate = true, onTyping = () => {}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      setIsDone(true);
      return;
    }

    setDisplayedText('');
    setIsDone(false);
    indexRef.current = 0;

    if (!text) return;

    // We will reveal text much faster by advancing multiple characters per tick.
    const chunkSize = 4;

    const interval = setInterval(() => {
      const i = indexRef.current;
      if (i < text.length) {
        const nextIndex = Math.min(i + chunkSize, text.length);
        setDisplayedText(text.slice(0, nextIndex));
        indexRef.current = nextIndex;
        onTyping(); // Trigger auto-scroll on each tick
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, animate, speed]);

  return { displayedText, isDone };
};
