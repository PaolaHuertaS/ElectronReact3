import React from 'react';
import { createRoot } from 'react-dom/client';
import AnimeApi from './animeApi';
import './styles.css'; //para los estilos

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<AnimeApi />);
});