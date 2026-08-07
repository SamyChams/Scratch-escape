/* =========================================================
   corrige-chiffre.js — corrigé de LOOP, CHIFFRÉ
   ---------------------------------------------------------
   Aucune réponse en clair : les solutions sont chiffrées en
   AES-256-GCM avec une clé dérivée du mot de passe enseignant
   (PBKDF2-SHA256, 250000 tours).

   Pour lire ou modifier le corrigé : ouvrir outils.html.
   ========================================================= */

const CORRIGE_CHIFFRE = {
  version: 1,
  iterations: 250000,
  sel: "O2+hDkenbVr667T/xQexUw==",
  iv: "TRjXPvTU3XIL4Z7B",
  donnees: "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"
};

if (typeof window !== 'undefined') window.CORRIGE_CHIFFRE = CORRIGE_CHIFFRE;
