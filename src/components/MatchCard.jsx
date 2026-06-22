
const MatchCard = ({
  title,
  subTitle,
  label1 = "Öğrenci 1",
  label2 = "Öğrenci 2",
  label3 = "Öğrenci 3",
  val1,
  val2,
  val3,
  isComplete,
  onAccept
}) => {
  if (!val1 && !val2 && !val3) return null;

  const isThreeWay = val3 !== undefined;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: isThreeWay ? '650px' : '550px' }}>
        
        <h2 className="match-modal-title" style={{ textAlign: 'center' }}>
          {title || (isComplete ? '✨ Harika Eşleşme! ✨' : '🎯 Seçim Yapılıyor...')}
        </h2>
        
        <p className="modal-desc" style={{ textAlign: 'center' }}>
          {subTitle || (isComplete 
            ? (isThreeWay ? 'Bu üç öğrenci başarıyla eşleştirildi ve çarktan çıkarıldı.' : 'Bu iki öğrenci başarıyla eşleştirildi ve çarktan çıkarıldı.')
            : 'Çark bir sonraki şanslı öğrenciyi seçiyor...')}
        </p>

        <div className="match-boxes-container">
          <div className={`match-student-box ${val1 ? 'active-p1' : ''}`}>
            <span className="match-box-label lbl-p1">{label1}</span>
            <div className="match-box-name">
              {val1 || 'Seçiliyor...'}
            </div>
          </div>

          <div className={`match-connector ${isComplete ? 'complete' : ''}`}>
            {isThreeWay ? '🔗' : '🤝'}
          </div>

          <div className={`match-student-box ${val2 ? 'active-p2' : ''}`}>
            <span className="match-box-label lbl-p2">{label2}</span>
            <div className="match-box-name">
              {val2 || 'Bekleniyor...'}
            </div>
          </div>

          {isThreeWay && (
            <>
              <div className={`match-connector ${isComplete ? 'complete' : ''}`}>
                🔗
              </div>

              <div className={`match-student-box ${val3 ? 'active-p3' : ''}`}>
                <span className="match-box-label lbl-p3">{label3}</span>
                <div className="match-box-name">
                  {val3 || 'Bekleniyor...'}
                </div>
              </div>
            </>
          )}
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
