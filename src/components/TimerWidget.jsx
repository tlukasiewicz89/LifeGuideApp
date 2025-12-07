import React, { useState, useEffect, useRef } from 'react';

const TimerWidget = () => {
  const [duration, setDuration] = useState(5 * 60); // in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      audioRef.current?.play();
      setTimeLeft(duration); // auto restart
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, duration]);

  const formatTime = s => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSetDuration = mins => {
    const seconds = mins * 60;
    setDuration(seconds);
    setTimeLeft(seconds);
  };

  return (
    <div className="absolute top-6 right-6 bg-white border border-amber-200 rounded-xl p-4 shadow-md text-sm z-50">
      <h4 className="font-bold text-lg mb-2">⏳ Focus Timer</h4>

      <div className="grid grid-cols-2 gap-2 mb-2">
        {[5, 10, 15, 30].map(min => (
          <button
            key={min}
            onClick={() => handleSetDuration(min)}
            className="px-2 py-1 border rounded hover:bg-amber-100"
          >
            {min} min
          </button>
        ))}
      </div>

      <div className="text-2xl font-mono mb-2">{formatTime(timeLeft)}</div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setIsRunning(true);
            audioRef.current?.play().catch(() => {}); // optional preload play
          }}
          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Stop
        </button>
      </div>

      {/* Bell sound */}
      <audio
        ref={audioRef}
        preload="auto"
        onError={() => console.error('Audio failed to load!')}
      >
        <source src="/chime-02.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default TimerWidget;
