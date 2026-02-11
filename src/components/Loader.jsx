import React, { useState, useEffect } from 'react';
import '../App.css';

const loadingIdioms = [
  { eng: "Bite the bullet", rus: "Сжать зубы / Терпеть трудности" },
  { eng: "Break a leg", rus: "Ни пуха, ни пера!" },
  { eng: "Piece of cake", rus: "Проще простого" },
  { eng: "Under the weather", rus: "Плохо себя чувствовать" },
  { eng: "Smooth as silk", rus: "Гладко, как по маслу" },
  { eng: "Patience is a virtue", rus: "Терпение — это добродетель" },
  { eng: "The best of both worlds", rus: "Лучшее из обоих миров" }
];

const Loader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === loadingIdioms.length - 1 ? 0 : prevIndex + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="brain-icon">🧠</div>
        
        <div className="loader-text-wrapper">
          <h2 className="loader-eng">{loadingIdioms[currentIndex].eng}</h2>
          <p className="loader-rus">{loadingIdioms[currentIndex].rus}</p>
          <span className="cursor">|</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
