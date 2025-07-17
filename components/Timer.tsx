
import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isPaused: boolean;
  onTick: (newTime: number) => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, isPaused, onTick }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isPaused || time <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTime(prevTime => {
          const newTime = prevTime - 1;
          onTick(newTime);
          if (newTime <= 0) {
              clearInterval(timerId);
              onTimeUp();
              return 0;
          }
          return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const timeColor = time <= 30 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300';

  return (
    <div className={`font-mono text-2xl font-bold ${timeColor}`}>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default Timer;
