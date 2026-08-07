/* =========================================================
   coffre.js — chiffrement du corrigé enseignant
   ---------------------------------------------------------
   AES-256-GCM, clé dérivée du mot de passe par PBKDF2
   (SHA-256). Utilise l'API Web Crypto du navigateur :
   aucune bibliothèque externe.

   Sans le mot de passe, le contenu de js/corrige-chiffre.js
   est inexploitable — y compris pour un élève qui ouvrirait
   le code source de la page.
   ========================================================= */

const Coffre = (() => {
  const ITERATIONS = 250000;

  const versB64 = (u8) => btoa(String.fromCharCode(...new Uint8Array(u8)));
  const depuisB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  function disponible() {
    return !!(window.crypto && window.crypto.subtle);
  }

  async function cle(motDePasse, sel, iterations, usages) {
    const base = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(motDePasse), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: sel, iterations, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, usages);
  }

  /** Déchiffre un coffre. Renvoie l'objet, ou null si le mot de passe est faux. */
  async function ouvrir(motDePasse, coffre) {
    try {
      const sel = depuisB64(coffre.sel);
      const iv = depuisB64(coffre.iv);
      const k = await cle(motDePasse, sel, coffre.iterations || ITERATIONS, ['decrypt']);
      const clair = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv }, k, depuisB64(coffre.donnees));
      return JSON.parse(new TextDecoder().decode(clair));
    } catch (e) {
      return null;   // mot de passe incorrect ou fichier abîmé
    }
  }

  /** Chiffre un objet et renvoie un coffre prêt à être enregistré. */
  async function fermer(motDePasse, objet) {
    const sel = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const k = await cle(motDePasse, sel, ITERATIONS, ['encrypt']);
    const chiffre = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, k,
      new TextEncoder().encode(JSON.stringify(objet)));
    return {
      version: 1,
      iterations: ITERATIONS,
      sel: versB64(sel),
      iv: versB64(iv),
      donnees: versB64(chiffre)
    };
  }

  /** Reconstruit le contenu du fichier js/corrige-chiffre.js. */
  function versFichier(coffre) {
    return `/* =========================================================
   corrige-chiffre.js — corrigé de l'escape game, CHIFFRÉ
   ---------------------------------------------------------
   Ce fichier ne contient aucune réponse en clair : les
   solutions sont chiffrées en AES-256-GCM avec une clé
   dérivée du mot de passe enseignant (PBKDF2, ${coffre.iterations} tours).

   Pour lire ou modifier le corrigé : ouvrir outils.html.
   ========================================================= */

const CORRIGE_CHIFFRE = {
  version: ${coffre.version},
  iterations: ${coffre.iterations},
  sel: "${coffre.sel}",
  iv: "${coffre.iv}",
  donnees: "${coffre.donnees}"
};

if (typeof window !== 'undefined') window.CORRIGE_CHIFFRE = CORRIGE_CHIFFRE;
`;
  }

  return { ouvrir, fermer, versFichier, disponible };
})();

if (typeof window !== 'undefined') window.Coffre = Coffre;
