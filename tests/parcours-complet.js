/* =========================================================
   Rejoue les deux branches du parcours en résolvant
   réellement chacune des 20 énigmes, et vérifie que les deux
   élèves n'ont aucun exercice en commun.

   Utilisation :
     npm install playwright
     python3 -m http.server 8765 &
     node tests/parcours-complet.js
   ========================================================= */

const { chromium } = require('playwright');

// Sur une machine ordinaire, Playwright trouve Chromium tout seul.
// CHROMIUM_PATH permet de le désigner à la main si besoin.
const LANCEMENT = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const BASE = 'http://127.0.0.1:8765';

/* Solution attendue pour chacune des 20 énigmes écrites. */
const SOLUTIONS = {
  e1a1: { type: 'assoc' },
  e1a3: { type: 'qcm' },
  e1b3: { type: 'assoc' },
  e2a3: { type: 'assoc' },
  e2b3: { type: 'qcm' },
  e3a3: { type: 'saisie', valeur: '90' },
  e3b3: { type: 'trous', nombres: ['6'] },
  e4a3: { type: 'assoc' },
  e4b3: { type: 'qcm' },
  e5a3: { type: 'qcm' },
  e5b3: { type: 'ordre' },
  e1a2: { type: 'ordre' },
  e1b1: { type: 'qcm' },
  e1b2: { type: 'ordre' },
  e2a1: { type: 'qcm' },
  e2a2: { type: 'grille', suite: [0, 2, 0, 0, 0, 1, 0, 0, 0] },
  e2b1: { type: 'saisie', valeur: '70' },
  e2b2: { type: 'grille', suite: [0, 0, 0, 2, 0, 0, 0, 0] },
  e3a1: { type: 'qcm' },
  e3a2: { type: 'trous', nombres: ['4', '4'] },
  e3b1: { type: 'qcm' },
  e3b2: { type: 'saisie', valeur: '72' },
  e4a1: { type: 'trous', choix: [0, 0] },
  e4a2: { type: 'qcm' },
  e4b1: { type: 'qcm' },
  e4b2: { type: 'trous', choix: [0, 0] },
  e5a1: { type: 'saisie', valeur: '16' },
  e5a2: { type: 'ordre' },
  e5b1: { type: 'qcm' },
  e5b2: { type: 'saisie', valeur: '103' }
};

async function resoudre(page, id, sol) {
  const boite = page.locator('.modale__boite');
  await boite.waitFor({ timeout: 10000 });

  if (sol.type === 'qcm') {
    const i = await page.evaluate((eid) => {
      for (const e of ETAPES) for (const c of Object.keys(e.branches))
        for (const x of e.branches[c].enigmes)
          if (x.id === eid) return x.options.findIndex(o => o.correct);
    }, id);
    await page.locator('.option').nth(i).click();

  } else if (sol.type === 'assoc') {
    const paires = await page.evaluate((eid) => {
      for (const e of ETAPES) for (const c of Object.keys(e.branches))
        for (const x of e.branches[c].enigmes) if (x.id === eid) return x.paires;
    }, id);
    for (const p of paires) {
      await page.locator('.assoc__colonne').first().locator('.jeton', { hasText: p.g }).first().click();
      await page.locator('.assoc__colonne').last().locator('.jeton', { hasText: p.d }).first().click();
    }

  } else if (sol.type === 'ordre') {
    const n = await page.locator('.item-ordre').count();
    for (let cible = 0; cible < n; cible++) {
      for (let t = 0; t < n; t++) {
        const idx = await page.locator('.item-ordre').evaluateAll(
          (els, c) => els.findIndex((e, k) => k >= c && Number(e.dataset.index) === c), cible);
        if (idx === cible) break;
        await page.locator('.item-ordre').nth(idx).locator('.mini-btn').first().click();
      }
    }
    await boite.locator('.actions button', { hasText: 'Vérifier' }).click();

  } else if (sol.type === 'saisie') {
    await boite.locator('input').first().fill(sol.valeur);
    await boite.locator('.actions button', { hasText: 'Vérifier' }).click();

  } else if (sol.type === 'grille') {
    for (const k of sol.suite) await page.locator('.palette .bloc').nth(k).click();
    await boite.locator('.actions button', { hasText: 'Lancer' }).click();

  } else if (sol.type === 'trous') {
    if (sol.nombres) {
      for (let i = 0; i < sol.nombres.length; i++) {
        await page.locator('.trou input').nth(i).fill(sol.nombres[i]);
      }
    } else {
      for (let t = 0; t < sol.choix.length; t++) {
        await page.locator(`.trou[data-trou="${t}"]`).click();
        await page.locator('#modale-hote .carte .palette .bloc').nth(sol.choix[t]).click();
      }
    }
    await boite.locator('.actions button', { hasText: /Lancer|Vérifier/ }).click();
  }

  const ok = boite.locator('.actions button', { hasText: 'Continuer' });
  await ok.waitFor({ timeout: 25000 });
  await ok.click();
  await page.locator('.modale').waitFor({ state: 'detached' });
}

