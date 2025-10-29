import { useState, useEffect } from "react";

/**
 * Custom hook for typewriter effect
 * @param text - The text to type out
 * @param speed - Typing speed in milliseconds (default: 80)
 * @param delay - Initial delay before typing starts (default: 1000)
 */
export const useTypewriter = (
  text: string,
  speed: number = 80,
  delay: number = 1000
) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    let currentIndex = 0;
    setDisplayedText("");
    setIsComplete(false);

    const startTyping = setTimeout(() => {
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeNextChar, speed);
        } else {
          setIsComplete(true);
        }
      };
      typeNextChar();
    }, delay);

    return () => clearTimeout(startTyping);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
};
