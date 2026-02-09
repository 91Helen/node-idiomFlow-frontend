import { useState, useEffect } from 'react'; 
import { useGetIdiomsQuery, useDeleteIdiomMutation } from '../features/apiSlice';
import { useAuth0 } from '@auth0/auth0-react';

const IdiomsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState(null); 
  
  const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();


  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      } catch (e) {
        console.error("Ошибка получения токена", e);
      }
    };

    if (isAuthenticated) {
      getToken();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

 
  const { 
    data: idioms, 
    isLoading: dataLoading, 
    isError, 
    error 
  } = useGetIdiomsQuery(token, { skip: !token });

  const [deleteIdiom] = useDeleteIdiomMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Удалить эту идиому?')) {
      try {
        const accessToken = await getAccessTokenSilently();
        await deleteIdiom({ id, token: accessToken }).unwrap();
        alert('Удалено!');
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Не удалось удалить.');
      }
    }
  };

  const filteredIdioms = idioms?.filter((idiom) => {
    const searchContent = `${idiom.phrase} ${idiom.meaning}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });


  if (authLoading || (isAuthenticated && !token && dataLoading)) {
    return <div className="status-message">⏳ Проверка авторизации...</div>;
  }

  if (isError) return <div className="error-message">Ошибка: {error?.data?.message || 'Доступ запрещен'}</div>;

  return (
    <section>
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск по вашим идиомам..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
        )}
      </div>

      <h2>Ваша персональная коллекция:</h2>
      
      {!isAuthenticated ? (
        <p className="status-message">Пожалуйста, войдите, чтобы увидеть свои идиомы.</p>
      ) : (
        <div className="idioms-grid">
          {filteredIdioms?.length > 0 ? (
            filteredIdioms.map((idiom) => (
              <div key={idiom._id} className="idiom-card">
                <div className="idiom-phrase">{idiom.phrase}</div>
                <div className="idiom-meaning"><strong>Значение:</strong> {idiom.meaning}</div>
                {idiom.example && <div className="idiom-example">"{idiom.example}"</div>}
                
                <button className="delete-btn" onClick={() => handleDelete(idiom._id)}>
                  🗑️ Удалить
                </button>
              </div>
            ))
          ) : (
            <p className="status-message">{dataLoading ? 'Загрузка...' : 'У вас пока нет идиом. Добавьте первую!'}</p>
          )}
        </div>
      )}
    </section>
  );
};

export default IdiomsList;