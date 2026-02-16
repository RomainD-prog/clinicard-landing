# CliniCard Website

Site web officiel pour [clinicard.fr](https://clinicard.fr) - Application de révision médicale intelligente.

## 📋 Vue d'ensemble

Site statique HTML/CSS/JS conçu pour :
- Présenter l'application CliniCard
- Optimiser le SEO pour les recherches médicales (révision PASS, EDN, ECOS)
- Rediriger vers les stores (App Store, Google Play)
- Fournir des informations aux étudiants en médecine

## 🎨 Design System

Le site suit exactement le design de l'application :
- **Couleurs principales** : `#1D4ED8` (bleu primary), `#10B981` (vert accent)
- **Police** : Lexend (via Google Fonts)
- **Style** : Clean, moderne, médical professionnel
- **Inspiration** : Doctolib + Duolingo (professionnalisme + engagement)

## 📁 Structure des fichiers

```
website/
├── index.html          # Page principale
├── styles.css          # Styles CSS complets
├── script.js           # Scripts interactifs
├── assets/
│   ├── logo.svg        # Logo CliniCard
│   ├── favicon.png     # Favicon (copié depuis app)
│   ├── icon.png        # Icône app (copié depuis app)
│   ├── app-screenshot.png  # Capture d'écran de l'app
│   └── og-image.png    # Image Open Graph pour réseaux sociaux
└── README.md           # Ce fichier
```

## 🚀 Déploiement

### Option 1 : GitHub Pages (Gratuit)

1. **Créer un dépôt pour le site** :
```bash
cd /Users/romain.durieux/Documents/medflash/website
git init
git add .
git commit -m "Initial commit - CliniCard website"
```

2. **Créer un nouveau repo sur GitHub** (ex: `clinicard-website`)

3. **Push le code** :
```bash
git remote add origin https://github.com/YOUR_USERNAME/clinicard-website.git
git branch -M main
git push -u origin main
```

4. **Activer GitHub Pages** :
   - Aller dans Settings > Pages
   - Source : Deploy from branch `main` / folder `/ (root)`
   - Sauvegarder

5. **Configurer le domaine personnalisé** :
   - Dans Settings > Pages > Custom domain : `clinicard.fr`
   - Créer un fichier `CNAME` avec le contenu : `clinicard.fr`
   - Chez votre registrar de domaine, ajouter les DNS records :
     ```
     Type: A
     Name: @
     Value: 185.199.108.153
     
     Type: A
     Name: @
     Value: 185.199.109.153
     
     Type: A
     Name: @
     Value: 185.199.110.153
     
     Type: A
     Name: @
     Value: 185.199.111.153
     
     Type: CNAME
     Name: www
     Value: YOUR_USERNAME.github.io
     ```

### Option 2 : Netlify (Recommandé - Plus simple)

1. **Créer un compte sur [Netlify](https://netlify.com)**

2. **Deploy le site** :
   - Drag & drop le dossier `website` dans Netlify
   - OU : Connect to Git et sélectionner votre repo

3. **Configurer le domaine** :
   - Dans Site settings > Domain management
   - Add custom domain : `clinicard.fr`
   - Suivre les instructions pour configurer les DNS

4. **DNS sur votre registrar** :
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: YOUR_SITE.netlify.app
   ```

### Option 3 : Vercel

1. **Installer Vercel CLI** :
```bash
npm i -g vercel
```

2. **Deploy** :
```bash
cd /Users/romain.durieux/Documents/medflash/website
vercel
```

3. **Configurer le domaine** :
```bash
vercel domains add clinicard.fr
```

### Option 4 : Serveur personnel (OVH, etc.)

1. **Upload via FTP/SFTP** :
   - Transférer tous les fichiers du dossier `website/` vers `/var/www/html/` ou `/public_html/`

2. **Configuration Apache (.htaccess)** :
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

3. **Configuration Nginx** :
```nginx
server {
    listen 80;
    server_name clinicard.fr www.clinicard.fr;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name clinicard.fr www.clinicard.fr;
    
    root /var/www/clinicard;
    index index.html;
    
    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/clinicard.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/clinicard.fr/privkey.pem;
    
    # Compression
    gzip on;
    gzip_types text/css text/javascript application/javascript image/svg+xml;
    
    # Cache headers
    location ~* \.(svg|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(css|js)$ {
        expires 1M;
        add_header Cache-Control "public";
    }
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## 🔗 Mise à jour des liens App Store / Google Play

Quand les apps seront publiées, mettre à jour dans `index.html` :

### iOS App Store
Remplacer `href="#"` par :
```html
<a href="https://apps.apple.com/app/idXXXXXXXXXX" class="store-button store-ios">
```

Pour obtenir le lien :
1. Une fois l'app publiée sur App Store Connect
2. L'ID sera visible dans l'URL : `https://appstoreconnect.apple.com/apps/XXXXXXXXXX`
3. Le lien public sera : `https://apps.apple.com/app/idXXXXXXXXXX`

### Google Play Store
Remplacer `href="#"` par :
```html
<a href="https://play.google.com/store/apps/details?id=com.romaindurieux.medflash" class="store-button store-android">
```

Note : Le package name est déjà configuré dans `app.json` : `com.romaindurieux.medflash`

## 📊 SEO & Analytics

### Mots-clés ciblés
- révision médicale
- flashcards médecine
- QCM PASS / EDN / ECOS
- application étudiant médecine
- révision concours médecine
- apprentissage médical IA

### Ajouter Google Analytics (optionnel)

Ajouter avant `</head>` dans `index.html` :
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Soumettre à Google Search Console

1. Aller sur [Google Search Console](https://search.google.com/search-console)
2. Ajouter la propriété `clinicard.fr`
3. Vérifier via DNS ou balise meta
4. Soumettre le sitemap (optionnel pour site simple)

## 🔧 Maintenance

### Mettre à jour les statistiques

Dans `index.html`, section hero-stats (ligne ~97) :
```html
<div class="stat">
    <div class="stat-value">10k+</div> <!-- Mettre à jour ici -->
    <div class="stat-label">Flashcards créées</div>
</div>
```

### Ajouter un blog (futur)

Créer un dossier `blog/` avec des articles en HTML pour améliorer le SEO :
- "Comment réussir le PASS avec les flashcards"
- "5 techniques de mémorisation pour les études médicales"
- etc.

## 📱 Test local

Pour tester le site localement :

```bash
cd /Users/romain.durieux/Documents/medflash/website

# Option 1 : Python
python3 -m http.server 8000

# Option 2 : Node.js (npx)
npx serve .

# Option 3 : VS Code - Live Server extension
# Clic droit > Open with Live Server
```

Puis ouvrir : `http://localhost:8000`

## ✅ Checklist avant mise en production

- [ ] Vérifier tous les liens internes
- [ ] Tester sur mobile (responsive)
- [ ] Tester performance (Lighthouse / PageSpeed Insights)
- [ ] Vérifier les images sont optimisées
- [ ] Configurer HTTPS/SSL
- [ ] Ajouter les vrais liens App Store / Google Play
- [ ] Tester meta tags Open Graph (Facebook Debugger)
- [ ] Soumettre à Google Search Console
- [ ] Configurer Google Analytics (optionnel)

## 🎯 Performances attendues

- **Lighthouse Score** : 95+ (Performance, SEO, Accessibility, Best Practices)
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Mobile-friendly** : Oui

## 📞 Support

Pour toute question sur le site :
- Email : clinicardapp@gmail.com
- GitHub Issues : https://github.com/romaind-prog/clinicard/issues

---

**Fait avec ❤️ pour les étudiants en médecine**
