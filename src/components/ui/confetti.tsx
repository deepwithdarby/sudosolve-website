"use client";
import { useState, useEffect } from 'react';

export function Confetti() {
  const [snowflakes, setSnowflakes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const generateSnowflakes = () => {
      const newSnowflakes = Array.from({ length: 50 }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 3 + 4}s`, // 4s to 7s
          animationDelay: `${Math.random() * 5}s`,
          fontSize: `${Math.random() * 1.5 + 1}rem`, // 1rem to 2.5rem
        };
        return <div key={i} className="snowflake" style={style}>❄️</div>;
      });
      setSnowflakes(newSnowflakes);
    };

    generateSnowflakes();
  }, []);

  return <div className="confetti-container">{snowflakes}</div>;
}
