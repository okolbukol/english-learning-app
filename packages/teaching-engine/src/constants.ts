import type { CoachFeedback, ElementCode, ErrorType, EvaluationStep } from "./types";

export const REQUIRED_ORDER: ElementCode[] = ["Ö", "F", "Z1", "İm", "N1", "N2", "Z2"];

export const STEP_BY_CODE: Record<ElementCode, EvaluationStep> = {
  Ö: "select_subject",
  F: "select_f",
  Z1: "label_z1",
  İm: "select_im",
  N1: "label_n1",
  N2: "label_n2",
  Z2: "label_z2"
};

export const SCORE_WEIGHTS = {
  processOrder: 35,
  elementAccuracy: 30,
  englishOrder: 20,
  finalSentence: 10,
  speaking: 5
} as const;

export const ERROR_FEEDBACK: Record<ErrorType, string> = {
  f_not_found: "Önce yükleme bakıp ortacı bulmalısın.",
  f_wrong: "Seçilen parça ortaç görevini taşımıyor.",
  im_missing: "Ortaçtan önce resmi çizen imaj eksik.",
  im_wrong_boundary: "İmaj sınırı yanlış seçildi; ol/et gibi yardımcılar tek başına imaj olmaz.",
  subject_missing: "Türkçede gizli özne varsa İngilizceye geçmeden görünür yapılmalı.",
  z1_missing: "Durum zarfı bulunamadı.",
  z1_n_confusion: "Durum zarfı nesneyle karıştı; nasıl sorusuna cevap veren öğeyi ara.",
  z2_missing: "Zaman zarfı bulunamadı.",
  n2_z2_confusion: "Bu öğe ne zaman sorusuna değil, nereye/nerede/nereden sorusuna cevap verir.",
  n1_n2_confusion: "Edatlı ve edatsız nesne karıştı.",
  order_wrong: "İngilizce dizilim ana şablona uygun değil.",
  final_sentence_wrong: "Son İngilizce cümle kabul edilen hedeflerden biriyle eşleşmiyor.",
  translation_too_early: "Hazır çeviri işlem yapılmadan gösterilmemeli.",
  unsupported_sentence: "Bu cümle MVP kapsamının dışında."
};

