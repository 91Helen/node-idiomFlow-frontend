import { useAuth0 } from "@auth0/auth0-react";
import { useGetIdiomsQuery, useDeleteIdiomMutation } from "../features/apiSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import IdiomCard from "../components/IdiomCard";

const Profile = () => {
  const { user, isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);
  const [dbUser, setDbUser] = useState(null);

  const getLevelInfo = (points) => {
    if (points < 100) return { name: "Новичок 🎓", color: "#95a5a6" };
    if (points < 500) return { name: "Знаток 🔥", color: "#e67e22" };
    if (points < 1500) return { name: "Мастер 🏆", color: "#9b59b6" };
    return { name: "Легенда 👑", color: "#f1c40f" };
  };

  useEffect(() => {
    const initializeProfile = async () => {
      if (isAuthenticated && user) {
        try {
          const t = await getAccessTokenSilently();
          setToken(t);
          const response = await axios.post('http://localhost:5000/api/users/sync', {
            email: user.email,
            name: user.name,
            picture: user.picture
          }, {
            headers: { Authorization: `Bearer ${t}` }
          });
          setDbUser(response.data);
        } catch (err) {
          console.error("Profile sync error:", err);
        }
      }
    };
    initializeProfile();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const { data: idioms, isLoading: dataLoading } = useGetIdiomsQuery(token, {
    refetchOnMountOrArgChange: true,
    skip: !token,
  });
  
  const [deleteIdiom] = useDeleteIdiomMutation();
  const myIdioms = idioms?.filter(idiom => idiom.userId === user?.sub);
  const levelInfo = getLevelInfo(dbUser?.totalPoints || 0);

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту идиому?")) {
      try {
        await deleteIdiom({ id, token }).unwrap();
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };

  if (authLoading || dataLoading) return <div className="loader">Загрузка профиля...</div>;

  return (
    isAuthenticated && (
      <div className="profile-page-wrapper fade-in">
        <div className="profile-user-card">
          <div className="profile-avatar-container">
            <img src={user.picture} alt={user.name} className="profile-main-avatar" />
            <div className="status-online"></div>
          </div>
          
          <div className="profile-info"> 
            <div className="profile-name-row">
              <h2 className="profile-name">{user.name}</h2>
              <span className="level-badge" style={{ backgroundColor: levelInfo.color }}>
                {levelInfo.name}
              </span>
            </div>
            <p className="profile-email-text">{user.email}</p>
            
            <div className="profile-stats-row">
              <div className="stat-item">
                <span className="stat-label">Рекорд квиза</span>
                <span className="stat-value text-purple">{dbUser?.bestScore || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Всего опыта (XP)</span>
                <span className="stat-value text-orange">{dbUser?.totalPoints || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Идиом создано</span>
                <span className="stat-value">{myIdioms?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content-divider">
          <h3 className="section-title">Мои идиомы</h3>
          <div className="divider-line"></div>
        </div>

        <div className="idioms-grid">
          {myIdioms && myIdioms.length > 0 ? (
            myIdioms.map((idiom) => (
              <IdiomCard 
                key={idiom._id} 
                idiom={idiom} 
                currentUserId={user?.sub} 
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="no-data-message">
              <p>Ваша коллекция пока пуста.</p>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Profile;