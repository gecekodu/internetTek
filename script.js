let arama = document.getElementById("arama");
let butonlar = document.querySelectorAll(".kitap-btn");
let kitapAdi = document.getElementById("kitapAdi");
let bilgi = document.getElementById("sayfaBilgi");
let geri = document.getElementById("geri");
let ileri = document.getElementById("ileri");

let solCanvas = document.getElementById("solSayfa");
let sagCanvas = document.getElementById("sagSayfa");

let pdfDosya = null;
let sayfaNo = 1;

arama.onkeyup = function () {
  let yazi = arama.value.toLowerCase();

  for (let i = 0; i < butonlar.length; i++) {
    if (butonlar[i].textContent.toLowerCase().includes(yazi)) {
      butonlar[i].style.display = "inline-block";
    } else {
      butonlar[i].style.display = "none";
    }
  }
};

/*
  Bu kısım AI yardımıyla yazıldı.
  PDF sayfalarını masaüstünde açık kitap gibi,
  küçük ekranda ise tek sayfa gibi göstermek için kullanılıyor.
*/

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

async function sayfaCiz(pdf, no, canvas) {
  let ctx = canvas.getContext("2d");

  if (no > pdf.numPages) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  let page = await pdf.getPage(no);
  let viewport = page.getViewport({ scale: 1.4 });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: ctx,
    viewport: viewport
  }).promise;
}

async function goster() {
  if (!pdfDosya) return;

  if (window.innerWidth <= 900) {
    await sayfaCiz(pdfDosya, sayfaNo, solCanvas);
    bilgi.textContent = "Sayfa: " + sayfaNo;
  } else {
    await sayfaCiz(pdfDosya, sayfaNo, solCanvas);
    await sayfaCiz(pdfDosya, sayfaNo + 1, sagCanvas);
    bilgi.textContent = "Sayfa: " + sayfaNo + " - " + (sayfaNo + 1);
  }
}

for (let i = 0; i < butonlar.length; i++) {
  butonlar[i].onclick = async function () {
    let dosya = this.getAttribute("data-pdf");
    kitapAdi.textContent = this.textContent;
    sayfaNo = 1;

    pdfDosya = await pdfjsLib.getDocument(dosya).promise;
    goster();
  };
}

ileri.onclick = function () {
  if (!pdfDosya) return;

  if (window.innerWidth <= 900) {
    if (sayfaNo < pdfDosya.numPages) {
      sayfaNo += 1;
      goster();
    }
  } else {
    if (sayfaNo + 2 <= pdfDosya.numPages) {
      sayfaNo += 2;
      goster();
    }
  }
};

geri.onclick = function () {
  if (!pdfDosya) return;

  if (window.innerWidth <= 900) {
    if (sayfaNo > 1) {
      sayfaNo -= 1;
      goster();
    }
  } else {
    if (sayfaNo - 2 >= 1) {
      sayfaNo -= 2;
      goster();
    }
  }
};

window.onresize = function () {
  goster();
};