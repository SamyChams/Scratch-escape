/* =========================================================
   enigmes.js — les six types d'énigmes jouables
   ---------------------------------------------------------
   Ce module ne connaît rien à l'univers du jeu : il reçoit
   la description d'une énigme et un contexte (où dessiner,
   quoi appeler en cas de réussite ou d'erreur), et il fabrique
   l'interface correspondante.

     qcm         → choisir parmi plusieurs réponses
     association → relier deux colonnes
     ordre       → remettre des blocs dans le bon ordre
     saisie      → écrire une réponse
     grille      → construire un programme et le faire tourner
     trous       → compléter un script, puis le vérifier

   Le contexte fourni par l'appelant :
     { zoneJeu, zoneRetour, actions, reussir(), echouer(msg) }
   ========================================================= */

const Enigmes = (() => {
  'use strict';

  const el = (balise, classe, contenu) => {
    const n = document.createElement(balise);
    if (classe) n.className = classe;
    if (contenu !== undefined) n.innerHTML = contenu;
    return n;
  };
  const vider = (n) => { while (n.firstChild) n.removeChild(n.firstChild); };

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
  /** Point d'entrée : fabrique l'énigme du type demandé. */
  function construire(enigme, ctx) {
    switch (enigme.type) {
      case 'qcm':         return construireQcm(enigme, ctx);
      case 'association': return construireAssociation(enigme, ctx);
      case 'ordre':       return construireOrdre(enigme, ctx);
      case 'saisie':      return construireSaisie(enigme, ctx);
      case 'grille':      return construireGrille(enigme, ctx);
      case 'trous':       return construireTrous(enigme, ctx);
      default: throw new Error('Type d\'énigme inconnu : ' + enigme.type);
    }
  }

  return { construire };
})();

if (typeof window !== 'undefined') window.Enigmes = Enigmes;
