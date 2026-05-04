# Plan d'Action SEO — clinicard.fr
**Généré le :** 3 mai 2026 | Score actuel : **66/100** | Cible : **80/100**

---

## CRITIQUE — À corriger immédiatement (bloque l'indexation)

### C1 — Corriger les canonicals des 13 articles de blog
**Impact : Très élevé | Effort : 30 min**

Chaque article déclare `canonical = /blog/slug` mais GitHub Pages sert `/blog/slug.html`. Google indexe des URLs 404.

**Action :** Dans chaque fichier `docs/blog/*.html`, changer :
```html
<!-- Avant -->
<link rel="canonical" href="https://clinicard.fr/blog/slug">
<!-- Après -->
<link rel="canonical" href="https://clinicard.fr/blog/slug.html">
```

**Fichiers :** 13 fichiers `docs/blog/*.html` (sauf `index.html`)

Mettre à jour `docs/sitemap.xml` en même temps : remplacer toutes les URLs blog par la forme `.html`.

---

### C2 — Corriger et compléter llms.txt
**Impact : Élevé | Effort : 15 min**

2 articles sur 14 listés. URLs avec `.html` incorrect. 12 articles totalement absents.

**Action :** Remplacer la section Liens de `docs/llms.txt` par :
```
## Articles de blog

- Méthode des J : https://clinicard.fr/blog/methode-des-j-repetition-espacee-medecine.html
- Quelle moyenne pour faire médecine : https://clinicard.fr/blog/quelle-moyenne-pour-faire-medecine-pass.html
- Anki en médecine : https://clinicard.fr/blog/anki-medecine-pass-guide-complet.html
- Active Recall : https://clinicard.fr/blog/active-recall-memoriser-vite-pass-edn.html
- Créer des flashcards efficaces : https://clinicard.fr/blog/creer-flashcards-efficaces-pass-edn.html
- Courbe de l'oubli : https://clinicard.fr/blog/courbe-oubli-memorisation-medecine-pass-edn.html
- Planning de révisions : https://clinicard.fr/blog/planning-revisions-pass-edn-methode-hebdomadaire.html
- Technique Pomodoro : https://clinicard.fr/blog/technique-pomodoro-pass-edn-productivite.html
- Burnout en médecine : https://clinicard.fr/blog/burnout-stress-etudiant-medecine-pass-edn.html
- Raisonnement clinique ECOS : https://clinicard.fr/blog/raisonnement-clinique-ecos-methode-5-etapes.html
- Réussir les ECOS : https://clinicard.fr/blog/reussir-ecos-guide-stations-examen-clinique.html
- Annoncer une mauvaise nouvelle SPIKES : https://clinicard.fr/blog/annonce-mauvaise-nouvelle-ecos-methode-spikes.html
- Technique Feynman : https://clinicard.fr/blog/technique-feynman-medecine-pass-edn.html
- Syndrome de l'imposteur : https://clinicard.fr/blog/syndrome-imposteur-etudiant-medecine-pass-edn.html
```
Ajouter aussi `https://app.clinicard.fr` dans une section "## Application web".

---

### C3 — Corriger le font render-blocking dans l'article SPIKES
**Impact : Élevé | Effort : 10 min**

`docs/blog/annonce-mauvaise-nouvelle-ecos-methode-spikes.html` charge Google Fonts de manière **synchrone**, bloquant le rendu. Tous les autres articles utilisent le pattern `onload` asynchrone.

