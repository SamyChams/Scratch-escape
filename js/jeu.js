/* =========================================================
   jeu.js — moteur de l'escape game
   ---------------------------------------------------------
   Gère l'affichage des salles, les six types d'énigmes,
   les cadenas, les indices et l'écran de victoire.
   ========================================================= */

(() => {
  'use strict';

  const scene    = document.getElementById('scene');
  const hote     = document.getElementById('modale-hote');
  const elChrono = document.getElementById('chrono');
  const elSalle  = document.getElementById('num-salle');
  const elJauge  = document.getElementById('jauge');
  const elPseudo = document.getElementById('pseudo');
  const btnSon   = document.getElementById('btn-son');

  let salleCourante = 0;
  let indicesAffiches = 0;   // pour l'énigme ouverte

  /* ---------------------------------------------------- outils DOM */
  const el = (balise, classe, contenu) => {
    const n = document.createElement(balise);
    if (classe) n.className = classe;
    if (contenu !== undefined) n.innerHTML = contenu;
    return n;
  };
  const vider = (n) => { while (n.firstChild) n.removeChild(n.firstChild); };

  /* ================================================== DÉMARRAGE */
  function init() {
    if (!Progression.etat.debut) { location.href = 'index.html'; return; }

    elPseudo.textContent = Progression.etat.pseudo;
    majSon();
    btnSon.addEventListener('click', () => { Son.basculer(); majSon(); });
    document.getElementById('btn-memo').addEventListener('click', () => ouvrirMemo());
    document.getElementById('btn-quitter').addEventListener('click', quitter);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fermerModale(); });

    setInterval(() => { elChrono.textContent = Progression.chrono(); }, 1000);
    elChrono.textContent = Progression.chrono();

    salleCourante = Math.min(Progression.etat.salle, SALLES.length - 1);
    if (Progression.etat.termine) afficherVictoire();
    else afficherSalle(salleCourante);
  }

  function majSon() {
    const actif = Son.estActif();
    btnSon.textContent = actif ? '🔊' : '🔇';
    btnSon.setAttribute('aria-label', actif ? 'Couper le son' : 'Activer le son');
  }

  function quitter() {
    if (confirm("Retourner à l'accueil ? Ta progression est sauvegardée automatiquement.")) {
      location.href = 'index.html';
    }
  }

  function majProgression() {
    const total = SALLES.reduce((s, x) => s + x.enigmes.length, 0);
    const faits = Progression.etat.resolues.length;
    elJauge.style.width = Math.round((faits / total) * 100) + '%';
    elSalle.textContent = `Salle ${Math.min(salleCourante + 1, SALLES.length)}/${SALLES.length}`;
  }

  /* ================================================== AFFICHER UNE SALLE */
  function afficherSalle(indice) {
    salleCourante = indice;
    Progression.ouvrirSalle(indice);
    majProgression();
    vider(scene);
    window.scrollTo(0, 0);

    const salle = SALLES[indice];

    const entete = el('div', 'salle__entete');
    entete.appendChild(el('div', 'salle__badge', salle.icone));
    const bloc = el('div');
    bloc.appendChild(el('div', 'salle__num', `Salle ${salle.numero} sur ${SALLES.length}`));
    bloc.appendChild(el('h1', null, salle.titre));
    entete.appendChild(bloc);
    scene.appendChild(entete);

    scene.appendChild(el('div', 'narration', salle.entree));

    /* --- les trois énigmes ------------------------------------- */
    const grille = el('div', 'grille-enigmes');
    salle.enigmes.forEach((enigme, i) => {
      const fait = Progression.estResolue(enigme.id);
      const tuile = el('button', 'tuile' + (fait ? ' tuile--ok' : ''));
      tuile.type = 'button';
      tuile.innerHTML = `
        <div class="tuile__puce">${fait ? '✅' : '🔒'}</div>
        <div class="tuile__icone">${enigme.icone}</div>
        <div class="tuile__titre">Énigme ${i + 1} — ${enigme.titre}</div>
        <div class="tuile__etat">${fait
          ? `Résolue · chiffre obtenu : <b>${enigme.fragment}</b>`
          : 'Clique pour ouvrir'}</div>`;
      tuile.addEventListener('click', () => { Son.clic(); ouvrirEnigme(salle, enigme); });
      grille.appendChild(tuile);
    });
    scene.appendChild(grille);

    /* --- le cadenas -------------------------------------------- */
    scene.appendChild(construireCadenas(salle));

    /* --- rappel de cours --------------------------------------- */
    const aide = el('div', 'centre');
    aide.style.marginTop = '26px';
    const b = el('button', 'btn btn--fantome', '📘 Ouvrir le cahier de cours de cette salle');
    b.addEventListener('click', () => ouvrirMemo(salle.memo));
    aide.appendChild(b);
    scene.appendChild(aide);
  }

  /* ================================================== CADENAS */
  function construireCadenas(salle) {
    const carte = el('div', 'carte cadenas');
    const tout = salle.enigmes.every((e) => Progression.estResolue(e.id));

    carte.appendChild(el('h2', null, '🔐 Le cadenas de la porte'));

    const frag = el('div', 'fragments');
    salle.enigmes.forEach((e) => {
      const ok = Progression.estResolue(e.id);
      frag.appendChild(el('div', 'fragment' + (ok ? ' fragment--trouve' : ''), ok ? e.fragment : '?'));
    });
    carte.appendChild(frag);

    if (!tout) {
      carte.appendChild(el('p', 'muet', 'Résous les trois énigmes pour découvrir les trois chiffres du code.'));
      return carte;
    }

    carte.appendChild(el('p', null, 'Compose le code dans le bon ordre (énigme 1, puis 2, puis 3) :'));

    const molettes = el('div', 'cadenas__molettes');
    const champs = [];
    for (let i = 0; i < salle.code.length; i++) {
      const inp = el('input', 'molette');
      inp.type = 'text';
      inp.inputMode = 'numeric';
      inp.maxLength = 1;
      inp.setAttribute('aria-label', `Chiffre ${i + 1}`);
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/\D/g, '');
        if (inp.value && champs[i + 1]) champs[i + 1].focus();
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !inp.value && champs[i - 1]) champs[i - 1].focus();
        if (e.key === 'Enter') tenter();
      });
      champs.push(inp);
      molettes.appendChild(inp);
    }
    carte.appendChild(molettes);

    const zoneRetour = el('div');
    const actions = el('div', 'actions');
    actions.style.justifyContent = 'center';
    const btn = el('button', 'btn btn--grand', '🔓 Ouvrir la porte');
    btn.addEventListener('click', tenter);
    actions.appendChild(btn);
    carte.appendChild(actions);
    carte.appendChild(zoneRetour);

    function tenter() {
      const saisi = champs.map((c) => c.value.trim()).join('');
      vider(zoneRetour);
      if (saisi === salle.code) {
        Son.deverrouille();
        porteOuverte(salle);
      } else {
        Son.mauvais();
        Progression.compterErreur();
        carte.classList.remove('cadenas--secoue');
        void carte.offsetWidth;
        carte.classList.add('cadenas--secoue');
        zoneRetour.appendChild(el('div', 'retour retour--erreur',
          "❌ Le cadenas résiste. Vérifie les chiffres et surtout leur <b>ordre</b> : celui de l'énigme 1 en premier."));
      }
    }

    return carte;
  }

  function porteOuverte(salle) {
    vider(scene);
    window.scrollTo(0, 0);
    const carte = el('div', 'carte centre');
    carte.appendChild(el('div', null, '<div style="font-size:4rem">🚪✨</div>'));
    carte.appendChild(el('h2', null, `Porte ${salle.numero} ouverte !`));
    carte.appendChild(el('div', 'narration', salle.sortie));

    const actions = el('div', 'actions');
    actions.style.justifyContent = 'center';
    const suivante = salle.numero < SALLES.length;
    const btn = el('button', 'btn btn--grand', suivante ? '➡ Entrer dans la salle suivante' : '🏆 Voir le résultat');
    btn.addEventListener('click', () => {
      Son.clic();
      if (suivante) afficherSalle(salle.numero);
      else { Progression.terminer(); afficherVictoire(); }
    });
    actions.appendChild(btn);
    carte.appendChild(actions);
    scene.appendChild(carte);
  }

  /* ================================================== MODALE */
  function ouvrirModale(titre, icone) {
    fermerModale();
    const fond = el('div', 'modale');
    const boite = el('div', 'modale__boite');
    const entete = el('div', 'modale__entete');
    entete.appendChild(el('div', null, `<div style="font-size:2rem">${icone || ''}</div>`));
    entete.appendChild(el('h2', 'modale__titre', titre));
    const fermer = el('button', 'modale__fermer', '✕');
    fermer.setAttribute('aria-label', 'Fermer');
    fermer.addEventListener('click', fermerModale);
    entete.appendChild(fermer);
    boite.appendChild(entete);
    fond.appendChild(boite);
    fond.addEventListener('click', (e) => { if (e.target === fond) fermerModale(); });
    hote.appendChild(fond);
    return boite;
  }

  function fermerModale() { vider(hote); }

  /* ================================================== CAHIER DE COURS */
  function ouvrirMemo(ids) {
    const fiches = ids ? COURS.filter((f) => ids.includes(f.id)) : COURS;
    const boite = ouvrirModale('Cahier de cours', '📘');
    fiches.forEach((f) => boite.appendChild(Memo.fiche(f)));
    const p = el('p', 'centre muet petit',
      'Toutes les fiches sont aussi consultables sur la page <a href="memo.html" target="_blank">Cahier de cours</a>.');
    boite.appendChild(p);
  }

  /* ================================================== ÉNIGMES */
  function ouvrirEnigme(salle, enigme) {
    indicesAffiches = 0;
    const boite = ouvrirModale(enigme.titre, enigme.icone);

    boite.appendChild(el('div', 'consigne', enigme.consigne));

    // Script d'illustration éventuel
    if (enigme.script && enigme.type !== 'trous') {
      const cadre = el('div');
      cadre.style.margin = '0 0 18px';
      cadre.appendChild(Blocs.pile(enigme.script));
      boite.appendChild(cadre);
    }
    if (enigme.question) boite.appendChild(el('p', null, `<b>${enigme.question}</b>`));

    const zoneJeu = el('div');
    boite.appendChild(zoneJeu);

    const zoneRetour = el('div');
    const actions = el('div', 'actions');
    boite.appendChild(zoneRetour);
    boite.appendChild(actions);

    /* --- Aide : indices ---------------------------------------- */
    const btnIndice = el('button', 'btn btn--fantome', '💡 Un indice');
    btnIndice.addEventListener('click', () => {
      if (indicesAffiches >= enigme.indices.length) return;
      Son.indice();
      Progression.compterIndice();
      zoneRetour.appendChild(el('div', 'retour retour--indice',
        `💡 <b>Indice ${indicesAffiches + 1} :</b> ${enigme.indices[indicesAffiches]}`));
      indicesAffiches++;
      if (indicesAffiches >= enigme.indices.length) btnIndice.disabled = true;
    });

    const btnCours = el('button', 'btn btn--fantome', '📘 Revoir le cours');
    btnCours.addEventListener('click', () => {
      const memoIds = salle.memo;
      fermerModale();
      ouvrirMemo(memoIds);
    });

    /* --- Réussite ----------------------------------------------- */
    function reussir() {
      Son.bon();
      Progression.resoudre(enigme.id, enigme.fragment);
      vider(zoneRetour);
      vider(actions);
      const bravo = el('div', 'retour retour--ok');
      bravo.innerHTML = `🎉 <b>Bravo !</b> ${enigme.explication}
        <div style="margin-top:14px;text-align:center">
          <div class="muet petit">Chiffre du code obtenu</div>
          <div style="font-size:2.6rem;font-weight:800;color:var(--jaune)">${enigme.fragment}</div>
        </div>`;
      zoneRetour.appendChild(bravo);
      const btn = el('button', 'btn btn--vert btn--grand', '✔ Continuer');
      btn.addEventListener('click', () => { fermerModale(); afficherSalle(salleCourante); });
      actions.appendChild(btn);
      actions.style.justifyContent = 'center';
      btn.focus();
    }

    function echouer(message) {
      Son.mauvais();
      Progression.compterErreur();
      vider(zoneRetour);
      zoneRetour.appendChild(el('div', 'retour retour--erreur', message));
    }

    const ctx = { zoneJeu, zoneRetour, actions, reussir, echouer, el, vider };

    switch (enigme.type) {
      case 'qcm':         construireQcm(enigme, ctx); break;
      case 'association': construireAssociation(enigme, ctx); break;
      case 'ordre':       construireOrdre(enigme, ctx); break;
      case 'saisie':      construireSaisie(enigme, ctx); break;
      case 'grille':      construireGrille(enigme, ctx); break;
      case 'trous':       construireTrous(enigme, ctx); break;
    }

    actions.appendChild(btnIndice);
    actions.appendChild(btnCours);

    if (Progression.estResolue(enigme.id)) {
      zoneRetour.appendChild(el('div', 'retour retour--ok',
        `✅ Tu as déjà résolu cette énigme. Le chiffre obtenu est <b>${enigme.fragment}</b>.`));
    }
  }

  /* ---------------------------------------------------------- QCM */
  function construireQcm(enigme, ctx) {
    const liste = el('div', 'options');
    const lettres = 'ABCDEF';
    const boutons = [];

    enigme.options.forEach((opt, i) => {
      const b = el('button', 'option');
      b.type = 'button';
      b.appendChild(el('span', 'option__lettre', lettres[i]));
      const contenu = el('span');
      if (opt.pile)      contenu.appendChild(Blocs.pile(opt.pile));
      else if (opt.bloc) contenu.appendChild(Blocs.creer(opt.bloc));
      else               contenu.innerHTML = opt.texte;
      b.appendChild(contenu);

      b.addEventListener('click', () => {
        if (opt.correct) {
          b.classList.add('option--juste');
          boutons.forEach((x) => { x.disabled = true; });
          ctx.reussir();
        } else {
          b.classList.add('option--faux');
          b.disabled = true;
          ctx.echouer(`❌ Pas tout à fait. ${opt.retour || 'Relis bien la question et réessaie.'}`);
        }
      });
      boutons.push(b);
      liste.appendChild(b);
    });
    ctx.zoneJeu.appendChild(liste);
  }

  /* -------------------------------------------------- ASSOCIATION */
  function construireAssociation(enigme, ctx) {
    const melange = (t) => t.slice().sort(() => Math.random() - 0.5);
    const gauche = melange(enigme.paires);
    const droite = melange(enigme.paires);

    const zone = el('div', 'assoc');
    const colG = el('div', 'assoc__colonne');
    const colD = el('div', 'assoc__colonne');
    colG.appendChild(el('div', 'assoc__titre', 'Catégorie'));
    colD.appendChild(el('div', 'assoc__titre', 'Couleur'));

    let choisiG = null;
    let trouves = 0;

    const faireJeton = (paire, cote) => {
      const b = el('button', 'jeton');
      b.type = 'button';
      if (cote === 'd' && paire.couleur) {
        const p = el('span', 'pastille');
        p.style.background = paire.couleur;
        b.appendChild(p);
      }
      b.appendChild(el('span', null, cote === 'g' ? paire.g : paire.d));
      b.dataset.cle = paire.g;
      return b;
    };

    gauche.forEach((p) => {
      const b = faireJeton(p, 'g');
      b.addEventListener('click', () => {
        if (b.disabled) return;
        Son.clic();
        colG.querySelectorAll('.jeton--actif').forEach((x) => x.classList.remove('jeton--actif'));
        choisiG = b;
        b.classList.add('jeton--actif');
      });
      colG.appendChild(b);
    });

    droite.forEach((p) => {
      const b = faireJeton(p, 'd');
      b.addEventListener('click', () => {
        if (b.disabled) return;
        if (!choisiG) {
          ctx.zoneRetour.innerHTML = '';
          ctx.zoneRetour.appendChild(el('div', 'retour retour--indice',
            '👉 Commence par cliquer sur une <b>catégorie</b> dans la colonne de gauche.'));
          return;
        }
        if (choisiG.dataset.cle === b.dataset.cle) {
          Son.bon();
          [choisiG, b].forEach((x) => { x.classList.remove('jeton--actif'); x.classList.add('jeton--lie'); x.disabled = true; });
          choisiG = null;
          trouves++;
          ctx.zoneRetour.innerHTML = '';
          if (trouves === enigme.paires.length) ctx.reussir();
        } else {
          const mauvais = choisiG;
          mauvais.classList.remove('jeton--actif');
          choisiG = null;
          ctx.echouer(`❌ Non, <b>${mauvais.textContent}</b> n'est pas de cette couleur. Réessaie !`);
        }
      });
      colD.appendChild(b);
    });

    zone.appendChild(colG);
    zone.appendChild(colD);
    ctx.zoneJeu.appendChild(zone);
  }

  /* -------------------------------------------------------- ORDRE */
  function construireOrdre(enigme, ctx) {
    const liste = el('ul', 'liste-ordre');

    // Mélange en s'assurant que l'ordre de départ n'est pas déjà le bon
    let indices = enigme.blocs.map((_, i) => i);
    let essais = 0;
    do {
      indices.sort(() => Math.random() - 0.5);
      essais++;
    } while (essais < 20 && indices.every((v, i) => v === i));

    indices.forEach((idx) => {
      const li = el('li', 'item-ordre');
      li.dataset.index = idx;

      const poignee = el('span', 'item-ordre__poignee', '⠿');
      poignee.title = 'Glisse pour déplacer';
      li.appendChild(poignee);
      li.appendChild(el('span', 'item-ordre__rang', '·'));
      li.appendChild(Blocs.creer(enigme.blocs[idx]));

      const fleches = el('div', 'item-ordre__fleches');
      const haut = el('button', 'mini-btn', '▲');
      const bas  = el('button', 'mini-btn', '▼');
      haut.title = 'Monter'; bas.title = 'Descendre';
      haut.addEventListener('click', () => { Son.clic(); if (li.previousElementSibling) liste.insertBefore(li, li.previousElementSibling); majRangs(); });
      bas.addEventListener('click',  () => { Son.clic(); if (li.nextElementSibling) liste.insertBefore(li.nextElementSibling, li); majRangs(); });
      fleches.appendChild(haut);
      fleches.appendChild(bas);
      li.appendChild(fleches);

      // Déplacement à la souris ou au doigt
      poignee.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        li.classList.add('item-ordre--saisi');
        poignee.setPointerCapture(e.pointerId);
      });
      poignee.addEventListener('pointermove', (e) => {
        if (!li.classList.contains('item-ordre--saisi')) return;
        const sous = document.elementFromPoint(e.clientX, e.clientY);
        const cible = sous && sous.closest ? sous.closest('.item-ordre') : null;
        if (cible && cible !== li && cible.parentNode === liste) {
          const r = cible.getBoundingClientRect();
          const apres = e.clientY > r.top + r.height / 2;
          liste.insertBefore(li, apres ? cible.nextSibling : cible);
          majRangs();
        }
      });
      const relacher = () => { li.classList.remove('item-ordre--saisi'); majRangs(); };
      poignee.addEventListener('pointerup', relacher);
      poignee.addEventListener('pointercancel', relacher);

      liste.appendChild(li);
    });

    function majRangs() {
      [...liste.children].forEach((li, i) => {
        li.querySelector('.item-ordre__rang').textContent = i + 1;
      });
    }
    majRangs();

    ctx.zoneJeu.appendChild(liste);
    ctx.zoneJeu.appendChild(el('p', 'muet petit',
      'Utilise les flèches ▲ ▼ ou attrape un bloc par la poignée ⠿ pour le déplacer.'));

    const btn = el('button', 'btn', '✔ Vérifier le script');
    btn.addEventListener('click', () => {
      const ordre = [...liste.children].map((li) => Number(li.dataset.index));
      const bienPlaces = ordre.filter((v, i) => v === i).length;
      if (bienPlaces === ordre.length) ctx.reussir();
      else ctx.echouer(`❌ Ce n'est pas encore ça : <b>${bienPlaces}</b> bloc(s) sur ${ordre.length} sont à la bonne place. Continue !`);
    });
    ctx.actions.appendChild(btn);
  }

  /* ------------------------------------------------------- SAISIE */
  function construireSaisie(enigme, ctx) {
    const zone = el('div', 'centre');
    const inp = el('input', 'champ-pseudo');
    inp.type = 'text';
    inp.placeholder = (enigme.champ && enigme.champ.placeholder) || 'Ta réponse';
    if (enigme.champ && enigme.champ.largeur) inp.style.width = enigme.champ.largeur + 'px';
    inp.setAttribute('aria-label', 'Ta réponse');
    zone.appendChild(inp);
    ctx.zoneJeu.appendChild(zone);

    const valider = () => {
      const val = inp.value.trim().toLowerCase().replace(/\s+/g, ' ');
      if (!val) { ctx.echouer('✏ Écris d\'abord ta réponse dans la case.'); return; }
      const ok = enigme.reponses.some((r) => r.toLowerCase() === val);
      if (ok) ctx.reussir();
      else ctx.echouer("❌ Ce n'est pas la bonne valeur. Reprends le calcul étape par étape, ou demande un indice.");
    };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') valider(); });

    const btn = el('button', 'btn', '✔ Vérifier');
    btn.addEventListener('click', valider);
    ctx.actions.appendChild(btn);
    setTimeout(() => inp.focus(), 80);
  }

  /* ================================================== SIMULATEUR */
  const DIRS = { E: [1, 0], S: [0, 1], W: [-1, 0], N: [0, -1] };
  const FLECHES = { E: '➡', S: '⬇', W: '⬅', N: '⬆' };
  const ROUE = ['E', 'S', 'W', 'N'];

  /** Construit le plateau et renvoie de quoi le piloter. */
  function construirePlateau(conf) {
    const plateau = el('div', 'grille-jeu');
    plateau.style.gridTemplateColumns = `repeat(${conf.largeur}, 1fr)`;
    const cases = [];
    for (let y = 0; y < conf.hauteur; y++) {
      for (let x = 0; x < conf.largeur; x++) {
        const c = el('div', 'case');
        if (conf.murs.some(([mx, my]) => mx === x && my === y)) { c.classList.add('case--mur'); c.textContent = '🧱'; }
        if (conf.sortie.x === x && conf.sortie.y === y) { c.classList.add('case--sortie'); c.textContent = '🚪'; }
        cases.push(c);
        plateau.appendChild(c);
      }
    }

    const pion = el('div', 'pion');
    pion.innerHTML = '<span>🐈</span><span class="pion__dir">➡</span>';

    let etat;
    function placer() {
      const c = cases[etat.y * conf.largeur + etat.x];
      c.appendChild(pion);
      pion.querySelector('.pion__dir').textContent = FLECHES[etat.dir];
    }
    function reinit() {
      etat = { x: conf.depart.x, y: conf.depart.y, dir: conf.depart.dir };
      pion.classList.remove('pion--cogne');
      placer();
    }
    reinit();

    const estMur = (x, y) =>
      x < 0 || y < 0 || x >= conf.largeur || y >= conf.hauteur ||
      conf.murs.some(([mx, my]) => mx === x && my === y);

    return {
      element: plateau,
      reinit,
      get etat() { return etat; },
      /** Applique une instruction ; renvoie false en cas de choc. */
      appliquer(op) {
        if (op.op === 'avancer') {
          const [dx, dy] = DIRS[etat.dir];
          const nx = etat.x + dx, ny = etat.y + dy;
          if (estMur(nx, ny)) {
            pion.classList.add('pion--cogne');
            Son.cogne();
            return false;
          }
          etat.x = nx; etat.y = ny;
          Son.pas();
        } else if (op.op === 'tourner') {
          const i = ROUE.indexOf(etat.dir);
          etat.dir = ROUE[(i + (op.sens === 'd' ? 1 : 3)) % 4];
          Son.clic();
        }
        placer();
        return true;
      },
      arrive() { return etat.x === conf.sortie.x && etat.y === conf.sortie.y; }
    };
  }

  /** Déroule les boucles pour obtenir une liste d'instructions simples. */
  function aplatir(programme, limite = 300) {
    const sortie = [];
    (function parcourir(liste) {
      liste.forEach((op) => {
        if (sortie.length > limite) return;
        if (op.op === 'repeter') {
          const n = Math.max(0, Math.min(50, Number(op.n) || 0));
          for (let i = 0; i < n; i++) parcourir(op.corps);
        } else {
          sortie.push(op);
        }
      });
    })(programme);
    return sortie;
  }

  /** Anime le programme sur le plateau puis appelle fin(reussi, raison). */
  function executer(plateau, programme, fin, surligner) {
    const ops = aplatir(programme);
    plateau.reinit();
    if (!ops.length) { fin(false, 'vide'); return; }
    let i = 0;
    (function etape() {
      if (i >= ops.length) {
        fin(plateau.arrive(), plateau.arrive() ? 'ok' : 'raté');
        return;
      }
      if (surligner) surligner(i);
      const ok = plateau.appliquer(ops[i]);
      if (!ok) { fin(false, 'mur'); return; }
      if (plateau.arrive() && i === ops.length - 1) { fin(true, 'ok'); return; }
      i++;
      setTimeout(etape, 420);
    })();
  }

  /* -------------------------------------------------------- GRILLE */
  function construireGrille(enigme, ctx) {
    const conf = enigme.grille;
    const plateau = construirePlateau(conf);
    const programme = [];   // liste d'opérations construite par l'élève

    const zone = el('div', 'labo');

    // Colonne gauche : le plateau
    const gauche = el('div');
    gauche.appendChild(el('div', 'palette__titre', 'La salle'));
    gauche.appendChild(plateau.element);
    zone.appendChild(gauche);

    // Colonne droite : palette + programme
    const droite = el('div');
    droite.appendChild(el('div', 'palette__titre', 'Palette — clique pour ajouter'));
    const palette = el('div', 'palette');
    enigme.palette.forEach((p) => {
      const b = Blocs.creer(p.bloc);
      b.classList.add('bloc--cliquable');
      b.setAttribute('role', 'button');
      b.setAttribute('tabindex', '0');
      const ajouter = () => {
        if (programme.length >= enigme.maxBlocs) {
          ctx.echouer(`⚠ Ton programme ne peut pas dépasser ${enigme.maxBlocs} blocs. Essaie de faire plus court !`);
          return;
        }
        Son.clic();
        programme.push(p.op === 'avancer' ? { op: 'avancer' } : { op: 'tourner', sens: p.op === 'droite' ? 'd' : 'g' });
        dessinerProgramme();
      };
      b.addEventListener('click', ajouter);
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ajouter(); } });
      palette.appendChild(b);
    });
    droite.appendChild(palette);

    droite.appendChild(el('div', 'programme__titre', 'Ton programme'));
    const zoneProg = el('div', 'programme');
    droite.appendChild(zoneProg);
    zone.appendChild(droite);
    ctx.zoneJeu.appendChild(zone);

    let lignes = [];
    function dessinerProgramme() {
      vider(zoneProg);
      lignes = [];
      if (!programme.length) {
        zoneProg.appendChild(el('div', 'programme__vide',
          'Vide pour l\'instant. Clique sur les blocs de la palette pour construire ton programme.'));
        return;
      }
      programme.forEach((op, i) => {
        const ligne = el('div', 'ligne-prog');
        const modele = enigme.palette.find((p) =>
          (op.op === 'avancer' && p.op === 'avancer') ||
          (op.op === 'tourner' && p.op === (op.sens === 'd' ? 'droite' : 'gauche')));
        const b = Blocs.creer(modele.bloc);
        ligne.appendChild(b);
        const sup = el('button', 'ligne-prog__supprimer', '✕');
        sup.title = 'Supprimer ce bloc';
        sup.addEventListener('click', () => { programme.splice(i, 1); dessinerProgramme(); });
        ligne.appendChild(sup);
        lignes.push(b);
        zoneProg.appendChild(ligne);
      });
    }
    dessinerProgramme();

    const btnLancer = el('button', 'btn btn--vert', '▶ Lancer le programme');
    const btnVider  = el('button', 'btn btn--fantome', '🗑 Tout effacer');

    btnVider.addEventListener('click', () => { programme.length = 0; dessinerProgramme(); plateau.reinit(); });

    btnLancer.addEventListener('click', () => {
      if (!programme.length) { ctx.echouer('🧩 Ton programme est vide : ajoute d\'abord des blocs.'); return; }
      btnLancer.disabled = true; btnVider.disabled = true;
      vider(ctx.zoneRetour);
      executer(plateau, programme, (reussi, raison) => {
        btnLancer.disabled = false; btnVider.disabled = false;
        lignes.forEach((b) => b.classList.remove('bloc--surligne'));
        if (reussi) ctx.reussir();
        else if (raison === 'mur') ctx.echouer('💥 Aïe ! Scratchy s\'est cogné contre un mur. Vérifie dans quelle direction il regarde avant chaque « avancer ».');
        else ctx.echouer('🤔 Le programme s\'est terminé, mais Scratchy n\'est pas sur la porte 🚪. Compte bien les cases !');
      }, (i) => {
        lignes.forEach((b, j) => b.classList.toggle('bloc--surligne', i === j));
      });
    });

    ctx.actions.appendChild(btnLancer);
    ctx.actions.appendChild(btnVider);
  }

  /* --------------------------------------------------------- TROUS */
  function construireTrous(enigme, ctx) {
    const valeurs = enigme.trous.map(() => null);

    const zone = enigme.grille ? el('div', 'labo') : el('div');
    let plateau = null;

    if (enigme.grille) {
      plateau = construirePlateau(enigme.grille);
      const g = el('div');
      g.appendChild(el('div', 'palette__titre', 'La salle'));
      g.appendChild(plateau.element);
      zone.appendChild(g);
    }

    const droite = el('div');
    droite.appendChild(el('div', 'programme__titre', 'Le script à compléter'));
    const pile = Blocs.pile(enigme.script);
    droite.appendChild(pile);
    const zoneChoix = el('div');
    zoneChoix.style.marginTop = '14px';
    droite.appendChild(zoneChoix);
    zone.appendChild(droite);
    ctx.zoneJeu.appendChild(zone);

    // Remplissage des emplacements
    pile.querySelectorAll('.trou').forEach((trou) => {
      const i = Number(trou.dataset.trou);
      const def = enigme.trous[i];
      if (!def) return;

      if (def.type === 'nombre') {
        trou.textContent = '';
        trou.classList.add('trou--rempli');
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.min = '0';
        inp.max = '20';
        inp.setAttribute('aria-label', `Nombre à compléter n°${i + 1}`);
        inp.addEventListener('input', () => { valeurs[i] = inp.value === '' ? null : Number(inp.value); });
        trou.appendChild(inp);
      } else {
        trou.addEventListener('click', () => {
          Son.clic();
          pile.querySelectorAll('.trou').forEach((t) => t.classList.remove('trou--actif'));
          trou.classList.add('trou--actif');
          proposerChoix(i, trou, def);
        });
      }
    });

    function proposerChoix(i, trou, def) {
      vider(zoneChoix);
      const carte = el('div', 'carte');
      carte.style.padding = '14px';
      carte.appendChild(el('div', 'palette__titre', `Choisis le bloc à placer dans l'emplacement ${i + 1}`));
      const p = el('div', 'palette');
      def.choix.forEach((desc, k) => {
        const b = Blocs.creer(desc);
        b.classList.add('bloc--cliquable');
        b.addEventListener('click', () => {
          Son.clic();
          valeurs[i] = k;
          vider(trou);
          trou.classList.add('trou--rempli');
          trou.classList.remove('trou--actif');
          const copie = Blocs.creer(desc);
          trou.appendChild(copie);
          vider(zoneChoix);
        });
        p.appendChild(b);
      });
      carte.appendChild(p);
      zoneChoix.appendChild(carte);
    }

    /* --- vérification ------------------------------------------- */
    const btn = el('button', 'btn btn--vert', enigme.grille ? '▶ Lancer le programme' : '✔ Vérifier le script');
    btn.addEventListener('click', () => {
      if (valeurs.some((v) => v === null || v === undefined || Number.isNaN(v))) {
        ctx.echouer('🧩 Il reste au moins un emplacement en pointillés à compléter.');
        return;
      }
      vider(ctx.zoneRetour);

      if (enigme.grille) {
        btn.disabled = true;
        executer(plateau, enigme.programme(valeurs), (reussi, raison) => {
          btn.disabled = false;
          if (reussi) ctx.reussir();
          else if (raison === 'mur') ctx.echouer('💥 Scratchy s\'est cogné : le nombre de répétitions est trop grand.');
          else ctx.echouer('🤔 Scratchy s\'arrête avant la porte 🚪. Recompte le nombre de cases à parcourir.');
        });
      } else {
        const ok = enigme.trous.every((d, i) => valeurs[i] === d.reponse);
        if (ok) ctx.reussir();
        else ctx.echouer('❌ Ce script ne fait pas ce qui est demandé. Relis la consigne et essaie un autre bloc.');
      }
    });
    ctx.actions.appendChild(btn);
  }

  /* ================================================== VICTOIRE */
  function afficherVictoire() {
    vider(scene);
    window.scrollTo(0, 0);
    Son.victoire();
    confettis();
    majProgression();

    const etoiles = Progression.etoiles();
    const e = Progression.etat;

    const intro = el('div', 'carte centre no-print');
    intro.innerHTML = `
      <div style="font-size:5rem">🐈✨</div>
      <h1>Scratchy est libre !</h1>
      <p>Le Labo 404 s'éteint doucement derrière toi. Le Bug est vaincu… et tu connais
      maintenant les bases de Scratch : les blocs, les coordonnées, les boucles,
      les tests, les variables et les messages.</p>`;
    scene.appendChild(intro);

    const d = el('div', 'diplome');
    d.innerHTML = `
      <div style="font-size:2.4rem">🏆</div>
      <h2>Diplôme d'évasion du Labo 404</h2>
      <p>décerné à</p>
      <div class="diplome__nom">${e.pseudo}</div>
      <p>pour avoir résolu les <b>15 énigmes</b> des 5 salles<br>et maîtrisé les rudiments de la programmation avec Scratch.</p>
      <div style="font-size:2rem;letter-spacing:6px">${'⭐'.repeat(etoiles)}${'☆'.repeat(3 - etoiles)}</div>
      <div style="font-weight:800;font-size:1.2rem;color:#7a5600">${Progression.rang()}</div>
      <div class="diplome__stats">
        <div class="diplome__stat"><b>${Progression.chrono()}</b>temps</div>
        <div class="diplome__stat"><b>${e.indices}</b>indice(s)</div>
        <div class="diplome__stat"><b>${e.erreurs}</b>erreur(s)</div>
      </div>
      <div>Fait le ${new Date().toLocaleDateString('fr-FR')}</div>`;
    scene.appendChild(d);

    const actions = el('div', 'actions no-print');
    actions.style.justifyContent = 'center';
    actions.style.marginTop = '24px';

    const imp = el('button', 'btn', '🖨 Imprimer mon diplôme');
    imp.addEventListener('click', () => window.print());

    const revoir = el('a', 'btn btn--bleu', '📘 Revoir le cahier de cours');
    revoir.href = 'memo.html';

    const rejouer = el('button', 'btn btn--fantome', '🔄 Rejouer depuis le début');
    rejouer.addEventListener('click', () => {
      if (confirm('Effacer la partie et tout recommencer ?')) {
        Progression.reinitialiser();
        location.href = 'index.html';
      }
    });

    actions.appendChild(imp);
    actions.appendChild(revoir);
    actions.appendChild(rejouer);
    scene.appendChild(actions);
  }

  function confettis() {
    const couleurs = ['#4c97ff', '#ffbf00', '#59c059', '#cf63cf', '#ff8c1a', '#9966ff'];
    for (let i = 0; i < 70; i++) {
      const c = el('div', 'confetti');
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = couleurs[i % couleurs.length];
      c.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
      c.style.animationDelay = (Math.random() * 1.5) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 7000);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
