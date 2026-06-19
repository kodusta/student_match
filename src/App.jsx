import React, { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import MatchCard from './components/MatchCard';
import Confetti from './components/Confetti';
import { soundManager } from './utils/SoundManager';

const DEFAULT_NAMES = [
  "Onur Baha Koç",
  "Berke Karakuş",
  "Muhammet Görkem İskeçeli",
  "Beyza Mensur",
  "Merve Daşçi",
  "Berivan Alpagu",
  "Hale Alacan",
  "Aslınur Gündüzalp",
  "Ezgi Kuzu",
  "Ünal Öztürk",
  "Eren Akarsu",
  "Okan Şahin",
  "Ahsen Dinler",
  "Ayşenur Akgün",
  "Furkan Yorulmaz",
  "Aygen Yıldırım",
  "Berna Nur İlbaş",
  "Esra Sağın",
  "Deniz Çaylı",
  "Dilek İnce",
  "Sinem Doğan",
  "Sudenaz Sangür",
  "Aslı Yaren Bahşi",
  "Ali Yanar"
];

function App() {
  const [names, setNames] = useState(() => {
    const saved = localStorage.getItem('wheel_names');
    return saved ? JSON.parse(saved) : DEFAULT_NAMES;
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('wheel_matches');
    return saved ? JSON.parse(saved) : [];
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('wheel_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [spinning, setSpinning] = useState(false);
  const [spinStage, setSpinStage] = useState(0); 
  const [targetIndex, setTargetIndex] = useState(-1);
  const [student1, setStudent1] = useState(null);
  const [student2, setStudent2] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNamesText, setEditNamesText] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('wheel_names', JSON.stringify(names));
  }, [names]);

  useEffect(() => {
    localStorage.setItem('wheel_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('wheel_sound', JSON.stringify(soundEnabled));
    soundManager.toggle(soundEnabled);
  }, [soundEnabled]);

  const triggerNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const startMatching = () => {
    if (spinning) return;
    
    if (names.length < 2) {
      triggerNotification("Eşleştirme yapabilmek için çarkta en az 2 öğrenci olmalıdır!", "error");
      return;
    }

    setStudent1(null);
    setStudent2(null);
    setShowConfetti(false);
    
    const index1 = Math.floor(Math.random() * names.length);
    setTargetIndex(index1);
    setSpinStage(1);
    setSpinning(true);
  };

  const handleSpinComplete = () => {
    if (spinStage === 1) {
      const selectedStudent1 = names[targetIndex];
      setStudent1(selectedStudent1);
      
      const remainingNames = names.filter(n => n !== selectedStudent1);
      
      setTimeout(() => {
        const index2 = Math.floor(Math.random() * remainingNames.length);
        const originalIndex2 = names.indexOf(remainingNames[index2]);
        
        setTargetIndex(originalIndex2);
        setSpinStage(2);
        setSpinning(true);
      }, 1500);

    } else if (spinStage === 2) {
      const selectedStudent2 = names[targetIndex];
      setStudent2(selectedStudent2);
      
      setSpinning(false);
      setSpinStage(0);
      setShowConfetti(true);
      soundManager.playSuccess();
      setShowMatchModal(true);
    }
  };

  const acceptMatch = () => {
    if (!student1 || !student2) return;

    const newMatch = {
      id: Date.now(),
      p1: student1,
      p2: student2,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMatches(prev => [newMatch, ...prev]);
    setNames(prev => prev.filter(name => name !== student1 && name !== student2));
    
    setStudent1(null);
    setStudent2(null);
    setShowMatchModal(false);
    setShowConfetti(false);
    
    triggerNotification("Eşleşme başarıyla kaydedildi ve öğrenciler listeden çıkarıldı.", "success");
  };

  const undoMatch = (matchId) => {
    const matchToUndo = matches.find(m => m.id === matchId);
    if (!matchToUndo) return;

    setNames(prev => {
      const updated = [...prev];
      if (!updated.includes(matchToUndo.p1)) updated.push(matchToUndo.p1);
      if (!updated.includes(matchToUndo.p2)) updated.push(matchToUndo.p2);
      return updated;
    });

    setMatches(prev => prev.filter(m => m.id !== matchId));
    triggerNotification(`${matchToUndo.p1} & ${matchToUndo.p2} çifti tekrar çarka eklendi.`, "info");
  };

  const resetAll = () => {
    if (window.confirm("Tüm eşleşmeleri sıfırlamak ve ilk listeyi geri yüklemek istediğinize emin misiniz?")) {
      setNames(DEFAULT_NAMES);
      setMatches([]);
      setStudent1(null);
      setStudent2(null);
      setShowMatchModal(false);
      setShowConfetti(false);
      triggerNotification("Sistem tamamen sıfırlandı.", "info");
    }
  };

  const openEditModal = () => {
    const text = names.map((name, i) => `${i + 1} ${name}`).join('\n');
    setEditNamesText(text);
    setShowEditModal(true);
  };

  const saveEditedNames = () => {
    const parsedNames = editNamesText
      .split('\n')
      .map(line => line.replace(/^\d+\s*/, '').trim())
      .filter(name => name.length > 0);

    if (parsedNames.length === 0) {
      alert("En az 1 geçerli isim girilmelidir!");
      return;
    }

    setNames(parsedNames);
    setShowEditModal(false);
    triggerNotification(`Öğrenci listesi güncellendi (${parsedNames.length} öğrenci).`, "success");
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Confetti active={showConfetti} />

      {/* Global Notification Banner */}
      {notification && (
        <div className={`notification-banner ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Top Header */}
      <header className="app-header">
        <div className="logo-section">
          <span className="logo-emoji">🎡</span>
          <div>
            <h1 className="title-main">Öğrenci Eşleştirme Çarkı</h1>
            <p className="subtitle-main">SoftIto Akademi Eşleştirme Sistemi</p>
          </div>
        </div>
        
        <div className="header-actions">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn btn-icon"
            title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          
          <button
            onClick={openEditModal}
            className="btn btn-edit"
          >
            ✏️ Düzenle
          </button>
          
          <button
            onClick={resetAll}
            className="btn btn-danger"
          >
            🔄 Sıfırla
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="app-container">
        
        {/* Left Column: Wheel & Action */}
        <section className="panel wheel-section">
          {/* Active Names Count Badge */}
          <div className="panel-badge">
            👥 Kalan Öğrenci: <span>{names.length}</span>
          </div>

          <div className="wheel-inner-wrapper">
            <Wheel
              names={names}
              spinning={spinning}
              targetIndex={targetIndex}
              onSpinComplete={handleSpinComplete}
            />
          </div>

          {/* Action Spin Button */}
          <div style={{ width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <button
              onClick={startMatching}
              disabled={spinning || names.length < 2}
              className="btn btn-spin"
            >
              {spinning 
                ? (spinStage === 1 ? '1. Öğrenci Seçiliyor...' : '2. Öğrenci Seçiliyor...') 
                : '🎡 Çarkı Çevir & Eşleştir'}
            </button>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontWeight: 500 }}>
              Her çevrimde çark sırayla iki kişiyi seçer ve eşleştirir.
            </p>
          </div>
        </section>

        {/* Right Column: Sidebar (Matches History & Remaining List) */}
        <section className="sidebar-section">
          
          {/* Matches Panel */}
          <div className="panel sidebar-panel" style={{ height: '380px' }}>
            <h2 className="panel-title">
              <span className="panel-title-text">🤝 Yapılan Eşleşmeler ({matches.length})</span>
              {matches.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm("Eşleşme geçmişini temizlemek istiyor musunuz? (Öğrenciler çarka geri eklenmez)")) {
                      setMatches([]);
                      triggerNotification("Eşleşme geçmişi temizlendi.", "info");
                    }
                  }}
                  className="btn-clear-history"
                >
                  Temizle
                </button>
              )}
            </h2>

            <div className="history-list">
              {matches.length === 0 ? (
                <div className="history-empty">
                  <span className="history-empty-icon">📋</span>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Henüz bir eşleşme yapılmadı.</p>
                </div>
              ) : (
                matches.map((match) => (
                  <div key={match.id} className="match-item">
                    <div className="match-details">
                      <div className="match-names">
                        <span className="name-p1">{match.p1}</span>
                        <span className="match-vs">ve</span>
                        <span className="name-p2">{match.p2}</span>
                      </div>
                      <span className="match-time">{match.time}</span>
                    </div>
                    <button
                      onClick={() => undoMatch(match.id)}
                      className="btn-undo"
                      title="Geri Al (Çarka Geri Ekle)"
                    >
                      ↩️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Remaining Student Chips Panel */}
          <div className="panel sidebar-panel" style={{ height: '280px' }}>
            <h2 className="panel-title">
              <span className="panel-title-text">👤 Çarktaki Öğrenciler ({names.length})</span>
            </h2>
            <div className="student-chips-container">
              {names.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '100%', textAlign: 'center', padding: '2rem 0' }}>
                  Kalan öğrenci yok. Çark sıfırlanabilir.
                </p>
              ) : (
                names.map((name, index) => (
                  <span key={index} className="student-chip">
                    {name}
                  </span>
                ))
              )}
            </div>
          </div>

        </section>

      </main>

      {/* Match Announcement Overlay Modal */}
      <MatchCard
        student1={student1}
        student2={student2}
        isComplete={student1 !== null && student2 !== null && !spinning}
        onAccept={acceptMatch}
      />

      {/* Edit Names Modal */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="modal-title">✏️ Öğrenci Listesini Düzenle</h3>
            <p className="modal-desc">Her satıra bir isim yazın. Numaralandırma varsa otomatik temizlenecektir.</p>
            
            <textarea
              value={editNamesText}
              onChange={(e) => setEditNamesText(e.target.value)}
              className="textarea-input"
              placeholder="Örnek:&#10;1 Ahmet Yılmaz&#10;2 Mehmet Kaya"
            />
            
            <div className="modal-footer">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-modal-cancel"
              >
                İptal
              </button>
              <button
                onClick={saveEditedNames}
                className="btn btn-modal-save"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
