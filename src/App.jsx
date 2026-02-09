import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast'; // 1. Импортируем Toaster

// Твои компоненты
import Navbar from './components/Navbar';
import AddIdiom from './components/AddIdiom';
import RandomIdiom from './components/RandomIdiom';
import Training from './pages/Training'; 
import Home from './pages/Home';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';

import './App.css';

const ProtectedAddIdiom = withAuthenticationRequired(AddIdiom, {
  onRedirecting: () => <div className="loader">Загрузка...</div>,
});

const ProtectedProfile = withAuthenticationRequired(Profile, {
  onRedirecting: () => <div className="loader">Загрузка...</div>,
});

function App() {
  const [idioms, setIdioms] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    const fetchIdioms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/idioms');
        setIdioms(res.data);
        isFetched.current = true;
      } catch (err) {
        console.error("Ошибка:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdioms();
  }, []);

  return (
    <Router>
      <Navbar />
      {/* 2. Добавляем компонент уведомлений с настройками */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      
      <div className="app-container">
        {loading ? (
          <div className="loader-wrapper">
            <div className="loader"></div>
            <p>Загружаем знания...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home idioms={idioms} />} />
            <Route path="/random" element={<RandomIdiom idioms={idioms} />} />
            <Route path="/training" element={<Training idioms={idioms} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            <Route 
              path="/add" 
              element={
                <div className="fade-in">
                  <ProtectedAddIdiom setIdioms={setIdioms} />
                </div>
              } 
            />

            <Route path="/quiz" element={<Quiz idioms={idioms} />} />

            <Route 
              path="/profile" 
              element={<ProtectedProfile idioms={idioms} />} 
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;