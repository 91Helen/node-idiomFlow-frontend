import { useState } from 'react';
import { useGetIdiomsQuery } from '../features/apiSlice';
import { useAuth0 } from "@auth0/auth0-react"; 
import "../App.css";

const RandomIdiom = () => {
  const { data: idioms, isLoading } = useGetIdiomsQuery();
  const { isAuthenticated, loginWithRedirect } = useAuth0(); 
  
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [clickCount, setClickCount] = useState(0); 

  const LIMIT = 5; 

  let displayedIdiom = (idioms && currentIndex !== null) ? idioms[currentIndex] : null;

  const handleNext = () => {
    if (!idioms || idioms.length === 0) return;

    if (!isAuthenticated && clickCount >= LIMIT) return;

    let nextIndex;
    if (idioms.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * idioms.length);
      } while (nextIndex === currentIndex);
    } else {
      nextIndex = 0;
    }
    
    setCurrentIndex(nextIndex);
    setShowMeaning(false);

    if (!isAuthenticated) {
      setClickCount(prev => prev + 1);
    }
  };

  if (isLoading) return <div className="status-message">⏳ Загрузка...</div>;
  if (!idioms || idioms.length === 0) return <div className="status-message">Добавьте идиомы в коллекцию!</div>;


  const isLimitReached = !isAuthenticated && clickCount >= LIMIT;

  return (
    <div className="random-page-wrapper fade-in">
      <h2 className="trainer-title">🎲 Тренажер</h2>
      
      {isLimitReached ? (
        /* ЭКРАН ПРИЗЫВА К РЕГИСТРАЦИИ (Marketing Paywall) */
        <div className="trainer-card promo-card fade-in">
          <div className="promo-icon">🚀</div>
          <h3>Вы отлично справляетесь!</h3>
          <p>Вы просмотрели {LIMIT} идиом. Зарегистрируйтесь, чтобы открыть всю коллекцию и сохранять свой прогресс.</p>
          <button className="add-idiom-button" onClick={() => loginWithRedirect()}>
            Войти и продолжить
          </button>
          <button className="secondary-btn" onClick={() => window.location.href = '/'}>
            Вернуться на главную
          </button>
        </div>
      ) : !displayedIdiom ? (
     
        <div className="start-screen">
          <p className="start-text">Приступить к быстрому запоминанию идиом?</p>
          <button className="add-idiom-button" onClick={handleNext}>
            Начать 🚀
          </button>
          {!isAuthenticated && <p className="promo-hint">Доступно {LIMIT} пробных карточек</p>}
        </div>
      ) : (
        /* КАРТОЧКА ТРЕНАЖЕРА */
        <div className="trainer-card random-card-container fade-in">
          {displayedIdiom.imageUrl && (
            <div className="random-image-wrapper">
              <img src={displayedIdiom.imageUrl} alt="visual cue" className="random-card-image" />
            </div>
          )}

          <div className="random-phrase-display">{displayedIdiom.phrase}</div>
          <div className="app-divider divider-spaced"></div>

          {showMeaning ? (
            <div className="meaning-section fade-in">
              <div className="idiom-meaning"><strong>Значение:</strong> {displayedIdiom.meaning}</div>
              {displayedIdiom.example && <div className="random-example-text">"{displayedIdiom.example}"</div>}
            </div>
          ) : (
            <button className="add-idiom-button" onClick={() => setShowMeaning(true)}>
              Показать перевод 👀
            </button>
          )}
          
          <button className="next-phrase-btn" onClick={handleNext}>
            Следующая фраза 🔄
          </button>

      
          {!isAuthenticated && (
            <p className="limit-counter">Осталось бесплатных попыток: {LIMIT - clickCount}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RandomIdiom;