import React, { useState, useCallback, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; 
import axios from 'axios';

const Quiz = ({ idioms }) => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0(); 
  
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isStarted, setIsStarted] = useState(false);

  const createQuestionData = useCallback((allIdioms) => {
    if (!Array.isArray(allIdioms) || allIdioms.length < 4) return null;

    const correct = allIdioms[Math.floor(Math.random() * allIdioms.length)];
    const otherIdioms = allIdioms.filter(i => i._id !== correct._id);
    const wrongs = otherIdioms.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [correct, ...wrongs].sort(() => 0.5 - Math.random());

    return {
      phrase: correct.phrase,
      correctMeaning: correct.meaning,
      options: options.map(o => o.meaning),
      image: correct.image
    };
  }, []);

 
  useEffect(() => {
    const saveQuizResults = async () => {
    
      if (showResults && isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          await axios.post('http://localhost:5000/api/users/update-score', {
            auth0Id: user.sub, 
            score: score
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("Результаты успешно синхронизированы!");
        } catch (err) {
          console.error("Ошибка при сохранении очков:", err);
        }
      }
    };

    saveQuizResults();
  }, [showResults, isAuthenticated, user, score, getAccessTokenSilently]);


  useEffect(() => {
    if (Array.isArray(idioms) && idioms.length >= 4 && !currentQuestion) {
      const timer = setTimeout(() => {
        setCurrentQuestion(createQuestionData(idioms));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [idioms, currentQuestion, createQuestionData]);

  const nextQuestion = useCallback(() => {
    const nextData = createQuestionData(idioms);
    setCurrentQuestion(nextData);
    setAnswered(false);
    setSelectedOption(null);
    setTimeLeft(15);
  }, [idioms, createQuestionData]);

  const handleAnswer = useCallback((option) => {
    if (answered || !currentQuestion) return;
    
    setSelectedOption(option);
    setAnswered(true);
    
    if (option === currentQuestion.correctMeaning) {
      setScore(prev => prev + 1);
    }

    if (questionCount >= 9) {
      setTimeout(() => setShowResults(true), 1500);
    } else {
      setTimeout(() => {
        setQuestionCount(prev => prev + 1);
        nextQuestion();
      }, 1500);
    }
  }, [answered, currentQuestion, questionCount, nextQuestion]);

  useEffect(() => {
    if (!isStarted || answered || showResults || !currentQuestion) return;

    if (timeLeft === 0) {
      const timeoutId = setTimeout(() => handleAnswer(null), 0);
      return () => clearTimeout(timeoutId);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, timeLeft, answered, showResults, currentQuestion, handleAnswer]);

  const restartQuiz = () => {
    setScore(0);
    setQuestionCount(0);
    setShowResults(false);
    setIsStarted(false);
    setCurrentQuestion(createQuestionData(idioms));
    setTimeLeft(15);
  };

  if (!currentQuestion && !showResults) return <div className="loader">Загрузка...</div>;

  if (!isStarted && !showResults) {
    return (
      <div className="quiz-container">
        <div className="quiz-card start-card fade-in">
          <div className="quiz-icon">🎯</div>
          <h2>Проверка Идиом</h2>
          <p>Заработай очки и попади в топ! 10 вопросов по 15 секунд.</p>
          <button className="start-btn" onClick={() => setIsStarted(true)}>
            Начать игру
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-container">
        <div className="quiz-card results-card fade-in">
          <h2>🎉 Финиш!</h2>
          <p className="final-score">Твой результат: {score} из 10</p>
          {isAuthenticated ? (
             <p className="promo-hint">Результаты сохранены в твоем профиле!</p>
          ) : (
             <p className="promo-hint">Войди, чтобы сохранять свои рекорды.</p>
          )}
          <button className="next-phrase-btn" onClick={restartQuiz}>
            Играть снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container fade-in">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="quiz-progress">Вопрос {questionCount + 1} / 10</div>
          <div className="quiz-score-badge">Счёт: {score}</div>
        </div>
        
        <div className="timer-section">
          <div className="timer-text" style={{ color: timeLeft < 5 ? '#ff4d4f' : '#636e72' }}>
            {timeLeft}с
          </div>
          <div className="timer-container">
            <div 
              className="timer-bar" 
              style={{ 
                width: `${(timeLeft / 15) * 100}%`,
                backgroundColor: timeLeft < 5 ? '#ff4d4f' : '#646cff' 
              }}
            ></div>
          </div>
        </div>
        
        {currentQuestion.image && (
          <div className="quiz-image-wrapper">
             <img src={currentQuestion.image} alt="idiom" className="quiz-img" />
          </div>
        )}

        <h2 className="quiz-phrase">«{currentQuestion.phrase}»</h2>
        
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === currentQuestion.correctMeaning;
            const isSelected = option === selectedOption;
            
            let btnClass = "";
            if (answered) {
              if (isCorrect) btnClass = "correct";
              else if (isSelected) btnClass = "wrong";
              else btnClass = "dimmed";
            }

            return (
              <button 
                key={index} 
                className={`option-btn ${btnClass}`}
                onClick={() => handleAnswer(option)}
                disabled={answered}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quiz;