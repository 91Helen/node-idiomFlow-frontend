import React, { useState } from 'react';
import { useAddIdiomMutation } from '../features/apiSlice';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-hot-toast'; 

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
      return toast.error('Заполни основные поля!', { icon: '⚠️' });
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

      return await addIdiom({ body: newIdiomData, token }).unwrap();
    };

    toast.promise(saveIdiom(), {
      loading: 'Сохраняем идиому...',
      success: () => {
        setPhrase(''); 
        setMeaning(''); 
        setExample(''); 
        setImageUrl('');
        return <b>Успешно сохранено! 🎉</b>;
      },
      error: () => <b>Ошибка при сохранении! 😕</b>,
    }, {
      
      success: {
        duration: 2000, 
      },
      error: {
        duration: 4000,
      }
    });
  };

  return (
    <div className="add-idiom-container">
      <h3 className="add-idiom-title">🆕 Добавить новую идиому</h3>
      
      <form onSubmit={handleSubmit} className="add-idiom-form">
        <label className="form-label">Фраза</label>
        <input 
          className="add-idiom-input"
          placeholder="Напр. Break a leg" 
          value={phrase} 
          onChange={(e) => setPhrase(e.target.value)} 
        />
        
        <label className="form-label">Значение</label>
        <input 
          className="add-idiom-input"
          placeholder="Удачи" 
          value={meaning} 
          onChange={(e) => setMeaning(e.target.value)} 
        />
        
        <label className="form-label">Пример</label>
        <textarea 
          className="add-idiom-textarea"
          placeholder="I told him to break a leg before the show" 
          value={example} 
          onChange={(e) => setExample(e.target.value)} 
        />
        
        <div className="add-idiom-row">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label className="form-label">Категория</label>
            <select 
              className="add-idiom-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {['General', 'Slang', 'Business', 'Food', 'Emotion', 'Health', 'Work'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label className="form-label">Ссылка на изображение</label>
            <input 
              className="add-idiom-input"
              placeholder="URL картинки" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
            />
          </div>
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
