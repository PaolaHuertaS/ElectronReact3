//estilo nuevo
import React from 'react';

const Navbar = ({ activeSection, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#" className="logo">AnimeApp</a>
        <ul className="nav-links">
          <li>
            <a 
              href="#recommendations" 
              className={activeSection === 'recommendations' ? 'active' : ''}
              onClick={() => onNavigate('recommendations')}
            >
              Recomendaciones
            </a>
          </li>
          <li>
            <a 
              href="#anime-list" 
              className={activeSection === 'anime-list' ? 'active' : ''}
              onClick={() => onNavigate('anime-list')}
            >
              Lista
            </a>
          </li>
          <li>
            <a 
              href="#details" 
              className={activeSection === 'details' ? 'active' : ''}
              onClick={() => onNavigate('details')}
            >
              Detalles
            </a>
          </li>
          <li>
            <a 
              href="#episodes" 
              className={activeSection === 'episodes' ? 'active' : ''}
              onClick={() => onNavigate('episodes')}
            >
              Episodios
            </a>
          </li>
          <li>
            <a 
              href="#rss" 
              className={activeSection === 'rss' ? 'active' : ''}
              onClick={() => onNavigate('rss')}
            >
              RSS
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;