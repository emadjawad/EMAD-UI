import { useEffect, useState } from 'react';

const NetworkRadar = () => {
  const [net, setNet] = useState<any>({ 
    ip: 'Scanning...', 
    city: 'Istanbul', 
    isp: 'Local Provider', 
    country: 'Turkey', 
    speed: '0.00',
    lat: 41.0082, 
    lon: 28.9784
  });

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const removeListener = window.electron.ipcRenderer.on('net-stats', (_event, data) => {
        // فحص الداتا قبل التحديث لضمان عدم وجود قيم null
        if (data) setNet(data);
      });
      return () => removeListener();
    }
    return () => {};
  }, []);

  // معادلة المزامنة مع فحص الأرقام "بالميلم"
  const getMapPos = (lat: any, lon: any) => {
    // إذا كانت الداتا لسا ما وصلت، بنستخدم إحداثيات إسطنبول كاحتياط
    const nLat = parseFloat(lat) || 41.0082;
    const nLon = parseFloat(lon) || 28.9784;
    const x = ((nLon + 180) / 360) * 100;
    const y = ((90 - nLat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const pos = getMapPos(net.lat, net.lon);

  return (
    <div style={{ fontSize: '0.7rem', color: '#00f3ff', display: 'flex', flexDirection: 'column', gap: '5px', height: '100%' }}>
      
      {/* لوحة البيانات */}
      <div style={{ border: '1px solid rgba(0,243,255,0.3)', padding: '8px', background: 'rgba(0,10,20,0.8)' }}>
        <p style={{ color: '#0f0', borderBottom: '1px solid rgba(0,255,0,0.2)', marginBottom: '5px', fontWeight: 'bold' }}>
          [ SATELLITE NETWORK SCANNER ]
        </p>
        <p>PUBLIC IP: <span style={{color: '#fff'}}>{net.ip || 'Detecting...'}</span></p>
        <p>LOCATION: <span style={{color: '#fff'}}>{(net.city || 'Istanbul').toUpperCase()}</span></p>
        <p>TRAFFIC: <span style={{color: '#0f0'}}>{net.speed || '0.00'} MB/s</span></p>
        <p>COORDS: <span style={{color: '#0f0'}}>
          {/* هون كان الخطأ، صلحناه بفحص نوع البيانات */}
          {typeof net.lat === 'number' ? net.lat.toFixed(4) : '41.0082'} / 
          {typeof net.lon === 'number' ? net.lon.toFixed(4) : '28.9784'}
        </span></p>
      </div>

      {/* الرادار */}
      <div style={{ height: '60px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent 0%, rgba(0, 243, 255, 0.4) 50%, transparent 100%)', animation: 'radar-spin 3s linear infinite' }} />
        <div style={{ width: '4px', height: '4px', backgroundColor: '#f00', borderRadius: '50%', position: 'absolute' }} />
      </div>

      {/* الكرة الأرضية الليلية */}
      <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '230px' }}>
        <div style={{
          width: '220px', height: '220px', borderRadius: '50%',
          position: 'relative', overflow: 'hidden', background: '#000',
          boxShadow: 'inset -20px -20px 60px #000, 0 0 30px rgba(0,243,255,0.2)',
          border: '1px solid rgba(0, 243, 255, 0.4)'
        }}>
          <div style={{ width: '200%', height: '100%', position: 'absolute', animation: 'earth-rotate 40s linear infinite', display: 'flex' }}>
            <div style={{ width: '50%', height: '100%', backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/b/ba/The_earth_at_night.jpg")', backgroundSize: '100% 100%', position: 'relative' }}>
              <div style={{ position: 'absolute', top: pos.y, left: pos.x, width: '10px', height: '10px', backgroundColor: '#f00', borderRadius: '50%', boxShadow: '0 0 15px #f00', transform: 'translate(-50%, -50%)' }} />
            </div>
            <div style={{ width: '50%', height: '100%', backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/b/ba/The_earth_at_night.jpg")', backgroundSize: '100% 100%', position: 'relative' }}>
              <div style={{ position: 'absolute', top: pos.y, left: pos.x, width: '10px', height: '10px', backgroundColor: '#f00', borderRadius: '50%', boxShadow: '0 0 15px #f00', transform: 'translate(-50%, -50%)' }} />
            </div>
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 30% 30%, transparent 15%, rgba(0,0,0,0.9) 85%)', pointerEvents: 'none', zIndex: 6 }} />
        </div>
      </div>

      <style>{`
        @keyframes radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes earth-rotate { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default NetworkRadar;