**Action :** Dans `annonce-mauvaise-nouvelle-ecos-methode-spikes.html`, remplacer :
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">
```
Par le pattern async utilisé dans `active-recall-memoriser-vite-pass-edn.html` :
```html
<link rel="preload" href="https://fonts.googleapis.com/css2?..." as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?..."></noscript>
```

---

## HAUTE PRIORITÉ — Dans la semaine

### H1 — Ajouter une page auteur (E-E-A-T critique)
**Impact : Très élevé | Effort : 2h**

Problème le plus impactant sur le score E-E-A-T (facteur de ranking sur contenu médical-adjacent). "Romain D." sans page de profil = auteur non vérifiable.

**Action :**
1. Créer `docs/about.html` avec : nom complet, contexte (pourquoi CliniCard a été créé), photo, lien LinkedIn ou autre profil public
2. Mettre à jour le schema `author.url` dans tous les BlogPosting de `/blog/article.html` → pointer vers `/about.html`
3. Ajouter un lien "À propos" dans le footer (colonne "Ressources")

---

### H2 — Remplacer l'email Gmail par un email domaine
**Impact : Élevé | Effort : 1h**

`clinicardapp@gmail.com` est explicitement noté dans les QRG Google comme un signal de faible accountability. Remplacer par `contact@clinicard.fr`.

**Fichiers à modifier :**
- `docs/index.html` (footer, FAQ section)
- `docs/blog/*.html` (schema JSON-LD `contactPoint.email` — via find/replace)
- `docs/sitemap.xml` n'est pas concerné

---

### H3 — Rendre le panel FAQ 2 visible aux crawlers
**Impact : Élevé | Effort : 20 min**

Le panel "Pourquoi CliniCard ?" (4 questions de différenciation vs Anki, ChatGPT, etc.) utilise l'attribut HTML `hidden` — invisible aux crawlers et aux AI.

**Fichier :** `docs/index.html`, ligne 751 :
```html
<!-- Avant -->
<div class="faq-panel" id="faq-panel-pourquoi" ... hidden>
<!-- Après -->
<div class="faq-panel" id="faq-panel-pourquoi" ... style="display:none">
```
(CSS `display:none` est indexé, `hidden` ne l'est pas)

Mettre à jour le schema FAQPage pour inclure les 4 questions de ce panel.

---

### H4 — Corriger le schema auteur dans l'article SPIKES
**Impact : Moyen | Effort : 5 min**

`annonce-mauvaise-nouvelle-ecos-methode-spikes.html` utilise `@type: Organization` pour l'auteur au lieu de `@type: Person`.

**Action :** Dans `docs/blog/annonce-mauvaise-nouvelle-ecos-methode-spikes.html`, remplacer le schema auteur par :
```json
"author": {
  "@type": "Person",
  "name": "Romain D.",
  "jobTitle": "Créateur de CliniCard",
  "url": "https://clinicard.fr/about.html"
}
```

---

### H5 — Ajouter canonical à privacy-policy.html
**Impact : Moyen | Effort : 5 min**

**Fichier :** `docs/privacy-policy.html`
```html
<link rel="canonical" href="https://clinicard.fr/privacy-policy.html">
```

---

### H6 — Mettre à jour sitemap.xml
**Impact : Moyen | Effort : 15 min**

3 corrections simultanées dans `docs/sitemap.xml` :
1. Remplacer toutes les URLs blog `/blog/slug` → `/blog/slug.html`
2. Supprimer l'entrée `mentions-legales.html` (page noindex)
3. Supprimer `<changefreq>` et `<priority>` sur l'entrée SPIKES (Google les ignore)

---

### H7 — Ajouter Blog dans la navigation mobile
**Impact : Moyen | Effort : 5 min**

**Fichier :** `docs/index.html`, ligne ~205 (div `#nav-mobile`) :
```html
<!-- Ajouter avant le bouton CTA mobile -->
<a href="/blog/">Blog</a>
```

---

### H8 — Ajouter disclaimer sur l'article burnout
**Impact : Moyen | Effort : 10 min**

**Fichier :** `docs/blog/burnout-stress-etudiant-medecine-pass-edn.html`

Ajouter en début d'article, après le titre :
```html
<p class="article-disclaimer">
  Cet article est fourni à titre informatif uniquement et ne se substitue 
  pas à un avis médical ou psychologique professionnel.
</p>
```

---

## MOYEN TERME — Dans le mois

### M1 — Ajouter width/height au logo footer + preconnect app.clinicard.fr
**Impact : Moyen (CLS + performance) | Effort : 10 min**

**Fichier :** `docs/index.html`

Ligne ~829 (footer logo) :
```html
<img src="assets/medflash-logo.png" alt="CliniCard Logo" class="logo-img footer-logo-img" width="36" height="36">
```

En `<head>`, après les preconnects existants :
```html
<link rel="preconnect" href="https://app.clinicard.fr">
```

---

### M2 — Supprimer les actifs orphelins
**Impact : Faible (propreté) | Effort : 5 min**

```bash
# À vérifier et supprimer si non référencés
rm docs/assets/favicon.png   # 300 KB, orphelin
rm docs/blog/audit            # Fichier texte stray
# screen-1.jpeg...screen-6.jpeg : vérifier avant de supprimer 
# (à utiliser dans la section Fonctionnalités d'abord)
```

---

### M3 — Utiliser les screenshots app dans la section Fonctionnalités
**Impact : Élevé (SXO + conversion) | Effort : 2h**

6 fichiers `screen-*.jpeg` existent mais ne sont référencés nulle part dans `index.html`. Remplacer les icônes SVG des feature cards par des screenshots réels + fallback WebP.

**Action :**
1. Générer les variantes WebP : `cwebp -q 80 screen-N.jpeg -o screen-N.webp`
2. Dans chaque `.feature-card`, ajouter une `<picture>` avec source WebP

---

### M4 — Ajouter AggregateRating au schema MobileApplication
**Impact : Moyen (rich results) | Effort : 15 min**

**Fichier :** `docs/index.html`, dans le schema `MobileApplication` :
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "ratingCount": "XX",
  "bestRating": "5"
}
```
*(Utiliser les vraies valeurs de l'App Store)*

Afficher aussi la note visuellement à côté du bouton App Store (signal de confiance fort).

---

### M5 — Ajouter SearchAction au schema WebSite
**Impact : Moyen (sitelinks searchbox) | Effort : 10 min**

**Fichier :** `docs/index.html`, dans le schema `WebSite` :
```json
"potentialAction": {
  "@type": "SearchAction",
  "target": {
    "@type": "EntryPoint",
    "urlTemplate": "https://clinicard.fr/blog/?q={search_term_string}"
  },
  "query-input": "required name=search_term_string"
}
```

---

### M6 — Ajouter og:locale et og:site_name
**Impact : Faible | Effort : 5 min**

**Fichier :** `docs/index.html` (et templates blog) :
```html
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="CliniCard">
```

---

### M7 — Corriger les lastmod du sitemap
**Impact : Faible | Effort : 15 min**

3 articles partagent artificiellement la date `2026-04-18`. Corriger avec les vraies dates de `datePublished` dans les JSON-LD de chaque article.

---

### M8 — Ajouter des sections "À lire aussi" aux 8 articles anciens
**Impact : Élevé (liens internes) | Effort : 2h**

Les 8 articles sans section "À lire aussi" : active-recall, burnout, courbe-oubli, creer-flashcards, methode-des-j, planning, pomodoro, raisonnement-clinique.

Chaque section doit pointer vers 3 articles thématiquement proches.

---

### M9 — Étendre les liens blog depuis la homepage
**Impact : Élevé (PageRank flow) | Effort : 30 min**

Le footer homepage ne lie qu'1 article. Ajouter 4-5 articles dans la colonne "Blog" du footer, et envisager une section "Derniers articles" dans le corps de la page.

---

## BACKLOG — Basse priorité

| Action | Impact | Effort |
|--------|--------|--------|
| Créer une présence YouTube (1 démo screencast) | Élevé (GEO) | Fort |
| Implémenter email capture sur le blog | Élevé (rétention) | Moyen |
| Générer OG images uniques par article | Moyen | Moyen |
| Ajouter table des matières sur Anki guide + méthode des J | Moyen | Faible |
| Implémenter IndexNow via GitHub Actions | Moyen | Moyen |
| Passer DNS par Cloudflare pour headers sécurité | Moyen | Moyen |
| Renommer `medflash-logo.png` → `clinicard-logo.png` | Faible | Faible |
| Ajouter `theme-color` meta (`#1D4ED8`) | Faible | Minimal |
| Ajouter `noindex` à `auth-redirect.html` | Faible | Minimal |
| Supprimer dead carousel CSS dans styles.css (~3 KB) | Minimal | Faible |
| Ajouter boutons partage (WhatsApp + copier lien) sur articles | Moyen | Moyen |
| Page /a-propos — version longue avec founding story | Élevé (E-E-A-T) | Moyen |
| BreadcrumbList sur tous les articles blog | Moyen | Faible |

---

## Résumé priorisé

```
Semaine 1 — Score potentiel : +6 pts (~72/100)
  C1 Canonicals blog (13 fichiers)
  C2 llms.txt complet
  C3 Font render-blocking SPIKES
  H3 FAQ panel 2 visible
  H5 Canonical privacy-policy
  H6 Sitemap mis à jour
  H7 Blog dans nav mobile
  H8 Disclaimer burnout

Semaine 2-3 — Score potentiel : +5 pts (~77/100)
  H1 Page auteur
  H2 Email domaine
  H4 Schema auteur SPIKES
  M1 Footer logo dimensions + preconnect
  M2 Actifs orphelins supprimés
  M4 AggregateRating schema
  M6 og:locale + og:site_name

Mois 2 — Score potentiel : +4 pts (~80/100)
  M3 Screenshots dans features
  M8 "À lire aussi" sur 8 articles
  M9 Liens blog depuis homepage
  M5 SearchAction schema
```
