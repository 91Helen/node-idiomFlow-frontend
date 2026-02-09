import { useState } from 'react';
import { useAddIdiomMutation } from '../features/apiSlice';
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-hot-toast'; 

const AddIdiom = () => {
  const [phrase, setPhrase] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [category, setCategory] = useState('General');
  const [imageUrl, setImageUrl] = useState('');

  const { getAccessTokenSilently, user } = useAuth0(); 
  const [addIdiom, { isLoading }] = useAddIdiomMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!phrase || !meaning) {
      return toast.error('Заполни основные поля!', {
        icon: '⚠️',
      });
    }

   
    const saveIdiom = async () => {
      const token = await getAccessTokenSilently();
      
      const newIdiomData = {
        phrase,
        meaning,
        example,
        category,
        imageUrl: imageUrl || 'https://placehold.co/400',
        userId: user?.sub,
        isPublic: true 
      };

 
      return await addIdiom({ 
        body: newIdiomData, 
        token 
      }).unwrap();
    };

  
    toast.promise(saveIdiom(), {
      loading: 'Сохраняем идиому в базу...',
      success: () => {
       
        setPhrase(''); 
        setMeaning(''); 
        setExample(''); 
        setImageUrl('');
        return <b>Успешно сохранено! 🎉</b>;
      },
      error: (err) => {
        console.error('Ошибка:', err);
        return <b>Ошибка при сохранении! 😕</b>;
      },
    }, {
       
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
    });
  };

  return (
    <div className="add-idiom-container">
      <h3 className="add-idiom-title">🆕 Добавить новую идиому</h3>
      <form onSubmit={handleSubmit} className="add-idiom-form">
        <input 
          className="add-idiom-input"
          placeholder="Сама идиома (напр. Break a leg)" 
          value={phrase} 
          onChange={(e) => setPhrase(e.target.value)} 
        />
        <input 
          className="add-idiom-input"
          placeholder="Значение (Удачи)" 
          value={meaning} 
          onChange={(e) => setMeaning(e.target.value)} 
        />
        <textarea 
          className="add-idiom-textarea"
          placeholder="Пример использования" 
          value={example} 
          onChange={(e) => setExample(e.target.value)} 
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            className="add-idiom-input"
            style={{ flex: 1 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {['General', 'Slang', 'Business', 'Food', 'Emotion', 'Health', 'Work'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input 
            className="add-idiom-input"
            style={{ flex: 2 }}
            placeholder="URL картинки" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
          />
        </div>

        <button 
          type="submit" 
          className="add-idiom-button"
          disabled={isLoading}
        >
          {isLoading ? 'Секундочку...' : 'Сохранить в базу'}
        </button>
      </form>
    </div>
  );
};

export default AddIdiom;