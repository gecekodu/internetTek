Basit PDF Arşivi

- Lokal PDF yükleme ve toplu yükleme (tarayıcıda obje URL ile)
- PDF içi arama (PDF.js ile metin çıkarma)
- `pdf/` klasörü `.gitignore` içinde, PDF'ler repoya eklenmez

Nasıl göndereceğinize dair kısa komutlar:

```bash
git init
git add .
git commit -m "Add PDF archive with local upload and search"
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

Uzak repoya push ederken PDF dosyalarının git'e dahil olmaması için local `pdf/` klasörünüzün `.gitignore` içinde olduğundan emin olun.