let total = 0;

async function jouerBranche(page, branche, erreurs) {
  await page.goto(BASE + '/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#pseudo', 'Réel-' + branche);
  await page.click('#btn-jouer');

  const passerRecit = async () => {
    for (let i = 0; i < 40; i++) {
      // on sort dès que l'écran suivant est là
      if (await page.locator('.bifurcation, .taches, .diplome').count()) return;
      const b = page.locator('.recit__pied .recit__passer');
      if (!(await b.count())) { await page.waitForTimeout(200); continue; }
      await b.click();
      const suite = page.locator('#scene .actions button').last();
      await suite.waitFor({ state: 'visible', timeout: 15000 });
      await suite.click();
      await page.waitForTimeout(250);
    }
  };

  for (let etape = 0; etape < 5; etape++) {
    await passerRecit();
    await page.locator('.bifurcation').waitFor({ timeout: 15000 });
    await page.locator('.option-branche').nth(branche === 'a' ? 0 : 1).click();
    await passerRecit();
    await page.locator('.taches').waitFor({ timeout: 15000 });

    const ids = await page.evaluate(() => {
      const e = ETAPES[Progression.etat.etape];
      return enigmesDe(e, Progression.brancheDe(e.id)).map(x => x.id);
    });

    for (let i = 0; i < ids.length; i++) {
      if (!SOLUTIONS[ids[i]]) throw new Error('aucune solution connue pour ' + ids[i]);
      await page.locator('.tache').nth(i).click();
      await resoudre(page, ids[i], SOLUTIONS[ids[i]]);
      console.log('   ✓', ids[i]);
      total++;
    }

    const code = await page.evaluate(() => {
      const e = ETAPES[Progression.etat.etape];
      return codeDe(e, Progression.brancheDe(e.id));
    });
    for (let i = 0; i < code.length; i++) {
      await page.locator('input.verif__case').nth(i).fill(code[i]);
    }
    await page.locator('.verif button').click();
    await page.waitForTimeout(300);
  }
  await passerRecit();
  await page.locator('.diplome').waitFor({ timeout: 20000 });
}

(async () => {
  const nav = await chromium.launch(LANCEMENT);
  const erreurs = [];
  for (const br of ['a', 'b']) {
    const page = await nav.newPage({ viewport: { width: 1280, height: 950 } });
    page.on('pageerror', e => erreurs.push(br + ': ' + e.message));
    page.on('console', m => { if (m.type() === 'error') erreurs.push(br + ' console: ' + m.text()); });
    console.log('— branche ' + br.toUpperCase());
    total = 0;
    await jouerBranche(page, br, erreurs);
    console.log(`✓ branche ${br.toUpperCase()} : ${total} énigmes réellement résolues, attestation atteinte`);
    if (br === 'b') await page.screenshot({ path: 'loop-fin.png' });
    await page.close();
  }
  await nav.close();
  const ecrites = Object.keys(SOLUTIONS).length;
  console.log(erreurs.length
    ? '\n❌ ERREURS:\n' + erreurs.join('\n')
    : `\n✅ Les ${ecrites} énigmes écrites sont solubles, aucune erreur JS.`);
  process.exit(erreurs.length ? 1 : 0);
})().catch(e => { console.error('ÉCHEC:', e.message); process.exit(1); });
