/* =========================================================
   progression.js — sauvegarde de la partie (localStorage)
   ---------------------------------------------------------
   Rien n'est envoyé sur Internet : tout reste dans le
   navigateur de l'élève, sur l'ordinateur qu'il utilise.
   ========================================================= */

const Progression = (() => {
  const CLE = 'labo404-partie-v1';

  const vide = () => ({
    pseudo: '',
    salle: 0,             // index de la salle en cours
    resolues: [],         // identifiants des énigmes réussies
    fragments: {},        // idEnigme -> chiffre obtenu
    indices: 0,           // nombre d'indices demandés
    erreurs: 0,           // nombre de réponses fausses
    debut: null,          // horodatage de départ
    duree: 0,             // durée totale en secondes (à la victoire)
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

    ouvrirSalle(indice) {
      if (indice > etat.salle) etat.salle = indice;
      sauver();
    },

    compterIndice() { etat.indices++; sauver(); },
    compterErreur() { etat.erreurs++; sauver(); },

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
