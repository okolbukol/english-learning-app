# Öğretim Motoru Spesifikasyonu

## Amaç

Öğretim motoru, Türkçe cümleyi yöntem kurallarına göre işlenebilir parçalara ayırır, kullanıcı çözümünü değerlendirir, hata türünü belirler ve sonraki alıştırmayı seçer.

Motorun görevi çeviri yapmak değil, cümle çözme işlemini denetlemektir.

## Ana Kavramlar

### Kelime Türleri

MVP içinde desteklenecek temel türler:

- İsim
- Sıfat
- Belirteç
- Edat
- Eylem
- Ortaç

### Cümle Öğeleri

MVP içinde desteklenecek öğeler:

- `Ö`: özne
- `F`: ortaç
- `Z1`: durum zarfı
- `İm`: imaj
- `N1`: edatsız nesne
- `N2`: edatlı nesne
- `Z2`: zaman zarfı

Ana İngilizce dizilim:

`Ö + F + Z1 + İm + N1 + N2 + Z2`

### İsim Grubu Kodları

MVP içinde isim grupları şu mantıkla tutulur:

- `E`: edat
- `B`: belirteç
- `S`: sıfat
- `İ2`: yardımcı isim
- `İ`: ana isim

## Cümle Veri Modeli

```json
{
  "id": "sent_0001",
  "stage": 1,
  "lesson": "ofzinnz-temel",
  "difficulty": 2,
  "tr_sentence": "Yarın ofise gizlice bir paket bırakmalısın.",
  "normalized_tr_sentence": "Yarın ofise gizlice bir paket bırakmalısın.",
  "tokens": [
    { "id": "t1", "text": "Yarın", "start": 0, "end": 5 },
    { "id": "t2", "text": "ofise", "start": 6, "end": 11 },
    { "id": "t3", "text": "gizlice", "start": 12, "end": 19 },
    { "id": "t4", "text": "bir", "start": 20, "end": 23 },
    { "id": "t5", "text": "paket", "start": 24, "end": 29 },
    { "id": "t6", "text": "bırakmalısın", "start": 30, "end": 42 }
  ],
  "solution": {
    "elements": [
      { "code": "Z2", "text": "Yarın", "token_ids": ["t1"] },
      { "code": "N2", "text": "ofise", "token_ids": ["t2"] },
      { "code": "Z1", "text": "gizlice", "token_ids": ["t3"] },
      { "code": "N1", "text": "bir paket", "token_ids": ["t4", "t5"] },
      { "code": "İm", "text": "bırak", "token_ids": ["t6"] },
      { "code": "F", "text": "-malı", "token_ids": ["t6"] },
      { "code": "Ö", "text": "sen", "token_ids": [] }
    ],
    "english_order": ["Ö", "F", "Z1", "İm", "N1", "N2", "Z2"],
    "target_sentence": "You must secretly drop a package to the office tomorrow."
  },
  "accepted_variants": [
    "You must secretly leave a package at the office tomorrow."
  ],
  "tags": ["etap-1", "ortaç", "imaj", "n1-n2", "z1-z2"]
}
```

## Kullanıcı Cevabı Veri Modeli

```json
{
  "sentence_id": "sent_0001",
  "attempt_id": "att_0001",
  "user_id": "user_0001",
  "steps": [
    {
      "step": "select_f",
      "answer": { "text": "-malı", "token_ids": ["t6"] },
      "is_correct": true,
      "error_type": null
    },
    {
      "step": "label_element",
      "answer": { "code": "Z2", "text": "ofise", "token_ids": ["t2"] },
      "is_correct": false,
      "error_type": "n2_z2_confusion"
    }
  ],
  "final_sentence": "You must secretly drop a package to the office tomorrow.",
  "score": 84
}
```

## İşlem Sırası

Motor her çözümü şu sırayla değerlendirir:

1. Ortaç seçimi
2. İmaj seçimi
3. Özne belirleme
4. Z1 belirleme
5. Z2 belirleme
6. N1 belirleme
7. N2 belirleme
8. İngilizce dizilim
9. İngilizce cümle üretimi

Kullanıcı sonraki adıma geçebilir; ancak sistem hatalı adımları işlem profiline kaydeder.

## Hata Sınıfları

MVP hata sınıfları:

- `f_not_found`: ortaç bulunamadı
- `f_wrong`: yanlış ortaç seçildi
- `im_missing`: imaj eksik
- `im_wrong_boundary`: imaj sınırı yanlış
- `subject_missing`: gizli özne açılmadı
- `z1_missing`: durum zarfı bulunamadı
- `z1_n_confusion`: durum zarfı nesne sanıldı
- `z2_missing`: zaman zarfı bulunamadı
- `n2_z2_confusion`: edatlı nesne zaman zarfı sanıldı
- `n1_n2_confusion`: edatsız ve edatlı nesne karıştı
- `order_wrong`: İngilizce dizilim yanlış
- `translation_too_early`: kullanıcı işlem yapmadan çeviri istedi
- `unsupported_sentence`: cümle MVP kapsamı dışında

