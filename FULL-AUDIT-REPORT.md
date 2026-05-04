# Audit SEO Complet — clinicard.fr
**Date :** 3 mai 2026 | **Auditeur :** CliniCard SEO Audit (7 agents spécialisés)

---

## Score de Santé SEO Global : **66 / 100**

| Catégorie | Poids | Score | Pondéré |
|-----------|-------|-------|---------|
| Technical SEO | 22 % | 62/100 | 13.6 |
| Qualité du contenu | 23 % | 62/100 | 14.3 |
| On-Page SEO | 20 % | 70/100 | 14.0 |
| Schema / Données structurées | 10 % | 78/100 | 7.8 |
| Performance (CWV) | 10 % | 78/100 | 7.8 |
| IA Search Readiness (GEO) | 10 % | 61/100 | 6.1 |
| Images | 5 % | 55/100 | 2.75 |
| **TOTAL** | **100 %** | | **66.4** |

---

## Résumé Exécutif

**Type de business détecté :** Application SaaS éducative (EdTech médecine) — B2C, France.

**Top 5 problèmes critiques :**
1. **Canonical mismatch sur les 13 articles de blog** — les canonicals pointent vers des URLs sans `.html` que GitHub Pages ne sert pas → Google indexe des URLs qui renvoient 404.
2. **Sitemap listé les mêmes URLs inexistantes** — renforce le problème précédent.
3. **Absence de page auteur** — E-E-A-T critique pour un contenu médical/YMYL-adjacent.
4. **FAQ panel 2 caché avec `hidden`** — contenu invisible aux crawlers (4 Q&R de différenciation concurrentielle non indexées).
5. **llms.txt ne couvre que 2/14 articles** avec des URLs `.html` incorrectes.

**Top 5 quick wins :**
1. Corriger les 13 canonicals → ajouter `.html` à chaque canonical (30 min).
2. Corriger + compléter `llms.txt` → ajouter les 12 articles manquants (15 min).
3. Supprimer `mentions-legales.html` du sitemap (noindex dans sitemap = bruit) (5 min).
4. Ajouter canonical à `privacy-policy.html` (5 min).
5. Ajouter le lien Blog dans la navigation mobile (5 min).

---

## 1. Technical SEO — 62/100

### 1.1 Crawlabilité — PASS (90/100)

- `robots.txt` : correct, `User-agent: * Allow: /`, Sitemap déclaré ✓
- Pas de traps ni de boucles de redirection détectées ✓
- `mentions-legales.html` : `noindex, follow` approprié ✓
- `auth-redirect.html` : pas de `noindex` → risque d'indexation accidentelle si linké

**Problème détecté :** `docs/blog/audit` est un fichier texte stray dans le répertoire `/blog/`. À supprimer.

### 1.2 Indexabilité et Canonicals — CRITIQUE (55/100)

**Problème #1 — Mismatch canonical sur tous les articles de blog**

Chaque article `.html` déclare un canonical sans extension :
```html
<!-- Déclaré -->
<link rel="canonical" href="https://clinicard.fr/blog/annonce-mauvaise-nouvelle-ecos-methode-spikes">
<!-- Servi par GitHub Pages -->
https://clinicard.fr/blog/annonce-mauvaise-nouvelle-ecos-methode-spikes.html
```

GitHub Pages ne strip pas `.html` pour les fichiers en sous-répertoires. Le canonical pointe vers une URL qui retourne 404. Googlebot ne peut pas consolider le PageRank correctement. **13 articles affectés.**

**Options de correction :**
- **Option A (rapide)** : Modifier tous les canonicals et le sitemap pour utiliser la forme `.html` → `https://clinicard.fr/blog/slug.html`
- **Option B (propre)** : Restructurer chaque article en `blog/slug/index.html` → URL propre `/blog/slug/`

**Problème #2 — Sitemap liste les mêmes URLs inexistantes**

