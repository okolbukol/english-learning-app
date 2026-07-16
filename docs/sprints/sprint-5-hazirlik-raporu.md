# Sprint 5 Hazırlık Raporu

Tarih: 2026-07-15

## Sprint Hedefi

5-10 gerçek kullanıcıyla yapılacak testlerin güvenilir ve karşılaştırılabilir biçimde yürütülmesini desteklemek.

Bu sprintte amaç yeni ürün kararı almak değil, mevcut Test Session akışından güvenli öğrenme verisi toplamaktır.

## Yapılan Değişiklikler

### Kullanıcı Test Protokolü

Kullanıcı testi belgeleri standart repository düzeninde `docs/research/user-testing/` altında tutulur.

Eklenen belgeler:

- `TEST_PROTOCOL.md`
- `OBSERVATION_FORM.md`
- `PARTICIPANT_RESULT_TEMPLATE.md`
- `VALIDATION_SUMMARY_TEMPLATE.md`
- `SAMPLE_ANALYTICS_EXPORT.json`

Belgelerde şunlar açıkça belirtildi:

- Kişisel veri toplanmayacak.
- Katılımcılar P001, P002 gibi anonim kodlarla takip edilecek.
- Araştırmacı doğru cevap, etiket, İngilizce cümle veya Hata Koçu yorumu konusunda müdahale etmeyecek.
- Ürün geliştirme kararları 5-10 katılımcı verisi toplanmadan verilmeyecek.

### Analitik Dışa Aktarım

Mevcut Test Session akışı değiştirilmeden analitik dışa aktarım eklendi.

Eklenen çıktılar:

- JSON indir
- CSV indir

Export içeriği:

- participantCode
- session question/completed count
- solved sentence records
- user report
- teaching analytics

Katılımcı kodu yalnızca `P001` formatında kabul edilir. Kişisel veri alanı yoktur.

### Export Schema Testi

`SAMPLE_ANALYTICS_EXPORT.json` dosyası eklendi.

Schema doğrulaması `apps/web/src/lib/learning-analytics.test.ts` içine eklendi.

Test şunları doğrular:

- Örnek export dosyası geçerli schema'dadır.
- JSON serializer geçerli çıktı üretir.
- CSV serializer beklenen kolonları üretir.

## Değiştirilmeyen Alanlar

- Teaching Engine kuralları değiştirilmedi.
- Teaching Engine değerlendirme mantığı değiştirilmedi.
- Yeni oyunlaştırma eklenmedi.
- AI özelliği eklenmedi.
- Üyelik eklenmedi.
- Tasarım genişlemesi yapılmadı.

## Doğrulama

### Test

```txt
vitest run
Test Files: 8 passed
Tests: 19 passed
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
- First Load JS: 113 kB
- Build exit code: 0

## Gerçek Kullanıcı Testi Başlamadan Önce Kalan Blokajlar

- 5-10 katılımcı için anonim kod listesi hazırlanmalı.
- Test oturumlarının nerede ve hangi cihazda yapılacağı netleşmeli.
- Araştırmacıların protokolü aynı şekilde uygulayacağı kısa bir ön prova yapılmalı.
- Export dosyalarının saklanacağı klasör ve adlandırma standardı belirlenmeli.
- Ekran kaydı alınacaksa kişisel veri görünmeyeceği tekrar kontrol edilmeli.
- Test sırasında internet, cihaz veya tarayıcı kaynaklı teknik aksaklıkların nasıl not edileceği kararlaştırılmalı.

## Karar Notu

Bu sprint ürün geliştirme önerisi üretmez.

Bir sonraki ürün kararı, yalnızca 5-10 gerçek kullanıcıdan toplanan anonim test verisi ve gözlem formları değerlendirildikten sonra alınmalıdır.
