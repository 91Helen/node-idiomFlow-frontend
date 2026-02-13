import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useGetIdiomsQuery, useDeleteIdiomMutation } from "../features/apiSlice";
import IdiomCard from "../components/IdiomCard";
import Loader from "../components/Loader"; 
import { toast } from "react-hot-toast"; 
import "../App.css"; 

const Home = () => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0(); 
  const [token, setToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: idioms, isLoading, error } = useGetIdiomsQuery(token);
  const [deleteIdiom] = useDeleteIdiomMutation();

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const t = await getAccessTokenSilently();
          setToken(t);
        } catch (err) { 
          console.error("Ошибка получения токена:", err); 
        }
      }
    };
    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  const filteredIdioms = idioms?.filter(idiom => 
    idiom.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idiom.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleDelete = (id) => {
    toast((t) => (
      <div className="toast-confirm-container">
        <p className="toast-confirm-text">Удалить эту идиому? 🗑️</p>
        <div className="toast-confirm-actions">
          <button
            className="toast-btn toast-btn-delete"
            onClick={async () => {
              toast.dismiss(t.id);
              const accessToken = await getAccessTokenSilently(); 
              toast.promise(
                deleteIdiom({ id, token: accessToken }).unwrap(),
                {
                  loading: 'Удаляем...',
                  success: <b>Удалено успешно!</b>,
                  error: <b>Ошибка удаления 😕</b>,
                }
              );
            }}
          >
            Да
          </button>
          <button
            className="toast-btn toast-btn-cancel"
            onClick={() => toast.dismiss(t.id)}
          >
            Нет
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'bottom-center',
      className: 'custom-toast-wrapper',
    });
  };

  if (isLoading) return <Loader />;
  
  if (error) return (
    <div className="error-container">
      <p>Ошибка загрузки данных. Убедитесь, что бэкенд запущен.</p>
    </div>
  );

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Коллекция Идиом 📚</h1>
        <p>Изучайте английский через живые выражения</p>
        
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Найти идиому..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>
      </header>

      <div className="idioms-grid">
        {filteredIdioms && filteredIdioms.length > 0 ? (
          filteredIdioms.map((idiom) => (
            <IdiomCard 
              key={idiom._id} 
              idiom={idiom} 
              currentUserId={user?.sub} 
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="no-results">
            {searchTerm ? `По запросу "${searchTerm}" ничего не найдено` : "Идиом пока нет. Добавьте первую!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
