import React from 'react';

const MatchCard = ({ student1, student2, isComplete, onAccept }) => {
  if (!student1 && !student2) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '550px' }}>
        
        <h2 className="match-modal-title" style={{ textAlign: 'center' }}>
          {isComplete ? '✨ Harika Eşleşme! ✨' : '🎯 Seçim Yapılıyor...'}
        </h2>
        
        <p className="modal-desc" style={{ textAlign: 'center' }}>
          {isComplete 
            ? 'Bu iki öğrenci başarıyla eşleştirildi ve çarktan çıkarıldı.' 
            : 'Çark bir sonraki şanslı öğrenciyi seçiyor...'}
        </p>

        <div className="match-boxes-container">
          <div className={`match-student-box ${student1 ? 'active-p1' : ''}`}>
            <span className="match-box-label lbl-p1">Öğrenci 1</span>
            <div className="match-box-name">
              {student1 || 'Seçiliyor...'}
            </div>
          </div>

          <div className={`match-connector ${isComplete ? 'complete' : ''}`}>
            🤝
          </div>

          <div className={`match-student-box ${student2 ? 'active-p2' : ''}`}>
            <span className="match-box-label lbl-p2">Öğrenci 2</span>
            <div className="match-box-name">
              {student2 || 'Bekleniyor...'}
            </div>
          </div>
        </div>

        {isComplete && (
          <button
            onClick={onAccept}
            className="btn btn-accept-match"
          >
            Tamam
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
