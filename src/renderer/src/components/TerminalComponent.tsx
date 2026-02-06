import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // 1. إعداد الشاشة بستايل EMAD-UI
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: 'transparent', 
        foreground: '#00f3ff',
        cursor: '#00f3ff',
        selectionBackground: 'rgba(0, 243, 255, 0.3)',
      },
      fontFamily: 'monospace',
      fontSize: 14,
      allowProposedApi: true 
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    
    // تأخير بسيط للتأكد من أن الحاوية أصبحت جاهزة
    setTimeout(() => fitAddon.fit(), 100);

    // 2. استقبال البيانات من نظام كالي (Main Process) وعرضها
    // ملاحظة: استخدمنا window.electron.ipcRenderer لأنك تستخدم electron-toolkit
    const removeListener = window.electron.ipcRenderer.on('terminal-data', (_event, data) => {
      term.write(data);
    });

    // 3. إرسال ما يكتبه عماد على الكيبورد إلى النظام الحقيقي
    term.onData((data) => {
      window.electron.ipcRenderer.send('terminal-write', data);
    });

    // معالجة تغيير حجم النافذة تلقائياً
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      removeListener(); 
      term.dispose();
    };
  }, []);

  return (
    <div 
      ref={terminalRef} 
      className="terminal-container" 
      style={{ 
        width: '100%', 
        height: '100%', 
        padding: '10px',
        boxSizing: 'border-box'
      }} 
    />
  );
};

export default TerminalComponent;