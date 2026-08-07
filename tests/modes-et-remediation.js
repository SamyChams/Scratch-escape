/* =========================================================
   Vérifie les trois filets de sécurité ajoutés au parcours :

     - le mode « sans faute » prévient au bon moment et ne
       bloque jamais : il ouvre toujours une porte de sortie ;
     - après deux échecs, la version plus simple est proposée
       et crédite bien le chiffre de l'énigme d'origine ;
     - les choix alimentent le profil que Nova affiche à la fin.

   Utilisation :
     npm install playwright
     python3 -m http.server 8765 &
     node tests/modes-et-remediation.js
   ========================================================= */

const { chromium } = require('playwright');

// Sur une machine ordinaire, Playwright trouve Chromium tout seul.
// CHROMIUM_PATH permet de le désigner à la main si besoin.
const LANCEMENT = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const BASE = 'http://127.0.0.1:8765';

const resultats = [];
const verifier = (nom, ok) => {
  resultats.push({ nom, ok });
  console.log(`${ok ? '✓' : '✗'} ${nom}`);
};

/** Amène la partie jusqu'aux deux énigmes de la première étape. */
async function allerAuxTaches(page, mode) {
  await page.goto(BASE + '/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#pseudo', 'Test');
  await page.locator('.carte-mode', { hasText: mode }).click();
  await page.click('#btn-jouer');

  const passerRecit = async () => {
    for (let i = 0; i < 40; i++) {
      if (await page.locator('.bifurcation, .taches').count()) return;
      const b = page.locator('.recit__pied .recit__passer');
      if (!(await b.count())) { await page.waitForTimeout(200); continue; }
      await b.click();
      const suite = page.locator('#scene .actions button').last();
      await suite.waitFor({ state: 'visible', timeout: 15000 });
      await suite.click();
      await page.waitForTimeout(250);
    }
  };

  await passerRecit();
  await page.locator('.option-branche').nth(1).click();   // branche B : commence par un QCM
  await passerRecit();
  await page.locator('.taches').waitFor({ timeout: 15000 });
}

/**
 * Clique la n-ième réponse fausse du QCM ouvert.
 * Une option déjà cliquée est désactivée : il faut donc en changer
 * à chaque essai, exactement comme le ferait un élève.
 */
async function repondreFaux(page, n = 0) {
  const i = await page.evaluate((rang) => {
    const e = ETAPES[Progression.etat.etape];
    const enigme = enigmesDe(e, Progression.brancheDe(e.id))[0];
    const faux = enigme.options.map((o, k) => (o.correct ? -1 : k)).filter((k) => k >= 0);
    return faux[rang % faux.length];
  }, n);
  await page.locator('.option').nth(i).click();
  await page.waitForTimeout(250);
}

(async () => {
  const nav = await chromium.launch(LANCEMENT);
  const erreurs = [];

  /* ---------- 1. mode « sans faute » : quota et porte de sortie ---------- */
  {
    const page = await nav.newPage({ viewport: { width: 1280, height: 950 } });
    page.on('pageerror', (e) => erreurs.push('expert: ' + e.message));
    await allerAuxTaches(page, 'Sans faute');

    verifier('le mode choisi est bien appliqué',
      (await page.evaluate(() => Progression.mode)) === 'expert');
    verifier('le quota restant est affiché',
      (await page.locator('.mode-rappel__valeur').innerText()).includes('3 erreurs'));

    await page.locator('.tache').first().click();
    for (let i = 0; i < 3; i++) await repondreFaux(page, i);

    await page.locator('.verif, #scene').first().waitFor();
    const texte = await page.locator('#scene').innerText();
    verifier('au 3e échec, l\'écran de quota apparaît', /Quota atteint/.test(texte));
    verifier('la porte de sortie est proposée', /mode tranquille/i.test(texte));
    verifier('recommencer l\'étape est aussi proposé', /Recommencer/i.test(texte));

    await page.locator('button', { hasText: 'mode tranquille' }).click();
    await page.locator('.taches').waitFor({ timeout: 10000 });
    verifier('basculer en tranquille change bien le mode',
      (await page.evaluate(() => Progression.mode)) === 'chill');
    verifier('et ne bloque pas la progression',
      (await page.locator('.taches').count()) === 1);
    await page.close();
  }

  /* ---------- 2. remédiation après deux échecs ---------- */
  {
    const page = await nav.newPage({ viewport: { width: 1280, height: 950 } });
    page.on('pageerror', (e) => erreurs.push('remédiation: ' + e.message));
    await allerAuxTaches(page, 'Tranquille');

    const attendu = await page.evaluate(() => {
      const e = ETAPES[Progression.etat.etape];
      return enigmesDe(e, Progression.brancheDe(e.id))[0];
    });

    await page.locator('.tache').first().click();
    await repondreFaux(page, 0);
    verifier('pas de version simple après un seul échec',
      (await page.locator('.btn--remediation').count()) === 0);

    await repondreFaux(page, 1);
    const bouton = page.locator('.btn--remediation');
    await bouton.waitFor({ timeout: 10000 });
    verifier('la version plus simple est proposée au 2e échec', true);

    await bouton.click();
    await page.locator('.modale__boite').waitFor();
    verifier('la remédiation porte sur la même notion',
      (await page.locator('.modale__titre').innerText()).includes('On reprend'));

    // on la résout
    const j = await page.evaluate((id) => {
      const r = REMEDIATIONS[ETAPES[Progression.etat.etape].id];
      return r.options.findIndex((o) => o.correct);
    });
    await page.locator('.option').nth(j).click();
    await page.locator('.modale__boite .actions button', { hasText: 'Continuer' }).click();
    await page.locator('.taches').waitFor({ timeout: 10000 });

    const credite = await page.evaluate((id) => Progression.etat.fragments[id], attendu.id);
    verifier('la remédiation crédite le chiffre de l\'énigme d\'origine',
      credite === attendu.fragment);
    await page.close();
  }

  /* ---------- 3. le profil se remplit au fil des choix ---------- */
  {
    const page = await nav.newPage({ viewport: { width: 1280, height: 950 } });
    page.on('pageerror', (e) => erreurs.push('profil: ' + e.message));
    await allerAuxTaches(page, 'Tranquille');
    const profil = await page.evaluate(() => Progression.etat.profil);
    verifier('le choix de branche alimente le profil', profil.length === 1);
    verifier('l\'étiquette du profil est connue',
      await page.evaluate((p) => !!PROFILS[p[0]], profil));
    await page.close();
  }

  await nav.close();
  const echecs = resultats.filter((r) => !r.ok).length;
  console.log(erreurs.length ? '\n❌ ERREURS JS:\n' + erreurs.join('\n') : '\n✅ Aucune erreur JS.');
  console.log(echecs ? `❌ ${echecs} vérification(s) en échec.` : `✅ ${resultats.length} vérifications passées.`);
  process.exit(echecs || erreurs.length ? 1 : 0);
})().catch((e) => { console.error('ÉCHEC:', e.message); process.exit(1); });
