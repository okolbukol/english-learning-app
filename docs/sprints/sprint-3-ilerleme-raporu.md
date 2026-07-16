# Sprint 3 İlerleme Raporu

Tarih: 2026-07-15

## Sprint Hedefi

Yeni mimari eklemeden mevcut PRD ve Teaching Engine spesifikasyonuna sadık kalarak:

1. 100 özgün Etap 1 cümlesi için içerik altyapısı oluşturmak
2. Hata Koçu geri bildirimlerini zenginleştirmek
3. Transfer testlerini eklemek
4. Kullanıcı ilerleme profilini geliştirmek

## Tamamlananlar

- `stage-one-content.ts` eklendi.
- 100 özgün Etap 1 cümlesi `SentenceDefinition` modeliyle üretildi.
- Cümleler otomatik token, öğe, hedef İngilizce cümle ve etiket bilgisi taşıyor.
- `fixtureSentences` artık 100 cümlelik Etap 1 içerik bankasını kullanıyor.
- Fiil-nesne eşleşmeleri doğal olacak şekilde düzenlendi.
- Hata Koçu geri bildirimi zenginleştirildi:
  - başlık
  - neden
  - düzeltme
  - mini pratik
- UI Hata Koçu paneli bu zengin geri bildirimi göstermeye başladı.
- UI sabit cümle parçalarına bağlı olmaktan çıkarıldı; aktif sentence öğelerinden parça üretir hale getirildi.
- Transfer testleri eklendi:
  - 100 cümlenin tamamı evaluator üzerinden doğru çözümle geçiyor.
  - N2/Z2 karışıklığı farklı içerik üzerinde yakalanıyor.
- Kullanıcı profil motoru geliştirildi:
  - başlangıç profil oluşturma
  - evaluation sonucundan profil güncelleme
  - ortalama skor
  - tamamlanan deneme sayısı
  - mastered/needs-practice beceri listeleri
  - en zayıf becerileri listeleme
- Repo genel typecheck blokerleri temizlendi.
- Test ortamında config import'unun env doğrulamasıyla kırılması düzeltildi.
- ESLint config eksik `@eslint/js` link'ine bağımlı olmayacak şekilde sadeleştirildi.
- Database package export'u, üretilmemiş Prisma client nedeniyle typecheck kırmayacak barrel export'a çevrildi.

## Test Sonuçları

Tüm Vitest testleri çalıştırıldı.

Sonuç:

- Test dosyası: 7 geçti
- Test sayısı: 16 geçti
- Başarısız test: 0

Kapsanan alanlar:

- Teaching Engine değerlendirme
- 100 cümlelik Etap 1 içerik bankası
- Transfer coverage
- Hata Koçu guardrail ve feedback
- Kullanıcı ilerleme profili
- Config validation
- Cümle çözüm UI render testi

## Typecheck Sonucu

Repo genel TypeScript denetimi çalıştırıldı.

Sonuç:

```txt
tsc --noEmit: başarılı
```

## Production Build Sonucu

Next.js production build çalıştırıldı.

Sonuç:

```txt
next build: başarılı
```

Build çıktısı:

- `/` static prerender edildi
- First Load JS: 110 kB
- Build exit code: 0

## Notlar

- Prisma generate bu ortamda dış ağdaki Prisma binary checksum isteğine takıldığı için çalıştırılamadı. Buna rağmen database paketi typecheck'i kırmayacak hale getirildi.
- `pnpm` komutları supply-chain doğrulaması sırasında dış ağ isteği yaptığı için doğrulamalar yerel binary'lerle çalıştırıldı:
  - `vitest.CMD`
  - `tsc.CMD`
  - `next.CMD`

## Sprint 4 Planı

Önerilen sıradaki işler:

1. Cümle seçiciyi UI'ya ekle ve 100 cümle bankasından kontrollü seçim yap.
2. Etiketleme UI'ında aynı kodun gereksiz tekrar kullanımını engelle.
3. Hata Koçu mini pratiğini tıklanabilir kısa görev haline getir.
4. Kullanıcı profilini UI'da görünür hale getir.
5. Ders akışını "tanılama -> günlük ders -> cümle çözüm -> profil güncelleme" şeklinde bağla.
6. İçerik bankasını JSONL dışa aktarımına uygun hale getir.
7. Prisma client üretimi için offline/CI uyumlu strateji belirle.

