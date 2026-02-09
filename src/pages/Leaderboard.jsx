import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Leaderboard = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0(); 
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitialFetched = useRef(false); 

  useEffect(() => {
   
    const fetchLeaders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/leaderboard');
        setLeaders(res.data);
        isInitialFetched.current = true;
      } catch (err) {
        console.error("Ошибка при загрузке рейтинга:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const getRankClass = (index) => {
    if (index === 0) return 'rank-gold';
    if (index === 1) return 'rank-silver';
    if (index === 2) return 'rank-bronze';
    return '';
  };

  if (loading) return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Считаем достижения...</p>
    </div>
  );

  return (
    <div className="leaderboard-wrapper fade-in">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">Зал славы 🏆</h1>
        <p className="leaderboard-subtitle">Лучшие знатоки идиом со всего мира</p>
      </div>

      {!isAuthenticated && (
        <div className="promo-banner-card">
          <div className="promo-content">
            <h3>Хотите попасть в список? 🚀</h3>
            <p>Ваши очки за тренировки и квизы будут суммироваться в общем рейтинге.</p>
          </div>
          <button onClick={() => loginWithRedirect()} className="auth-btn login pulse">
            Войти и участвовать
          </button>
        </div>
      )}

      <div className="leaderboard-list">
        {leaders.length > 0 ? (
          leaders.map((leader, index) => {
           
            const isCurrentUser = isAuthenticated && user?.email === leader.email;
            
            return (
              <div 
                key={leader._id || index} 
                className={`leader-item ${getRankClass(index)} ${isCurrentUser ? 'current-user-highlight' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }} 
              >
                <div className="leader-rank">
                  {index < 3 ? <span className="medal-icon"></span> : index + 1}
                </div>
                
                <div className="avatar-wrapper">
                  <img 
                    src={leader.picture || 'https://via.placeholder.com/50'} 
                    alt={leader.name} 
                    className="leader-avatar" 
                  />
                  {isCurrentUser && <span className="you-badge">Вы</span>}
                </div>

                <div className="leader-info">
                  <div className="leader-name">{leader.name || 'Анонимный лингвист'}</div>
                  <div className="leader-level">Уровень {Math.floor((leader.totalPoints || 0) / 100) + 1}</div>
                </div>

                <div className="leader-score">
                  <span className="xp-value">{leader.totalPoints || 0}</span>
                  <span className="xp-label">XP</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data-message">Рейтинг пока пуст. Будь первым!</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;