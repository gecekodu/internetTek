const dersler = [
  {
    ad: "Algoritma ve Programlama",
    pdfler: [
      { ad: "01 - Ders Detayları", dosya: "pdf/Algoritma ve Programlama/01 - Ders Detayları.pdf" },
      { ad: "02 - TemelKavramlar ve Algoritmaya Giriş", dosya: "pdf/Algoritma ve Programlama/02 - TemelKavramlar ve Algoritmaya Giriş.pdf" },
      { ad: "03 - SatırKod - AkışDiyagramları", dosya: "pdf/Algoritma ve Programlama/03 - SatırKod - AkışDiyagramları.pdf" },
      { ad: "04 - SatırAlgoritmaAkışDiaygramları-Örnekler", dosya: "pdf/Algoritma ve Programlama/04 - SatırAlgoritmaAkışDiaygramları-Örnekler.pdf" }
    ]
  },
  {
    ad: "İşletim Sistemleri",
    pdfler: [
      { ad: "B1", dosya: "pdf/İşletim Sistemleri/B1.pdf" },
      { ad: "B2", dosya: "pdf/İşletim Sistemleri/B2.pdf" },
      { ad: "B3", dosya: "pdf/İşletim Sistemleri/B3.pdf" },
      { ad: "B4", dosya: "pdf/İşletim Sistemleri/B4.pdf" }
    ]
  },
  {
    ad: "Bilgisayar Mimarisi",
    pdfler: [
      { ad: "CH1", dosya: "pdf/Bilgisayar Mimarisi/Bilgisayar Mimarisi CH1.pdf" },
      { ad: "CH2", dosya: "pdf/Bilgisayar Mimarisi/Bilgisayar Mimarisi CH2.pdf" },
      { ad: "CH4 Notlar", dosya: "pdf/Bilgisayar Mimarisi/Bilgisayar Mimarisi CH4_notlar.pdf" },
      { ad: "CH5 Notlar", dosya: "pdf/Bilgisayar Mimarisi/Bilgisayar Mimarisi CH5_notlar.pdf" }
    ]
  },
  {
    ad: "Nesne Tabanlı Analiz ve Tasarım",
    pdfler: [
      { ad: "1.1 - Nesne Tabanlı Düşünme", dosya: "pdf/Nesne Tabanlı Analiz ve Tasarım/1.1-Nesne Tabanlı Düşünme.pdf" },
      { ad: "1.2 - Yazılım Sürecinde Tasarım", dosya: "pdf/Nesne Tabanlı Analiz ve Tasarım/1.2-Yazılım Sürecinde Tasarım.pdf" },
      { ad: "1.3 - Kalite Nitelikleri için Tasarım", dosya: "pdf/Nesne Tabanlı Analiz ve Tasarım/1.3-Kalite Nitelikleri için Tasarım.pdf" },
      { ad: "2 - Nesne tabanlı Modelleme", dosya: "pdf/Nesne Tabanlı Analiz ve Tasarım/2.Nesne tabanlı Modelleme.pdf" }
    ]
  }
];


/*
  Bu kısım AI yardımıyla yazıldı.
  PDF sayfalarını masaüstünde açık kitap gibi,
  küçük ekranda ise tek sayfa gibi göstermek için kullanılıyor.
  Selamunaleyküm
*/

const derslerAlan = document.getElementById("dersler");
const seciliDers = document.getElementById("seciliDers");
const pdfListe = document.getElementById("pdfListe");
const topluIndir = document.getElementById("topluIndir");
const arama = document.getElementById("arama");

let aktifDers = null;

function pdfleriCiz(pdfler) {
  pdfListe.innerHTML = "";

  pdfler.forEach(function (pdf) {
    const kart = document.createElement("article");
    const baslik = document.createElement("h3");
    const iframe = document.createElement("iframe");
    const link = document.createElement("a");

    kart.className = "pdfKart";

    baslik.textContent = pdf.ad;

    iframe.src = pdf.dosya;
    iframe.title = pdf.ad;

    link.textContent = "Yeni sekmede aç";
    link.href = pdf.dosya;
    link.target = "_blank";

    kart.appendChild(baslik);
    kart.appendChild(iframe);
    kart.appendChild(link);
    pdfListe.appendChild(kart);
  });
}

function aktifDersiAyarla(ders) {
  aktifDers = ders;
  seciliDers.textContent = ders ? ders.ad + " PDF'leri" : "Bir ders seçiniz";
  topluIndir.hidden = !ders;
  pdfleriCiz(ders ? ders.pdfler : []);
}

function dersleriCiz(liste) {
  derslerAlan.innerHTML = "";

  liste.forEach(function (ders) {
    const btn = document.createElement("button");

    btn.textContent = ders.ad;
    btn.onclick = function () {
      aktifDersiAyarla(ders);
    };

    derslerAlan.appendChild(btn);
  });
}

async function zipIndir() {
  if (!aktifDers) {
    return;
  }

  const zip = new JSZip();

  for (const pdf of aktifDers.pdfler) {
    const yanit = await fetch(pdf.dosya);
    const veri = await yanit.blob();
    const dosyaAdi = pdf.dosya.split("/").pop() || (pdf.ad + ".pdf");
    zip.file(dosyaAdi, veri);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const zipAdi = (aktifDers.ad || "pdfler") + ".zip";
  const zipUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");

  a.href = zipUrl;
  a.download = zipAdi;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(zipUrl);
}

function aramayiUygula() {
  const metin = arama.value.toLowerCase().trim();
  const filtreli = dersler.filter(function (ders) {
    if (ders.ad.toLowerCase().indexOf(metin) !== -1) {
      return true;
    }

    return ders.pdfler.some(function (pdf) {
      return pdf.ad.toLowerCase().indexOf(metin) !== -1;
    });
  });

  dersleriCiz(filtreli);

  if (filtreli.length > 0) {
    aktifDersiAyarla(filtreli[0]);
  } else {
    aktifDersiAyarla(null);
  }
}

topluIndir.onclick = zipIndir;
arama.oninput = aramayiUygula;

dersleriCiz(dersler);
aktifDersiAyarla(dersler[0]);
