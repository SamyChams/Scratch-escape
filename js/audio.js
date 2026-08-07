/* =========================================================
   audio.js — petits bruitages synthétisés (aucun fichier son)
   Fonctionne hors ligne : tout est généré par le navigateur.
   ========================================================= */

const Son = (() => {
  let ctx = null;
  let actif = localStorage.getItem('toktik-son') !== 'off';

  function contexte() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /** Joue une note simple. */
  function note(frequence, depart, duree, volume = 0.16, forme = 'triangle') {
    const c = contexte();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = forme;
    osc.frequency.setValueAtTime(frequence, c.currentTime + depart);
    gain.gain.setValueAtTime(0.0001, c.currentTime + depart);
    gain.gain.exponentialRampToValueAtTime(volume, c.currentTime + depart + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + depart + duree);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime + depart);
    osc.stop(c.currentTime + depart + duree + 0.02);
  }

  function jouer(sequence, volume, forme) {
    if (!actif) return;
    try {
      sequence.forEach(([f, d, l]) => note(f, d, l, volume, forme));
    } catch (e) { /* le son n'est jamais indispensable au jeu */ }
  }

  return {
    estActif: () => actif,
    basculer() {
      actif = !actif;
      localStorage.setItem('toktik-son', actif ? 'on' : 'off');
      if (actif) this.clic();
      return actif;
    },
    clic()        { jouer([[520, 0, 0.06]], 0.08, 'square'); },
    bon()         { jouer([[523, 0, 0.12], [659, 0.09, 0.12], [784, 0.18, 0.22]]); },
    mauvais()     { jouer([[220, 0, 0.14], [165, 0.12, 0.22]], 0.14, 'sawtooth'); },
    indice()      { jouer([[880, 0, 0.08], [1175, 0.07, 0.14]], 0.10); },
    deverrouille(){ jouer([[392, 0, 0.1], [523, 0.1, 0.1], [659, 0.2, 0.1], [1047, 0.3, 0.4]]); },
    pas()         { jouer([[330, 0, 0.05]], 0.06, 'square'); },
    tape()        { jouer([[1600 + Math.random() * 400, 0, 0.012]], 0.022, 'square'); },
    cogne()       { jouer([[120, 0, 0.18]], 0.18, 'sawtooth'); },
    victoire()    {
      jouer([[523, 0, 0.14], [659, 0.14, 0.14], [784, 0.28, 0.14],
             [1047, 0.42, 0.2], [784, 0.62, 0.12], [1047, 0.74, 0.5]]);
    }
  };
})();

if (typeof window !== 'undefined') window.Son = Son;
