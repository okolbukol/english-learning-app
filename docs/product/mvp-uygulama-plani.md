# MVP Uygulama Planı

## Hedef

İlk sürümün hedefi, yöntemin ana değerini çalışır hale getirmektir:

> Kullanıcı Türkçe bir cümleyi adım adım çözüp İngilizce dizilime taşıyabilmeli ve yaptığı hatanın hangi işlemden kaynaklandığını görebilmelidir.

## MVP Teslimatları

1. Kullanıcı tanılama testi
2. Ana panel
3. Günlük ders ekranı
4. Cümle çözüm ekranı
5. Cümle laboratuvarı
6. Hata koçu
7. İşlem profili
8. Örnek cümle havuzu
9. Sınırlı yapay zeka destekli açıklama katmanı

## Geliştirme Sırası

### Faz 1: Temel İçerik ve Veri

Süre: 1-2 hafta

Yapılacaklar:

- Etap 1 için 100-150 çözümlü cümle hazırlanır.
- Her cümle `Ö, F, Z1, İm, N1, N2, Z2` etiketleriyle işaretlenir.
- Cümle zorluk seviyeleri belirlenir.
- Hata sınıfları kesinleştirilir.
- JSONL örnek cümle formatı oluşturulur.

Çıktı:

- `sentences.jsonl`
- `error-types.json`
- `lessons.json`

### Faz 2: Cümle Çözüm Ekranı

Süre: 2-3 hafta

Yapılacaklar:

- Türkçe cümle gösterimi
- Kelime/kelime grubu seçimi
- Etiket verme
- Öğeleri İngilizce sıraya dizme
- Adım adım doğrulama
- İpucu sistemi
- Sonuç cümlesi alanı

Bu faz, MVP'nin kalbidir. Diğer ekranlar daha sade olabilir; bu ekran iyi çalışmalıdır.

### Faz 3: Hata Koçu

Süre: 1-2 hafta

Yapılacaklar:

- Hata türü algılama
- Hata açıklaması gösterme
- Benzer mini alıştırma önerme
- Kullanıcının tekrar denemesine izin verme
- İşlem profiline hata yazma

Örnek hata kartı:

- Başlık: Edatlı nesne zaman zarfı sanıldı
- Açıklama: `ofise` ne zaman sorusuna değil, nereye sorusuna cevap verir.
- Doğru kod: N2
- Tekrar: `yarın`, `evde`, `okula`, `dün` öğelerini ayır.

### Faz 4: Tanılama ve İlerleme

Süre: 1 hafta

Yapılacaklar:

- İlk giriş testi
- İşlem profili oluşturma
- Zayıf beceri seçimi
- Günlük ders önerisi
- İlerleme ekranı

### Faz 5: Cümle Laboratuvarı

Süre: 1-2 hafta

Yapılacaklar:

- Kullanıcı cümlesi alma
- MVP kapsam kontrolü
- Çok zor cümleleri nazikçe reddetme
- Uygun cümlede çözüm adımlarını açma
- Yapay zeka destekli aday öğe önerisi

### Faz 6: Yapay Zeka Denetim Katmanı

Süre: 1 hafta

Yapılacaklar:

- Yapay zeka prompt sınırları yazılır.
- AI çıktısı "cevabı erken verdi mi?" kontrolünden geçer.
- AI sadece açıklama ve öneri alanında kullanılır.
- Kesin çözüm veritabanı çözümüyle karşılaştırılır.

## Teknik Veri Yapıları

### Cümle

```json
{
  "id": "sent_0001",
  "stage": 1,
  "lesson_id": "lesson_ofzinnz_001",
  "difficulty": 1,
  "tr_sentence": "Bugün evde kalmalısın.",
  "elements": {
    "Ö": "sen",
    "F": "-malı",
    "Z1": null,
    "İm": "kal",
    "N1": null,
    "N2": "evde",
    "Z2": "Bugün"
  },
  "target_sentence": "You must stay at home today.",
  "tags": ["etap-1", "f-mali", "n2", "z2"]
}
```

### Ders

