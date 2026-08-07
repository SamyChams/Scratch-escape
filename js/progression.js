/* =========================================================
   progression.js — sauvegarde de la partie (localStorage)
   ---------------------------------------------------------
   Rien n'est envoyé sur Internet : tout reste dans le
   navigateur de l'élève, sur l'ordinateur qu'il utilise.
   ========================================================= */

const Progression = (() => {
  const CLE = 'loop-partie-v1';

  const vide = () => ({
    pseudo: '',
    mode: 'chill',        // chill | chrono | expert
    etape: 0,             // index de l'étape en cours
    profil: [],           // étiquettes tirées des choix, pour le portrait final
    erreursEtape: {},     // idEtape -> erreurs commises (quota du mode « sans faute »)
    departEtape: {},      // idEtape -> horodatage d'entrée (mode chrono)
    medailles: {},        // idEtape -> true si le temps cible est tenu
    branches: {},         // idEtape -> branche choisie ('a' ou 'b')
    resolues: [],         // identifiants des énigmes réussies
    fragments: {},        // idEnigme -> chiffre obtenu
    indices: 0,           // nombre d'indices demandés
    erreurs: 0,           // nombre de réponses fausses
    debut: null,          // horodatage de départ
    duree: 0,             // durée totale en secondes (à la victoire)
    prologueVu: false,    // le récit d'introduction a déjà été joué
    sallesVues: [],       // salles dont le dialogue d'entrée a déjà été joué
    termine: false
  });

  let etat = charger();

  function charger() {
    try {
      const brut = localStorage.getItem(CLE);
      if (!brut) return vide();
      return Object.assign(vide(), JSON.parse(brut));
    } catch (e) {
      return vide();
    }
  }

  function sauver() {
    try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { /* mode privé */ }
  }

  return {
    get etat() { return etat; },
    existe()   { return !!etat.debut && !etat.termine; },

    demarrer(pseudo) {
      etat = vide();
      etat.pseudo = (pseudo || 'Agent secret').slice(0, 24);
      etat.debut = Date.now();
      sauver();
      return etat;
    },

    reinitialiser() { etat = vide(); localStorage.removeItem(CLE); },

    estResolue(id) { return etat.resolues.includes(id); },

    resoudre(id, fragment) {
      if (!etat.resolues.includes(id)) {
        etat.resolues.push(id);
        if (fragment !== undefined) etat.fragments[id] = fragment;
        sauver();
      }
    },

    ouvrirEtape(indice) {
      if (indice > etat.etape) etat.etape = indice;
      sauver();
    },

    /** Mémorise la branche choisie : elle décide des énigmes rencontrées. */
    choisirBranche(idEtape, branche, profil) {
      etat.branches[idEtape] = branche;
      if (profil && !etat.profil.includes(profil)) etat.profil.push(profil);
      sauver();
    },

    /* --- mode de jeu ------------------------------------------------ */
    get mode() { return MODES[etat.mode] ? etat.mode : 'chill'; },
    changerMode(id) {
      if (MODES[id]) { etat.mode = id; sauver(); }
    },
    reglesMode() { return MODES[this.mode]; },

    /* --- quota d'erreurs, par étape --------------------------------- */
    erreursDe(idEtape) { return etat.erreursEtape[idEtape] || 0; },
    quotaDepasse(idEtape) {
      const max = this.reglesMode().erreursMax;
      return max !== null && this.erreursDe(idEtape) >= max;
    },
    /** Remet une étape à zéro : quota, chrono et énigmes à refaire. */
    reprendreEtape(idEtape, idsEnigmes = []) {
      etat.erreursEtape[idEtape] = 0;
      delete etat.departEtape[idEtape];
      idsEnigmes.forEach((id) => {
        etat.resolues = etat.resolues.filter((x) => x !== id);
        delete etat.fragments[id];
      });
      sauver();
    },

    /* --- chronomètre par étape -------------------------------------- */
    entrerEtape(idEtape) {
      if (!etat.departEtape[idEtape]) { etat.departEtape[idEtape] = Date.now(); sauver(); }
    },
    secondesEtape(idEtape) {
      const d = etat.departEtape[idEtape];
      return d ? Math.floor((Date.now() - d) / 1000) : 0;
    },
    /** Le temps cible est-il tenu ? Renvoie null hors mode chrono. */
    fermerEtape(idEtape) {
      if (!this.reglesMode().chrono) return null;
      const tenu = this.secondesEtape(idEtape) <= this.reglesMode().objectif;
      etat.medailles[idEtape] = tenu;
      sauver();
      return tenu;
    },
    medaillesGagnees() { return Object.values(etat.medailles).filter(Boolean).length; },
    brancheDe(idEtape) { return etat.branches[idEtape] || null; },

    marquerPrologue() { etat.prologueVu = true; sauver(); },

    salleVue(id) { return etat.sallesVues.includes(id); },
    marquerSalleVue(id) {
      if (!etat.sallesVues.includes(id)) { etat.sallesVues.push(id); sauver(); }
    },

    compterIndice() { etat.indices++; sauver(); },
    /** Compte une erreur, globalement et pour l'étape en cours. */
    compterErreur(idEtape) {
      etat.erreurs++;
      if (idEtape) etat.erreursEtape[idEtape] = (etat.erreursEtape[idEtape] || 0) + 1;
      sauver();
      return idEtape ? etat.erreursEtape[idEtape] : etat.erreurs;
    },

    terminer() {
      etat.duree = this.secondes();   // à calculer AVANT de marquer la partie finie
      etat.termine = true;
      sauver();
    },

    secondes() {
      if (etat.termine) return etat.duree;
      return etat.debut ? Math.floor((Date.now() - etat.debut) / 1000) : 0;
    },

    /** Chronomètre au format mm:ss (ou h:mm:ss). */
    chrono() {
      const s = this.secondes();
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const r = s % 60;
      const deux = (n) => String(n).padStart(2, '0');
      return h > 0 ? `${h}:${deux(m)}:${deux(r)}` : `${deux(m)}:${deux(r)}`;
    },

    /** Note finale sur 3 étoiles, selon les indices et les erreurs. */
    etoiles() {
      const malus = etat.indices * 2 + etat.erreurs;
      if (malus <= 4)  return 3;
      if (malus <= 12) return 2;
      return 1;
    },

    rang() {
      switch (this.etoiles()) {
        case 3:  return 'Grand Maître des Blocs';
        case 2:  return 'Programmeur confirmé';
        default: return 'Apprenti codeur';
      }
    }
  };
})();

if (typeof window !== 'undefined') window.Progression = Progression;
