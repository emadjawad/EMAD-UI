import { useEffect, useState } from 'react';

const Stats = () => {
  const [stats, setStats] = useState({ cpu: '0', ram: '0' });

  useEffect(() => {
    // استلام البيانات من المحرك (Main Process)
    const removeListener = window.electron.ipcRenderer.on('sys-stats', (_event, data) => {
      setStats(data);
    });
    return () => removeListener();
  }, []);

  const Bar = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#00f3ff', marginBottom: '4px' }}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div style={{ width: '100%', height: '4px', background: 'rgba(0, 243, 255, 0.1)' }}>
        <div style={{ 
          width: `${value}%`, 
          height: '100%', 
          background: color, 
          boxShadow: `0 0 8px ${color}`, 
          transition: 'width 0.5s ease' 
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '5px' }}>
      <Bar label="CPU LOAD" value={stats.cpu} color="#00f3ff" />
      <Bar label="RAM USAGE" value={stats.ram} color="#bd00ff" />
    </div>
  );
};

export default Stats;