```json
{
  "id": "lesson_ofzinnz_001",
  "title": "İngilizce Cümle Sırası",
  "stage": 1,
  "goal": "Kullanıcı öğeleri İngilizce ana dizilime yerleştirir.",
  "required_skills": ["f", "im", "subject"],
  "sentences": ["sent_0001", "sent_0002", "sent_0003"]
}
```

### Hata Türü

```json
{
  "id": "n2_z2_confusion",
  "title": "Edatlı nesne zaman zarfı sanıldı",
  "detect_when": "Kullanıcı çözümde N2 olan öğeyi Z2 olarak etiketler.",
  "feedback": "Bu öğe ne zaman sorusuna değil, nereye/nerede/nereden sorusuna cevap verir.",
  "practice_skill": "n2-z2-ayrimi"
}
```

## Yapay Zeka Prompt İlkeleri

AI sistem mesajı şu kuralları taşımalıdır:

- Sen çevirmen değilsin, işlem denetçisisin.
- Kullanıcı işlem yapmadan hedef İngilizce cümleyi verme.
- Önce ortaç, sonra imaj, sonra öğeler sırasını koru.
- Sadece desteklenen etiketleri kullan: `Ö, F, Z1, İm, N1, N2, Z2`.
- Emin olmadığında "bu cümle ileri kapsamda" diyebilirsin.
- Açıklamaları kısa, Türkçe ve işlem odaklı yaz.

## MVP Ekran Önceliği

1. Cümle çözüm ekranı
2. Hata koçu
3. Günlük ders
4. Tanılama testi
5. Ana panel
6. İlerleme ekranı
7. Cümle laboratuvarı

Önce cümle çözüm ekranı yapılmalıdır. Çünkü ürünün değer önerisi bu ekranda kanıtlanır.

## İçerik Hazırlama Planı

İlk 150 cümlenin dağılımı:

- 30 cümle: sadece Ö + F + İm
- 25 cümle: Z2 içeren cümleler
- 25 cümle: N1 içeren cümleler
- 25 cümle: N2 içeren cümleler
- 20 cümle: Z1 içeren cümleler
- 15 cümle: gizli özne
- 10 cümle: olumsuz veya soru yapısı

Her cümle için tutulacaklar:

- Türkçe cümle
- Öğe çözümü
- İngilizce hedef cümle
- Kabul edilebilir varyantlar
- Zorluk seviyesi
- Hedef beceri
- Olası hata türleri

## Kabul Kriterleri

MVP tamamlandı sayılmak için:

- Kullanıcı tanılama testini tamamlayabilmeli.
- Sistem kullanıcıya günlük ders atayabilmeli.
- Kullanıcı en az 100 hazır cümlede adım adım çözüm yapabilmeli.
- Sistem en az 10 hata türünü ayırt edebilmeli.
- Kullanıcı cümleyi İngilizce ana dizilime taşıyabilmeli.
- Kullanıcı işlem profili güncellenmeli.
- Yapay zeka hedef cümleyi erken vermemeli.

## Riskler

### Risk: MVP kapsamı büyür

Çözüm: İlk sürüm Etap 1 çekirdeğinde tutulur. Etap 2-4 yalnızca veri modelinin genişleyebileceği şekilde düşünülür.

### Risk: Yapay zeka yöntemi bozar

Çözüm: AI sadece açıklama ve aday öneri üretir. Kesin değerlendirme kural tabanlı veriyle yapılır.

### Risk: Kullanıcı işlem sırasını sıkıcı bulur

Çözüm: Her ders kısa tutulur, başarı görsel olarak gösterilir, hata açıklaması net ve hızlı verilir.

### Risk: Serbest cümle laboratuvarı çok zorlaşır

Çözüm: MVP'de kapsam sınırlaması konur. Uygulama zor cümleleri daha basit hale getirmeyi önerir.

## Sonraki Sürüm

MVP sonrası öncelikler:

1. Etap 2 dönüşüm kuralları
2. Edilgen yapı
3. Temel bağlaçlar
4. Sesli konuşma pratiği
5. Gelişmiş cümle laboratuvarı
6. Öğretmen paneli
7. Sınav modu

