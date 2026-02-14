'use client';
import { useEffect, useState } from 'react';

export const Countdown = ({
                            targetDate,
                            currentTime,
                            text,
                          }: {
  targetDate: string;
  currentTime: string;
  text?: string;
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!targetDate || !currentTime) return;

    const serverNow = new Date(currentTime).getTime();
    const clientNow = Date.now();
    const offset = serverNow - clientNow;

    const calculateTime = () => {
      const now = Date.now() + offset;
      const difference = new Date(targetDate).getTime() - now;
      setTimeLeft(Math.max(0, Math.floor(difference / 1000)));
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate, currentTime]);

  if (timeLeft <= 0) return null;

  return (
    <div className="flex flex-col items-center my-4 animate-bounce">
      <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">
        {text}
      </p>
      <span className="text-5xl font-black text-blue-600 drop-shadow-md">
        {timeLeft} s
      </span>
    </div>
  );
};
