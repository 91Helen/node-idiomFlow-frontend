import React, { useState, useEffect } from 'react';
import '../App.css';


const idioms = ["Piece of cake...", "Break a leg...", "In a nutshell...", "Keep it up...", "Flowing data..."];

const Loader = () => {
  const [text, setText] = useState(""); // Теперь будет использоваться!
  const [idiomIndex, setIdiomIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    // Логика печати букв
    if (charIndex < idioms[idiomIndex].length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + idioms[idiomIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100); // Скорость печати одной буквы
      return () => clearTimeout(timeout);
    } else {
      // Пауза перед следующей идиомой
      const timeout = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setIdiomIndex((prev) => (prev + 1) % idioms.length);
      }, 2000); // Сколько времени висит готовая фраза
      return () => clearTimeout(timeout);
    }
  }, [charIndex, idiomIndex]);

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="brain-icon">🧠</div>
        {/* Используем нашу переменную text здесь */}
        <p className="loader-text">{text}<span className="cursor">|</span></p>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
