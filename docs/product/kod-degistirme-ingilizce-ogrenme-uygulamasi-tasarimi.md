# Kod Degistirme Temelli Ingilizce Ogrenme Uygulamasi

## Amaç

Bu uygulama, Türkçe bilen bir kişiye İngilizceyi doğrudan İngilizce gramer ezberiyle değil, Türkçe cümleyi çözüp İngilizce cümle matematiğine dönüştürerek öğretir. Ekli 1-4. etap sunumları uygulamanın kesin öğretim kuralı kabul edilir.

Uygulamanın temel vaadi:

> Kullanıcı önce kendi Türkçesini doğru parçalar, sonra parçaları kodlar, sonra İngilizce dizilime yerleştirir, en son konuşur.

## Değişmez Öğretim Kuralları

1. Dersler kelime ezberiyle başlamaz; kelime türleri, cümle öğeleri ve cümle dizilimiyle başlar.
2. Kullanıcı her cümlede önce ortacı bulur.
3. Ortaçtan sonra imaj, özne, durum zarfı, zaman zarfı, edatsız nesne ve edatlı nesne bulunur.
4. İngilizce cümle dizilimi ana şablon olarak `Ö + F + Z1 + İm + N1 + N2 + Z2` kabul edilir.
5. Türkçeden İngilizceye geçişte kullanıcı cümleyi önce böler, sonra parçalar, sonra yönetir.
6. İsim grupları `E + B + S + İ2 + İ` mantığıyla okutulur.
7. Türkçedeki kısalmalar, düşen öğeler ve gizli anlamlar görünür hale getirilmeden İngilizceye geçilmez.
8. Her yeni konu önce Türkçe mantığıyla, sonra İngilizce karşılığıyla, en son üretim alıştırmasıyla öğretilir.
9. Uygulama "doğru cevap" kadar "doğru işlem sırası"nı da değerlendirir.
10. Kullanıcı hazır çeviri görmeden önce kendi analizini yapmak zorundadır.

## Hedef Kullanıcı

Uygulama Türkçe bilen herkes için tasarlanır:

- İngilizceye sıfırdan başlayanlar
- Gramer bilen ama cümle kuramayanlar
- Okuduğunu anlayan fakat konuşamayanlar
- YDS/YÖKDİL benzeri sınavlara çalışanlar
- İngilizceyi Türkçe mantığıyla sistemli öğrenmek isteyen yetişkinler

Uygulama çocuklaştırılmış bir deneyim sunmaz. Arayüz sade, açık, işlem adımları net ve tekrar edilebilir olmalıdır.

## Müfredat Yapısı

### Etap 1: Cümlenin Motoru

Öğretilenler:

- Kelime türleri: isim, sıfat, belirteç, edat, eylem, ortaç
- Alfa kelime
- İsim grubu mantığı
- Cümle öğeleri
- Yüklem, imaj, ortaç, özne
- Durum zarfı, zaman zarfı, nesne
- İngilizcenin ana dizilimi
- Türkçeden İngilizceye yol haritası
- İngilizceden Türkçeye yol haritası
- Olumlu, olumsuz, soru ve emir yapıları

Uygulama ekranı:

- "Cümleyi Çöz" çalışma alanı
- Türkçe cümle kutusu
- Ortaç seçici
- İmaj seçici
- Özne/Nesne/Zarf etiketleme alanı
- İngilizce dizilim çubuğu
- Sonuç cümlesi

### Etap 2: Dönüştürme Katmanı

Öğretilenler:

- İlgi eki
- `to` ve `-ing`
- `going to`
- geçmiş zaman
- fiil halleri: x1, x2, x3
- cümle kalıpları
- `-di`li zamanlar

Uygulama ekranı:

- "Türkçeyi Aç" modu
- Kullanıcıya kısa Türkçe cümle verilir.
- Uygulama gizli veya kısalmış yapıları işaretletir.
- Kullanıcı T1 cümleyi T2 cümleye dönüştürür.
- Sonra İngilizceye taşır.

### Etap 3: İleri Cümle İşlemleri

Öğretilenler:

- Edilgen yapı
- Yardımcı ortaç
- var/yok ve sahiplik
- daha/en
- sıklık ve miktar zarfları

Uygulama ekranı:

- "Yapı Dedektörü"
- Kullanıcı cümlede edilgenlik, sahiplik, karşılaştırma veya zarf türü arar.
- Uygulama yalnızca doğru yapıyı değil, yapının neden o yapı olduğunu da doğrular.

### Etap 4: Cümleleri Birleştirme ve Konuşma

Öğretilenler:

