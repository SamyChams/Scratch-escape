/* =========================================================
   recit.js — dialogues qui s'écrivent petit à petit
   ---------------------------------------------------------
   Les répliques apparaissent lettre après lettre, comme dans
   un jeu d'aventure. L'élève avance avec la barre Espace
   (ou Entrée, ou un clic) :

     · pendant que le texte défile → tout afficher d'un coup
     · quand la réplique est finie → passer à la suivante

   Un bouton « Tout afficher » permet de sauter la séquence,
   et l'animation est désactivée si le système demande de
   réduire les animations.
   ========================================================= */

const Recit = (() => {

  const VITESSE = 18;        // millisecondes par caractère
  const PAUSES = { ',': 90, ';': 120, ':': 120, '.': 200, '!': 200, '?': 200, '…': 260 };

  const sobre = () => window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ machine à écrire */
  /**
   * Écrit progressivement du HTML dans un élément, en préservant
   * la mise en forme (gras, italique…).
   * Renvoie un objet { terminer() } pour tout afficher d'un coup.
   */
  function ecrire(element, html, fini) {
    element.innerHTML = html;

    // On repère tous les textes, puis on les vide pour les réafficher peu à peu.
    const morceaux = [];
    (function parcourir(noeud) {
      noeud.childNodes.forEach((enfant) => {
        if (enfant.nodeType === Node.TEXT_NODE) {
          morceaux.push({ noeud: enfant, texte: enfant.nodeValue });
          enfant.nodeValue = '';
        } else if (enfant.nodeType === Node.ELEMENT_NODE) {
          parcourir(enfant);
        }
      });
    })(element);

    let bloc = 0, pos = 0, minuteur = null, actif = true, depuisSon = 0;
    element.classList.add('ecriture-en-cours');

    function terminer() {
      if (!actif) return;
      actif = false;
      clearTimeout(minuteur);
      morceaux.forEach((m) => { m.noeud.nodeValue = m.texte; });
      element.classList.remove('ecriture-en-cours');
      if (fini) fini();
    }

    if (sobre() || !morceaux.length) { terminer(); return { terminer, estFini: () => true }; }

    (function pas() {
      if (!actif) return;
      while (bloc < morceaux.length && pos >= morceaux[bloc].texte.length) { bloc++; pos = 0; }
      if (bloc >= morceaux.length) { terminer(); return; }

      const m = morceaux[bloc];
      const lettre = m.texte[pos];
      m.noeud.nodeValue += lettre;
      pos++;

      if (++depuisSon >= 3 && lettre.trim()) { depuisSon = 0; Son.tape(); }

      minuteur = setTimeout(pas, VITESSE + (PAUSES[lettre] || 0));
    })();

    return { terminer, estFini: () => !actif };
  }

  /* ------------------------------------------------ séquence complète */
  /**
   * Joue une suite de répliques dans un conteneur.
   *   scenes  : [ { qui, texte } | { texte } ]
   *   options : { onFin, clavier }
   */
  function jouer(hote, scenes, options = {}) {
    const zone = document.createElement('div');
    zone.className = 'recit__scenes';
    hote.appendChild(zone);

    const pied = document.createElement('div');
    pied.className = 'recit__pied';
    pied.innerHTML = `
      <button type="button" class="recit__passer">⏩ Tout afficher</button>
      <span class="recit__invite">Appuie sur <b>Espace</b> ou clique pour continuer <span class="recit__fleche">▼</span></span>`;
    hote.appendChild(pied);

    const invite = pied.querySelector('.recit__invite');
    const passer = pied.querySelector('.recit__passer');
    invite.style.visibility = 'hidden';

    let index = -1;
    let enCours = null;
    let termine = false;

    /**
     * Fabrique le réceptacle d'une réplique et renvoie l'élément à remplir.
     * L'appelant peut fournir sa propre mise en forme via options.bulle,
     * du moment qu'elle contient un élément .recit__cible.
     */
    function bulle(scene) {
      const n = document.createElement('div');
      n.className = 'recit__bulle';
      if (typeof options.bulle === 'function') {
        n.innerHTML = options.bulle(scene);
      } else if (scene.qui) {
        n.innerHTML = Illus.dialogue(scene.qui, '<span class="recit__cible"></span>');
      } else {
        n.innerHTML = '<div class="narration"><span class="recit__cible"></span></div>';
      }
      zone.appendChild(n);
      return n.querySelector('.recit__cible');
    }

    function suivante() {
      index++;
      if (index >= scenes.length) { finir(); return; }
      invite.style.visibility = 'hidden';
      const cible = bulle(scenes[index]);
      enCours = ecrire(cible, scenes[index].texte, () => {
        invite.style.visibility = 'visible';
      });
    }

    /** Une pression : soit on complète le texte, soit on passe à la suite. */
    function avancer() {
      if (termine) return;
      if (enCours && !enCours.estFini()) enCours.terminer();
      else suivante();
    }

    function toutAfficher() {
      if (termine) return;
      if (enCours) enCours.terminer();
      while (index < scenes.length - 1) {
        index++;
        const cible = bulle(scenes[index]);
        cible.innerHTML = scenes[index].texte;
      }
      finir();
    }

    function finir() {
      termine = true;
      pied.remove();
      detacher();
      if (options.onFin) options.onFin();
    }

    /* --- entrées clavier et souris --------------------------------- */
    function auClavier(e) {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      const c = document.activeElement;
      if (c && /INPUT|TEXTAREA|BUTTON/.test(c.tagName)) return;  // on ne vole pas la touche
      e.preventDefault();
      avancer();
    }
    function auClic(e) {
      if (e.target.closest('button, a, input')) return;
      avancer();
    }

    function detacher() {
      document.removeEventListener('keydown', auClavier);
      document.removeEventListener('click', auClic);
    }

    if (options.clavier !== false) document.addEventListener('keydown', auClavier);
    // Écoute différée : sinon le clic qui a lancé le récit ferait
    // aussitôt défiler la première réplique.
    setTimeout(() => { if (!termine) document.addEventListener('click', auClic); }, 0);
    passer.addEventListener('click', (e) => { e.stopPropagation(); toutAfficher(); });

    suivante();
    return { toutAfficher };
  }

  return { jouer, ecrire, sobre };
})();

if (typeof window !== 'undefined') window.Recit = Recit;