export const ERROR_COACHING: Record<ErrorType, CoachFeedback> = {
  f_not_found: {
    title: "Ortaç eksik",
    why: "Bu yöntemde cümlenin motoru ortaçtır; ortaç bulunmadan İngilizce dizilim kurulamaz.",
    fix: "Yüklemin sonundaki zaman, gereklilik veya yeterlik ekini ayır.",
    miniPractice: "`-malı`, `-di`, `-ecek`, `-ebilir` eklerini üç kısa cümlede işaretle."
  },
  f_wrong: {
    title: "Yanlış ortaç",
    why: "Seçilen parça işi yapan resim değil, cümlenin zaman veya kip parçası olmalıdır.",
    fix: "İmajı değil, imajdan sonra gelen ortaç bölümünü seç.",
    miniPractice: "`bırakmalısın` içinde `bırak` ve `-malı` ayrımını tekrar et."
  },
  im_missing: {
    title: "İmaj eksik",
    why: "İmaj, ortaçtan önce kafada resmi çizen eylemdir.",
    fix: "Ortaçtan hemen sola dön ve resmi çizen kökü seç.",
    miniPractice: "`açmalısın`, `yazdım`, `göndereceğim` kelimelerinde imajı ayır."
  },
  im_wrong_boundary: {
    title: "İmaj sınırı yanlış",
    why: "İmaj gereğinden geniş veya dar seçilirse İngilizce eylem yanlış taşınır.",
    fix: "Sadece resmi çizen eylem kökünü seç; ortaç parçasını imaja katma.",
    miniPractice: "`hazırlamalısın` için imaj `hazırla`, ortaç `-malı` olarak ayır."
  },
  subject_missing: {
    title: "Gizli özne açılmadı",
    why: "Türkçede özne düşebilir; İngilizcede özne görünür olmak zorundadır.",
    fix: "Yüklem ekinden işi yapan kişiyi çıkar ve özne alanına yaz.",
    miniPractice: "`doldurdum`, `almalısın`, `okuyacağım` için özneyi bul."
  },
  z1_missing: {
    title: "Durum zarfı eksik",
    why: "Z1, işin nasıl yapıldığını söyler ve İngilizce dizilimde imajdan önce gelir.",
    fix: "`Nasıl?` sorusuna cevap veren öğeyi ara.",
    miniPractice: "`gizlice`, `dikkatlice`, `sessizce` öğelerini Z1 olarak etiketle."
  },
  z1_n_confusion: {
    title: "Durum zarfı nesne sanıldı",
    why: "Z1 bir nesne değil, işin yapılma biçimidir.",
    fix: "Öğe `neyi?` değil `nasıl?` sorusuna cevap veriyorsa Z1 seç.",
    miniPractice: "`bir paket`, `gizlice`, `bu formu` öğelerini N1/Z1 diye ayır."
  },
  z2_missing: {
    title: "Zaman zarfı eksik",
    why: "Z2, işin zamanını verir ve İngilizce dizilimin sonunda yer alır.",
    fix: "`Ne zaman?` sorusuna cevap veren edatsız zaman öğesini seç.",
    miniPractice: "`bugün`, `yarın`, `geçen hafta` öğelerini Z2 olarak etiketle."
  },
  n2_z2_confusion: {
    title: "Edatlı nesne zaman zarfı sanıldı",
    why: "N2 yön, yer, araç veya ilişki bilgisi verir; Z2 yalnızca zaman cevabıdır.",
    fix: "Öğe `ne zaman?` yerine `nereye/nerede/nereden/kime?` cevabıysa N2 seç.",
    miniPractice: "`ofise`, `bugün`, `evde`, `dün` öğelerini N2/Z2 olarak ayır."
  },
  n1_n2_confusion: {
    title: "N1 ve N2 karıştı",
    why: "N1 edatsız nesnedir; N2 edat veya yön/yer ilişkisi taşıyan nesnedir.",
    fix: "Edatlı, yönlü veya yer bildiren öğeyi N2; doğrudan nesneyi N1 seç.",
    miniPractice: "`bir paket`, `ofise`, `kapıyı`, `masaya` öğelerini N1/N2 diye ayır."
  },
  order_wrong: {
    title: "İngilizce dizilim yanlış",
    why: "Etap 1 ana sıra bozulursa doğru öğeler yanlış cümleye dönüşür.",
    fix: "Öğeleri `Ö + F + Z1 + İm + N1 + N2 + Z2` sırasına yerleştir.",
    miniPractice: "Bir doğru çözümü al ve öğeleri sıraya üç kez yeniden diz."
  },
  final_sentence_wrong: {
    title: "Son cümle hedefle eşleşmedi",
    why: "Öğeler doğru olsa bile İngilizce üretimde kelime veya sıra hatası kalmış olabilir.",
    fix: "Önce dizilimi kontrol et, sonra hedef kelime seçimlerini düzelt.",
    miniPractice: "Aynı çözümde sadece İngilizce cümleyi yeniden yaz."
  },
  translation_too_early: {
    title: "Çeviri erken istendi",
    why: "Bu ürünün değeri hazır çeviri değil, işlem sırasını öğrenmektir.",
    fix: "Önce ortaç, imaj ve öğeleri etiketle; çeviri en sonda kontrol edilir.",
    miniPractice: "Bir cümlede İngilizce yazmadan sadece kodlama adımlarını tamamla."
  },
  unsupported_sentence: {
    title: "Cümle MVP kapsamı dışında",
    why: "MVP tek yüklemli Etap 1 cümlelerini güvenli biçimde destekler.",
    fix: "Cümleyi daha kısa, tek yüklemli ve bağlaçsız hale getir.",
    miniPractice: "Uzun cümleyi iki kısa Etap 1 cümlesine böl."
  }
};
