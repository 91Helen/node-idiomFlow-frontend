
import React, { useState} from 'react'; 
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'; 
import '../App.css';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (isMenuOpen && Math.abs(latest - previous) > 5) { 
      setIsMenuOpen(false); 
    }

    if (isMenuOpen) { 
      setIsHidden(false); 
      return; 
    }

    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else if (latest < previous) {
      setIsHidden(false);
    }
  });

  const closeMenu = () => setIsMenuOpen(false);

  const MotionNav = motion.nav;

  return (
    <MotionNav 
      className="navbar"
      initial={{ y: 0 }}
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="navbar-brand">
        <NavLink to="/" onClick={closeMenu}>IdiomFlow 📚</NavLink>
      </div>
      
      <div 
        className={`burger-icon ${isMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span><span></span><span></span>
      </div>

      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}

      <ul className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
        <li><NavLink to="/" onClick={closeMenu}>Главная</NavLink></li>
        
        {isAuthenticated && (
          <li>
            <NavLink to="/add" onClick={closeMenu} style={{ color: '#646cff', fontWeight: 'bold' }}>
              Добавить идиому +
            </NavLink>
          </li>
        )}

        <li><NavLink to="/random" onClick={closeMenu}>Запоминание</NavLink></li>
        <li><NavLink to="/quiz" onClick={closeMenu}>Квиз 🏆</NavLink></li>
        <li><NavLink to="/training" onClick={closeMenu}>Тренировка 🧠</NavLink></li>
        <li><NavLink to="/leaderboard" onClick={closeMenu}>Лидеры 🥇</NavLink></li>

        {!isLoading && (
          <li className="auth-section">
            {!isAuthenticated ? (
              <button className="auth-btn login" onClick={() => loginWithRedirect()}>
                Войти
              </button>
            ) : (
              <div className="nav-user-wrapper">
                <NavLink to="/profile" onClick={closeMenu} className="nav-profile-link">
                  {user?.picture ? (
                    <img src={user.picture} alt="Avatar" className="nav-avatar" />
                  ) : (
                    <div className="nav-avatar-placeholder">{user?.name?.[0] || 'U'}</div>
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
    </MotionNav>
  );
};

export default Navbar;
