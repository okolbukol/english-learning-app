# Sprint 1 İlerleme Raporu

Tarih: 2026-07-15

## Sprint Hedefi

PRD, Öğretim Motoru Spesifikasyonu ve MVP Planı'na sadık kalarak UI geliştirmeden önce Teaching Engine paketinin ilk üretim çekirdeğini kurmak.

## Tamamlananlar

- `packages/teaching-engine` workspace paketi oluşturuldu.
- Öğretim motoru için temel tip sistemi eklendi:
  - `Ö`
  - `F`
  - `Z1`
  - `İm`
  - `N1`
  - `N2`
  - `Z2`
- MVP hata sınıfları eklendi.
- Cümle veri modeli ve kullanıcı denemesi veri modeli eklendi.
- 3 adet çözümlü fixture cümle eklendi.
- Deneme değerlendirme motoru eklendi.
- Puanlama sistemi eklendi:
  - işlem sırası
  - öğe doğruluğu
  - İngilizce dizilim
  - son cümle
  - sesli üretim alanı
- Zayıf beceriye göre sonraki alıştırma öneren profil motoru eklendi.
- Yapay zeka çıktıları için guardrail denetimi eklendi.
- Workspace TypeScript yoluna `@html2pdf-pro/teaching-engine` alias'ı eklendi.
- Kök scriptlere `test:engine` eklendi.

## Test Sonuçları

Engine testleri doğrudan yerel Vitest ile çalıştırıldı.

Sonuç:

- Test dosyası: 3 geçti
- Test sayısı: 8 geçti
- Başarısız test: 0

Kapsanan alanlar:

- Tam doğru cümle çözümü
- N2/Z2 karışıklığı hata sınıflandırması
- Hazır çeviriyi erken isteme kuralı
- Kabul edilen İngilizce varyantlar
- Zayıf beceriye göre pratik önerisi
- Yapay zeka guardrail kuralları

## Typecheck Durumu

Teaching Engine izole TypeScript denetiminden geçti.

Repo genel `tsc --noEmit` denetimi şu mevcut bloker nedeniyle geçmedi:

```txt
packages/database/src/index.ts: Module "@prisma/client" has no exported member "Prisma" / "PrismaClient".
```

Bu hata Teaching Engine kaynaklı değil. Muhtemel neden Prisma client'ın üretilmemiş veya workspace içinde doğru bağlanmamış olması.

## UI Durumu

UI geliştirmeye başlanmadı.

Sebep: Kullanıcının şartına uygun olarak önce Teaching Engine testleri tamamlandı ve sprint kapatıldı. UI çalışması Sprint 2'de başlayabilir.

## Sprint 2 Planı

Sprint 2 hedefi: Engine testleri geçtiği için ilk UI entegrasyonunu başlatmak.

Öncelik sırası:

1. Mevcut Next.js web uygulamasının yapısını incele.
2. Cümle çözüm ekranının veri akışını engine ile bağla.
3. İlk ekranı sadece Etap 1 fixture cümleleriyle çalıştır.
4. Kullanıcının öğe etiketleme denemesini UI state olarak tut.
5. `evaluateAttempt` sonucunu Hata Koçu panelinde göster.
6. Engine testleri korunurken UI için ilk component testlerini ekle.
7. Prisma typecheck blokerini ayrı teknik borç olarak çöz veya geçici olarak build kapsamından izole et.

## Riskler

- Repo adı ve mevcut web uygulaması hâlâ eski `html2pdf-pro` bağlamını taşıyor.
- Database paketi Prisma client üretimi olmadan repo genel typecheck'i kırıyor.
- UI'ya geçmeden önce ürün adlandırması ve route yapısı sadeleştirilmeli.

