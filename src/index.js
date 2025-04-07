import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import AnimeApi from './animeApi';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<AnimeApi />);
});