Toutes les entrées blog du sitemap utilisent la forme sans extension — cohérentes avec les canonicals mais aucune ne résout sur GitHub Pages.

**Problème #3 — `privacy-policy.html` sans canonical**

Aucun `<link rel="canonical">` sur cette page.

**Problème #4 — `mentions-legales.html` dans le sitemap malgré `noindex`**

Google ignore ces entrées mais elles ajoutent du bruit. À retirer.

### 1.3 Sécurité — Limitation GitHub Pages (40/100)

| Header | Statut | Note |
|--------|--------|------|
| HTTPS | ✓ | Enforced |
| HSTS | ✓ | max-age=31556952 (~1 an) |
| CSP | ✗ | Impossible sur GitHub Pages |
| X-Content-Type-Options | ✗ | Impossible sur GitHub Pages |
| X-Frame-Options | ✗ | Impossible sur GitHub Pages |
| Referrer-Policy | ✗ | Impossible sur GitHub Pages |

**Contournement possible :** Passer DNS par Cloudflare en proxy, puis injecter les headers manquants via Transform Rules (gratuit).

### 1.4 Structure des URLs — PARTIEL (65/100)

- Slugs propres, descriptifs, mots-clés français ✓
- Pas de majuscules ni de paramètres querystring ✓
- Le nav desktop a "Blog" ; le **nav mobile n'a pas de lien "Blog"** ✗
- Les liens internes dans `blog/index.html` utilisent `.html` (href correct pour la navigation), mais les canonicals disent sans `.html` → contradiction structurelle

### 1.5 Core Web Vitals — Estimation lab (78/100)

| Métrique | Estimation | Statut |
|----------|------------|--------|
| LCP | ~1.2–1.8s desktop / ~1.8–2.8s mobile 4G | PASS desktop, risque mobile |
| CLS | ~0.0–0.05 | PASS |
| INP | < 100ms | PASS (zéro script tiers) |

**Problème critique CWV :** `annonce-mauvaise-nouvelle-ecos-methode-spikes.html` charge Google Fonts avec un `<link rel="stylesheet">` **synchrone (render-blocking)**, au lieu du pattern `onload` asynchrone utilisé dans tous les autres articles. Impact estimé : +300–500ms sur mobile 4G.

**Risque CLS :** L'`<img>` du logo dans ce même article est sans `width`/`height`.

**Atout majeur :** Zéro script tiers (analytics, chat, publicité). INP exceptionnel.

### 1.6 Actifs et Images

| Fichier | Taille | Problème |
|---------|--------|---------|
| `assets/favicon.png` | 300 KB | **Fichier orphelin** — le favicon servi est `/favicon.png` (2.3 KB). Ce 300 KB n'est référencé nulle part. |
| `screen-1.jpeg` … `screen-6.jpeg` | 136–288 KB | **Non référencés dans index.html** — fichiers morts dans le repo |
| `og-image.png` | 3.7 KB | Trop petit — probablement en dessous de 1200×630px |
| Logo | OK | WebP fallback présent ✓ |

---

## 2. Qualité du Contenu et E-E-A-T — 62/100

### 2.1 Homepage

- Environ 600–700 mots de contenu visible (borderline, cible 800+)
- Keywords primaires bien distribués : PASS, LAS, EDN, flashcards, répétition espacée ✓
- H1 pertinent : "Réviser intelligemment pour réussir vos concours" ✓
- Widget flashcard interactif dans le hero = signal Experience fort ✓
- FAQ avec 10 questions bien structurées ✓
- **Zéro statistique quantifiée** (pas de "X étudiants", pas de note App Store) → gap citabilité

### 2.2 Blog — 13 articles

**Word count :**

