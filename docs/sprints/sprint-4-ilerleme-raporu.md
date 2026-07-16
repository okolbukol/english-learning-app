# Sprint 4 İlerleme Raporu

Tarih: 2026-07-15

## Sprint Hedefi

Kod yazmaktan çok öğrenme verisi üretmek; Teaching Engine paketini değiştirmeden mevcut web katmanında kullanıcı doğrulama, test session ve öğrenme analitiği üretmek.

## Kurallara Uyum

- Teaching Engine değiştirilmedi.
- Yeni mimari eklenmedi.
- Mevcut web uygulaması ve mevcut engine API'leri kullanıldı.
- Yeni özellikler, var olan cümle çözüm akışının test session ve raporlama katmanı olarak eklendi.
- Tüm testler yeşil.
- Production build başarılı.

## Yapılan Değişiklikler

### Öğrenme Analitiği

`apps/web/src/lib/learning-analytics.ts` eklendi.

Toplanan veriler:

- çözülen cümle
- çözüm süresi
- ilk denemede başarı
- en çok yapılan hata
- ipucu kullanımı
- yanlış etiketler
- transfer cümlesi durumu
- skor

### Test Session Modu

Ana cümle çözüm ekranı 20 soruluk test session olarak genişletildi.

Eklenenler:

- 20 soruluk dengeli oturum seçimi
- aktif soru göstergesi
- soru süresi ölçümü
- deneme sayısı takibi
- ipucu sayacı
- sonraki soru akışı
- oturum kayıtları
- oturum sonunda otomatik güncellenen rapor

### Kullanıcı Raporu

UI'da `Kullanıcı Raporu` paneli eklendi.

Rapor alanları:

- ortalama skor
- en güçlü beceriler
- en zayıf beceriler
- transfer başarısı
- ilk deneme başarısı
- ortalama ipucu kullanımı
- çalışma önerisi

### Öğretim Analitiği

UI'da `Öğretim Analitiği` paneli eklendi.

Analitik alanları:

- en çok hata yapılan etiketler
- en zor cümleler
- ortalama çözüm süresi
- en sık görülen hata

### Testler

`apps/web/src/lib/learning-analytics.test.ts` eklendi.

Kapsananlar:

- 20 soruluk dengeli test session üretimi
- kullanıcı raporu üretimi
- öğretim analitiği üretimi

Mevcut UI testi rapor ve analitik panelleri kapsayacak şekilde güncellendi.

## Doğrulama Sonuçları

### Test

```txt
vitest run
Test Files: 8 passed
Tests: 18 passed
```

### Typecheck

```txt
tsc --noEmit
Başarılı
```

### Production Build

```txt
next build
Başarılı
```

Build çıktısı:

- `/` static prerender edildi
- First Load JS: 112 kB
- Build exit code: 0

## Bilinen Teknik Borçlar

- Test session verisi şu anda client state içinde tutuluyor; kalıcı kullanıcı geçmişi yok.
- Raporlar oturum içi veriden üretiliyor; database veya dosya kaydı yapılmıyor.
- İpucu kullanımı yalnızca sayaç olarak tutuluyor; hangi ipucunun kullanıldığı ayrı kaydedilmiyor.
- Çözüm süresi client tarafında ölçülüyor; sekme arka plana alınırsa süre yorumu sapabilir.
- Test session soru seçimi deterministik; ileride kullanıcı profiline göre adaptif seçim gerekebilir.
- Prisma generate dış ağdaki Prisma binary checksum isteğine bağlı olduğu için bu ortamda çalıştırılamıyor.
- UI etkileşim testleri render kapsamını aştı ama henüz tam kullanıcı akışı simülasyonu yapmıyor.

## Sprint 5 Önerisi

Önerilen hedef: öğrenme verisini kalıcı ve karşılaştırılabilir hale getirmek.

Öncelikler:

1. Test session sonuçlarını local persistence veya database hazırlığına bağla.
2. Oturum geçmişi ekranı ekle.
3. Kullanıcı raporunu önceki oturumlarla karşılaştır.
4. İpucu türlerini ayrıştır.
5. Öğretim analitiğinde cümle bazlı hata geçmişini göster.
6. 20 soruluk oturum için tam kullanıcı akışı testleri ekle.
7. Prisma generate için offline/CI uyumlu çözüm belirle.

