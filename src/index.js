import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>¡Electron + React funcionando!</h1>
      <p>Esta es una aplicación básica con Electron y React.</p>
      
      <p>Contador: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Incrementar
      </button>
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<App />);
});