## Puanlama

MVP puanlama ağırlıkları:

- İşlem sırası: 35
- Öğe doğruluğu: 30
- İngilizce dizilim: 20
- İngilizce cümle doğruluğu: 10
- Sesli tekrar veya okuma: 5

Puanlama örneği:

```json
{
  "process_order": 30,
  "element_accuracy": 24,
  "english_order": 20,
  "final_sentence": 8,
  "speaking": 5,
  "total": 87
}
```

## İpucu Sistemi

İpuçları üç seviyeli olmalıdır:

1. Hafif ipucu: "Önce yükleme bak."
2. Yönlendirici ipucu: "`-malı` ortaç listesinde olabilir."
3. Açık ipucu: "Bu cümlede ortaç `-malı`, imaj `bırak`."

Her ipucu puanı biraz düşürür, fakat öğrenme akışını kesmez.

## Yapay Zeka Sınırları

Yapay zeka kullanılabilecek alanlar:

- Kullanıcının serbest cümlesini zorluk açısından sınıflandırma
- Cümle için öğe adayları önerme
- Hata açıklamasını daha doğal Türkçeyle yazma
- Aynı hata türüne uygun yeni alıştırma üretme

Yapay zeka kullanılamayacak alanlar:

- Kesin çözümü kullanıcı işlem yapmadan verme
- Sunum kurallarını değiştirme
- Kullanıcının yanlış cevabını sırf doğal duyuluyor diye doğru sayma
- Öğretim sırasını atlama

Her yapay zeka çıktısı şu denetimden geçmelidir:

```json
{
  "does_reveal_answer_too_early": false,
  "follows_required_step_order": true,
  "uses_supported_labels_only": true,
  "sentence_in_mvp_scope": true
}
```

## Örnek Cümle Havuzu Formatı

Örnekler JSONL olarak tutulabilir. Her satır bir cümledir.

```json
{"id":"sent_0001","stage":1,"difficulty":1,"tr_sentence":"Bugün evde kalmalısın.","elements":{"Z2":"Bugün","N2":"evde","İm":"kal","F":"-malı","Ö":"sen"},"target_sentence":"You must stay at home today.","tags":["z2","n2","f-mali"]}
{"id":"sent_0002","stage":1,"difficulty":2,"tr_sentence":"Dün okulda dikkatlice bir form doldurdum.","elements":{"Z2":"Dün","N2":"okulda","Z1":"dikkatlice","N1":"bir form","İm":"doldur","F":"-di","Ö":"ben"},"target_sentence":"I carefully filled out a form at school yesterday.","tags":["z1","z2","n1","n2","past"]}
```

## Kullanıcı İşlem Profili

```json
{
  "user_id": "user_0001",
  "metrics": {
    "f_accuracy": 0.92,
    "im_accuracy": 0.81,
    "subject_accuracy": 0.76,
    "z1_accuracy": 0.68,
    "z2_accuracy": 0.74,
    "n1_n2_accuracy": 0.61,
    "english_order_accuracy": 0.83
  },
  "weakest_skills": ["n1_n2", "z1"],
  "next_lesson": "n1-n2-ayrimi"
}
```

## Sonraki Alıştırma Seçimi

Motor sonraki cümleyi şu öncelikle seçer:

1. Kullanıcının en zayıf işlem türü
2. Mevcut etap sırası
3. Önceki cümle zorluğu
4. Kullanıcının ipucu kullanma oranı
5. Son üç denemedeki hata türü

Örnek:

- Kullanıcı üç kez `n2_z2_confusion` yaptıysa sistem zaman zarfı ve edatlı nesne ayrımını çalıştırır.
- Kullanıcı ortaçta başarılı ama imaj sınırında zayıfsa daha çok birleşik yüklem örneği verir.

## MVP Kapsam Sınırı

MVP motoru şu cümleleri tam destekler:

- Tek yüklemli cümleler
- Açık veya gizli özneli cümleler
- Basit zaman zarfları
- Basit durum zarfları
- Edatlı ve edatsız nesneli cümleler
- Temel olumlu, olumsuz, soru ve emir yapıları

MVP motoru şu cümleleri kapsam dışı sayabilir:

- Çok bağlaçlı uzun cümleler
- İç içe yan cümleler
- İleri edilgen yapılar
- Aktarım cümleleri
- Ettirgen yapılar
- Belirsiz veya devrik serbest konuşma cümleleri

