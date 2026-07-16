# User Test Protocol

## Amaç

Bu protokol, Kod Değiştirme İngilizce uygulamasının 5-10 gerçek kullanıcıyla güvenilir ve karşılaştırılabilir biçimde test edilmesi için hazırlanmıştır.

Bu sprintte amaç yeni ürün kararı almak değildir. Amaç, mevcut Test Session akışından öğrenme verisi toplamaktır.

## Katılımcı Kodlama

- Kişisel veri toplanmaz.
- İsim, soyisim, e-posta, telefon, okul, şirket veya yaş gibi doğrudan ya da dolaylı tanımlayıcı bilgi yazılmaz.
- Katılımcılar yalnızca anonim kodla takip edilir:
  - P001
  - P002
  - P003
- Aynı katılımcı için tüm formlarda aynı anonim kod kullanılmalıdır.

## Oturum Yapısı

Her katılımcı aynı akışı izler:

1. Katılımcıya çalışmanın amacı kısaca anlatılır.
2. Katılımcıya kişisel veri toplanmayacağı söylenir.
3. Katılımcıya uygulamada hazır çeviri beklentisi olmadan işlem yapacağı açıklanır.
4. Katılımcı 20 soruluk Test Session akışını tamamlar.
5. Oturum sonunda analitik JSON veya CSV olarak dışa aktarılır.
6. Araştırmacı gözlem formunu doldurur.
7. Katılımcı sonuç şablonu anonim kodla kaydedilir.

## Araştırmacı Talimatı

Araştırmacı test sırasında mümkün olduğunca sessiz kalmalıdır.

Araştırmacı şunları yapabilir:

- Oturumu başlatmak
- Katılımcıya anonim kodunu söylemek
- Teknik bir arıza varsa oturumu yeniden başlatmak
- Katılımcı görevi anlamadıysa yalnızca ekrandaki görevi tekrar okumak

Araştırmacı şunları yapmamalıdır:

- Doğru etiketi söylemek
- Ortaç, imaj, özne, zarf veya nesne için yönlendirme yapmak
- "Burada N2 seçmelisin" gibi ipucu vermek
- İngilizce cümleyi düzeltmek
- Hata Koçu açıklamasını yorumlamak
- Katılımcıya hızlanmasını söylemek
- Test sırasında öğretim yapmak
- Katılımcının yanlışını anlık olarak açıklamak

## Oturum Öncesi Kontrol

- Uygulama production build'den veya doğrulanmış local build'den açılmış olmalı.
- Katılımcı kodu P001 formatında belirlenmiş olmalı.
- Araştırmacı gözlem formu hazır olmalı.
- Ekran kaydı yapılacaksa kişisel veri görünmediği kontrol edilmeli.
- Katılımcıya testin kişiyi değil uygulamayı ölçtüğü söylenmeli.

## Oturum Sonrası Kontrol

- JSON veya CSV dışa aktarımı alınmalı.
- Dosya adı anonim katılımcı koduyla başlamalı.
- Gözlem formu aynı katılımcı koduyla kaydedilmeli.
- Katılımcının kişisel bilgisi hiçbir dosyaya eklenmemeli.
- Tüm dosyalar `docs/research/user-testing/results/` gibi ayrı bir analiz klasöründe saklanmalı.

## Başarı Ölçütleri

Bu testlerden sonra şu sorulara veriyle cevap aranır:

- Katılımcılar cümle çözüm sırasını takip edebiliyor mu?
- En çok hangi etiketlerde hata yapılıyor?
- Hangi cümleler daha uzun sürüyor?
- İlk denemede başarı oranı nedir?
- İpucu kullanımı hangi becerilerde artıyor?
- Transfer cümlelerinde başarı düşüyor mu?

Ürün geliştirme kararları bu veriler toplanmadan verilmemelidir.
