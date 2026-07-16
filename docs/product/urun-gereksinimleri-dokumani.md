# Ürün Gereksinimleri Dokümanı

## Ürün Adı

Kod Değiştirme İngilizce

## Ürün Amacı

Türkçe bilen kullanıcıların İngilizce cümle kurmayı, hazır çeviri veya kalıp ezberiyle değil, Türkçe cümleyi parçalayıp kodlayarak öğrenmesini sağlamak.

Ürünün merkezindeki işlem:

1. Türkçe cümleyi gör.
2. Cümleyi öğelerine böl.
3. Kelime türlerini ve cümle görevlerini kodla.
4. Türkçedeki gizli veya kısalmış yapıyı aç.
5. İngilizce dizilime taşı.
6. Cümleyi üret.
7. Sesli söyle.
8. Hatanın hangi işlemden kaynaklandığını gör.

## Temel Ürün İlkesi

Uygulama bir çeviri uygulaması değildir. Kullanıcıya ilk adımda İngilizce karşılık verilmez. Kullanıcı önce işlem yapar; uygulama bu işlemi denetler, yönlendirir ve gerekirse hatanın kaynağını açıklar.

## Hedef Kullanıcılar

- İngilizceye sıfırdan başlayan Türkçe bilen yetişkinler
- İngilizce gramer bilen ama cümle kuramayan kullanıcılar
- İngilizce okuyan fakat konuşamayan kullanıcılar
- Sınav İngilizcesi çalışanlar
- İngilizceyi sistematik, mantık temelli öğrenmek isteyenler

## MVP Kapsamı

İlk sürüm bilinçli olarak dar tutulmalıdır. MVP'nin amacı bütün yöntemi bitirmek değil, yöntemin ana değerini kullanıcıya çalışır halde göstermektir.

MVP içinde olacaklar:

- Başlangıç testi
- Günlük ders akışı
- Etap 1 çekirdeği
- Cümle çözüm ekranı
- Cümle laboratuvarı
- Hata koçu
- Temel ilerleme takibi
- 100-150 çözümlü örnek cümle
- Sınırlı yapay zeka destekli denetim

MVP dışında kalacaklar:

- Canlı telaffuz puanlama
- Tam Etap 2, Etap 3 ve Etap 4 kapsamı
- Topluluk özellikleri
- Öğretmen paneli
- Sınav modu
- Gelişmiş konuşma simülasyonu
- Otomatik sınırsız cümle çözümü

## Ana Kullanıcı Akışları

### 1. İlk Giriş ve Tanılama

Kullanıcı uygulamaya ilk kez geldiğinde seviye seçmez. Kısa bir tanılama testi çözer.

Görevler:

- Verilen cümlede ortacı seç.
- İmajı seç.
- Gizli özneyi bul.
- Bir öğenin edatlı mı edatsız mı olduğunu belirle.
- Zaman zarfını ayır.
- Türkçe öğeleri İngilizce sıraya diz.

Çıktı:

- Kullanıcının işlem profili oluşur.
- İlk ders otomatik belirlenir.
- Kullanıcıya "A1/A2" gibi genel seviye değil, "ortaç bulma güçlü, N1/N2 ayırma zayıf" gibi işlem temelli sonuç gösterilir.

### 2. Günlük Ders

Günlük ders 20-30 dakika sürer.

Ekran sırası:

1. Bugünün kuralı
2. Kılavuzlu örnek
3. Etiketleme görevi
4. Sıralama görevi
5. Cümle üretme görevi
6. Hata açıklaması
7. Kısa tekrar

Başarı koşulu:

- Kullanıcı aynı işlem türünde en az 5 cümleyi kabul edilebilir doğrulukla çözmelidir.

### 3. Cümle Çözüm Ekranı

Bu ekran MVP'nin ana ekranıdır.

Kullanıcıya bir Türkçe cümle verilir:

`Yarın ofise gizlice bir paket bırakmalısın.`

Kullanıcı şu adımları tamamlar:

1. Ortacı seçer.
2. İmajı seçer.
3. Özneyi belirler.
4. Z1, N1, N2, Z2 öğelerini etiketler.
5. Öğeleri İngilizce şablona sürükler.
6. İngilizce cümleyi yazar veya tamamlar.