- Temel bağlaçlar: and, or, but
- Dış bağlaçlar
- İç bağlaçlar
- if/when/because/although/as soon as gibi bağlayıcı mantıkları
- aktarım
- ettirgen yapı
- konuşmanın matematiği

Uygulama ekranı:

- "Cümle Birleştirici"
- "Bağlaç Haritası"
- "Konuşma Antrenörü"
- Aynı öğeleri düşürme alıştırmaları
- Bağlaçlı cümlelerde sıra değiştirme alıştırmaları

## Ana Ürün Deneyimi

### 1. Başlangıç Testi

Kullanıcıya gramer terimleri sorulmaz. Bunun yerine 12 kısa görev verilir:

- Ortacı bul
- İmajı bul
- Özne nerede?
- Bu kelime isim mi sıfat mı?
- Bu öğe edatlı mı edatsız mı?
- Türkçe cümleyi İngilizce sıraya koy
- Verilen İngilizce cümleyi Türkçe öğelerine ayır

Sonuçta kullanıcı bir seviyeye değil, işlem haritasına yerleştirilir:

- Kelime türleri eksik
- Cümle öğeleri eksik
- Dizilim eksik
- Zaman/ortaç eksik
- Bağlaç eksik
- Konuşma pratiği hazır

### 2. Günlük Ders

Her günlük ders 20-30 dakika sürer ve aynı ritmi takip eder:

1. Kuralı gör
2. Türkçe örneği parçala
3. Kodları yerleştir
4. İngilizce sıraya diz
5. Cümleyi üret
6. Cümleyi sesli söyle
7. Hatanın sebebini gör
8. Benzer 5 cümle çöz

### 3. Cümle Laboratuvarı

Kullanıcının istediği Türkçe cümleyi yazdığı serbest alan.

Uygulama şu sırayla çalışır:

1. Cümleyi yüklem adaylarına böler.
2. Ortaç adaylarını gösterir.
3. Kullanıcıdan ortaç seçmesini ister.
4. İmajı işaretletir.
5. Öğeleri `Ö, F, Z1, İm, N1, N2, Z2` olarak etiketletir.
6. İsim gruplarını `E, B, S, İ2, İ` olarak parçalattırır.
7. İngilizce yerleşim alanını açar.
8. Son cümleyi üretmeden önce kullanıcıya "sen diz" görevi verir.

Uygulama hiçbir zaman ilk adımda hazır çeviri vermez.

### 4. Hata Koçu

Hata mesajları klasik "yanlış" biçiminde olmaz. Her hata bir işlem hatasına bağlanır:

- Ortaç yanlış bulundu.
- İmaj eksik seçildi.
- Edatlı nesne zaman zarfı sanıldı.
- Türkçedeki gizli özne açılmadı.
- Sıfat isim gibi kullanıldı ama İngilizcede `one` veya gerçek isim eklenmedi.
- Edilgen yapı T2'ye çevrilmeden İngilizceye geçildi.
- Bağlaçlı cümlede iki cümlenin sırası yanlış kuruldu.

### 5. Konuşma Modu

Konuşma modu ezber cümle tekrarına dayanmaz. Kullanıcıya Türkçe düşünce verilir:

Örnek görev:

> "Dün ofiste müdüre gizlice bir dosya vermeliydim."

Kullanıcı bunu adım adım çözer:

- Dün: Z2
- ofiste: N2
- müdüre: N2
- gizlice: Z1
- dosya: N1
- ver: İm
- -meliydi: F
- ben: Ö

Sonra İngilizce sıraya dizer ve sesli söyler.

## Ekran Tasarımları

### Ana Ekran

Sol bölüm:

- Bugünkü ders
- Devam eden etap
- Zayıf işlem türü
- Son çözülen cümle

Orta bölüm:

- Büyük çalışma alanı
- Cümle çözüm kartı
- Renkli öğe şeritleri

Sağ bölüm:

- Ortaç listesi
- Edat listesi
- Bağlaç listesi
- Fiil x1/x2/x3 mini sözlüğü

### Cümle Çözüm Ekranı

Üstte Türkçe cümle:

`Yarın ofise gizlice bir paket bırakmalısın.`

Altında işlem şeritleri:

- Ortaç: `-malı`
- İmaj: `bırak`
- Özne: `sen`
- Z1: `gizlice`
- N1: `bir paket`
- N2: `ofise`
- Z2: `yarın`

En altta İngilizce şablon:

`Ö | F | Z1 | İm | N1 | N2 | Z2`

Kullanıcı öğeleri sürükleyerek bu şablona yerleştirir.

### Müfredat Haritası

Harita dört ana etap şeklindedir:

- Etap 1: Cümle iskeleti
- Etap 2: Dönüşüm kuralları
- Etap 3: Yapı derinliği
- Etap 4: Bağlaç ve konuşma

