import React, { useState, useEffect } from 'react';
import '../App.css';

const loadingIdioms = [
  { eng: "Bite the bullet", rus: "Сжать зубы / Терпеть трудности" },
  { eng: "Break a leg", rus: "Ни пуха, ни пера!" },
  { eng: "Piece of cake", rus: "Проще простого" },
  { eng: "Under the weather", rus: "Плохо себя чувствовать" },
  { eng: "Smooth as silk", rus: "Гладко, как по маслу" },
  { eng: "Patience is a virtue", rus: "Терпение — это добродетель" }
];

const Loader = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = loadingIdioms[index].eng;
    
 
    const timer = setTimeout(() => {
      if (!isDeleting) {
   
        setDisplayText(currentFullText.slice(0, displayText.length + 1));
        
  
        if (displayText === currentFullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
      
        setDisplayText(currentFullText.slice(0, displayText.length - 1));
        
    
        if (displayText === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % loadingIdioms.length);
        }
      }
    }, isDeleting ? 40 : 100);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index]);

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="brain-icon">🧠</div>
        
        <div className="loader-text-wrapper">
          <h2 className="loader-eng">
            {displayText}
            <span className="cursor">|</span>
          </h2>
   
          <p className={`loader-rus ${displayText.length > 3 ? 'visible' : ''}`}>
            {loadingIdioms[index].rus}
          </p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
