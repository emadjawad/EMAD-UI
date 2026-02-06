import { useState, useEffect } from 'react';
import { Howl } from 'howler';
import TerminalComponent from './components/TerminalComponent';
import Clock from './components/Clock';
import Stats from './components/Stats'; 
import Keyboard from './components/Keyboard';
import FileBrowser from './components/FileBrowser'; 
import NetworkRadar from './components/NetworkRadar';
import './styles/App.css'; 

// 1. تعريف أصوات النظام
const bootSound = new Howl({
  src: ['./src/assets/sounds/boot.mp3'],
  volume: 0.7,
  html5: true,
  onplayerror: function() {
    bootSound.once('unlock', function() { bootSound.play(); });
  }
});

const accessGrantedSound = new Howl({
  src: ['./src/assets/sounds/access.mp3'],
  volume: 0.5,
});

function App() {
  const [isBooting, setIsBooting] = useState(true);

  const handleTerminate = () => {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('quit-app');
    }
  };

  useEffect(() => {
    bootSound.play();

    const timer = setTimeout(() => {
      setIsBooting(false);
      accessGrantedSound.play();
    }, 4000);

    return () => {
      clearTimeout(timer);
      bootSound.fade(0.7, 0, 1000);
    };
  }, []);

  if (isBooting) {
    return (
      <div className="boot-container" style={{ 
        backgroundColor: '#000', height: '100vh', display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center', color: '#00f3ff', fontFamily: 'monospace',
        overflow: 'hidden', position: 'relative'
      }}>
        {/* تأثير الوميض الخفي بالخلفية */}
        <div className="scanlines"></div>

        <div className="glitch-box">
          <h1 className="glitch-text" data-text="EMAD-UI">EMAD-UI</h1>
        </div>

        <p className="boot-status">INITIALIZING SECURE INTERFACE...</p>

        <div className="progress-bar-container">
          <div className="progress-bar-fill"></div>
        </div>

        <style>{`
          .glitch-text { font-size: 5.5rem; letter-spacing: 20px; font-weight: bold; position: relative; }
          .glitch-text::before, .glitch-text::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: black; }
          .glitch-text::before { left: 2px; text-shadow: -3px 0 #ff00c1; animation: glitch-slice-1 2.5s infinite linear alternate-reverse; }
          .glitch-text::after { left: -2px; text-shadow: -3px 0 #00fff9; animation: glitch-slice-2 3.5s infinite linear alternate-reverse; }
          .boot-status { font-size: 1.1rem; opacity: 0.7; letter-spacing: 4px; margin-top: 25px; animation: slowBlink 2s infinite; }
          .progress-bar-container { width: 350px; height: 2px; background: rgba(0,243,255,0.1); margin-top: 30px; position: relative; overflow: hidden; }
          .progress-bar-fill { width: 100%; height: 100%; background: #00f3ff; position: absolute; left: -100%; animation: filling 3.8s forwards; }
          @keyframes glitch-slice-1 { 0% { clip: rect(30px, 9999px, 31px, 0); } 100% { clip: rect(40px, 9999px, 42px, 0); } }
          @keyframes glitch-slice-2 { 0% { clip: rect(80px, 9999px, 82px, 0); } 100% { clip: rect(65px, 9999px, 67px, 0); } }
          @keyframes slowBlink { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
          @keyframes filling { to { left: 0%; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="layout-container" style={{ 
      backgroundColor: '#000', color: '#00f3ff', height: '100vh', padding: '10px', 
      boxSizing: 'border-box', overflow: 'hidden', display: 'flex', 
      flexDirection: 'column', gap: '10px', position: 'relative'
    }}>
      {/* تأثير الـ CRT الشامل */}
      <div className="scanlines"></div>

      <button onClick={handleTerminate} className="terminate-btn"> [ TERMINATE ] </button>

      {/* القسم العلوي: تم تعديل الـ flex للرادار */}
      <div className="top-section" style={{ display: 'flex', flex: 3, gap: '10px', minHeight: '0' }}>
        
        {/* اليسار: الساعة والحساسات */}
        <div className="panel side-panel">
          <Clock />
          <Stats />
          <div className="user-info">
            <p>{" > "} SYSTEM: ONLINE</p>
            <p>{" > "} KERNEL: KALI-LINUX</p>
            <p>{" > "} USER: EMAD</p>
          </div>
        </div>
        
        {/* المنتصف: الترمينال (القلب النابض) */}
        <div className="panel terminal-panel">
          <TerminalComponent />
        </div>
        
        {/* اليمين: رادار الشبكة (تم زيادة الـ flex لـ 1.2 لحساب حجم الكرة) */}
        <div className="panel radar-panel" style={{ flex: 1.2 }}>
          <h3 className="panel-title">NETWORK SCANNER</h3>
          <NetworkRadar />
        </div>
      </div>
      
      {/* القسم السفلي */}
      <div className="bottom-section" style={{ display: 'flex', flex: 1.2, gap: '10px', minHeight: '0' }}>
        
        {/* مدير الملفات */}
        <div className="panel file-panel" style={{ flex: 1 }}>
          <h3 className="panel-title small">FILE SYSTEM</h3>
          <div className="file-content">
            <FileBrowser />
          </div>
        </div>

        {/* الكيبورد الافتراضي */}
        <div className="panel keyboard-panel" style={{ flex: 2.5 }}>
          <Keyboard />
        </div>
      </div>

      <style>{`
        .panel { border: 1px solid rgba(0, 243, 255, 0.3); background: rgba(0, 5, 10, 0.5); position: relative; display: flex; flexDirection: column; padding: 10px; overflow: hidden; }
        .side-panel { flex: 1; gap: 15px; padding: 15px; }
        .terminal-panel { flex: 2; border-color: #00f3ff; }
        .panel-title { font-size: 0.9rem; border-bottom: 1px solid rgba(0, 243, 255, 0.2); padding-bottom: 10px; margin-bottom: 15px; color: #00f3ff; text-shadow: 0 0 5px #00f3ff; }
        .panel-title.small { font-size: 0.8rem; margin-bottom: 5px; padding-bottom: 5px; }
        .user-info { margin-top: auto; font-size: 0.7rem; opacity: 0.6; line-height: 1.5; font-family: 'Courier New', monospace; }
        .file-content { flex: 1; overflow-y: auto; }
        .terminate-btn { position: absolute; top: 15px; right: 15px; z-index: 999; background: rgba(255, 0, 0, 0.05); border: 1px solid #ff4444; color: #ff4444; padding: 4px 12px; font-family: monospace; font-size: 0.7rem; cursor: pointer; transition: all 0.2s; }
        .terminate-btn:hover { background: #ff4444; color: #000; box-shadow: 0 0 15px #ff4444; }
        
        /* تأثير خطوط المسح CRT */
        .scanlines {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 3px, 3px 100%; pointer-events: none; z-index: 1000; opacity: 0.3;
        }
      `}</style>
    </div>
  );
}

export default App;