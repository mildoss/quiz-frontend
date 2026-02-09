'use client';
import { useEffect, useState } from 'react';

export const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      setTimeLeft(Math.max(0, Math.floor(difference / 1000)));
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft <= 0) return null;

  return (
    <div className="flex flex-col items-center my-4 animate-bounce">
      <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">The game will start in</p>
      <span className="text-5xl font-black text-blue-600 drop-shadow-md">{timeLeft} s</span>
    </div>
  );
};