| Article | ~Mots | Statut |
|---------|-------|--------|
| anki-medecine-pass-guide-complet | ~2 100 | ✓ PASS |
| quelle-moyenne-pour-faire-medecine-pass | ~2 235 | ✓ PASS |
| methode-des-j-repetition-espacee-medecine | ~1 937 | ✓ PASS |
| burnout-stress-etudiant-medecine-pass-edn | ~1 853 | ✓ PASS |
| reussir-ecos-guide-stations-examen-clinique | ~1 875 | ✓ PASS |
| active-recall-memoriser-vite-pass-edn | ~1 766 | BORDERLINE |
| annonce-mauvaise-nouvelle-ecos-methode-spikes | ~1 771 | BORDERLINE |
| courbe-oubli-memorisation-medecine-pass-edn | ~1 772 | BORDERLINE |
| technique-pomodoro-pass-edn-productivite | ~1 753 | BORDERLINE |
| raisonnement-clinique-ecos-methode-5-etapes | ~1 740 | BORDERLINE |
| creer-flashcards-efficaces-pass-edn | ~1 715 | BORDERLINE |
| planning-revisions-pass-edn-methode-hebdomadaire | ~1 678 | BORDERLINE |
| (blog/index.html) | ~1 051 | N/A |

*Remarque : les comptes incluent le HTML. Le contenu textuel réel est ~30 % inférieur pour la plupart des articles.*

