import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Training = ({ idioms }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState('idle');
  const [earnedXP, setEarnedXP] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false); 

  const trainingList = idioms?.filter(i => i.example) || [];
  const currentIdiom = trainingList[currentIdx];


  const saveScoreToDB = async (points) => {
    if (!isAuthenticated) return;
    setIsSyncing(true); 
    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        'http://localhost:5000/api/users/update-score',
        { score: points },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      console.log(`✅ XP (${points}) успешно сохранено в облаке`);
    } catch (err) {
      console.error("❌ Ошибка синхронизации:", err.response?.data || err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const getMaskedSentence = () => {
    if (!currentIdiom?.example || !currentIdiom?.phrase) return "";
    let sentence = currentIdiom.example;
    let phraseToHide = currentIdiom.phrase.replace(/^to\s+/i, '').replace(/['"]+/g, '').trim();
    let flexiblePhrase = phraseToHide.replace(/one's/gi, "[\\w']+");

    try {
      const regex = new RegExp(flexiblePhrase, 'gi');
      return regex.test(sentence) ? sentence.replace(regex, '__________') : sentence;
    } catch { return sentence; }
  };

  const maskedSentence = getMaskedSentence();

  const handleCheck = (e) => {
    e.preventDefault();
 
    if (!userInput.trim() || status === 'success' || status === 'hint' || isSyncing) return;

    const normalize = (str) => str.toLowerCase().replace(/^to\s+/i, '').replace(/['".,!]+/g, '').trim();
    const cleanUser = normalize(userInput);
    const cleanCorrect = normalize(currentIdiom.phrase);

    if (cleanUser === cleanCorrect || (cleanCorrect.includes(cleanUser) && cleanUser.length > 3)) {
      const points = attempts === 0 ? 10 : attempts === 1 ? 5 : 2;
      
     
      setEarnedXP(points);
      setStatus('success');
      

      saveScoreToDB(points);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setStatus('hint');
      } else {
        setStatus('error');
   
      }
    }
  };

  const nextQuestion = () => {
    setCurrentIdx((prev) => (prev + 1) % trainingList.length);
    setUserInput('');
    setAttempts(0);
    setStatus('idle');
    setEarnedXP(0);
  };

  if (!idioms || idioms.length === 0) return <div className="loader">Загрузка данных...</div>;
  if (!currentIdiom) return <div className="no-data">Нет доступных упражнений.</div>;

  const progressPercentage = ((currentIdx + 1) / trainingList.length) * 100;

  return (
    <div className="training-wrapper fade-in">
      <div className="training-card">
        
       
        <div className="training-header">
          <div className="category-badge">{currentIdiom.category || 'Общее'}</div>
          <div className="idiom-counter">
            <span>Идиома</span> 
            <strong>{currentIdx + 1}</strong> 
            <small>из {trainingList.length}</small>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="training-image-container">
          <img src={currentIdiom.imageUrl} alt="visual hint" className="training-img" />
        </div>

        <div className="training-content">
          <div className="sentence-box">
             <p className="sentence-display">"{maskedSentence}"</p>
             <p className="meaning-hint">💡 {currentIdiom.meaning}</p>
          </div>

          <form onSubmit={handleCheck} className="training-form">
            <input 
              type="text"
              className={`training-input ${status === 'success' ? 's-border' : status === 'error' ? 'e-border' : ''}`}
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                if (status === 'error') setStatus('idle'); 
              }}
              placeholder="Введите верную идиому..."
              disabled={status === 'success' || status === 'hint'}
              autoFocus
              autoComplete="off"
            />
            
            {status === 'idle' || status === 'error' ? (
              <button type="submit" className="check-btn" disabled={isSyncing}>
                {isSyncing ? 'Синхронизация...' : `Проверить ${attempts > 0 ? `(${3 - attempts} попытки)` : '🚀'}`}
              </button>
            ) : (
              <button type="button" onClick={nextQuestion} className="next-btn">
                Продолжить <span>→</span>
              </button>
            )}
          </form>

          <div className="status-messages">
            {status === 'success' && (
              <div className="msg success-msg bounce-in">
                🎯 Отлично! <strong>+{earnedXP} XP</strong> добавлено.
              </div>
            )}
            
            {status === 'error' && (
              <div className="msg error-msg shake">
                ❌ Не совсем так. Попробуй еще раз!
              </div>
            )}
            
            {status === 'hint' && (
              <div className="hint-box fade-in">
                <p className="msg info-msg">Запоминай правильный ответ:</p>
                <p className="correct-answer-text">
                   <span>{currentIdiom.phrase}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;