# 🎡 SoftIto Öğrenci Eşleştirme Çarkı

Bu proje, sınıf içi etkinlikler, proje grupları veya soru-cevap seansları için öğrencileri rastgele, adil ve eğlenceli bir şekilde ikişerli olarak eşleştirmek amacıyla geliştirilmiş modern bir React + Vite web uygulamasıdır.

Uygulama, tamamen bağımsız (Tailwind CSS gibi harici çerçevelere ihtiyaç duymayan) özel bir Vanilla CSS tasarım sistemine, sentezlenmiş ses efektlerine ve performans dostu kutlama animasyonlarına sahiptir.

---

## ✨ Özellikler

- **🎯 Çift Aşamalı Seçim Akışı:** "Çarkı Çevir" butonuna basıldığında çark sırayla döner; önce birinci öğrenciyi, ardından otomatik olarak ikinci öğrenciyi seçer. Eşleşme tamamlandığında bu iki öğrenci çarktan kalıcı olarak çıkartılır.
- **🎨 Premium Vanilla CSS Tasarımı:** Koyu tema (Dark Mode) üzerine kurulu, neon mor/pembe/sarı renk paletine sahip, modern cam efekti (glassmorphic) kullanan pürüzsüz arayüz.
- **🔊 Sentezlenmiş Ses Efektleri:** Harici hiçbir ses dosyasına ihtiyaç duymadan, tarayıcının **Web Audio API** arayüzü kullanılarak gerçek zamanlı sentezlenen çark dönme tıkırtısı (tick) ve eşleşme tebrik melodisi. İstenildiğinde ses tamamen kapatılabilir.
- **🎉 Canvas Konfeti Animasyonu:** Eşleşme sağlandığı an ekranda patlayan, HTML5 Canvas ile çizilen yüksek performanslı konfeti parçacık efektleri.
- **💾 Kalıcı Hafıza (LocalStorage):** Kalan öğrenci listesi, yapılan eşleşmelerin geçmişi ve ses ayarı tarayıcı kapansa bile korunur.
- **↩️ Eşleşmeyi Geri Alma:** Yapılan bir eşleşme iptal edilerek öğrenciler tekrar aktif çark havuzuna dahil edilebilir.
- **✏️ Öğrenci Listesi Düzenleyici:** Liste düzenleme penceresi sayesinde isim listesi hızlıca güncellenebilir. İsimlerin başındaki numaralar otomatik olarak temizlenir.
- **📱 Mobil Uyumlu Tasarım:** Farklı ekran boyutlarına göre kendini mükemmel şekilde ölçeklendiren duyarlı yerleşim yapısı.

---

## 📁 Proje Klasör Yapısı

```
student_match/
├── src/
│   ├── components/
│   │   ├── Confetti.jsx       # Canvas konfeti kutlama efekti
│   │   ├── MatchCard.jsx      # Eşleşme sonucunu gösteren modal kartı
│   │   └── Wheel.jsx          # SVG tabanlı dinamik dönen çark
│   ├── utils/
│   │   └── SoundManager.js    # Web Audio API ses sentezleyici motoru
│   ├── App.jsx                # Ana uygulama ve state yönetimi
│   ├── index.css              # Özel tasarım sistemi ve görsel tanımlamalar
│   └── main.jsx               # React başlangıç noktası
├── isimler.md                 # Orijinal öğrenci listesi verisi
├── index.html                 # HTML şablonu (SEO ve meta ayarları ile)
├── package.json               # Bağımlılıklar ve komutlar
└── vite.config.js             # Vite yapılandırması
```

---

## 🚀 Başlangıç

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1. Bağımlılıkları Yükleyin
Proje dizininde terminali açıp aşağıdaki komutu çalıştırın:
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın
Uygulamayı yerel olarak test etmek için yerel sunucuyu ayağa kaldırın:
```bash
npm run dev
```
Sunucu başladığında terminalde gösterilen adrese (genellikle `http://localhost:5173/`) tarayıcınızdan gidin.

### 3. Tarayıcı İçin Üretim Derlemesi Alın
Uygulamayı canlıya (production) hazırlamak için derleme komutunu çalıştırabilirsiniz:
```bash
npm run build
```
Oluşan dosyalar `dist/` klasörüne aktarılacaktır.

---

## 🛠️ Kullanılan Teknolojiler

- **React 19** - Bileşen tabanlı kullanıcı arayüzü yönetimi
- **Vite 8** - Hızlı derleme ve geliştirme ortamı
- **Web Audio API** - Sentetik ses üretimi ve kontrolü
- **HTML5 Canvas** - Konfeti animasyon çizimleri
- **SVG (Scalable Vector Graphics)** - Matematiksel ve piksel kaybı olmayan çark görselleştirmesi
