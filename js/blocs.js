/* =========================================================
   Blocs.js — fabrique des blocs Scratch en HTML
   ---------------------------------------------------------
   Un bloc se décrit avec un petit objet :

     { cat: 'mouvement', texte: 'avancer de {10} pas' }

   Conventions dans le texte :
     {10}   -> champ ovale blanc contenant 10
     {?0}   -> emplacement à compléter n°0 (énigmes « script à trous »)
     {=x|liste} -> champ de type menu déroulant

   Options :
     chapeau: true      -> bloc arrondi en haut (événements)
     forme: 'booleen'   -> hexagone (conditions)
     corps: [ ... ]     -> bloc en C (répéter, si…alors) contenant d'autres blocs
     corps2: [ ... ]    -> deuxième partie d'un si…sinon (précédée de `sinon`)
   ========================================================= */

const Blocs = (() => {

  /** Transforme le texte d'un bloc en noeuds DOM. */
  function ecrireTexte(parent, texte, desc) {
    const morceaux = String(texte).split(/(\{[^}]*\})/g);
    morceaux.forEach((m) => {
      if (!m) return;
      if (m.startsWith('{') && m.endsWith('}')) {
        const contenu = m.slice(1, -1);

        if (contenu === '#') {                      // condition imbriquée (hexagone)
          if (desc && desc.condition) parent.appendChild(creer(desc.condition));
          return;
        }
        if (contenu.startsWith('?')) {              // emplacement à compléter
          const trou = document.createElement('span');
          trou.className = 'trou';
          trou.dataset.trou = contenu.slice(1);
          trou.textContent = '?';
          parent.appendChild(trou);
          return;
        }
        const champ = document.createElement('span');
        champ.className = 'bloc__champ';
        if (contenu.startsWith('=')) {              // menu déroulant
          champ.classList.add('bloc__champ--liste');
          champ.textContent = contenu.slice(1) + ' ▾';
        } else {
          champ.textContent = contenu;
        }
        parent.appendChild(champ);
      } else {
        parent.appendChild(document.createTextNode(m));
      }
    });
  }

  /** Construit l'élément DOM d'un bloc (simple, booléen ou en C). */
  function creer(desc) {
    const cat = desc.cat || 'mouvement';

    // --- Bloc en C (avec un corps) -------------------------------------
    if (desc.corps) {
      const c = document.createElement('div');
      c.className = `bloc-c bloc-c--${cat}`;

      const haut = document.createElement('div');
      haut.className = 'bloc-c__haut';
      ecrireTexte(haut, desc.texte, desc);
      c.appendChild(haut);

      c.appendChild(creerCorps(desc.corps));

      if (desc.corps2) {
        const sinon = document.createElement('div');
        sinon.className = 'bloc-c__haut';
        ecrireTexte(sinon, desc.texteSinon || 'sinon', desc);
        c.appendChild(sinon);
        c.appendChild(creerCorps(desc.corps2));
      }

      const bas = document.createElement('div');
      bas.className = 'bloc-c__bas';
      c.appendChild(bas);
      return c;
    }

    // --- Bloc simple ou booléen ---------------------------------------
    const b = document.createElement('div');
    b.className = `bloc bloc--${cat}`;
    if (desc.chapeau) b.classList.add('bloc--chapeau');
    if (desc.forme === 'booleen') b.classList.add('bloc--booleen');
    ecrireTexte(b, desc.texte, desc);
    return b;
  }

  function creerCorps(liste) {
    const corps = document.createElement('div');
    corps.className = 'bloc-c__corps';
    liste.forEach((d) => {
      // Un corps peut contenir un emplacement vide : { trou: 0 }
      if (d && d.trou !== undefined) {
        const trou = document.createElement('span');
        trou.className = 'trou';
        trou.dataset.trou = d.trou;
        trou.textContent = '?';
        corps.appendChild(trou);
      } else {
        corps.appendChild(creer(d));
      }
    });
    return corps;
  }

  /** Construit une pile de blocs emboîtés. */
  function pile(listeDesc, classes = '') {
    const p = document.createElement('div');
    p.className = ('pile ' + classes).trim();
    listeDesc.forEach((d) => {
      if (d && d.trou !== undefined) {
        const trou = document.createElement('span');
        trou.className = 'trou';
        trou.dataset.trou = d.trou;
        trou.textContent = '?';
        p.appendChild(trou);
      } else {
        p.appendChild(creer(d));
      }
    });
    return p;
  }

  /** Version texte d'un bloc (pour les lecteurs d'écran et la page prof). */
  function enTexte(desc) {
    let t = String(desc.texte || '').replace(/\{[?=]?([^}]*)\}/g, '$1');
    if (desc.condition) t = t.replace('#', '⟨' + enTexte(desc.condition) + '⟩');
    if (desc.corps) {
      t += ' [ ' + desc.corps.map(enTexte).join(' ; ') + ' ]';
      if (desc.corps2) t += ' sinon [ ' + desc.corps2.map(enTexte).join(' ; ') + ' ]';
    }
    return t;
  }

  return { creer, pile, enTexte };
})();

if (typeof window !== 'undefined') window.Blocs = Blocs;
