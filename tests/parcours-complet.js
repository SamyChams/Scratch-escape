/* =========================================================
   Test de bout en bout : résout les 15 énigmes, ouvre les
   5 cadenas et vérifie qu'aucune erreur JavaScript ne survient.

   Utilisation :
     npm install playwright
     python3 -m http.server 8765 &
     node tests/parcours-complet.js
   ========================================================= */

const { chromium } = require('playwright');

const BASE = 'http://127.0.0.1:8765';
const erreurs = [];

(async () => {
  const nav = await chromium.launch();
  const page = await nav.newPage({ viewport: { width: 1280, height: 950 } });
  page.on('console', m => { if (m.type() === 'error') erreurs.push('CONSOLE: ' + m.text()); });
  page.on('pageerror', e => erreurs.push('PAGEERROR: ' + e.message));

  // ---------- Accueil ----------
  await page.goto(BASE + '/index.html');
  await page.fill('#pseudo', 'Camille');
  await page.click('#btn-jouer');
  await page.waitForURL('**/jeu.html');
  await page.waitForSelector('.grille-enigmes .tuile');
  console.log('✓ accueil → jeu, pseudo =', await page.textContent('#pseudo'));

  const ouvrir = async (i) => {
    await page.locator('.grille-enigmes .tuile').nth(i).click();
    await page.waitForSelector('.modale__boite');
  };
  const continuer = async (nom) => {
    const btn = page.locator('.modale__boite .actions button', { hasText: 'Continuer' });
    await btn.waitFor({ timeout: 20000 });
    await btn.click();
    await page.waitForSelector('.modale', { state: 'detached' });
    console.log('  ✓ résolue :', nom);
  };
  const qcmJuste = async (idEnigme) => {
    const i = await page.evaluate((id) => {
      for (const s of SALLES) for (const e of s.enigmes)
        if (e.id === id) return e.options.findIndex(o => o.correct);
    }, idEnigme);
    await page.locator('.option').nth(i).click();
  };
  const trier = async () => {
    // range la liste avec les boutons ▼ (tri par sélection)
    const n = await page.locator('.item-ordre').count();
    for (let cible = 0; cible < n; cible++) {
      for (let tour = 0; tour < n; tour++) {
        const idx = await page.locator('.item-ordre').evaluateAll(
          (els, c) => els.findIndex((e, k) => k >= c && Number(e.dataset.index) === c), cible);
        if (idx === cible) break;
        await page.locator('.item-ordre').nth(idx).locator('.mini-btn').first().click(); // ▲
      }
    }
    await page.locator('.modale__boite .actions button', { hasText: 'Vérifier' }).click();
  };

  // ================= SALLE 1 =================
  await ouvrir(0); // association
  const paires = await page.evaluate(() => SALLES[0].enigmes[0].paires);
  for (const p of paires) {
    await page.locator('.assoc__colonne').first().locator('.jeton', { hasText: p.g }).click();
    await page.locator('.assoc__colonne').last().locator('.jeton', { hasText: new RegExp('^' + p.d + '$') }).click();
  }
  await continuer('s1e1 association');

  await ouvrir(1); await qcmJuste('s1e2'); await continuer('s1e2 qcm');
  await ouvrir(2); await trier();          await continuer('s1e3 ordre');

  const passerPorte = async (code) => {
    for (let i = 0; i < code.length; i++) await page.locator('.molette').nth(i).fill(code[i]);
    await page.locator('.cadenas button', { hasText: 'Ouvrir la porte' }).click();
    await page.locator('button', { hasText: /salle suivante|Voir le résultat/i }).click();
    console.log('  ✓ cadenas', code, 'ouvert');
  };
  await passerPorte('491');
  await page.waitForSelector('.grille-enigmes');

  // ================= SALLE 2 =================
  await ouvrir(0); await qcmJuste('s2e1'); await continuer('s2e1 qcm');
  await ouvrir(1);
  await page.locator('.modale__boite input').fill('70');
  await page.locator('.modale__boite .actions button', { hasText: 'Vérifier' }).click();
  await continuer('s2e2 saisie');

  await ouvrir(2); // labyrinthe : avancer, gauche, avancer×3, droite, avancer×3
  const P = page.locator('.palette .bloc');
  const suite = [0, 2, 0, 0, 0, 1, 0, 0, 0];
  for (const k of suite) await P.nth(k).click();
  await page.locator('.modale__boite .actions button', { hasText: 'Lancer' }).click();
  await continuer('s2e3 grille');
  await passerPorte('270');
  await page.waitForSelector('.grille-enigmes');

  // ================= SALLE 3 =================
  await ouvrir(0); await qcmJuste('s3e1'); await continuer('s3e1 qcm');
  await ouvrir(1);
  await page.locator('.modale__boite input').fill('72');
  await page.locator('.modale__boite .actions button', { hasText: 'Vérifier' }).click();
  await continuer('s3e2 saisie');

  await ouvrir(2);
  await page.locator('.trou input').nth(0).fill('4');
  await page.locator('.trou input').nth(1).fill('4');
  await page.locator('.modale__boite .actions button', { hasText: 'Lancer' }).click();
  await continuer('s3e3 trous+grille');
  await passerPorte('365');
  await page.waitForSelector('.grille-enigmes');

  // ================= SALLE 4 =================
  await ouvrir(0); await qcmJuste('s4e1'); await continuer('s4e1 qcm');
  await ouvrir(1); await qcmJuste('s4e2'); await continuer('s4e2 qcm');
  await ouvrir(2);
  for (const t of [0, 1]) {
    await page.locator(`.trou[data-trou="${t}"]`).click();
    await page.locator('#modale-hote .carte .palette .bloc').first().click();
  }
  await page.locator('.modale__boite .actions button', { hasText: 'Vérifier' }).click();
  await continuer('s4e3 trous');
  await passerPorte('814');
  await page.waitForSelector('.grille-enigmes');

  // ================= SALLE 5 =================
  await ouvrir(0);
  await page.locator('.modale__boite input').fill('16');
  await page.locator('.modale__boite .actions button', { hasText: 'Vérifier' }).click();
  await continuer('s5e1 saisie');
  await ouvrir(1); await qcmJuste('s5e2'); await continuer('s5e2 qcm');
  await ouvrir(2); await trier();          await continuer('s5e3 ordre');
  await passerPorte('526');

  await page.waitForSelector('.diplome');
  console.log('✓ VICTOIRE —', (await page.textContent('.diplome__nom')).trim(),
              '| rang :', await page.evaluate(() => Progression.rang()));
  await page.screenshot({ path: 'shot-victoire.png', fullPage: false });
  console.log('  temps affiché sur le diplôme :', (await page.locator('.diplome__stat b').first().textContent()).trim());

  // Pages annexes
  for (const p of ['memo.html', 'professeur.html']) {
    await page.goto(BASE + '/' + p);
    await page.waitForTimeout(300);
    const n = await page.locator('.carte').count();
    console.log(`✓ ${p} — ${n} sections rendues`);
  }

  await nav.close();
  console.log(erreurs.length ? '\n❌ ERREURS:\n' + erreurs.join('\n') : '\n✅ Aucune erreur console.');
  process.exit(erreurs.length ? 1 : 0);
})().catch(e => { console.error('ÉCHEC:', e.message); process.exit(1); });
