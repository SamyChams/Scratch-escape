/* =========================================================
   Vérifie la protection du corrigé enseignant : invisible
   sans mot de passe, mauvais mot de passe refusé, et rotation
   du mot de passe depuis outils.html.

   Utilisation :
     npm install playwright
     python3 -m http.server 8765 &
     node tests/corrige-chiffre.js
   ========================================================= */

const { chromium } = require('playwright');

// Sur une machine ordinaire, Playwright trouve Chromium tout seul.
// CHROMIUM_PATH permet de le désigner à la main si besoin.
const LANCEMENT = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const BASE = 'http://127.0.0.1:8765';
(async () => {
  const nav = await chromium.launch(LANCEMENT);
  const page = await nav.newPage({ viewport: { width: 1200, height: 900 } });
  const err = []; page.on('pageerror', e => err.push(e.message));

  // 1. Le corrigé est-il invisible sans mot de passe ?
  await page.goto(BASE + '/professeur.html');
  const txt = await page.locator('body').innerText();
  console.log('corrigé masqué au chargement    :', !/Badge refusé|360 ÷ 5|déconnexion/.test(txt) ? 'OUI ✓' : 'NON ✗');
  console.log('codes absents de la page        :', !/\b41\b|\b73\b|\b29\b|\b58\b/.test(txt) ? 'OUI ✓' : 'NON ✗');

  // 2. Mauvais mot de passe
  await page.fill('#mdp', 'jesuisunélève');
  await page.click('#btn-ouvrir');
  await page.waitForTimeout(1500);
  console.log('mauvais mot de passe refusé     :',
    (await page.locator('#retour-mdp').innerText()).includes('incorrect') ? 'OUI ✓' : 'NON ✗');

  // 3. Bon mot de passe
  await page.fill('#mdp', 'labo404');
  await page.click('#btn-ouvrir');
  await page.waitForSelector('#corrige:not(.cache)', { timeout: 15000 });
  const ouvert = await page.locator('#corrige').innerText();
  console.log('corrigé affiché après mdp       :', /Badge refusé/.test(ouvert) && /41/.test(ouvert) ? 'OUI ✓' : 'NON ✗');
  await page.screenshot({ path: 'shot-prof.png', fullPage: true });

  // 4. Rotation du mot de passe via outils.html
  await page.goto(BASE + '/outils.html');
  await page.fill('#mdp-actuel', 'labo404');
  await page.click('#btn-ouvrir');
  await page.waitForSelector('#suite:not(.cache)', { timeout: 15000 });
  await page.fill('#mdp1', 'chatperche2026');
  await page.fill('#mdp2', 'chatperche2026');
  const dl = page.waitForEvent('download');
  await page.click('#btn-generer');
  const fichier = await (await dl).path();
  const contenu = require('fs').readFileSync(fichier, 'utf8');
  console.log('fichier régénéré, sans fuite    :',
    /CORRIGE_CHIFFRE/.test(contenu) && !/Badge refusé|déconnexion/.test(contenu) ? 'OUI ✓' : 'NON ✗');

  // 5. Le nouveau fichier s'ouvre-t-il avec le nouveau mdp, et pas l'ancien ?
  const test = await page.evaluate(async (src) => {
    const blob = {};
    new Function('window', src + '; window.__c = CORRIGE_CHIFFRE;')(blob);
    const ancien = await Coffre.ouvrir('labo404', blob.__c);
    const nouveau = await Coffre.ouvrir('chatperche2026', blob.__c);
    return { ancien: ancien === null, nouveau: !!(nouveau && nouveau.solutions) };
  }, contenu);
  console.log('ancien mot de passe rejeté      :', test.ancien ? 'OUI ✓' : 'NON ✗');
  console.log('nouveau mot de passe accepté    :', test.nouveau ? 'OUI ✓' : 'NON ✗');

  await nav.close();
  console.log(err.length ? '❌ ' + err.join('\n') : '✅ aucune erreur JS');
})();
