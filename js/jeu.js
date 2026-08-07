/* =========================================================
   jeu.js — moteur de LOOP
   ---------------------------------------------------------
   Le jeu avance dans un arbre : à chaque étape, l'élève fait
   un CHOIX qui décide de la branche, donc des deux énigmes
   qu'il va rencontrer. Deux élèves n'ont pas le même parcours.

   Les six types d'énigmes sont fabriqués par js/enigmes.js ;
   ce fichier ne s'occupe que de l'enchaînement et du récit.
   ========================================================= */

(() => {
  'use strict';

  const scene    = document.getElementById('scene');
  const hote     = document.getElementById('modale-hote');
  const elChrono = document.getElementById('chrono');
  const elEtape  = document.getElementById('num-etape');
  const elJauge  = document.getElementById('jauge');
  const elPseudo = document.getElementById('pseudo');
  const btnSon   = document.getElementById('btn-son');

  let etapeCourante = 0;
  let indicesAffiches = 0;

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

    etapeCourante = Math.min(Progression.etat.etape, ETAPES.length - 1);

    if (Progression.etat.termine) {
      afficherVictoire();
    } else if (!Progression.etat.prologueVu) {
      jouerRecit(PROLOGUE.scenes, PROLOGUE.titre, '▶ Essayer de se déconnecter', () => {
        Progression.marquerPrologue();
        afficherEtape(etapeCourante);
      });
    } else {
      afficherEtape(etapeCourante);
    }
  }

  function majSon() {
    const actif = Son.estActif();
    btnSon.textContent = actif ? '🔊' : '🔇';
    btnSon.setAttribute('aria-label', actif ? 'Couper le son' : 'Activer le son');
  }

  function quitter() {
    if (confirm("Revenir à l'accueil ? Ta progression est sauvegardée automatiquement.")) {
      location.href = 'index.html';
    }
  }

  function majProgression() {
    // 2 énigmes par étape sur l'ensemble du parcours
    const total = ETAPES.length * 2;
    const faits = Progression.etat.resolues.length;
    elJauge.style.width = Math.min(100, Math.round((faits / total) * 100)) + '%';
    elEtape.textContent = `${Math.min(etapeCourante + 1, ETAPES.length)}/${ETAPES.length}`;
  }

  /* ================================================== L'ÉCRAN DE L'APPLI */
  const HEURES = ['23:47', '23:52', '00:03', '00:18', '00:31', '00:44'];

  /** Cadre « téléphone » dans lequel se joue tout le récit. */
  function ecranAppli(sousTitre) {
    const ecran = el('div', 'ecran');
    const barre = el('div', 'ecran__barre');
    barre.innerHTML = `
      <span class="ecran__marque">${APPLI.nom}</span>
      <span class="muet petit">${sousTitre || ''}</span>
      <span class="ecran__vide"></span>
      <span>${HEURES[Math.min(etapeCourante + 1, HEURES.length - 1)]}</span>
      <span title="Batterie">🔋</span>`;
    const contenu = el('div', 'ecran__contenu');
    ecran.appendChild(barre);
    ecran.appendChild(contenu);
    return { ecran, contenu };
  }

  /** Un message du fil : Nova, Kaya, @scratchy, les copains, ou la narration. */
  function messageHTML(scene, corpsHTML) {
    const corps = corpsHTML !== undefined ? corpsHTML : '<span class="recit__cible"></span>';

    if (!scene.qui) return `<div class="msg msg--recit">${corps}</div>`;

    const fiches = {
      nova:     { nom: 'NOVA',      etiquette: 'algorithme', avatar: () => Illus.nova(60) },
      kaya:     { nom: 'Kaya',      etiquette: 'en live',    avatar: () => Illus.kaya(60) },
      scratchy: { nom: '@scratchy', etiquette: '3 abonnés',
                  // en photo de profil, seule la tête du chat est lisible
                  avatar: () => `<svg viewBox="0 0 100 100">${Illus.teteChat(50, 54, 34)}</svg>` },
      ilyes:    { nom: 'Ilyes',     etiquette: 'groupe',     lettre: 'I' },
      nour:     { nom: 'Nour',      etiquette: 'groupe',     lettre: 'N' }
    };
    const f = fiches[scene.qui] || fiches.scratchy;
    const avatar = f.lettre
      ? `<div class="msg__avatar msg__avatar--lettre">${f.lettre}</div>`
      : `<div class="msg__avatar">${f.avatar()}</div>`;

    return `<div class="msg msg--${scene.qui}">
      ${avatar}
      <div class="msg__corps">
        <div class="msg__tete">
          <span class="msg__nom">${f.nom}</span>
          <span class="msg__etiquette">${f.etiquette}</span>
        </div>
        <div class="msg__bulle">${corps}</div>
      </div>
    </div>`;
  }

  /* ================================================== RÉCIT */
  /** Joue une suite de répliques, puis appelle `suite`. */
  function jouerRecit(scenes, titre, libelleBouton, suite, sousTitre) {
    vider(scene);
    window.scrollTo(0, 0);

    const { ecran, contenu } = ecranAppli(sousTitre);
    if (titre) contenu.appendChild(el('h1', 'centre', titre));
    scene.appendChild(ecran);

    const apres = el('div', 'actions');
    apres.style.justifyContent = 'center';

    Recit.jouer(contenu, scenes, {
      bulle: (s) => messageHTML(s),
      onFin: () => {
        const btn = el('button', 'btn btn--grand', libelleBouton);
        btn.addEventListener('click', () => { Son.clic(); suite(); });
        apres.appendChild(btn);
        contenu.appendChild(apres);
        btn.focus({ preventScroll: true });
      }
    });
  }

  /* ================================================== UNE ÉTAPE */
  function afficherEtape(indice) {
    etapeCourante = indice;
    Progression.ouvrirEtape(indice);
    majProgression();

    const etape = ETAPES[indice];
    document.documentElement.style.setProperty('--accent', etape.couleur);

    const branche = Progression.brancheDe(etape.id);

    // Pas encore de branche : on joue l'intro, puis on propose le choix.
    if (!branche) {
      const dejaVue = Progression.salleVue(etape.id);
      if (dejaVue) { afficherBifurcation(etape); return; }

      jouerRecit(etape.intro, `${etape.icone} ${etape.titre}`, '➡ Continuer', () => {
        Progression.marquerSalleVue(etape.id);
        afficherBifurcation(etape);
      }, etape.soustitre);
      return;
    }

    afficherTaches(etape, branche);
  }

  /* ---------------------------------------------- le choix qui bifurque */
  function afficherBifurcation(etape) {
    vider(scene);
    window.scrollTo(0, 0);
    const { ecran, contenu } = ecranAppli(etape.soustitre);
    contenu.appendChild(el('h1', 'centre', `${etape.icone} ${etape.titre}`));
    scene.appendChild(ecran);

    const bloc = el('div', 'bifurcation');
    bloc.appendChild(el('div', 'bifurcation__titre', `Étape ${etape.numero} sur ${ETAPES.length}`));
    bloc.appendChild(el('div', 'bifurcation__question', etape.choix.question));

    const options = el('div', 'bifurcation__options');
    etape.choix.options.forEach((opt) => {
      const b = el('button', 'option-branche', opt.texte);
      b.type = 'button';
      b.addEventListener('click', () => {
        Son.clic();
        Progression.choisirBranche(etape.id, opt.branche);
        // La réponse du personnage, puis les deux énigmes de la branche.
        jouerRecit([opt.reponse], null, '➡ Ouvrir la section', () => {
          afficherTaches(etape, opt.branche);
        }, etape.soustitre);
      });
      options.appendChild(b);
    });
    bloc.appendChild(options);
    bloc.appendChild(el('div', 'bifurcation__note',
      "Il n'y a pas de mauvais choix ici — mais tu ne feras pas les mêmes exercices que ton voisin."));
    contenu.appendChild(bloc);
  }

  /* ---------------------------------------------- les deux énigmes */
  function afficherTaches(etape, branche) {
    vider(scene);
    window.scrollTo(0, 0);
    majProgression();

    const enigmes = enigmesDe(etape, branche);
    const { ecran, contenu } = ecranAppli(etape.soustitre);
    contenu.appendChild(el('h1', 'centre', `${etape.icone} ${etape.titre}`));
    contenu.appendChild(el('p', 'centre muet petit',
      `Section « ${etape.branches[branche].titre} » — deux réglages à réparer.`));
    scene.appendChild(ecran);

    const liste = el('div', 'taches');
    enigmes.forEach((enigme, i) => {
      const fait = Progression.estResolue(enigme.id);
      const t = el('button', 'tache' + (fait ? ' tache--ok' : ''));
      t.type = 'button';
      t.innerHTML = `
        <div class="tache__icone">${enigme.icone}</div>
        <div>
          <div class="tache__titre">${i + 1}. ${enigme.titre}</div>
          <div class="tache__etat">${fait
            ? `Réparé · chiffre obtenu : <b>${enigme.fragment}</b>`
            : 'Appuie pour ouvrir'}</div>
        </div>
        <div class="tache__puce">${fait ? '✅' : '🔒'}</div>`;
      t.addEventListener('click', () => { Son.clic(); ouvrirEnigme(etape, branche, enigme); });
      liste.appendChild(t);
    });
    contenu.appendChild(liste);

    contenu.appendChild(construireVerification(etape, branche, enigmes));

    const aide = el('div', 'centre');
    aide.style.marginTop = '22px';
    const b = el('button', 'btn btn--fantome', '📘 Ouvrir le cahier de cours');
    b.addEventListener('click', () => ouvrirMemo(etape.memo));
    aide.appendChild(b);
    contenu.appendChild(aide);
  }

  /* ---------------------------------------------- le code de vérification */
  function construireVerification(etape, branche, enigmes) {
    const carte = el('div', 'verif');
    const tout = enigmes.every((e) => Progression.estResolue(e.id));

    carte.appendChild(el('div', 'verif__titre', '🔐 Code de vérification'));
    carte.appendChild(el('div', 'verif__sous',
      tout ? "Compose les deux chiffres obtenus, dans l'ordre des réglages."
           : "Répare les deux réglages : chacun te donne un chiffre du code."));

    if (!tout) {
      const apercu = el('div', 'verif__cases');
      enigmes.forEach((e) => {
        const ok = Progression.estResolue(e.id);
        const c = el('div', 'verif__case');
        c.style.display = 'grid';
        c.style.placeItems = 'center';
        c.textContent = ok ? e.fragment : '?';
        if (!ok) c.style.color = 'var(--texte-doux)';
        apercu.appendChild(c);
      });
      carte.appendChild(apercu);
      return carte;
    }

    const code = codeDe(etape, branche);
    const cases = el('div', 'verif__cases');
    const champs = [];
    for (let i = 0; i < code.length; i++) {
      const inp = el('input', 'verif__case');
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
      cases.appendChild(inp);
    }
    carte.appendChild(cases);

    const zoneRetour = el('div');
    const actions = el('div', 'actions');
    actions.style.justifyContent = 'center';
    const btn = el('button', 'btn btn--grand', '🔓 Valider le code');
    btn.addEventListener('click', tenter);
    actions.appendChild(btn);
    carte.appendChild(actions);
    carte.appendChild(zoneRetour);

    function tenter() {
      const saisi = champs.map((c) => c.value.trim()).join('');
      vider(zoneRetour);
      if (saisi === code) {
        Son.deverrouille();
        sectionOuverte(etape);
      } else {
        Son.mauvais();
        Progression.compterErreur();
        carte.classList.remove('verif--secoue');
        void carte.offsetWidth;
        carte.classList.add('verif--secoue');
        zoneRetour.appendChild(el('div', 'retour retour--erreur',
          "❌ Code refusé. Vérifie les deux chiffres et surtout leur <b>ordre</b> : celui du premier réglage d'abord."));
      }
    }

    return carte;
  }

  /* ---------------------------------------------- section franchie */
  function sectionOuverte(etape) {
    const derniere = etape.numero >= ETAPES.length;
    const scenes = (etape.sortie || []).slice();

    if (!scenes.length) {
      suivre();
      return;
    }
    jouerRecit(scenes, `✅ ${etape.titre} — réparé`,
      derniere ? '✨ Voir la fin' : '➡ Section suivante', suivre, etape.soustitre);

    function suivre() {
      if (derniere) {
        jouerRecit(EPILOGUE.scenes, EPILOGUE.titre, '🏆 Recevoir mon diplôme', () => {
          Progression.terminer();
          afficherVictoire();
        });
      } else {
        afficherEtape(etape.numero);
      }
    }
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
    boite.appendChild(el('p', 'centre muet petit',
      'Toutes les fiches sont aussi sur la page <a href="memo.html" target="_blank">Cahier de cours</a>.'));
  }

  /* ================================================== UNE ÉNIGME */
  function ouvrirEnigme(etape, branche, enigme) {
    indicesAffiches = 0;
    const boite = ouvrirModale(enigme.titre, enigme.icone);

    // Mise en scène : ce que l'élève « voit » avant de travailler.
    if (enigme.histoire) {
      const h = enigme.histoire;
      const noeud = el('div', null, messageHTML(h));
      boite.appendChild(noeud);
      const machine = Recit.ecrire(noeud.querySelector('.recit__cible'), h.texte);
      noeud.addEventListener('click', () => machine.terminer());
      noeud.title = 'Clique pour afficher tout le texte';
    }

    boite.appendChild(el('div', 'consigne', enigme.consigne));

    if (enigme.script && enigme.type !== 'trous') {
      const cadre = el('div');
      cadre.style.margin = '0 0 18px';
      cadre.appendChild(Blocs.pile(enigme.script));
      boite.appendChild(cadre);
    }
    if (enigme.question) boite.appendChild(el('p', null, `<b>${enigme.question}</b>`));

    const zoneJeu = el('div');
    const zoneRetour = el('div');
    const actions = el('div', 'actions');
    boite.appendChild(zoneJeu);
    boite.appendChild(zoneRetour);
    boite.appendChild(actions);

    /* --- indices : c'est Kaya qui souffle ---------------------- */
    const btnIndice = el('button', 'btn btn--fantome', '💡 Demander à Kaya');
    btnIndice.addEventListener('click', () => {
      if (indicesAffiches >= enigme.indices.length) return;
      Son.indice();
      Progression.compterIndice();
      zoneRetour.appendChild(el('div', null,
        messageHTML({ qui: 'kaya' }, `<b>Indice ${indicesAffiches + 1} :</b> ${enigme.indices[indicesAffiches]}`)));
      indicesAffiches++;
      if (indicesAffiches >= enigme.indices.length) btnIndice.disabled = true;
    });

    const btnCours = el('button', 'btn btn--fantome', '📘 Revoir le cours');
    btnCours.addEventListener('click', () => { fermerModale(); ouvrirMemo(etape.memo); });

    function reussir() {
      Son.bon();
      Progression.resoudre(enigme.id, enigme.fragment);
      vider(zoneRetour);
      vider(actions);
      zoneRetour.appendChild(el('div', 'retour retour--ok', `
        🎉 <b>Réglage réparé !</b> ${enigme.explication}
        <div style="margin-top:14px;text-align:center">
          <div class="muet petit">Chiffre du code obtenu</div>
          <div style="font-size:2.6rem;font-weight:800;color:var(--jaune)">${enigme.fragment}</div>
        </div>`));
      const btn = el('button', 'btn btn--vert btn--grand', '✔ Continuer');
      btn.addEventListener('click', () => { fermerModale(); afficherTaches(etape, branche); });
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

    Enigmes.construire(enigme, { zoneJeu, zoneRetour, actions, reussir, echouer });

    actions.appendChild(btnIndice);
    actions.appendChild(btnCours);

    if (Progression.estResolue(enigme.id)) {
      zoneRetour.appendChild(el('div', 'retour retour--ok',
        `✅ Déjà réparé. Le chiffre obtenu est <b>${enigme.fragment}</b>.`));
    }
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
      <div style="display:flex;justify-content:center">${Illus.scratchy(150)}</div>
      <h1>Déconnecté.</h1>
      <p>Il est ${HEURES[HEURES.length - 1]}. L'écran s'éteint pour de bon.
      Tu sais maintenant lire un programme : les blocs, les coordonnées, les boucles,
      les tests, les variables et les messages.</p>`;
    scene.appendChild(intro);

    // Le parcours réellement suivi, étape par étape
    const chemin = ETAPES.map((etape) => {
      const b = Progression.brancheDe(etape.id);
      return b ? `${etape.icone} ${etape.branches[b].titre}` : null;
    }).filter(Boolean);

    const d = el('div', 'diplome');
    d.innerHTML = `
      <div style="font-size:2.4rem">🏆</div>
      <h2>Attestation de déconnexion</h2>
      <p>délivrée à</p>
      <div class="diplome__nom">${e.pseudo}</div>
      <p>pour avoir repris le contrôle des <b>5 réglages</b> de LOOP<br>
      et maîtrisé les rudiments de la programmation avec Scratch.</p>
      <div style="font-size:2rem;letter-spacing:6px">${'⭐'.repeat(etoiles)}${'☆'.repeat(3 - etoiles)}</div>
      <div style="font-weight:800;font-size:1.2rem;color:#7a5600">${Progression.rang()}</div>
      <div class="diplome__stats">
        <div class="diplome__stat"><b>${Progression.chrono()}</b>temps</div>
        <div class="diplome__stat"><b>${e.indices}</b>indice(s)</div>
        <div class="diplome__stat"><b>${e.erreurs}</b>erreur(s)</div>
      </div>
      <div style="margin:14px 0;font-size:.9rem">
        <b>Ton parcours :</b><br>${chemin.join(' · ')}
      </div>
      <div>Fait le ${new Date().toLocaleDateString('fr-FR')}</div>`;
    scene.appendChild(d);

    const note = el('div', 'carte centre no-print');
    note.style.marginTop = '20px';
    note.innerHTML = `<p class="muet">Ton voisin n'a pas fait les mêmes exercices que toi :
      à chaque étape, ton choix décidait de la suite. Rejoue en choisissant l'autre chemin
      pour découvrir les <b>10 énigmes</b> que tu n'as pas vues.</p>`;
    scene.appendChild(note);

    const actions = el('div', 'actions no-print');
    actions.style.justifyContent = 'center';
    actions.style.marginTop = '24px';

    const imp = el('button', 'btn', '🖨 Imprimer mon attestation');
    imp.addEventListener('click', () => window.print());

    const revoir = el('a', 'btn btn--bleu', '📘 Revoir le cahier de cours');
    revoir.href = 'memo.html';

    const rejouer = el('button', 'btn btn--fantome', '🔄 Rejouer (autre parcours)');
    rejouer.addEventListener('click', () => {
      if (confirm('Effacer la partie et recommencer avec d\'autres choix ?')) {
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
    const couleurs = ['#4c97ff', '#ffbf00', '#59c059', '#cf63cf', '#ff8c1a', '#c56bff'];
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
