# 🚀 Guide de Déploiement Rapide - CliniCard.fr

## ⚡ Déploiement en 5 minutes (Méthode recommandée : Netlify)

### Étape 1 : Créer un compte Netlify
1. Aller sur https://www.netlify.com/
2. Créer un compte (gratuit) avec GitHub

### Étape 2 : Déployer le site
**Option A : Drag & Drop (Le plus simple)**
1. Aller sur https://app.netlify.com/drop
2. Glisser-déposer le dossier `website` complet
3. Le site sera en ligne immédiatement sur un domaine temporaire

**Option B : Via GitHub**
1. Créer un repo GitHub avec le contenu du dossier `website`
2. Sur Netlify : "Add new site" > "Import an existing project"
3. Connecter à GitHub et sélectionner le repo
4. Deploy!

### Étape 3 : Configurer le domaine clinicard.fr
1. Dans Netlify : Site settings > Domain management
2. "Add custom domain" > Entrer `clinicard.fr`
3. Netlify vous donnera les DNS à configurer

### Étape 4 : Configuration DNS chez votre registrar
Chez votre fournisseur de domaine (OVH, Gandi, etc.) :

```
Type: A
Nom: @
Valeur: 75.2.60.5

Type: CNAME
Nom: www
Valeur: [votre-site].netlify.app
```

**C'est tout ! Le site sera en ligne en quelques minutes.**

---

## 📝 Checklist Post-Déploiement

### Immédiatement après déploiement
- [ ] Vérifier que le site est accessible sur https://clinicard.fr
- [ ] Tester sur mobile
- [ ] Vérifier que tous les liens fonctionnent
- [ ] Tester les boutons App Store / Google Play (ils doivent afficher le message "bientôt disponible")

### Quand les apps seront publiées
- [ ] Mettre à jour les liens App Store dans `index.html` (ligne ~120)
  ```html
  <a href="https://apps.apple.com/app/idXXXXXXXXXX" class="store-button store-ios">
  ```

- [ ] Mettre à jour les liens Google Play dans `index.html` (ligne ~135)
  ```html
  <a href="https://play.google.com/store/apps/details?id=com.romaindurieux.medflash" class="store-button store-android">
  ```

### SEO (facultatif mais recommandé)
- [ ] Soumettre à Google Search Console
  1. Aller sur https://search.google.com/search-console
  2. Ajouter la propriété `clinicard.fr`
  3. Vérifier la propriété
  4. Soumettre le sitemap : `https://clinicard.fr/sitemap.xml`

- [ ] Tester les métadonnées Open Graph
  1. Aller sur https://developers.facebook.com/tools/debug/
  2. Entrer `https://clinicard.fr`
  3. Vérifier que l'image et le titre s'affichent correctement

---

## 🔧 Commandes utiles

### Tester le site localement
```bash
cd website
python3 -m http.server 8000
# Ouvrir http://localhost:8000
```

### Créer un repo Git (si vous voulez déployer via GitHub)
```bash
cd website
git init
git add .
git commit -m "Initial commit - CliniCard website"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/clinicard-website.git
git push -u origin main
```

---

## 📊 Performance attendue

Une fois déployé, vous devriez avoir :
- ✅ Score Lighthouse > 95
- ✅ Temps de chargement < 2s
- ✅ 100% mobile-friendly
- ✅ HTTPS automatique
- ✅ CDN global (avec Netlify)

---

## 🆘 Problèmes courants

**Le site ne s'affiche pas après config DNS**
→ Attendre 24-48h (propagation DNS)
→ Vider le cache : Ctrl+Shift+R (Chrome/Firefox)

**Les images ne s'affichent pas**
→ Vérifier que le dossier `assets/` est bien uploadé
→ Les fichiers SVG sont utilisés comme placeholder, vous pouvez les remplacer par de vraies images

**Erreur SSL/HTTPS**
→ Netlify configure automatiquement Let's Encrypt
→ Attendre quelques minutes après la config DNS

---

## 📞 Contact

Email : clinicardapp@gmail.com
GitHub : https://github.com/romaind-prog/clinicard

---

**Bonne chance avec le déploiement ! 🚀**