Uygulama her adımda sadece gerektiği kadar ipucu verir.

### 4. Cümle Laboratuvarı

Kullanıcı kendi Türkçe cümlesini yazar.

MVP'de laboratuvar sınırlı çalışır:

- Uygulama önce cümleyi kabul edilebilirlik açısından kontrol eder.
- Çok uzun, bağlaçlı veya ileri yapı içeren cümlelerde kullanıcıya "Bu cümle MVP kapsamının dışında, daha kısa bir cümleyle deneyelim" mesajı verir.
- Uygun cümlelerde sistem ortaç ve öğe adayları önerir.
- Kullanıcı yine kendi çözümünü yapar.

### 5. Hata Koçu

Hata koçu ürünün ayırt edici bölümüdür.

Yanlış cevaplar şu formatta açıklanır:

- Hata türü
- Hatanın olduğu işlem
- Neden yanlış olduğu
- Doğru işlem
- Benzer mini alıştırma

Örnek:

Kullanıcı `ofise` öğesini Z2 seçerse:

- Hata türü: Zarf/Nesne karışıklığı
- İşlem: N2/Z2 ayrımı
- Açıklama: `ofise` bir zaman cevabı değil, edatlı yön bilgisidir.
- Doğru kod: N2
- Mini tekrar: `okula`, `bugün`, `evde`, `dün` öğelerini N2/Z2 olarak ayır.

## Ekranlar

### Ana Panel

Gösterilecekler:

- Bugünkü ders
- Devam edilen etap
- En zayıf işlem
- Son çözüm sonucu
- Günlük hedef
- Cümle laboratuvarına giriş

### Ders Ekranı

Gösterilecekler:

- Kısa kural
- Örnek cümle
- İşlem adımları
- Kullanıcının aktif görevi
- İpucu butonu
- Hata koçu alanı

### Cümle Çözüm Ekranı

Gösterilecekler:

- Türkçe cümle
- Etiket araçları
- Öğe şeritleri
- İngilizce şablon
- Sonuç cümlesi alanı

### İlerleme Ekranı

Gösterilecekler:

- Ortaç bulma doğruluğu
- İmaj bulma doğruluğu
- Özne çıkarma doğruluğu
- N1/N2 ayrımı
- Z1/Z2 ayrımı
- İngilizce sıralama doğruluğu
- Günlük seri

## Fonksiyonel Gereksinimler

- Kullanıcı hesap oluşturabilmelidir.
- Kullanıcı tanılama testini çözebilmelidir.
- Sistem kullanıcıya günlük ders atayabilmelidir.
- Kullanıcı cümle üzerinde kelime veya kelime grubu seçebilmelidir.
- Kullanıcı seçili parçaya öğe etiketi verebilmelidir.
- Kullanıcı öğeleri İngilizce dizilim alanına taşıyabilmelidir.
- Sistem her adımı ayrı ayrı değerlendirebilmelidir.
- Sistem hata türünü sınıflandırabilmelidir.
- Sistem kullanıcı işlem profilini güncelleyebilmelidir.
- Kullanıcı kendi cümlesini laboratuvara yazabilmelidir.

## Fonksiyonel Olmayan Gereksinimler

- Arayüz sade ve tekrar edilebilir olmalıdır.
- Mobil ve masaüstünde kullanılabilir olmalıdır.
- Her ders 20-30 dakikada tamamlanmalıdır.
- Cümle çözüm ekranı hızlı tepki vermelidir.
- Yapay zeka çıktıları kesin öğretim kurallarını aşmamalıdır.
- Kullanıcıya hazır çeviri erken gösterilmemelidir.
- Veriler ileride yeni etapları destekleyecek şekilde genişletilebilir olmalıdır.

## Başarı Ölçütleri

MVP başarılı sayılırsa:

- Kullanıcılar Etap 1 cümlelerini işlem sırasıyla çözebilir.
- Kullanıcılar hatalarının nedenini anlayabilir.
- Kullanıcılar aynı cümle tipinde tekrar ettikçe daha az ipucu ister.
- Kullanıcılar İngilizce cümleyi yalnızca ezberlemeden, öğe dizilimiyle kurabilir.

