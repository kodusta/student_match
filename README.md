# 🎡 SoftIto Akademi Eşleştirme & Sektör Dağıtım Çarkı

Bu proje, sınıf içi etkinliklerde öğrencileri ikişerli gruplara eşleştirmek ve ardından oluşan bu gruplara rastgele proje sektörleri atamak amacıyla geliştirilmiş modern bir React + Vite web uygulamasıdır.

Uygulama, tamamen bağımsız (Tailwind CSS gibi harici çerçevelere ihtiyaç duymayan) özel bir Vanilla CSS tasarım sistemine, sentetik ses efektlerine ve performans dostu kutlama animasyonlarına sahiptir.

---

## ✨ Özellikler

Sayfaya girer girmez her iki çark paneli de yan yana görüntülenir ve tamamen bağımsız olarak çalışır:

### 👥 1. Öğrenci Eşleştirme Paneli (Sol)
- **Çift Aşamalı Seçim Akışı:** Çark sırayla döner; önce birinci öğrenciyi, ardından otomatik olarak ikinci öğrenciyi seçer.
- **Listeden Çıkarma:** Eşleşen öğrenciler çarktan ve kalanlar listesinden çıkarılarak "Yapılan Eşleşmeler" listesine aktarılır.
- **Geri Alma:** İptal edilen eşleşmelerdeki öğrenciler tekrar çarka dahil edilebilir.

### 🎯 2. Proje Sektörü Dağıtımı Paneli (Sağ)
- **Tek Aşamalı Sektör Seçimi:** Sıradaki grup için çark bir kez döner ve kalan sektörlerden birini rastgele seçerek o gruba atar.
- **Eşleşmelerden Yükleme:** Öğrenci Eşleştirme panelinde oluşan gruplar, tek tıkla doğrudan Sektör Dağıtımı panelinin grup listesine aktarılabilir.
- **Listeden Çıkarma:** Atanan sektör çarktan ve kalan sektörler listesinden çıkarılır.

### 🛠️ Ortak Özellikler
- **Premium Vanilla CSS Tasarımı:** Koyu tema, yan yana 2 sütunlu masaüstü yerleşimi, neon mor/pembe/sarı gradyan geçişleri ve cam efekti (glassmorphism) kullanan pürüzsüz arayüz.
- **Sentezlenmiş Ses Efektleri:** Web Audio API kullanılarak sentezlenen çark dönme tıkırtısı ve eşleşme tebrik melodisi.
- **Canvas Konfeti Animasyonu:** Eşleşme sağlandığında patlayan, HTML5 Canvas ile çizilen yüksek performanslı konfeti parçacık efektleri.
- **Kalıcı Hafıza (LocalStorage):** Tüm listeler, atamalar ve ses ayarı tarayıcı kapansa dahi korunur.
- **Listeleri Düzenleme:** Öğrenci veya grup listeleri manuel olarak düzenlenebilir. İsimlerin başındaki numaralar otomatik temizlenir.

---

## 🚀 Başlangıç

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Yerel sunucu başladığında `http://localhost:5173/` adresine tarayıcınızdan gidin.

### 3. Üretim Derlemesi Alın
```bash
npm run build
```

---

## 🛠️ Kullanılan Teknolojiler

- **React 19** - Kullanıcı arayüzü yönetimi
- **Vite 8** - Hızlı derleme ve geliştirme ortamı
- **Web Audio API** - Sentetik ses üretimi ve kontrolü
- **HTML5 Canvas** - Konfeti animasyon çizimleri
- **SVG (Scalable Vector Graphics)** - Matematiksel ve dinamik çark çizimi
