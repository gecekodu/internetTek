const dersler = [
  {
    ad: "İşletim Sistemleri",
    pdfler: [
      { ad: "B1", dosya: "pdf/İşletim Sistemleri/B1.pdf" },
      { ad: "B2", dosya: "pdf/İşletim Sistemleri/B2.pdf" },
      { ad: "B3", dosya: "pdf/İşletim Sistemleri/B3.pdf" },
      { ad: "B4", dosya: "pdf/İşletim Sistemleri/B4.pdf" },
      { ad: "B5", dosya: "pdf/İşletim Sistemleri/B5.pdf" },
      { ad: "B6", dosya: "pdf/İşletim Sistemleri/B6.pdf" },
      { ad: "B7", dosya: "pdf/İşletim Sistemleri/B7.pdf" },
      { ad: "B8", dosya: "pdf/İşletim Sistemleri/B8.pdf" }
    ]
  },
  {
    ad: "Algoritmalar",
    pdfler: [
      { ad: "Algoritmalar", dosya: "pdf/algoritmalar.pdf" }
    ]
  },
  {
    ad: "Bilgisayar Mimarisi",
    pdfler: [
      { ad: "CH1", dosya: "pdf/Bilgisayar Mimarisi CH1.pdf" }
    ]
  },
  {
    ad: "Lineer Cebir",
    pdfler: [
      { ad: "Lineer Cebir", dosya: "pdf/lineer_cebir.pdf.pdf" }
    ]
  }
];

const derslerAlan = document.getElementById("dersler");
const seciliDers = document.getElementById("seciliDers");
const pdfListe = document.getElementById("pdfListe");
const arama = document.getElementById("arama");

let aktifDers = dersler[0];

function dersFiltrele(aramaMetni) {
  return dersler.filter(function (ders) {
    const dersAdi = ders.ad.toLowerCase();
    const pdfEslesti = ders.pdfler.some(function (pdf) {
      const metin = (pdf.ad + " " + pdf.dosya).toLowerCase();
      return metin.indexOf(aramaMetni) !== -1;
    });

    return dersAdi.indexOf(aramaMetni) !== -1 || pdfEslesti;
  });
}

function pdfleriCiz(pdfler, aramaMetni) {
  pdfListe.innerHTML = "";

  const filtreliPdfler = pdfler.filter(function (pdf) {
    const metin = (pdf.ad + " " + pdf.dosya).toLowerCase();
    return metin.indexOf(aramaMetni) !== -1;
  });

  if (filtreliPdfler.length === 0) {
    pdfListe.innerHTML = '<p class="bosMesaj">Sonuç bulunamadı.</p>';
    return;
  }

  filtreliPdfler.forEach(function (pdf) {
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
    link.rel = "noopener";

    kart.appendChild(baslik);
    kart.appendChild(iframe);
    kart.appendChild(link);
    pdfListe.appendChild(kart);
  });
}

function dersleriCiz() {
  derslerAlan.innerHTML = "";

  dersler.forEach(function (ders) {
    const btn = document.createElement("button");

    btn.textContent = ders.ad;
    btn.onclick = function () {
      aktifDers = ders;
      seciliDers.textContent = ders.ad + " PDF'leri";
      pdfleriCiz(ders.pdfler, arama.value.trim().toLowerCase());

      document.querySelectorAll("#dersler button").forEach(function (b) {
        b.classList.remove("aktif");
      });
      btn.classList.add("aktif");
    };

    derslerAlan.appendChild(btn);
  });
}

arama.addEventListener("input", function () {
  const arananMetin = arama.value.trim().toLowerCase();
  const eslesenDersler = dersFiltrele(arananMetin);

  derslerAlan.innerHTML = "";

  if (arananMetin === "") {
    dersleriCiz();
    document.querySelector("#dersler button").click();
    return;
  }

  eslesenDersler.forEach(function (ders) {
    const btn = document.createElement("button");

    btn.textContent = ders.ad;
    btn.onclick = function () {
      aktifDers = ders;
      seciliDers.textContent = ders.ad + " PDF'leri";
      pdfleriCiz(ders.pdfler, arananMetin);

      document.querySelectorAll("#dersler button").forEach(function (b) {
        b.classList.remove("aktif");
      });
      btn.classList.add("aktif");
    };

    derslerAlan.appendChild(btn);
  });

  if (eslesenDersler.length > 0) {
    aktifDers = eslesenDersler[0];
    seciliDers.textContent = aktifDers.ad + " PDF'leri";

    document.querySelectorAll("#dersler button").forEach(function (b) {
      b.classList.remove("aktif");
    });

    const ilkButon = document.querySelector("#dersler button");
    if (ilkButon) {
      ilkButon.classList.add("aktif");
    }

    pdfleriCiz(aktifDers.pdfler, arananMetin);
    return;
  }

  seciliDers.textContent = "Sonuç bulunamadı";
  pdfListe.innerHTML = '<p class="bosMesaj">Sonuç bulunamadı.</p>';
});

dersleriCiz();
document.querySelector("#dersler button").click();