Her etapta üç durum gösterilir:

- Öğrendin
- İşlemde hata yapıyorsun
- Konuşmada kullanabiliyorsun

## Alıştırma Türleri

1. Kelime türü işaretleme
2. Alfa kelime bulma
3. İsim grubu parçalama
4. Ortaç bulma
5. İmaj bulma
6. Özne çıkarma
7. Zarf/nesne ayırma
8. Edatlı-edatsız nesne ayırma
9. Türkçe öğeleri İngilizce sıraya dizme
10. İngilizce cümleyi Türkçeye geri kodlama
11. T1 cümleyi T2 cümleye açma
12. Edilgen yapı dönüştürme
13. `to` / `-ing` seçimi
14. Bağlaçlı cümle birleştirme
15. Konuşma üretimi

## Öğrenme Motoru

Uygulama her cümleyi şu veri modeliyle saklar:

```json
{
  "tr_sentence": "Yarın ofise gizlice bir paket bırakmalısın.",
  "tokens": [],
  "elements": {
    "O": "sen",
    "F": "-malı",
    "Z1": "gizlice",
    "Im": "bırak",
    "N1": "bir paket",
    "N2": "ofise",
    "Z2": "yarın"
  },
  "english_order": ["O", "F", "Z1", "Im", "N1", "N2", "Z2"],
  "target_sentence": "You must secretly drop a package to the office tomorrow.",
  "lesson_tags": ["etap-1", "ortac", "nesne", "zarf"]
}
```

Skor sadece sonuç cümlesine göre verilmez. Ağırlıklar:

- İşlem sırası: yüzde 35
- Öğeleri doğru bulma: yüzde 30
- İngilizce dizilim: yüzde 20
- Kelime seçimi: yüzde 10
- Telaffuz/akıcılık: yüzde 5

## Yapay Zeka Kullanımı

Yapay zeka uygulamada öğretmen gibi değil, işlem denetçisi gibi çalışır.

Yapabilecekleri:

- Kullanıcının yazdığı Türkçe cümleyi zorluk seviyesine göre seçmek
- Öğeleri otomatik önermek
- Hatanın hangi işlemden kaynaklandığını açıklamak
- Kullanıcıya aynı kurala ait yeni cümle üretmek
- Konuşma pratiğinde anlık geri bildirim vermek

Yapmaması gerekenler:

- İlk denemede hazır çeviri vermek
- Sunumlardaki işlem sırasını atlamak
- Gramer terimini yöntemden kopuk anlatmak
- Kullanıcıyı sadece kelime ezberine yönlendirmek

## Kişiselleştirme

Her kullanıcı için bir "işlem profili" tutulur:

- Ortaç bulma doğruluğu
- İmaj bulma doğruluğu
- Özne çıkarma başarısı
- N1/N2 ayırma başarısı
- Z1/Z2 ayırma başarısı
- T1 -> T2 dönüşüm başarısı
- Bağlaçlı cümle başarısı
- Konuşmada kullanma başarısı

Uygulama dersleri seviyeye göre değil, kullanıcının bozduğu işlem türüne göre tekrarlar.

## Başarı Ölçütleri

Uygulama başarılı sayılırsa kullanıcı şunları yapabilir:

1. Türkçe bir cümlede yüklemi ve ortacı bulabilir.
2. İmajı doğru ayırabilir.
3. Gizli özneyi görünür hale getirebilir.
4. Nesne, edatlı nesne, durum zarfı ve zaman zarfını ayırabilir.
5. Türkçe cümleyi İngilizce ana dizilime taşıyabilir.
6. Edilgen, bağlaçlı, sahiplikli ve karşılaştırmalı yapıları sistem içinde kurabilir.
7. Hazır kalıp ezberlemeden kendi cümlesini konuşabilir.

## İlk Sürüm Kapsamı

MVP için yeterli kapsam:

- Etap 1'in tamamı
- Etap 2'den `to`, `-ing`, geçmiş zaman ve `going to`
- Etap 3'ten edilgen yapı
- Etap 4'ten temel bağlaçlar
- Cümle laboratuvarı
- Hata koçu
- Günlük ders akışı
- 300 çözümlü örnek cümle

İlk sürümde canlı konuşma puanlama şart değildir. Sesli tekrar ve kullanıcı kaydı yeterlidir.

## Ürün İlkesi

Bu uygulama İngilizceyi "yabancı bir sistem" gibi değil, Türkçe bilen kişinin zihnindeki cümleyi başka bir koda taşıma işlemi gibi öğretir. Bu nedenle tasarımın kalbi çeviri sonucu değil, cümleyi çözme sürecidir.
