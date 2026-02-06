import { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '10px', borderBottom: '1px solid rgba(0,243,255,0.2)' }}>
      <h1 style={{ color: '#00f3ff', margin: 0, fontSize: '1.5rem', textShadow: '0 0 10px #00f3ff' }}>
        EMAD-UI v1.0
      </h1>
      <div style={{ fontSize: '2rem', fontFamily: 'monospace', marginTop: '5px' }}>
        {time.toLocaleTimeString()}
      </div>
      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
        {time.toLocaleDateString()}
      </div>
    </div>
  );
};

export default Clock;