import React, { useState } from 'react'; 
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import '../App.css';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" onClick={closeMenu}>IdiomFlow 📚</NavLink>
      </div>
      
      
      <div className={`burger-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}

      <ul className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
        <li>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            Главная
          </NavLink>
        </li>

        <li>
          <NavLink to="/random" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            Запоминание
          </NavLink>
        </li>

        <li>
          <NavLink to="/quiz" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            Квиз 🏆
          </NavLink>
        </li>

        <li>
          <NavLink to="/training" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            Тренировка 🧠
          </NavLink>
        </li>

        <li>
          <NavLink to="/leaderboard" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            Лидеры 🥇
          </NavLink>
        </li>

        {isAuthenticated && (
          <li>
            <NavLink to="/add" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              Добавить идиому
            </NavLink>
          </li>
        )}

        {!isLoading && (
          <li className="auth-section">
            {!isAuthenticated ? (
              <button className="auth-btn login" onClick={() => { loginWithRedirect(); closeMenu(); }}>
                Войти
              </button>
            ) : (
              <div className="nav-user-wrapper">
                <NavLink 
                  to="/profile" 
                  onClick={closeMenu}
                  className={({ isActive }) => `nav-profile-link ${isActive ? 'active' : ''}`}
                >
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="nav-avatar" />
                  ) : (
                    <div className="nav-avatar-placeholder">{user?.name?.charAt(0)}</div>
                  )}
                  <span className="nav-username">Личный кабинет</span>
                </NavLink>
                
                <button 
                  className="auth-btn logout" 
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                  Выйти
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
