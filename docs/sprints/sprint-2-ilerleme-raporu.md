# Sprint 2 İlerleme Raporu

Tarih: 2026-07-15

## Sprint Hedefi

Teaching Engine testleri başarıyla geçtikten sonra, MVP Planı'na uygun ilk UI kesitini engine'e bağlı şekilde geliştirmek.

## Tamamlananlar

- Eski placeholder ana sayfa kaldırıldı.
- Ana sayfa `LessonClient` bileşenine bağlandı.
- Web uygulamasının metadata bilgisi ürün adına göre güncellendi.
- `apps/web` paketi `@html2pdf-pro/teaching-engine` paketini kullanacak şekilde güncellendi.
- Etap 1 fixture cümlesiyle çalışan ilk Cümle Çözüm ekranı eklendi.
- Kullanıcı şu işlemleri UI üzerinden yapabilir:
  - Türkçe cümleyi görür.
  - Parçaları `Ö, F, Z1, İm, N1, N2, Z2` kodlarıyla etiketler.
  - İngilizce dizilimi sıralar.
  - Son İngilizce cümleyi yazar.
  - Hata Koçu panelinden engine değerlendirmesini görür.
- İşlem kontrol paneli eklendi.
- Skor kartları eklendi.
- UI component testi eklendi.
- Vitest resolver ayarı monorepo ve React runtime için düzeltildi.
- Web paketi için Next tarafından üretilen `tsconfig.json` monorepo uyumlu hale getirildi.

## Test Sonuçları

Engine + UI testleri birlikte çalıştırıldı.

Sonuç:

- Test dosyası: 4 geçti
- Test sayısı: 9 geçti
- Başarısız test: 0

Kapsanan alanlar:

- Teaching Engine değerlendirme
- Profil tabanlı alıştırma önerisi
- Yapay zeka guardrail denetimi
- Cümle çözüm UI render testi

## Build Sonuçları

Next.js production build çalıştırıldı.

Sonuç:

- Production compile başarılı
- Static page generation başarılı
- Build çıkış kodu: 0

Not:

Build sırasında ESLint şu paket uyarısını verdi:

```txt
Cannot find package '@eslint/js' imported from eslint.config.mjs
```

Bu uyarı build'i durdurmadı, ancak Sprint 3'te dependency/lockfile temizliği kapsamında çözülmeli.

## Local Çalıştırma

3000 portu dolu olduğu için dev server 3001 portunda başlatıldı.

URL:

```txt
http://localhost:3001
```

HTTP kontrolü:

```txt
200 OK
```

## Typecheck Durumu

Teaching Engine ve UI testleri geçti.

Repo genel `tsc --noEmit` hâlâ şu mevcut database blokeri nedeniyle geçmiyor:

```txt
packages/database/src/index.ts: Module "@prisma/client" has no exported member "Prisma" / "PrismaClient".
```

Bu Sprint 2 UI/engine değişikliklerinden kaynaklanmıyor. Sprint 3'te üretim seviyesi repo temizliği için çözülmeli.

## Sprint 3 Planı

Sprint 3 hedefi: repo üretim sağlığını artırmak ve Cümle Çözüm ekranını MVP kullanılabilirliğine yaklaştırmak.

Öncelik sırası:

1. Prisma client/export blokerini çöz.
2. ESLint `@eslint/js` uyarısını çöz.
3. Kök `pnpm test:engine` komutunun supply-chain doğrulaması sırasında ağa takılmasını düzelt veya offline test script'i ekle.
4. Cümle Çözüm ekranında hazır doğru/yanlış durumunu daha ergonomik hale getir.
5. Kullanıcının aynı kodu birden fazla parçaya vermesini engelleyen UI kuralı ekle.
6. Hata Koçu paneline mini tekrar önerisi ekle.
7. Fixture cümle seçicisiyle 3 Etap 1 cümlesi arasında geçiş ekle.
8. UI etkileşim testlerini etiketleme ve denetleme akışını kapsayacak şekilde genişlet.

