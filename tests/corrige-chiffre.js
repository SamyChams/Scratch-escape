/* =========================================================
   Vérifie la protection du corrigé enseignant.

   Le mot de passe réel est choisi par l'enseignant et n'est
   écrit nulle part : ce test ne peut donc pas l'utiliser.
   Il procède en deux temps —

     1. sur le site réel, sans mot de passe : le corrigé doit
        rester invisible, les codes absents de la page, et un
        mauvais mot de passe doit être refusé ;

     2. sur un coffre d'essai fabriqué à la volée : le
        mécanisme de chiffrement doit faire l'aller-retour,
        refuser une autre clé, et ne rien laisser en clair.

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

const resultats = [];
const verifier = (nom, ok) => {
  resultats.push({ nom, ok });
  console.log(`${ok ? '✓' : '✗'} ${nom}`);
};

(async () => {
  const nav = await chromium.launch(LANCEMENT);
  const page = await nav.newPage({ viewport: { width: 1200, height: 900 } });
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));

  /* ---------- 1. le site réel, sans mot de passe ---------- */
  await page.goto(BASE + '/professeur.html');
  const visible = await page.locator('body').innerText();

  // On cherche des formulations propres au corrigé, pas des mots que la
  // fiche pédagogique emploie légitimement (« initialisation », par exemple).
  verifier('aucune solution visible au chargement',
    !/Badge refusé|360 ÷ 5|envoyer à tous|la boucle amène/i.test(visible));
  verifier('aucun code de vérification visible',
    !/\b(418|732|296|581|604|619|385|527|143|790)\b/.test(visible));
  verifier('le fichier chiffré ne contient rien en clair',
    !/badge|initialis|signal/i.test(
      await (await fetch(BASE + '/js/corrige-chiffre.js')).text()));

  await page.fill('#mdp', 'ce-nest-pas-le-bon');
  await page.click('#btn-ouvrir');
  await page.waitForTimeout(1800);
  verifier('un mauvais mot de passe est refusé',
    (await page.locator('#retour-mdp').innerText()).includes('incorrect'));
  verifier('et le corrigé reste masqué',
    await page.locator('#corrige').evaluate((e) => e.classList.contains('cache')));

  /* ---------- 2. le mécanisme, sur un coffre d'essai ---------- */
  const meca = await page.evaluate(async () => {
    // Un témoin assez long pour ne pas apparaître par hasard dans du base64.
    const temoin = 'TEMOIN-EN-CLAIR-A-NE-PAS-RETROUVER';
    const secret = { solutions: { test: temoin }, codes: { e1a: '418' } };
    const coffre = await Coffre.fermer('mot-de-passe-dessai', secret);

    const bon     = await Coffre.ouvrir('mot-de-passe-dessai', coffre);
    const mauvais = await Coffre.ouvrir('autre-mot-de-passe', coffre);
    const fichier = Coffre.versFichier(coffre);

    return {
      allerRetour: !!bon && bon.solutions.test === temoin,
      refus: mauvais === null,
      sansFuite: !fichier.includes(temoin),
      iterations: coffre.iterations,
      selUnique: coffre.sel !== (await Coffre.fermer('mot-de-passe-dessai', secret)).sel
    };
  });

  verifier('le coffre se rouvre avec la bonne clé', meca.allerRetour);
  verifier('une autre clé est refusée', meca.refus);
  verifier('le fichier produit ne laisse rien en clair', meca.sansFuite);
  verifier('la dérivation reste coûteuse (≥ 100 000 tours)', meca.iterations >= 100000);
  verifier('le sel change à chaque chiffrement', meca.selUnique);

  await nav.close();
  const echecs = resultats.filter((r) => !r.ok).length;
  console.log(erreurs.length ? '\n❌ ERREURS JS:\n' + erreurs.join('\n') : '\n✅ Aucune erreur JS.');
  console.log(echecs ? `❌ ${echecs} vérification(s) en échec.` : `✅ ${resultats.length} vérifications passées.`);
  process.exit(echecs || erreurs.length ? 1 : 0);
})().catch((e) => { console.error('ÉCHEC:', e.message); process.exit(1); });
