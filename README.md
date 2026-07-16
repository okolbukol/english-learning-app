# English Learning App

Türkçe bilen kullanıcılar için geliştirilmiş, cümle çözümleme temelli İngilizce öğrenme uygulaması.

## 1. Projenin Amacı

Bu proje, Türkçe bilen bir kullanıcının İngilizce cümle kurarken ezber çeviri yerine işlem sırası öğrenmesini hedefler. Kullanıcı Türkçe cümleyi parçalara ayırır, parçaları öğretim etiketleriyle kodlar, İngilizce dizilime taşır ve en son İngilizce cümleyi üretir.

Uygulamadaki içerikler özgün üretilmiştir. Proje, Türkçe bilenler için geliştirilen pedagojik bir yöntemin dijital uyarlamasıdır; herhangi bir Taner Çağlı materyalinden içerik kopyalandığı iddia edilmez.

## 2. Pedagojik Yaklaşım

Temel yaklaşım "cümleyi parçala, kodla, İngilizce dizilime taşı, sonra konuş" akışıdır.

Etap 1 için kullanılan ana etiketler:

- `Ö`: özne
- `F`: ortaç
- `Z1`: durum zarfı
- `İm`: imaj
- `N1`: edatsız nesne
- `N2`: edatlı nesne
- `Z2`: zaman zarfı

Ana İngilizce dizilim kuralı:

```text
Ö + F + Z1 + İm + N1 + N2 + Z2
```

Uygulama hazır çeviriyi merkeze almaz. Önce işlem adımları, sonra son cümle kontrol edilir.

## 3. MVP Kapsamı

Mevcut MVP Etap 1 cümleleriyle sınırlıdır.

Kapsamda olanlar:

- 100 özgün ve desteklenen Etap 1 cümlesi.
- Cümle parçalarını etiketleme.
- İngilizce öğe sırasını kurma.
- Son İngilizce cümleyi kabul edilen hedef cümleyle karşılaştırma.
- Hata Koçu geri bildirimi.
- 20 soruluk Test Session akışı.
- Kullanıcı raporu ve öğretim analitiği.
- Anonim JSON/CSV analitik dışa aktarımı.

Kapsam dışı olanlar:

- Üyelik ve kullanıcı hesabı.
- Veritabanına kalıcı kullanıcı kaydı.
- Canlı AI entegrasyonu.
- Oyunlaştırma.
- Çok etaplı tam İngilizce müfredatı.

## 4. Mevcut Özellikler

- Next.js tabanlı tek sayfalık öğrenme/test arayüzü.
- 20 soruluk oturum üretimi.
- Cümle parçası kodlama paneli.
- İngilizce dizilim seçimi.
- Son cümle yazma ve denetleme.
- İpucu kullanım sayacı.
- Deneme süresi takibi.
- İlk denemede başarı takibi.
- Hata türü ve yanlış etiket takibi.
- Hata Koçu: neden, düzeltme ve mini pratik geri bildirimi.
- Kullanıcı raporu: ortalama skor, güçlü/zayıf beceriler, transfer başarısı, çalışma önerisi.
- Öğretim analitiği: en çok hata yapılan etiketler, en zor cümleler, ortalama çözüm süresi.
- Anonim katılımcı kodu ile JSON ve CSV dışa aktarımı.

## 5. Repository Yapısı

```text
apps/
  web/
    src/app/
    src/lib/
packages/
  teaching-engine/
    src/
  config/
    src/
  database/
    prisma/
    src/
docs/
  product/
  sprints/
  research/
    user-testing/
  repository/
  archive/
    legacy-html2pdf/
```

Not: Kök seviyede ayrı bir `research/` klasörü yoktur. Kullanıcı testi dokümanları `docs/research/user-testing/` altında tutulur.

## 6. Teknik Yapı

Repository bir pnpm workspace olarak yapılandırılmıştır.

- `apps/web`: Next.js 15, React 19 ve Tailwind CSS kullanan web uygulaması.
- `packages/teaching-engine`: Öğretim kuralları, Etap 1 içerik bankası, değerlendirme, hata koçluğu, transfer testi ve kullanıcı profil mantığı.
- `packages/config`: Zod ile ortam değişkeni doğrulama yardımcıları.
- `packages/database`: Prisma şeması ve veritabanı paketi iskeleti.
- `vitest`: Unit ve UI davranış testleri.
- `typescript`: Kök `tsconfig.json` üzerinden typecheck.

Paket adlarında önceki proje döneminden kalan `@html2pdf-pro/*` ad alanı kullanılmaktadır. Bu çalışan sistemi bozmamak için henüz değiştirilmemiştir.

## 7. Kurulum

Gereksinimler:

- Node.js 20 veya üzeri.
- pnpm 9 veya üzeri.

Bağımlılıkları yükle:

```bash
pnpm install
```

Ortam değişkenleri için örnek dosya:

```bash
.env.example
```

Veritabanı paketinde Prisma şeması vardır; ancak mevcut kullanıcı test akışı veritabanına kayıt yapmaz.

## 8. Development Server Çalıştırma

Kök dizinden:

```bash
pnpm dev
```

