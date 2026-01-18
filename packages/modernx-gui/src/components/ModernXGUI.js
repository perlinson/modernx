import React, { useState, useEffect } from 'react';
import WebSocket from 'ws';

const ModernXGUI = () => {
  const [projectInfo, setProjectInfo] = useState(null);
  const [state, setState] = useState({});
  const [actions, setActions] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Load project info
    fetch('/api/project')
      .then(response => response.json())
      .then(data => {
        setProjectInfo(data);
        console.log('Project loaded:', data);
      })
      .catch(error => console.error('Failed to load project:', error));

    // Connect to WebSocket for real-time updates
    const websocket = new WebSocket(`ws://${window.location.host}`);
    
    websocket.onopen = () => {
      console.log('Connected to ModernX GUI WebSocket');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'state_update') {
          setState(data.payload);
        } else if (data.type === 'action') {
          setActions(prev => [...prev, data.payload]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('Disconnected from ModernX GUI');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const renderProjectStructure = () => {
    if (!projectInfo) return null;

    return (
      <div className="project-structure">
        <h3>Project: {projectInfo.name}</h3>
        <div className="models-list">
          <h4>Models:</h4>
          <ul>
            {projectInfo.models?.map(model => (
              <li key={model}>{model}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderStateViewer = () => {
    return (
      <div className="state-viewer">
        <h3>Current State</h3>
        <pre className="state-display">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    );
  };

  const renderActionHistory = () => {
    return (
      <div className="action-history">
        <h3>Action History</h3>
        <div className="actions-list">
          {actions.map((action, index) => (
            <div key={index} className="action-item">
              <strong>{action.type}</strong>
              <small>{new Date(action.timestamp).toLocaleTimeString()}</small>
              <pre>{JSON.stringify(action.payload, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="modernx-gui">
      <header>
        <h1>ModernX GUI</h1>
        <div className="connection-status">
          {ws?.readyState === WebSocket.OPEN ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </header>
      
      <main className="gui-layout">
        <aside className="sidebar">
          {renderProjectStructure()}
        </aside>
        
        <section className="main-content">
          <div className="state-section">
            {renderStateViewer()}
          </div>
          
          <div className="actions-section">
            {renderActionHistory()}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ModernXGUI;
