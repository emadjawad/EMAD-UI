import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#050505',
        foreground: '#00f3ff',
      },
      fontFamily: 'monospace',
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln('Welcome to EMAD-UI OS...');
    term.write('\r\n$ ');

    return () => term.dispose();
  }, []);

  return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
};

export default TerminalComponent;