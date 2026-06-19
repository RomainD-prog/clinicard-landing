#!/usr/bin/env node
/**
 * Régénère les 3 cartes "Méthodes et conseils de révision" de la landing
 * (docs/index.html) à partir des articles les plus récents listés dans
 * docs/blog/index.html.
 *
 * L'index du blog est ordonné du plus récent au plus ancien : on prend donc
 * les 3 premières <article class="blog-card">.
 *
 * Le bloc remplacé est délimité dans docs/index.html par :
 *   <!-- BLOG_PREVIEW:START ... -->  ...  <!-- BLOG_PREVIEW:END -->
 *
 * Usage :  node scripts/update-blog-preview.js
 * Idempotent : ne réécrit le fichier que si le contenu change.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG_INDEX = path.join(ROOT, 'docs', 'blog', 'index.html');
const LANDING = path.join(ROOT, 'docs', 'index.html');
const N = 3; // nombre de cartes à afficher
const EXCERPT_MAX = 150; // longueur max de l'extrait sur la landing

const START = '<!-- BLOG_PREVIEW:START (auto-généré par scripts/update-blog-preview.js — ne pas éditer à la main) -->';
const END = '<!-- BLOG_PREVIEW:END -->';

const ARROW_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>';

function fail(msg) {
  console.error('✗ update-blog-preview : ' + msg);
  process.exit(1);
}

function firstMatch(block, re, label, slug) {
  const m = block.match(re);
  if (!m) fail(`champ « ${label} » introuvable pour l'article « ${slug || '?'} »`);
  return m[1].trim();
}

// Normalise un href du blog (/blog/slug, blog/slug, slug) → "blog/slug"
function normalizeHref(href) {
  let h = href.trim().replace(/^\//, '');      // retire "/" initial
  h = h.replace(/^blog\//, '');                // retire "blog/" éventuel
  return 'blog/' + h;
}

// Tronque proprement un extrait sur une frontière de mot.
function shorten(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[.,;:…\s]+$/, '') + '…';
}

function parseArticles(html) {
  const articles = [];
  const re = /<article class="blog-card">([\s\S]*?)<\/article>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const block = m[1];

    const hrefMatch = block.match(/<a href="([^"]+)" class="blog-card-link">/);
    if (!hrefMatch) continue; // pas une carte d'article standard
    const slug = hrefMatch[1];

    const tag = firstMatch(block, /<span class="blog-tag">([\s\S]*?)<\/span>/, 'tag', slug);
    const title = firstMatch(block, /<h2 class="blog-card-title">([\s\S]*?)<\/h2>/, 'titre', slug);
    const metaRaw = firstMatch(block, /<p class="blog-card-meta">([\s\S]*?)<\/p>/, 'meta', slug);
    const excerpt = firstMatch(block, /<p class="blog-card-excerpt">([\s\S]*?)<\/p>/, 'extrait', slug);

    const date = metaRaw.split('·')[0].trim(); // "17 juin 2026 · 6 min" → "17 juin 2026"

    articles.push({
      href: normalizeHref(slug),
      tag,
      date,
      title,
      excerpt: shorten(excerpt, EXCERPT_MAX),
    });
  }
  return articles;
}

function renderCard(a) {
  return [
    `                <a href="${a.href}" class="blog-preview-card">`,
    `                    <div class="blog-preview-meta">`,
    `                        <span class="blog-preview-tag">${a.tag}</span>`,
    `                        <span class="blog-preview-date">${a.date}</span>`,
    `                    </div>`,
    `                    <p class="blog-preview-title">${a.title}</p>`,
    `                    <p class="blog-preview-excerpt">${a.excerpt}</p>`,
    `                    <span class="blog-preview-link">Lire l'article ${ARROW_SVG}</span>`,
    `                </a>`,
  ].join('\n');
}

function main() {
  const blogHtml = fs.readFileSync(BLOG_INDEX, 'utf8');
  const articles = parseArticles(blogHtml).slice(0, N);
  if (articles.length < N) {
    fail(`seulement ${articles.length} article(s) trouvé(s) dans docs/blog/index.html (attendu ≥ ${N})`);
  }

  const landing = fs.readFileSync(LANDING, 'utf8');
  const startIdx = landing.indexOf(START);
  const endIdx = landing.indexOf(END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    fail('marqueurs BLOG_PREVIEW:START / BLOG_PREVIEW:END introuvables dans docs/index.html');
  }

  const cards = articles.map(renderCard).join('\n');
  const block = `${START}\n${cards}\n                ${END}`;
  const updated = landing.slice(0, startIdx) + block + landing.slice(endIdx + END.length);

  if (updated === landing) {
    console.log('✓ blog preview déjà à jour (aucun changement).');
    return;
  }

  fs.writeFileSync(LANDING, updated);
  console.log('✓ blog preview mis à jour avec les ' + N + ' articles les plus récents :');
  articles.forEach((a, i) => console.log(`  ${i + 1}. ${a.date} — ${a.title}`));
}

main();
