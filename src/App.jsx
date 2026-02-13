
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Toaster } from 'react-hot-toast';
import { gsap } from 'gsap';

import { useGetIdiomsQuery } from './features/apiSlice'; 
import Navbar from './components/Navbar';
import AddIdiom from './components/AddIdiom';
import RandomIdiom from './components/RandomIdiom';
import Training from './pages/Training'; 
import Home from './pages/Home';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Loader from './components/Loader'; 

import './App.css';

const ProtectedAddIdiom = withAuthenticationRequired(AddIdiom, {
  onRedirecting: () => <Loader />,
});

const ProtectedProfile = withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loader />,
});

function App() {
  const { data: idioms = [], isLoading } = useGetIdiomsQuery();
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimationFinished(true);
          
          gsap.set(contentRef.current, { clearProps: "all" });
        }
      });

      tl.fromTo(contentRef.current, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.3 }
      );
    }
  }, [isLoading]);

  return (
    <Router>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        gutter={8}
        containerClassName="toaster-container"
        toastOptions={{
          className: 'custom-toast',
          duration: 1000,
  
          success: {
            className: 'custom-toast',
          },
          error: {
            className: 'custom-toast',
          },
        }}
      />

      {(!isAnimationFinished || isLoading) && <Loader />}
      
      <div 
        ref={contentRef} 
        className={`main-wrapper ${isLoading ? 'is-loading' : 'is-ready'}`}
      >
        <Navbar />
        
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home idioms={idioms} />} />
            <Route path="/random" element={<RandomIdiom idioms={idioms} />} />
            <Route path="/random" element={<RandomIdiom idioms={idioms} />} />
            <Route path="/training" element={<Training idioms={idioms} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            <Route 
              path="/add" 
              element={
                <div className="fade-in">
                  <ProtectedAddIdiom /> 
                </div>
              } 
            />

            <Route path="/quiz" element={<Quiz idioms={idioms} />} />

            <Route 
              path="/profile" 
              element={<ProtectedProfile idioms={idioms} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