Bu komut `package.json` içinde şu filtreyle web uygulamasını çalıştırır:

```bash
pnpm --filter @html2pdf-pro/web dev
```

## 9. Test Komutları

Tüm testler:

```bash
pnpm test
```

Sadece Teaching Engine testleri:

```bash
pnpm test:engine
```

Watch mode:

```bash
pnpm test:watch
```

## 10. Typecheck Komutu

```bash
pnpm typecheck
```

Bu komut kökte `tsc --noEmit` çalıştırır.

## 11. Production Build Komutu

```bash
pnpm build
```

Bu komut `apps/web` için Next.js production build çalıştırır.

## 12. Kullanıcı Test Modu

Mevcut ana ekran 20 soruluk Test Session akışı olarak çalışır. Oturumda kullanıcı:

- Türkçe cümleyi görür.
- Parçaları öğretim etiketleriyle kodlar.
- İngilizce dizilimi seçer.
- Son İngilizce cümleyi yazar.
- Denetleme sonrası Hata Koçu ve rapor alanlarını görür.

Katılımcılar kişisel bilgiyle değil, `P001`, `P002` gibi anonim kodlarla izlenir. Katılımcı kodu `P` + üç rakam formatında olmalıdır.

Kullanıcı testi protokolü ve formlar:

```text
docs/research/user-testing/
```

## 13. JSON/CSV Analitik Dışa Aktarımı

Uygulama oturum kayıtlarını tarayıcıdan indirilebilir JSON veya CSV olarak dışa aktarır.

Dışa aktarılan veriler şunları içerir:

- Anonim katılımcı kodu.
- Çözülen cümle sayısı.
- Cümle ID'si ve Türkçe cümle.
- Skor.
- Çözüm süresi.
- İlk denemede başarı.
- İpucu kullanımı.
- Birincil hata türü.
- Yanlış etiketler.
- Ders, zorluk ve transfer bilgisi.
- Kullanıcı raporu.
- Öğretim analitiği.

JSON şema örneği:

```text
docs/research/user-testing/SAMPLE_ANALYTICS_EXPORT.json
```

## 14. Teaching Engine Sınırları

Teaching Engine uygulamanın pedagojik çekirdeğidir. Mevcut sınırlar:

- Etap 1 destekli cümleler üzerinde çalışır.
- İçerik bankasında 100 özgün desteklenen cümle vardır.
- Her desteklenen cümlede `Ö`, `F` ve `İm` bulunmalıdır.
- Değerlendirme etiket doğruluğu, İngilizce sıra ve son cümle eşleşmesi üzerinden yapılır.
- Destek dışı cümleler `unsupported_sentence` hatasıyla değerlendirilir.
- UI, Teaching Engine kurallarını değiştirmez; sadece kullanıcı girişlerini engine'e gönderir.

Skor ağırlıkları:

- İşlem sırası: 35
- Öğe doğruluğu: 30
- İngilizce sıra: 20
- Son cümle: 10
- Konuşma/üretim payı: 5

## 15. AI Guardrail Kuralları

Repository'de canlı AI özelliği yoktur; ancak Teaching Engine içinde AI destekli bir akış eklenirse uygulanacak guardrail doğrulaması vardır.

Guardrail ihlalleri:

- Cevabı işlem tamamlanmadan erken göstermek.
- Zorunlu adım sırasını bozmak.
- Desteklenmeyen etiket kullanmak.
- MVP kapsamı dışındaki cümleyi işlemek.

Desteklenen etiketler:

```text
Ö, F, Z1, İm, N1, N2, Z2
```

## 16. Mevcut Durum ve Bilinen Teknik Borçlar

Mevcut durum:

- Web uygulaması çalışır durumdadır.
- Teaching Engine testleri mevcuttur.
- Öğrenme analitiği ve dışa aktarım testleri mevcuttur.
- Kullanıcı doğrulama dokümanları hazırlanmıştır.
- Repository dokümanları `docs/` altında toparlanmıştır.

Bilinen teknik borçlar:

- Paket adları hâlâ `@html2pdf-pro/*` ad alanını kullanıyor.
- `docs/archive/legacy-html2pdf/` altında eski proje döneminden kalan arşiv dokümanı bulunuyor.
- Veritabanı paketi ve Docker Compose altyapısı vardır; mevcut kullanıcı test akışı henüz kalıcı veritabanı kaydı yapmaz.
- Analitik dışa aktarımı tarayıcı indirmesiyle sınırlıdır.
- Kullanıcı hesapları, oturum geçmişi ve sunucu tarafı raporlama yoktur.
- Canlı AI entegrasyonu yoktur; yalnızca guardrail doğrulama yardımcıları vardır.

## 17. Dokümanların Konumları

Ürün ve öğretim dokümanları:

```text
docs/product/
```

Sprint raporları:

```text
docs/sprints/
```

Kullanıcı testi dokümanları:

```text
docs/research/user-testing/
```

Repository düzenleme raporu:

```text
docs/repository/STRUCTURE_REPORT.md
```

Eski proje arşivi:

```text
docs/archive/legacy-html2pdf/
```
