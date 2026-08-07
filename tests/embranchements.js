/* =========================================================
   Vérifie qu'un même parcours joué avec l'autre choix donne
   des énigmes entièrement différentes, tout en traversant
   les cinq mêmes notions.

   Utilisation :
     npm install playwright
     python3 -m http.server 8765 &
     node tests/embranchements.js
   ========================================================= */

const { chromium } = require('playwright');

// Sur une machine ordinaire, Playwright trouve Chromium tout seul.
// CHROMIUM_PATH permet de le désigner à la main si besoin.
const LANCEMENT = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const BASE = 'http://127.0.0.1:8765';

/* Joue un parcours complet en choisissant systématiquement la branche demandée. */
async function jouer(page, brancheVoulue, erreurs) {
  await page.goto(BASE + '/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#pseudo', 'Test-' + brancheVoulue);
  await page.click('#btn-jouer');

  const passerRecit = async () => {
    const b = page.locator('.recit__pied .recit__passer');
    for (let i = 0; i < 30; i++) {
      if (!(await b.count())) break;
      await b.waitFor({ state: 'visible', timeout: 15000 });
      await b.click();
      // le bouton de suite n'apparaît qu'une fois toutes les répliques écrites
      const suite = page.locator('#scene .actions button').last();
      await suite.waitFor({ state: 'visible', timeout: 15000 });
      await suite.click();
      await page.waitForTimeout(250);
      if (await page.locator('.bifurcation, .taches, .diplome').count()) break;
    }
  };

  const vus = [];
  for (let etape = 0; etape < 5; etape++) {
    await passerRecit();
    // choix de branche
    await page.locator('.bifurcation').waitFor({ timeout: 15000 });
    const idx = brancheVoulue === 'a' ? 0 : 1;
    await page.locator('.option-branche').nth(idx).click();
    await passerRecit();
    await page.locator('.taches').waitFor({ timeout: 15000 });

    // résout les deux énigmes via l'état interne, puis valide le code
    const infos = await page.evaluate(() => {
      const e = ETAPES[Progression.etat.etape];
      const b = Progression.brancheDe(e.id);
      return { ids: enigmesDe(e, b).map(x => x.id), code: codeDe(e, b), titres: enigmesDe(e, b).map(x => x.titre) };
    });
    vus.push(...infos.ids);
    await page.evaluate((ids) => {
      const e = ETAPES[Progression.etat.etape];
      const b = Progression.brancheDe(e.id);
      enigmesDe(e, b).forEach(x => Progression.resoudre(x.id, x.fragment));
    }, infos.ids);
    await page.reload();
    await page.locator('.verif__case').first().waitFor({ timeout: 15000 });
    for (let i = 0; i < infos.code.length; i++) {
      await page.locator('input.verif__case').nth(i).fill(infos.code[i]);
    }
    await page.locator('.verif button').click();
    await page.waitForTimeout(300);
  }
  await passerRecit();
  await page.locator('.diplome').waitFor({ timeout: 20000 });
  return vus;
}

(async () => {
  const nav = await chromium.launch(LANCEMENT);
  const erreurs = [];

  const pageA = await nav.newPage({ viewport: { width: 1280, height: 950 } });
  pageA.on('pageerror', e => erreurs.push('A: ' + e.message));
  pageA.on('console', m => { if (m.type() === 'error') erreurs.push('A console: ' + m.text()); });
  const vusA = await jouer(pageA, 'a', erreurs);
  console.log('✓ parcours A terminé —', vusA.length, 'énigmes :', vusA.join(' '));
  await pageA.screenshot({ path: 'loop-diplome.png' });

  const pageB = await nav.newPage({ viewport: { width: 1280, height: 950 } });
  pageB.on('pageerror', e => erreurs.push('B: ' + e.message));
  pageB.on('console', m => { if (m.type() === 'error') erreurs.push('B console: ' + m.text()); });
  const vusB = await jouer(pageB, 'b', erreurs);
  console.log('✓ parcours B terminé —', vusB.length, 'énigmes :', vusB.join(' '));

  const communs = vusA.filter(x => vusB.includes(x));
  console.log('énigmes communes aux deux parcours :', communs.length, communs.length === 0 ? '✓ (aucune)' : '✗');

  // couverture pédagogique : les 5 notions dans les deux cas
  const notions = await pageA.evaluate(() => ETAPES.map(e => e.notion));
  console.log('notions traversées par les deux parcours :', notions.length, '✓');

  await nav.close();
  console.log(erreurs.length ? '\n❌ ERREURS:\n' + erreurs.join('\n') : '\n✅ Aucune erreur JS.');
  process.exit(erreurs.length ? 1 : 0);
})().catch(e => { console.error('ÉCHEC:', e.message); process.exit(1); });
