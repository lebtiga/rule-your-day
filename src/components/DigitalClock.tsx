import React, { useState, useEffect } from 'react';

export function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return (
    <div className="font-mono text-2xl font-bold tracking-tight">
      <span>{displayHours.toString().padStart(2, '0')}</span>
      <span className="animate-pulse">:</span>
      <span>{minutes.toString().padStart(2, '0')}</span>
      <span className="text-lg ml-1 text-gray-500 dark:text-gray-400">{period}</span>
    </div>
  );
}