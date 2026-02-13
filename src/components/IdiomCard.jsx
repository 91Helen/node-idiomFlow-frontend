import React from 'react';

const IdiomCard = ({ idiom, onDelete, currentUserId }) => {
  const isOwner = idiom.userId === currentUserId;

  return (
    <div className="idiom-card">
      <div className="idiom-image-wrapper">
        <img 
          src={idiom.imageUrl} 
          alt={idiom.phrase} 
          className="idiom-img"
        />
        <div className="idiom-badge">{idiom.category}</div>
      </div>
      
      <div className="idiom-main-content">
        <h3 className="idiom-title">{idiom.phrase}</h3>
        <p className="idiom-text"><strong>Meaning:</strong> {idiom.meaning}</p>
        <p className="idiom-example"><em>"{idiom.example}"</em></p>
      </div>

      {isOwner && (
        <div className="idiom-footer">
          <div className="spacer"></div>
          <button className="delete-btn" onClick={() => onDelete(idiom._id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default IdiomCard;
