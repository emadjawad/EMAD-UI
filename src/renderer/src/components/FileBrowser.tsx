import { useEffect, useState } from 'react';

// إذا ما عندك lucide-react، فيك تستخدم أيقونات SVG بسيطة
const FolderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px #00f3ff)' }}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"></path>
  </svg>
);

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px #0f0)' }}>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const FileBrowser = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [currentPath] = useState('/home/emad');

  useEffect(() => {
    const loadFiles = async () => {
      if (window.electron && window.electron.ipcRenderer) {
        const data = await window.electron.ipcRenderer.invoke('read-dir', currentPath);
        setFiles(data);
      }
    };
    loadFiles();
  }, [currentPath]);

  return (
    <div style={{ fontFamily: 'monospace', color: '#00f3ff', fontSize: '0.8rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {files.map((file, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '4px 8px',
            borderBottom: '1px solid rgba(0, 243, 255, 0.05)',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 243, 255, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {file.isDirectory ? <FolderIcon /> : <FileIcon />}
              <span style={{ color: file.isDirectory ? '#00f3ff' : '#0f0' }}>{file.name}</span>
            </div>
            <span style={{ opacity: 0.4, fontSize: '0.6rem' }}>{file.isDirectory ? '<DIR>' : '<FILE>'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileBrowser;