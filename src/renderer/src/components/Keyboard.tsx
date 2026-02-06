import { useEffect, useState } from 'react';

const Keyboard = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // إرسال كود المفتاح للـ Set
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    // هون السر: استخدام true لتشغيل الـ Capture Phase
    // هيك بنسمع الزر قبل ما التيرمينال يعمل e.stopPropagation()
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, []);

  const rows = [
    ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
    ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
    ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
    ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
    ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight']
  ];

  const displayKey = (code: string) => {
    const map: { [key: string]: string } = {
      'Escape': 'ESC', 'Backspace': 'BACK', 'CapsLock': 'CAPS', 'ShiftLeft': 'SHIFT', 
      'ShiftRight': 'SHIFT', 'ControlLeft': 'CTRL', 'ControlRight': 'CTRL', 
      'AltLeft': 'ALT', 'AltRight': 'ALT', 'MetaLeft': 'WIN', 'Enter': 'ENTER',
      'Tab': 'TAB', 'Space': 'SPACE', 'Backquote': '`', 'Minus': '-', 'Equal': '=',
      'BracketLeft': '[', 'BracketRight': ']', 'Backslash': '\\', 'Semicolon': ';', 
      'Quote': "'", 'Comma': ',', 'Period': '.', 'Slash': '/'
    };
    if (map[code]) return map[code];
    return code.replace('Key', '').replace('Digit', '');
  };

  const getKeyWidth = (code: string) => {
    if (code === 'Space') return '180px';
    if (code === 'Backspace' || code === 'Enter') return '80px';
    if (code === 'ShiftLeft' || code === 'ShiftRight') return '95px';
    if (code === 'CapsLock' || code === 'Tab') return '70px';
    return '42px';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(0,243,255,0.1)' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
          {row.map(code => {
            const isActive = activeKeys.has(code);
            return (
              <div key={code} style={{
                width: getKeyWidth(code),
                height: '35px',
                border: `1px solid ${isActive ? '#00f3ff' : 'rgba(0, 243, 255, 0.2)'}`,
                background: isActive ? 'rgba(0, 243, 255, 0.4)' : 'rgba(0, 20, 30, 0.6)',
                boxShadow: isActive ? '0 0 15px #00f3ff' : 'none',
                color: isActive ? '#fff' : '#00f3ff',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: '0.65rem', borderRadius: '4px', transition: 'all 0.05s',
                textTransform: 'uppercase', fontWeight: isActive ? 'bold' : 'normal'
              }}>
                {displayKey(code)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;