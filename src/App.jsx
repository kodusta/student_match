import { useState, useEffect } from 'react';
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

const DEFAULT_SECTORS = [
  "Yapay Zeka Destekli Kişisel Asistan",
  "Siber Güvenlik / Şifre Kasası",
  "Fintech / Kişisel Bütçe ve Yatırım Takibi",
  "Oyunlaştırılmış Alışkanlık & Görev Yöneticisi",
  "Akıllı Ev Otomasyonu IoT Kontrol Paneli",
  "NFT ve Dijital Sanat Pazaryeri",
  "Evcil Hayvan Sağlık & Veteriner Randevu Portalı",
  "Gönüllülük Ağı ve Sosyal Sorumluluk Platformu"
];

const DEFAULT_GROUPS = [
  "Grup 1", "Grup 2", "Grup 3", "Grup 4", "Grup 5", "Grup 6",
  "Grup 7", "Grup 8"
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

  const [sectors, setSectors] = useState(() => {
    const saved = localStorage.getItem('wheel_sectors');
    return saved ? JSON.parse(saved) : DEFAULT_SECTORS;
  });

  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('wheel_groups');
    return saved ? JSON.parse(saved) : DEFAULT_GROUPS;
  });

  const [groupSectors, setGroupSectors] = useState(() => {
    const saved = localStorage.getItem('wheel_group_sectors');
    return saved ? JSON.parse(saved) : [];
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('wheel_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [studentSpinning, setStudentSpinning] = useState(false);
  const [sectorSpinning, setSectorSpinning] = useState(false);
  const [spinStage, setSpinStage] = useState(0); 
  
  const [studentTargetIndex, setStudentTargetIndex] = useState(-1);
  const [sectorTargetIndex, setSectorTargetIndex] = useState(-1);
  
  const [student1, setStudent1] = useState(null);
  const [student2, setStudent2] = useState(null);

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalType, setEditModalType] = useState('students'); 
  const [editModalText, setEditModalText] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('wheel_names', JSON.stringify(names));
  }, [names]);

  useEffect(() => {
    localStorage.setItem('wheel_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('wheel_sectors', JSON.stringify(sectors));
  }, [sectors]);

  useEffect(() => {
    localStorage.setItem('wheel_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('wheel_group_sectors', JSON.stringify(groupSectors));
  }, [groupSectors]);

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

  const startStudentMatching = () => {
    if (studentSpinning || sectorSpinning) return;
    if (names.length < 3) {
      triggerNotification("Eşleştirme yapabilmek için çarkta en az 3 öğrenci olmalıdır!", "error");
      return;
    }
    setStudent1(null);
    setStudent2(null);
    setShowConfetti(false);
    
    const index = Math.floor(Math.random() * names.length);
    setStudentTargetIndex(index);
    setSpinStage(1);
    setStudentSpinning(true);
  };

  const startSectorAssignment = () => {
    if (studentSpinning || sectorSpinning) return;
    if (groupSectors.length >= groups.length) {
      triggerNotification("Tüm gruplara sektör atandı!", "error");
      return;
    }
    if (sectors.length === 0) {
      triggerNotification("Dağıtılacak sektör kalmadı!", "error");
      return;
    }
    setShowConfetti(false);

    const index = Math.floor(Math.random() * sectors.length);
    setSectorTargetIndex(index);
    setSpinStage(4); 
    setSectorSpinning(true);
  };

  const handleStudentSpinComplete = () => {
    if (spinStage === 1) {
      const selectedStudent1 = names[studentTargetIndex];
      setStudent1(selectedStudent1);
      const remainingNames = names.filter(n => n !== selectedStudent1);
      
      setTimeout(() => {
        const index2 = Math.floor(Math.random() * remainingNames.length);
        const originalIndex2 = names.indexOf(remainingNames[index2]);
        setStudentTargetIndex(originalIndex2);
        setSpinStage(2);
        setStudentSpinning(true);
      }, 1500);

    } else if (spinStage === 2) {
      const selectedStudent2 = names[studentTargetIndex];
      setStudent2(selectedStudent2);
      const remainingNames = names.filter(n => n !== student1 && n !== selectedStudent2);
      
      setTimeout(() => {
        const index3 = Math.floor(Math.random() * remainingNames.length);
        const originalIndex3 = names.indexOf(remainingNames[index3]);
        setStudentTargetIndex(originalIndex3);
        setSpinStage(3);
        setStudentSpinning(true);
      }, 1500);

    } else if (spinStage === 3) {
      const selectedStudent3 = names[studentTargetIndex];
      setStudentSpinning(false);
      setSpinStage(0);
      
      setModalData({
        title: "✨ Harika Eşleşme! ✨",
        subTitle: "Bu üç öğrenci başarıyla eşleştirildi ve çarktan çıkarıldı.",
        label1: "Öğrenci 1",
        label2: "Öğrenci 2",
        label3: "Öğrenci 3",
        val1: student1,
        val2: student2,
        val3: selectedStudent3,
        type: 'student'
      });
      
      setShowConfetti(true);
      soundManager.playSuccess();
      setShowMatchModal(true);
    }
  };

  const handleSectorSpinComplete = () => {
    if (spinStage === 4) {
      const selSector = sectors[sectorTargetIndex];
      setSectorSpinning(false);
      setSpinStage(0);
      
      setModalData({
        title: "🎯 Proje Sektörü Atandı! 🎯",
        subTitle: "Grup için rastgele sektör seçildi ve çarktan kaldırıldı.",
        label1: "Grup",
        label2: "Proje Sektörü",
        val1: groups[groupSectors.length],
        val2: selSector,
        type: 'sector'
      });
      
      setShowConfetti(true);
      soundManager.playSuccess();
      setShowMatchModal(true);
    }
  };

  const acceptModalMatch = () => {
    if (!modalData) return;

    if (modalData.type === 'student') {
      const newMatch = {
        id: Date.now(),
        p1: modalData.val1,
        p2: modalData.val2,
        p3: modalData.val3,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMatches(prev => [newMatch, ...prev]);
      setNames(prev => prev.filter(name => name !== modalData.val1 && name !== modalData.val2 && name !== modalData.val3));
      setStudent1(null);
      setStudent2(null);
      triggerNotification("Eşleşme kaydedildi ve öğrenciler çarktan çıkarıldı.", "success");
    } else {
      const newGroupSector = {
        id: Date.now(),
        group: modalData.val1,
        sector: modalData.val2,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setGroupSectors(prev => [newGroupSector, ...prev]);
      setSectors(prev => prev.filter(s => s !== modalData.val2));
      triggerNotification("Grup sektörü başarıyla atandı ve sektör çarktan çıkarıldı.", "success");
    }
    
    setShowMatchModal(false);
    setShowConfetti(false);
    setModalData(null);
  };

  const undoStudentMatch = (matchId) => {
    const matchToUndo = matches.find(m => m.id === matchId);
    if (!matchToUndo) return;
    setNames(prev => {
      const updated = [...prev];
      if (!updated.includes(matchToUndo.p1)) updated.push(matchToUndo.p1);
      if (!updated.includes(matchToUndo.p2)) updated.push(matchToUndo.p2);
      if (!updated.includes(matchToUndo.p3)) updated.push(matchToUndo.p3);
      return updated;
    });
    setMatches(prev => prev.filter(m => m.id !== matchId));
    triggerNotification(`${matchToUndo.p1}, ${matchToUndo.p2} & ${matchToUndo.p3} üçlüsü tekrar çarka eklendi.`, "info");
  };

  const undoSectorAssignment = (matchId) => {
    const matchToUndo = groupSectors.find(m => m.id === matchId);
    if (!matchToUndo) return;
    setSectors(prev => {
      const updated = [...prev];
      if (!updated.includes(matchToUndo.sector)) updated.push(matchToUndo.sector);
      return updated;
    });
    setGroupSectors(prev => prev.filter(m => m.id !== matchId));
    triggerNotification(`${matchToUndo.group} için atanan ${matchToUndo.sector} sektörü iptal edildi.`, "info");
  };

  const resetStudents = () => {
    if (window.confirm("Öğrenci listesini ve eşleşmeleri sıfırlamak istiyor musunuz?")) {
      setNames(DEFAULT_NAMES);
      setMatches([]);
      setStudent1(null);
      setStudent2(null);
      setShowMatchModal(false);
      setShowConfetti(false);
      triggerNotification("Öğrenci eşleştirme sistemi sıfırlandı.", "info");
    }
  };

  const resetSectors = () => {
    if (window.confirm("Sektör dağılımlarını ve çarktaki sektörleri sıfırlamak istiyor musunuz?")) {
      setSectors(DEFAULT_SECTORS);
      setGroupSectors([]);
      setShowMatchModal(false);
      setShowConfetti(false);
      triggerNotification("Sektör dağıtım sistemi sıfırlandı.", "info");
    }
  };

  const openEditModal = (type) => {
    setEditModalType(type);
    if (type === 'students') {
      const text = names.map((name, i) => `${i + 1} ${name}`).join('\n');
      setEditModalText(text);
    } else {
      const text = groups.map((g, i) => `${i + 1} ${g}`).join('\n');
      setEditModalText(text);
    }
    setShowEditModal(true);
  };

  const saveEditedList = () => {
    const parsed = editModalText
      .split('\n')
      .map(line => line.replace(/^\d+\s*/, '').trim())
      .filter(item => item.length > 0);

    if (parsed.length === 0) {
      alert("En az 1 geçerli öğe yazılmalıdır!");
      return;
    }

    if (editModalType === 'students') {
      setNames(parsed);
      triggerNotification(`Öğrenci listesi güncellendi (${parsed.length} öğrenci).`, "success");
    } else {
      setGroups(parsed);
      setGroupSectors([]);
      triggerNotification(`Grup listesi güncellendi (${parsed.length} grup). Dağıtımlar sıfırlandı.`, "success");
    }
    setShowEditModal(false);
  };

  const importGroupsFromMatches = () => {
    if (matches.length === 0) {
      triggerNotification("Henüz yapılmış bir öğrenci eşleşmesi bulunmuyor!", "error");
      return;
    }
    const imported = matches.map((m, i) => `Grup ${i + 1} (${m.p1} & ${m.p2} & ${m.p3})`);
    setGroups(imported);
    setGroupSectors([]);
    triggerNotification(`${imported.length} adet grup eşleşmelerden başarıyla yüklendi!`, "success");
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Confetti active={showConfetti} />

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
            <h1 className="title-main">SoftIto Akademi Çark Sistemi</h1>
            <p className="subtitle-main">Grup Eşleştirme & Proje Sektörü Dağıtımı</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn btn-icon"
            title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="app-container">
        
        {/* Panel 1: Öğrenci Eşleştirme */}
        <section className="panel wheel-section">
          <div className="panel-header-section">
            <h2 className="panel-main-title">👥 Öğrenci Eşleştirme</h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={() => openEditModal('students')} className="btn btn-edit">✏️ Düzenle</button>
              <button onClick={resetStudents} className="btn btn-danger">🔄 Sıfırla</button>
              <div className="panel-badge">Kalan: <span>{names.length}</span></div>
            </div>
          </div>

          <div className="wheel-inner-wrapper">
            <Wheel
              names={names}
              spinning={studentSpinning}
              targetIndex={studentTargetIndex}
              onSpinComplete={handleStudentSpinComplete}
              size={320}
            />
          </div>

          <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
            <button
              onClick={startStudentMatching}
              disabled={studentSpinning || sectorSpinning || names.length < 3}
              className="btn btn-spin"
            >
              {studentSpinning 
                ? (spinStage === 1 ? '1. Öğrenci Seçiliyor...' : spinStage === 2 ? '2. Öğrenci Seçiliyor...' : '3. Öğrenci Seçiliyor...') 
                : '🎡 Çarkı Çevir & Eşleştir'}
            </button>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontWeight: 500 }}>
              Çark sırayla üç kişiyi seçer, eşleştirir ve havuzdan çıkarır.
            </p>
          </div>

          <div className="panel-split">
            <div className="split-list-panel">
              <h3 className="split-title">Çarktaki Öğrenciler ({names.length})</h3>
              <div className="student-chips-container">
                {names.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '100%', padding: '1rem 0' }}>Kalan yok.</p>
                ) : (
                  names.map((name, i) => (
                    <span key={i} className="student-chip">{name}</span>
                  ))
                )}
              </div>
            </div>

            <div className="split-list-panel">
              <h3 className="split-title">
                <span>Yapılan Eşleşmeler ({matches.length})</span>
                {matches.length > 0 && (
                  <button onClick={() => { if (window.confirm("Eşleşmeleri temizlemek istiyor musunuz?")) setMatches([]); }} className="btn-clear-history">Temizle</button>
                )}
              </h3>
              <div className="history-list">
                {matches.length === 0 ? (
                  <div className="history-empty">
                    <span className="history-empty-icon">📋</span>
                    <p style={{ fontSize: '0.75rem' }}>Eşleşme yok.</p>
                  </div>
                ) : (
                  matches.map((match) => (
                    <div key={match.id} className="match-item">
                      <div className="match-details">
                        <div className="match-names">
                          <span className="name-p1">{match.p1}</span>
                          <span className="match-vs">,</span>
                          <span className="name-p2">{match.p2}</span>
                          <span className="match-vs">ve</span>
                          <span className="name-p3">{match.p3}</span>
                        </div>
                        <span className="match-time">{match.time}</span>
                      </div>
                      <button onClick={() => undoStudentMatch(match.id)} className="btn-undo">↩️</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Panel 2: Sektör Dağıtımı */}
        <section className="panel wheel-section">
          <div className="panel-header-section">
            <h2 className="panel-main-title" style={{ background: 'linear-gradient(to right, #ec4899, #f59e0b)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              🎯 Proje Sektörü Dağıtımı
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {matches.length > 0 && (
                <button onClick={importGroupsFromMatches} className="btn btn-edit" style={{ borderColor: 'rgba(139,92,246,0.3)', color: '#c084fc' }}>Eşleşmelerden Yükle</button>
              )}
              <button onClick={() => openEditModal('groups')} className="btn btn-edit">✏️ Düzenle</button>
              <button onClick={resetSectors} className="btn btn-danger">🔄 Sıfırla</button>
              <div className="panel-badge badge-sectors">Kalan: <span>{sectors.length}</span></div>
            </div>
          </div>

          <div className="wheel-inner-wrapper">
            <Wheel
              names={sectors}
              spinning={sectorSpinning}
              targetIndex={sectorTargetIndex}
              onSpinComplete={handleSectorSpinComplete}
              size={320}
            />
          </div>

          <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
            {groupSectors.length < groups.length && (
              <div className="current-group-badge">
                Sıradaki Grup: <span>{groups[groupSectors.length]}</span>
              </div>
            )}
            <button
              onClick={startSectorAssignment}
              disabled={studentSpinning || sectorSpinning || groupSectors.length >= groups.length || sectors.length === 0}
              className="btn btn-spin"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #f59e0b 100%)', boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)' }}
            >
              {sectorSpinning ? 'Sektör Seçiliyor...' : '🎯 Çevir & Sektör Ata'}
            </button>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontWeight: 500 }}>
              Sıradaki gruba rastgele proje konusu atar ve sektörü havuzdan çıkarır.
            </p>
          </div>

          <div className="panel-split">
            <div className="split-list-panel">
              <h3 className="split-title">Dağıtılacak Gruplar ({groups.length})</h3>
              <div className="student-chips-container">
                {groups.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '100%', padding: '1rem 0' }}>Grup yok.</p>
                ) : (
                  groups.map((g, i) => {
                    const isAssigned = groupSectors.some(gs => gs.group === g);
                    return (
                      <span 
                        key={i} 
                        className="student-chip"
                        style={{
                          opacity: isAssigned ? 0.35 : 1,
                          textDecoration: isAssigned ? 'line-through' : 'none',
                          borderColor: isAssigned ? 'transparent' : 'rgba(255,255,255,0.08)'
                        }}
                      >
                        {g}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            <div className="split-list-panel">
              <h3 className="split-title">
                <span>Atanan Konular ({groupSectors.length})</span>
                {groupSectors.length > 0 && (
                  <button onClick={() => { if (window.confirm("Atamaları temizlemek istiyor musunuz?")) setGroupSectors([]); }} className="btn-clear-history">Temizle</button>
                )}
              </h3>
              <div className="history-list">
                {groupSectors.length === 0 ? (
                  <div className="history-empty">
                    <span className="history-empty-icon">🎯</span>
                    <p style={{ fontSize: '0.75rem' }}>Atama yok.</p>
                  </div>
                ) : (
                  groupSectors.map((gs) => (
                    <div key={gs.id} className="match-item">
                      <div className="match-details">
                        <div className="match-names">
                          <span className="name-p1">{gs.group}</span>
                          <span className="match-vs">➜</span>
                          <span className="name-p2" style={{ color: '#fbbf24' }}>{gs.sector}</span>
                        </div>
                        <span className="match-time">{gs.time}</span>
                      </div>
                      <button onClick={() => undoSectorAssignment(gs.id)} className="btn-undo">↩️</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Celebration Modal Overlay */}
      {showMatchModal && modalData && (
        <MatchCard
          title={modalData.title}
          subTitle={modalData.subTitle}
          label1={modalData.label1}
          label2={modalData.label2}
          label3={modalData.label3}
          val1={modalData.val1}
          val2={modalData.val2}
          val3={modalData.val3}
          isComplete={true}
          onAccept={acceptModalMatch}
        />
      )}

      {/* Edit List Modal */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="modal-title">
              ✏️ {editModalType === 'students' ? 'Öğrenci Listesini Düzenle' : 'Grup Listesini Düzenle'}
            </h3>
            <p className="modal-desc">
              Her satıra bir tane yazın. Numaralar otomatik temizlenecektir.
            </p>
            
            <textarea
              value={editModalText}
              onChange={(e) => setEditModalText(e.target.value)}
              className="textarea-input"
              placeholder={editModalType === 'students' ? "Örnek:\n1 Ahmet Yılmaz\n2 Mehmet Kaya" : "Örnek:\n1 Grup 1 (Ahmet & Mehmet)\n2 Grup 2 (Ayşe & Fatma)"}
            />
            
            <div className="modal-footer">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-modal-cancel"
              >
                İptal
              </button>
              <button
                onClick={saveEditedList}
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
