import { useState, useEffect } from "react";

const TestTimer = ({ duration, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="font-bold text-lg text-blue-700">
      Time Left: {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default TestTimer;
