import React, { useState, useEffect } from "react";
import Row from 'react-bootstrap/Row';


const NextImageTimer = ({seconds}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <div>
      <h4>{timeLeft}</h4>
    </div>
  );

}

export default NextImageTimer;
