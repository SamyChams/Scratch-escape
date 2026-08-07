/* =========================================================
   memo.js — affichage des fiches du cahier de cours
   Utilisé par memo.html et par la fenêtre d'aide du jeu.
   ========================================================= */

const Memo = (() => {

  const el = (balise, classe, html) => {
    const n = document.createElement(balise);
    if (classe) n.className = classe;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };

  /** Construit une section d'une fiche. */
  function section(s) {
    switch (s.t) {

      case 'p':
        return el('p', null, s.texte);

      case 'liste': {
        const bloc = el('div');
        if (s.titre) bloc.appendChild(el('h3', null, s.titre));
        const ul = el('ul');
        s.items.forEach((i) => ul.appendChild(el('li', null, i)));
        bloc.appendChild(ul);
        return bloc;
      }

      case 'tableau': {
        const bloc = el('div');
        if (s.titre) bloc.appendChild(el('h3', null, s.titre));
        const table = el('table', 'tableau');
        const thead = el('thead');
        const tr = el('tr');
        s.entetes.forEach((h) => tr.appendChild(el('th', null, h)));
        thead.appendChild(tr);
        table.appendChild(thead);
        const tbody = el('tbody');
        s.lignes.forEach((ligne) => {
          const l = el('tr');
          ligne.forEach((c) => l.appendChild(el('td', null, c)));
          tbody.appendChild(l);
        });
        table.appendChild(tbody);
        bloc.appendChild(table);
        return bloc;
      }

      case 'blocs': {
        const bloc = el('div', 'fiche__demo-conteneur');
        if (s.legende) bloc.appendChild(el('p', null, s.legende));
        const cadre = el('div');
        cadre.style.margin = '0 0 18px';
        cadre.appendChild(Blocs.pile(s.pile));
        bloc.appendChild(cadre);
        return bloc;
      }

      case 'astuce':
        return el('div', 'encart encart--astuce', '💡 <b>Astuce :</b> ' + s.texte);

      case 'piege':
        return el('div', 'encart encart--piege', '⚠ ' + s.texte);

      default:
        return el('div');
    }
  }

  /** Construit une fiche complète. */
  function fiche(f) {
    const art = el('section', 'carte fiche');
    art.id = f.id;

    const entete = el('div', 'fiche__entete');
    entete.appendChild(el('div', 'fiche__icone', f.icone));
    const t = el('div');
    t.appendChild(el('h2', null, f.titre));
    if (f.resume) t.appendChild(el('div', 'muet petit', f.resume));
    entete.appendChild(t);
    art.appendChild(entete);

    f.sections.forEach((s) => art.appendChild(section(s)));
    return art;
  }

  /** Rend toutes les fiches dans un conteneur, avec un sommaire. */
  function tout(hote, fiches = COURS) {
    const sommaire = el('nav', 'sommaire');
    fiches.forEach((f) => {
      const a = el('a', null, `${f.icone} ${f.titre}`);
      a.href = '#' + f.id;
      sommaire.appendChild(a);
    });
    hote.appendChild(sommaire);
    fiches.forEach((f) => hote.appendChild(fiche(f)));
  }

  return { fiche, tout, section };
})();

if (typeof window !== 'undefined') window.Memo = Memo;