**Atouts contenus :**
- Citations PubMed réelles dans 2 articles (signal autorité fort) ✓
- Lien vers HAS et SIDES dans les articles cliniques ✓
- Tableaux comparatifs (Anki, profils PASS) ✓
- Callout boxes et highlight blocks (extractibles par l'IA) ✓
- Concepts nommés : transfer-appropriate processing, courbe d'Ebbinghaus ✓

### 2.3 E-E-A-T — Score global : 52/100

| Facteur | Score | Problèmes |
|---------|-------|-----------|
| Experience | 52/100 | Widget demo médical précis, 2 avis App Store réels — mais aucun retour d'expérience personnelle en 1ère personne |
| Expertise | 48/100 | Contenu médicalement précis (ICFEr, SPIKES Baile 2000 correctement cité) — mais auteur = "Romain D." sans credentials |
| Authoritativeness | 42/100 | App Store vérifiable, GitHub transparent, Instagram — mais email Gmail, aucune page About, aucun profil LinkedIn |
| Trustworthiness | 58/100 | Privacy policy, HTTPS, mentions légales — mais SIREN/adresse absents (LCEN Art. 6 III), pas de disclaimer sur l'article burnout |

**Problème critique :** L'article `burnout-stress-etudiant-medecine-pass-edn.html` couvre des symptômes de santé mentale sans disclaimer "informationnel uniquement". Sous les QRG Google 2025, le contenu santé-adjacent requiert un avertissement.

### 2.4 Signaux auteur

- La plupart des articles : `"author": {"@type": "Person", "name": "Romain D.", "jobTitle": "Créateur de CliniCard", "url": "https://clinicard.fr"}` — schema Person correct mais URL pointe vers homepage, pas une page auteur
- `annonce-mauvaise-nouvelle-ecos-methode-spikes.html` : régresse vers `@type: Organization` — **incohérence à corriger**
- Visible byline : "Par l'équipe CliniCard" sur certains articles vs "Romain D." dans le schema — discordance visible/machine

### 2.5 Liens internes — CRITIQUE

- La homepage footer ne lie que **1 des 13 articles** (méthode des J)
- 5 articles récents ont une section "À lire aussi" correcte ; les 8 plus anciens n'en ont pas
- Aucun article lié depuis le corps de la homepage
- La structure est hub-spoke avec le hub (homepage) quasi déconnecté des spokes (articles)

---

## 3. On-Page SEO — 70/100

### Homepage

| Élément | Valeur | Statut |
|---------|--------|--------|
| Title | "CliniCard — Vos cours en flashcards & QCM concours \| PASS, LAS, EDN" (67 chars) | Légèrement long (idéal ≤60) |
| Meta description | "Importez vos cours PDF…" (169 chars) | Légèrement long (idéal ≤155) |
| H1 | "Réviser intelligemment pour réussir vos concours" | ✓ Unique et pertinent |
| Canonical | `https://clinicard.fr/` | ✓ |
| lang | `fr` | ✓ |
| og:locale | Absent | ✗ Ajouter `fr_FR` |
| og:site_name | Absent | ✗ Ajouter "CliniCard" |
| twitter:site | Absent | ✗ Handle Twitter non renseigné |
| theme-color | Absent | Ajouter `#1D4ED8` |

### Articles de blog

- Titles bien formatés : "Topic : sous-titre | Blog CliniCard" ✓
- Meta descriptions présentes et uniques ✓
- H1 correspond au title tag ✓
- Canonicals présents mais pointent vers URLs inexistantes (cf. section 1.2)
- `og:type: article` correctement déclaré ✓
- Pas de `og:image` unique par article — tous utilisent `og-image.png` générique

---

## 4. Schema / Données Structurées — 78/100

### Homepage — 4 blocs JSON-LD

| Type | Statut | Problèmes |
|------|--------|-----------|
| `MobileApplication` | ✓ Valide | Manque `aggregateRating` (avis App Store disponibles), manque `screenshot`, manque `softwareVersion` |
| `Organization` | ✓ Valide | Logo URL référence `medflash-logo.png` (ancien brand name) ; `sameAs` ne liste que 2 entrées (App Store, Instagram) — manque LinkedIn, GitHub, YouTube |
| `WebSite` | ✓ Valide | Manque `potentialAction` / `SearchAction` pour sitelinks searchbox |
| `FAQPage` | ✓ Valide | 7 questions avec acceptedAnswer complets — panel 2 (4 Q&R supplémentaires) non inclus dans le schema |

### Articles de blog

| Type | Statut | Problèmes |
|------|--------|-----------|
| `BlogPosting` ou `Article` | ✓ Valide (la plupart) | `annonce-mauvaise-nouvelle` utilise `Organization` pour l'auteur au lieu de `Person` |
| `BreadcrumbList` | Partiel | Présent sur certains articles, absent sur d'autres (ex. Pomodoro, burnout) |
| Blog index | `Blog` schema | Manque `itemListElement` listant les articles |

---

## 5. Performance (CWV) — 78/100

*(Estimates lab — pas de données CrUX disponibles)*

| Ressource | Taille | Note |
|-----------|--------|------|
| `index.html` | 55 KB | Inclut 163 lignes de JSON-LD |
| `styles.css` | 47 KB | Render-blocking, ~9-12 KB gzippé |
| `script.js` | 8.5 KB | Fin de body ✓ |
| Logo PNG+WebP | 5 KB+1 KB | WebP fallback ✓ |
| Google Fonts | Async onload | ✓ (sauf article SPIKES) |

**Atouts majeurs :**
- Zéro script tiers
- Hero entièrement HTML/CSS (pas d'image au-dessus du fold)
- Preconnect + preload woff2 correctement implémentés
- Hébergé sur Fastly CDN (GitHub Pages)

**Problèmes :**
- `annonce-mauvaise-nouvelle` : font CSS synchrone (render-blocking)
- Footer logo `<img>` sans `width`/`height` → risque CLS
- Pas de `preconnect` pour `app.clinicard.fr` (2 CTAs héros pointent là)
- URLs woff2 pinées sur version (v40, v12) → fragile si Google met à jour

---

## 6. AI Search Readiness (GEO) — 61/100

### Accessibilité AI crawlers

Tous les bots AI autorisés (GPTBot, ClaudeBot, Perplexity, Google-Extended) — configuration optimale ✓

### llms.txt — INSUFFISANT

| Aspect | Statut |
|--------|--------|
| Fichier présent | ✓ |
| Couverture articles | **2 / 14** articles listés |
| URLs correctes | **Non** — extension `.html` alors que canonicals n'en ont pas |
| Champ `license:` | Absent |
| Mention app web | Absente |

Les 12 articles manquants couvrent les sujets les plus citables (active recall, courbe oubli, Pomodoro, ECOS, burnout). Invisible aux AI qui se fient à llms.txt comme point d'entrée.

### Citabilité des passages

**Points forts :**
- FAQ section avec answers autonomes ✓
- Callout boxes avec données chiffrées (méthode des J) ✓
- Citations PubMed externes ✓
- Tables HTML parsables ✓

**Points faibles :**
- **Zéro statistique quantifiée sur la homepage** (pas de "X utilisateurs", pas de note)
- FAQ answers trop courtes (~60 mots vs 134-167 optimal pour extraction AI)
- Panel FAQ 2 invisible aux crawlers (attribut `hidden`)
- Pas de blocs résumé "En bref" en tête d'articles

### Signaux de marque

| Signal | Statut |
|--------|--------|
| App Store | ✓ |
| Instagram | ✓ |
| GitHub | ✓ |
| YouTube | **Absent** — corrélation 0.737 avec citation AI |
| LinkedIn | **Absent** |
| Wikipedia | Absent (normal pour une app récente) |

---

## 7. Images — 55/100

| Problème | Sévérité | Détail |
|----------|----------|--------|
| `assets/favicon.png` 300 KB | Haut | Orphelin — non servi, à supprimer |
| `screen-*.jpeg` sans WebP | Moyen | 6 fichiers JPEG (~1.2 MB total), pas référencés dans index.html |
| `og-image.png` partagé sur 100% des pages | Moyen | Différenciation sociale nulle sur 13 articles |
| `og-image.png` trop petit (3.7 KB) | Moyen | Probablement sous-dimensionné pour social cards (1200×630 requis) |
| Footer logo sans width/height | Bas | CLS potentiel |
| Homepage n'utilise pas les 6 screenshots app | Bas | Les fichiers existent mais ne sont pas référencés |

---

## 8. SXO — Analyse d'expérience de recherche

### Correspondance type de page / SERP

| Page | Mot-clé cible | Type attendu par Google | Correspondance |
|------|---------------|------------------------|----------------|
| Homepage | flashcards médecine PASS | Informationnel + produit | MOYEN — 100% transactionnel |
| Blog articles | anki médecine PASS, répétition espacée… | Guides longs | ALIGNÉ ✓ |

### Parcours de conversion

**Problème :** Les CTAs des articles de blog envoient directement en App Store, court-circuitant la homepage avec ses preuves sociales, FAQ et différenciation concurrentielle.

**Entonnoir conseillé :** Article blog → Homepage avec ancre (#fonctionnalites) → App Store.

### Personas les moins bien servis

1. **Lycéen pré-PASS** (article "quelle-moyenne") — CTA "Télécharger" prématuré. Besoin : email capture "guide de survie PASS".
2. **Utilisateur Anki frustré** — article fort mais CTA mène au store sans passer par la page de différenciation.
3. **Étudiant en préparation ECOS (D4/D5)** — tension de positionnement : articles ECOS pour une app qui cible les QCM.

---

## Sitemap — Résumé

18 URLs | Format XML valide ✓

| URL | Problème |
|-----|---------|
| 13 articles blog | URLs sans `.html` — inexistantes sur GitHub Pages |
| `mentions-legales.html` | `noindex` mais dans sitemap — à retirer |
| `privacy-policy.html` | Dans sitemap ✓, mais pas de canonical sur la page |
| `lastmod` sur 3 articles | Valeur 2026-04-18 partagée artificiellement |
| `changefreq`/`priority` | Présent sur 1 seul article — Google les ignore, à supprimer |

---

## Sources des Agents

- **Technical SEO** : 26 tool calls, 167s
- **Content & E-E-A-T** : 11 tool calls, 150s
- **Performance** : 24 tool calls, 134s
- **GEO / AI Readiness** : 26 tool calls, 148s
- **SXO** : 20 tool calls, 211s
- **Sitemap** : 17 tool calls, 68s
- **Schema** : erreur API (couvert par Technical SEO + analyse directe)
