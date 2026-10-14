/**
 * Iranian banks data
 *
 * Fields:
 *  - code:       stable English slug, also the icon file name (icons/<variant>/<code>.svg)
 *  - name:       Persian name
 *  - nameEn:     English name
 *  - bins:       6-digit card prefixes (Shetab BIN)
 *  - shebaCode:  3-digit bank code inside the IBAN (digits 5-7), or null
 *  - status:     "active" | "merged"
 *  - mergedInto: code of the acquiring bank (only when status is "merged")
 */

const bank = (code, name, nameEn, bins, shebaCode, extra = {}) =>
  Object.freeze({
    code,
    name,
    nameEn,
    bins: Object.freeze(bins),
    shebaCode,
    status: extra.mergedInto ? "merged" : "active",
    ...(extra.mergedInto && { mergedInto: extra.mergedInto }),
  });

const BANKS = Object.freeze([
  bank("markazi", "بانک مرکزی", "Central Bank of Iran", ["636795", "636797"], "010"),
  bank("melli", "بانک ملی", "Bank Melli Iran", ["603799", "170019"], "017"),
  bank("sepah", "بانک سپه", "Bank Sepah", ["589210"], "015"),
  bank("saderat", "بانک صادرات", "Bank Saderat Iran", ["603769", "903769"], "019"),
  bank("mellat", "بانک ملت", "Bank Mellat", ["610433", "991975"], "012"),
  bank("tejarat", "بانک تجارت", "Tejarat Bank", ["627353", "585983"], "018"),
  bank("maskan", "بانک مسکن", "Bank Maskan", ["628023"], "014"),
  bank("keshavarzi", "بانک کشاورزی", "Agriculture Bank (Keshavarzi)", ["603770", "639217"], "016"),
  bank("refah", "بانک رفاه کارگران", "Refah Bank", ["589463"], "013"),
  bank("post", "پست بانک ایران", "Post Bank of Iran", ["627760"], "021"),
  bank("tosee-taavon", "بانک توسعه تعاون", "Cooperative Development Bank", ["502908"], "022"),
  bank("tosee-saderat", "بانک توسعه صادرات", "Export Development Bank of Iran", ["627648", "207177"], "020"),
  bank("sanat-madan", "بانک صنعت و معدن", "Bank of Industry and Mine", ["627961"], "011"),
  bank("mehr-iran", "بانک قرض‌الحسنه مهر ایران", "Mehr Iran Bank", ["606373"], "060"),
  bank("resalat", "بانک قرض‌الحسنه رسالت", "Resalat Bank", ["504172"], "070"),
  bank("tosee", "موسسه اعتباری توسعه", "Tose'e Credit Institution", ["628157"], "051"),
  bank("parsian", "بانک پارسیان", "Parsian Bank", ["622106", "627884", "639194"], "054"),
  bank("pasargad", "بانک پاسارگاد", "Bank Pasargad", ["502229", "639347"], "057"),
  bank("saman", "بانک سامان", "Saman Bank", ["621986"], "056"),
  bank("eghtesad-novin", "بانک اقتصاد نوین", "EN Bank (Eghtesad Novin)", ["627412"], "055"),
  bank("ayandeh", "بانک آینده", "Ayandeh Bank", ["636214"], "062"),
  bank("shahr", "بانک شهر", "Shahr Bank", ["502806", "504706"], "061"),
  bank("day", "بانک دی", "Day Bank", ["502938"], "066"),
  bank("sina", "بانک سینا", "Sina Bank", ["639346"], "059"),
  bank("sarmayeh", "بانک سرمایه", "Sarmayeh Bank", ["639607"], "058"),
  bank("gardeshgari", "بانک گردشگری", "Tourism Bank (Gardeshgari)", ["505416", "505426"], "064"),
  bank("iran-zamin", "بانک ایران زمین", "Iran Zamin Bank", ["505785"], "069"),
  bank("karafarin", "بانک کارآفرین", "Karafarin Bank", ["627488", "502910"], "053"),
  bank("khavarmiane", "بانک خاورمیانه", "Middle East Bank", ["585947"], "078"),
  bank("melal", "بانک ملل", "Melal Credit Institution", ["606256"], "075"),
  bank("iran-venezuela", "بانک ایران و ونزوئلا", "Iran-Venezuela Bilateral Bank", [], "095"),

  // Merged banks — their cards are still valid and processed by the acquirer.
  bank("ansar", "بانک انصار", "Ansar Bank", ["627381"], "063", { mergedInto: "sepah" }),
  bank("ghavamin", "بانک قوامین", "Ghavamin Bank", ["639599"], "052", { mergedInto: "sepah" }),
  bank("hekmat", "بانک حکمت ایرانیان", "Hekmat Iranian Bank", ["636949"], "065", { mergedInto: "sepah" }),
  bank("mehr-eghtesad", "بانک مهر اقتصاد", "Mehr Eghtesad Bank", ["639370"], "079", { mergedInto: "sepah" }),
  bank("kosar", "موسسه اعتباری کوثر", "Kosar Credit Institution", ["505801"], "073", { mergedInto: "sepah" }),
  bank("noor", "موسسه اعتباری نور", "Noor Credit Institution", ["507677"], "080", { mergedInto: "melli" }),
]);

module.exports = { BANKS };
