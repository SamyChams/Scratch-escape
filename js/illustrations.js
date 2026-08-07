/* =========================================================
   illustrations.js — décors et personnages en SVG
   ---------------------------------------------------------
   Tout est dessiné à la main en SVG : aucune image à charger,
   le site reste utilisable hors ligne et se redimensionne
   sans jamais devenir flou.
   ========================================================= */

const Illus = (() => {

  /* ============================== PERSONNAGES ============================== */

  /** Tête de chat réutilisable (dans les décors comme dans le portrait). */
  const teteChat = (x, y, r, opacite = 1) => `
    <g transform="translate(${x} ${y}) scale(${r / 22})" opacity="${opacite}">
      <path d="M-15 -12 l-3 -20 l17 10 z" fill="#ff9a26"/>
      <path d="M15 -12 l3 -20 l-17 10 z" fill="#ff9a26"/>
      <path d="M-13 -13 l-1.5 -11 l9 6 z" fill="#ffc9a0"/>
      <path d="M13 -13 l1.5 -11 l-9 6 z" fill="#ffc9a0"/>
      <circle cx="0" cy="0" r="22" fill="#ffb14d"/>
      <ellipse cx="0" cy="9" rx="13" ry="9" fill="#ffe3c2"/>
      <circle cx="-8" cy="-3" r="5.4" fill="#fff"/><circle cx="8" cy="-3" r="5.4" fill="#fff"/>
      <circle cx="-7" cy="-2" r="3.1" fill="#28304f"/><circle cx="9" cy="-2" r="3.1" fill="#28304f"/>
      <circle cx="-5.8" cy="-3.4" r="1.1" fill="#fff"/><circle cx="10.2" cy="-3.4" r="1.1" fill="#fff"/>
      <path d="M-3 5 h6 l-3 3.4 z" fill="#e8760f"/>
      <path d="M0 8.4 q-4 4 -7.5 1 M0 8.4 q4 4 7.5 1" fill="none" stroke="#e8760f" stroke-width="2" stroke-linecap="round"/>
      <path d="M-21 1 h-11 M-21 6 h-10 M21 1 h11 M21 6 h10" stroke="#ffe9d4" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>
      <path d="M-11 -18 l4 6 M0 -21 v7 M11 -18 l-4 6" stroke="#f0a03c" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>
    </g>`;

  /** Scratchy, le chat prisonnier. */
  const scratchy = (taille = 90) => `
  <svg viewBox="0 0 100 110" width="${taille}" height="${taille * 1.1}" role="img" aria-label="Scratchy le chat">
    <ellipse cx="50" cy="103" rx="27" ry="5" fill="rgba(0,0,0,.25)"/>
    <path d="M70 84 q22 6 20-14 q-1-10-10-11" fill="none" stroke="#e8760f" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="50" cy="80" rx="25" ry="21" fill="#ff9a26"/>
    <ellipse cx="50" cy="86" rx="15" ry="13" fill="#ffe3c2"/>
    <path d="M38 76 h24 M41 84 h18" stroke="#f0a03c" stroke-width="2.6" stroke-linecap="round" opacity=".5"/>
    ${teteChat(50, 44, 24)}
  </svg>`;

  /** Pixel, le petit drone qui souffle les indices. */
  const pixel = (taille = 90) => `
  <svg viewBox="0 0 100 110" width="${taille}" height="${taille * 1.1}" role="img" aria-label="Pixel le drone">
    <ellipse cx="50" cy="103" rx="20" ry="4" fill="rgba(0,0,0,.25)"/>
    <path d="M50 30 v-11" stroke="#7fe3ff" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="15" r="6" fill="#ffe14d"/>
    <circle cx="50" cy="15" r="11" fill="#ffe14d" opacity=".25"/>
    <rect x="20" y="30" width="60" height="48" rx="18" fill="#3fc4e8"/>
    <rect x="20" y="30" width="60" height="22" rx="13" fill="#6fdcf8"/>
    <ellipse cx="50" cy="54" rx="21" ry="16" fill="#0f2a52"/>
    <circle cx="50" cy="54" r="10" fill="#7fe3ff"/>
    <circle cx="50" cy="54" r="4.6" fill="#0d2340"/>
    <circle cx="53.4" cy="50.6" r="2" fill="#fff"/>
    <rect x="10" y="48" width="10" height="17" rx="5" fill="#2a9dc0"/>
    <rect x="80" y="48" width="10" height="17" rx="5" fill="#2a9dc0"/>
    <rect x="35" y="78" width="30" height="8" rx="4" fill="#2a9dc0"/>
    <path d="M40 90 l-7 9 M60 90 l7 9" stroke="#2a9dc0" stroke-width="4.5" stroke-linecap="round"/>
  </svg>`;

  /** Le Bug, le virus qui garde le serveur. */
  const bug = (taille = 90) => `
  <svg viewBox="0 0 100 110" width="${taille}" height="${taille * 1.1}" role="img" aria-label="Le Bug">
    <ellipse cx="50" cy="103" rx="25" ry="4" fill="rgba(0,0,0,.3)"/>
    <path d="M28 40 l-13-11 M72 40 l13-11" stroke="#8f4dd6" stroke-width="5" stroke-linecap="round"/>
    <circle cx="15" cy="29" r="5.5" fill="#c56bff"/><circle cx="85" cy="29" r="5.5" fill="#c56bff"/>
    <path d="M24 58 l-15 4 M76 58 l15 4 M26 74 l-14 11 M74 74 l14 11"
          stroke="#8f4dd6" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 28 q29 0 29 31 t-29 35 q-29-4-29-35 t29-31" fill="#a35cf0"/>
    <path d="M50 28 q29 0 29 31 q-15 6-29 4 q-14 2-29-4 q0-31 29-31" fill="#c084ff"/>
    <circle cx="38" cy="53" r="9.5" fill="#eafff4"/><circle cx="62" cy="53" r="9.5" fill="#eafff4"/>
    <circle cx="39" cy="54" r="4.8" fill="#1b0f33"/><circle cx="63" cy="54" r="4.8" fill="#1b0f33"/>
    <path d="M29 43 l16 5 M71 43 l-16 5" stroke="#3d1a6e" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="70" r="5" fill="#5ef0a8"/>
    <path d="M39 81 q11 9 22 0" fill="none" stroke="#3d1a6e" stroke-width="3.4" stroke-linecap="round"/>
    <rect x="6" y="66" width="7" height="7" fill="#5ef0a8" opacity=".85"/>
    <rect x="90" y="48" width="6" height="6" fill="#5ef0a8" opacity=".7"/>
    <rect x="84" y="92" width="8" height="8" fill="#c56bff" opacity=".6"/>
  </svg>`;


  /** Nova, l'algorithme de LOOP : un œil géométrique qui te regarde. */
  const nova = (taille = 90) => `
  <svg viewBox="0 0 100 110" width="${taille}" height="${taille * 1.1}" role="img" aria-label="Nova, l'algorithme">
    <defs>
      <radialGradient id="nv-iris" cx="50%" cy="45%">
        <stop offset="0%" stop-color="#ff7ae0"/>
        <stop offset="55%" stop-color="#a35cf0"/>
        <stop offset="100%" stop-color="#4a2a8a"/>
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="103" rx="22" ry="4" fill="rgba(0,0,0,.3)"/>
    <g opacity=".55" stroke="#c56bff" stroke-width="2" fill="none">
      <path d="M50 6 l38 22 v44 l-38 22 l-38-22 v-44 z"/>
    </g>
    <g opacity=".9" stroke="#7fe3ff" stroke-width="2.5" fill="none" stroke-linecap="round">
      <path d="M50 14 l30 18"/><path d="M50 14 l-30 18"/>
      <path d="M20 68 l30 18"/><path d="M80 68 l-30 18"/>
    </g>
    <circle cx="50" cy="14" r="3.5" fill="#7fe3ff"/>
    <circle cx="20" cy="32" r="3" fill="#7fe3ff"/><circle cx="80" cy="32" r="3" fill="#7fe3ff"/>
    <circle cx="20" cy="68" r="3" fill="#7fe3ff"/><circle cx="80" cy="68" r="3" fill="#7fe3ff"/>
    <circle cx="50" cy="86" r="3.5" fill="#7fe3ff"/>
    <path d="M12 50 q38 -30 76 0 q-38 30 -76 0 z" fill="#1a0f38" stroke="#c56bff" stroke-width="3"/>
    <circle cx="50" cy="50" r="17" fill="url(#nv-iris)"/>
    <ellipse cx="50" cy="50" rx="5" ry="15" fill="#12082b"/>
    <circle cx="56" cy="42" r="3.4" fill="#fff" opacity=".92"/>
    <circle cx="43" cy="57" r="1.8" fill="#fff" opacity=".55"/>
    <rect x="6" y="44" width="6" height="6" fill="#ff7ae0" opacity=".8"/>
    <rect x="90" y="58" width="5" height="5" fill="#7fe3ff" opacity=".7"/>
  </svg>`;

  /** Kaya, la créatrice coincée dans l'appli — elle streame encore. */
  const kaya = (taille = 90) => `
  <svg viewBox="0 0 100 110" width="${taille}" height="${taille * 1.1}" role="img" aria-label="Kaya, la créatrice">
    <ellipse cx="50" cy="103" rx="24" ry="4" fill="rgba(0,0,0,.28)"/>
    <circle cx="50" cy="46" r="34" fill="none" stroke="#ffe14d" stroke-width="3" stroke-dasharray="4 7" opacity=".65"/>
    <path d="M22 100 q4 -26 28 -26 q24 0 28 26 z" fill="#2fb3a6"/>
    <path d="M50 74 l-7 14 l7 6 l7 -6 z" fill="#249a8e"/>
    <path d="M30 34 q20 -18 40 0 q4 22 -4 30 q-16 8 -32 0 q-8 -8 -4 -30" fill="#3a2a52"/>
    <circle cx="50" cy="48" r="21" fill="#f0b98d"/>
    <path d="M29 44 q21 -20 42 0 q2 -22 -21 -22 q-23 0 -21 22" fill="#3a2a52"/>
    <circle cx="42" cy="48" r="2.9" fill="#2b2036"/><circle cx="58" cy="48" r="2.9" fill="#2b2036"/>
    <circle cx="43" cy="47" r="1" fill="#fff"/><circle cx="59" cy="47" r="1" fill="#fff"/>
    <path d="M44 58 q6 5 12 0" fill="none" stroke="#c4795a" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M27 40 v14 a5 5 0 0 0 5 5 h2 v-24 h-2 a5 5 0 0 0 -5 5 z" fill="#ff8c42"/>
    <path d="M73 40 v14 a5 5 0 0 1 -5 5 h-2 v-24 h2 a5 5 0 0 1 5 5 z" fill="#ff8c42"/>
    <path d="M27 40 q23 -16 46 0" fill="none" stroke="#ff8c42" stroke-width="4.5"/>
    <path d="M34 60 q6 8 6 14" fill="none" stroke="#ff8c42" stroke-width="3" stroke-linecap="round"/>
    <circle cx="41" cy="76" r="4" fill="#ff8c42"/>
    <rect x="60" y="84" width="26" height="12" rx="6" fill="#ff3b5c"/>
    <circle cx="67" cy="90" r="3" fill="#fff"/>
    <text x="76" y="94" font-size="8" font-weight="bold" fill="#fff" font-family="sans-serif">LIVE</text>
  </svg>`;

  const personnages = { scratchy, nova, kaya, pixel, bug };

  /* ================================ DÉCORS ================================ */
  /* Bandeaux d'ambiance en haut de chaque salle.
     Format large (800 × 150) pour supporter le recadrage sur écran large. */

  const cadre = (contenu, fond, id) => `
  <svg viewBox="0 0 800 150" preserveAspectRatio="xMidYMid slice" class="decor" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="fd-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${fond}" stop-opacity=".5"/>
        <stop offset="100%" stop-color="${fond}" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect width="800" height="150" fill="url(#fd-${id})"/>
    ${contenu}
  </svg>`;

  const rep = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');

  const decors = {

    /* Étape 1 — l'éditeur : une palette de blocs colorés qu'on assemble */
    e1: () => cadre(`
      <rect x="40" y="18" width="200" height="118" rx="10" fill="#0e1433" stroke="#4c97ff" stroke-width="2"/>
      <text x="52" y="40" font-size="13" font-family="monospace" fill="#7fb5ff">palette</text>
      ${rep(5, i => `<rect x="54" y="${50 + i * 17}" width="${140 - i * 12}" height="12" rx="6"
        fill="${['#4c97ff', '#9966ff', '#ffbf00', '#ffab19', '#59c059'][i]}"/>`)}
      <path d="M256 76 h44" stroke="#ffe14d" stroke-width="4" stroke-linecap="round"/>
      <path d="M304 76 l-12-7 v14 z" fill="#ffe14d"/>
      <g>
        <rect x="330" y="26" width="150" height="26" rx="7" fill="#ffbf00"/>
        <rect x="330" y="58" width="170" height="26" rx="7" fill="#4c97ff"/>
        <rect x="330" y="90" width="140" height="26" rx="7" fill="#9966ff"/>
        <rect x="346" y="52" width="22" height="7" fill="#cc9900"/>
        <rect x="346" y="84" width="22" height="7" fill="#3373cc"/>
      </g>
      ${teteChat(620, 74, 34)}
      <g fill="#fff" opacity=".5">
        ${rep(6, i => `<circle cx="${540 + i * 42}" cy="${28 + (i * 31) % 96}" r="1.8"/>`)}
      </g>`, '#4c97ff', 'e1'),

    /* Étape 2 — les filtres : un sticker qu'on positionne sur une grille */
    e2: () => cadre(`
      <g stroke="#7fd0ee" stroke-width="1" opacity=".45">
        ${rep(17, i => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="150"/>`)}
        ${rep(4, i => `<line x1="0" y1="${i * 40 + 15}" x2="800" y2="${i * 40 + 15}"/>`)}
      </g>
      <g stroke="#ffbf00" stroke-width="2.5" stroke-linecap="round">
        <path d="M60 96 h84"/><path d="M60 96 v-52"/>
      </g>
      <path d="M146 96 l-9-5 v10 z" fill="#ffbf00"/>
      <path d="M60 40 l-5 9 h10 z" fill="#ffbf00"/>
      <text x="152" y="101" font-size="15" font-family="monospace" fill="#ffbf00">x</text>
      <text x="46" y="36" font-size="15" font-family="monospace" fill="#ffbf00">y</text>
      <rect x="300" y="20" width="200" height="112" rx="14" fill="#12224a" stroke="#7fd0ee" stroke-width="2.5"/>
      ${teteChat(400, 76, 32)}
      <g stroke="#ff3b5c" stroke-width="2.5" fill="none">
        <circle cx="612" cy="72" r="26"/>
        <path d="M612 38 v14 M612 92 v14 M578 72 h14 M632 72 h14"/>
      </g>
      <text x="612" y="79" font-size="22" text-anchor="middle">😎</text>
      <path d="M540 72 h34" stroke="#ffe14d" stroke-width="3" stroke-dasharray="5 5"/>`, '#5cb1d6', 'e2'),

    /* Étape 3 — le montage : une bande vidéo où la même image se répète */
    e3: () => cadre(`
      <rect x="0" y="34" width="800" height="82" fill="#1c1330" opacity=".85"/>
      <g fill="#ffab19">
        ${rep(20, i => `<rect x="${i * 40 + 6}" y="38" width="10" height="9" rx="2" opacity=".7"/>`)}
        ${rep(20, i => `<rect x="${i * 40 + 6}" y="103" width="10" height="9" rx="2" opacity=".7"/>`)}
      </g>
      <g>
        ${rep(6, i => `<rect x="${40 + i * 122}" y="54" width="104" height="42" rx="6"
          fill="#2f1f52" stroke="#ffab19" stroke-width="2"/>
          ${teteChat(92 + i * 122, 75, 15)}`)}
      </g>
      <g fill="none" stroke="#ffe14d" stroke-width="4" stroke-linecap="round">
        <path d="M406 12 a20 20 0 1 1-15 7"/>
      </g>
      <path d="M386 16 l7 11 l-13 2 z" fill="#ffe14d"/>
      <text x="440" y="26" font-size="15" font-weight="bold" fill="#ffe14d" font-family="monospace">× 6</text>`,
      '#ffab19', 'e3'),

    /* Étape 4 — la modération : des commentaires, dont certains sont masqués */
    e4: () => cadre(`
      <g>
        ${rep(3, i => `<rect x="${60 + i * 20}" y="${20 + i * 40}" width="240" height="30" rx="15"
          fill="#1d3a2c" stroke="#59c059" stroke-width="2"/>
          <circle cx="${82 + i * 20}" cy="${35 + i * 40}" r="9" fill="#59c059" opacity=".5"/>
          <rect x="${100 + i * 20}" y="${30 + i * 40}" width="${150 - i * 22}" height="8" rx="4" fill="#9df09d" opacity=".55"/>`)}
      </g>
      <g>
        ${rep(2, i => `<rect x="${470 + i * 26}" y="${34 + i * 48}" width="230" height="30" rx="15"
          fill="#3a1d2c" stroke="#ff6680" stroke-width="2"/>
          <circle cx="${492 + i * 26}" cy="${49 + i * 48}" r="9" fill="#ff6680" opacity=".5"/>
          <rect x="${510 + i * 26}" y="${44 + i * 48}" width="${140 - i * 20}" height="8" rx="4" fill="#ffb3c0" opacity=".4"/>
          <path d="M${478 + i * 26} ${40 + i * 48} l214 18 M${692 + i * 26} ${40 + i * 48} l-214 18"
            stroke="#ff6680" stroke-width="2.5" opacity=".8"/>`)}
      </g>
      <path d="M352 42 h96 l16 32 l-16 32 h-96 l-16-32 z" fill="#59c059" stroke="#9df09d" stroke-width="2.5"/>
      <text x="400" y="82" font-size="17" font-weight="bold" fill="#0e2a0e" text-anchor="middle" font-family="monospace">si ?</text>`,
      '#59c059', 'e4'),

    /* Étape 5 — l'algorithme : l'œil de Nova et son compteur qui monte */
    e5: () => cadre(`
      <g opacity=".3" stroke="#c56bff" stroke-width="1.5" fill="none">
        ${rep(6, i => `<circle cx="400" cy="75" r="${34 + i * 20}"/>`)}
      </g>
      <g transform="translate(340 20) scale(1.2)">${nova(100).replace(/<svg[^>]*>|<\/svg>/g, '')}</g>
      <g>
        <rect x="60" y="52" width="200" height="46" rx="10" fill="#0e1433" stroke="#ff8c1a" stroke-width="2.5"/>
        <text x="76" y="72" font-size="12" font-family="monospace" fill="#ffb45c">temps_passé</text>
        <text x="76" y="92" font-size="19" font-weight="bold" font-family="monospace" fill="#ffe14d">00:47:12</text>
      </g>
      <path d="M270 75 h56" stroke="#ff8c1a" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 6"/>
      <g>
        <rect x="540" y="52" width="200" height="46" rx="10" fill="#0e1433" stroke="#c56bff" stroke-width="2.5"/>
        <text x="556" y="72" font-size="12" font-family="monospace" fill="#d6a8ff">ajouter 1 à …</text>
        <text x="556" y="92" font-size="19" font-weight="bold" font-family="monospace" fill="#7fe3ff">∞</text>
      </g>
      <path d="M474 75 h56" stroke="#c56bff" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 6"/>`,
      '#c56bff', 'e5')
  };

  /* =============================== OUTILS =============================== */

  /** Bandeau décoratif d'une salle. */
  function decor(idSalle) {
    const f = decors[idSalle];
    return f ? f() : '';
  }

  /**
   * Bulle de dialogue d'un personnage.
   * qui : 'scratchy' | 'pixel' | 'bug'
   */
  function dialogue(qui, texte, nomForce) {
    const noms = {
      scratchy: '@scratchy', nova: 'NOVA', kaya: 'Kaya',
      pixel: 'Pixel', bug: 'Le Bug'
    };
    const dessin = personnages[qui] || personnages.pixel;
    return `<div class="dialogue dialogue--${qui}">
      <div class="dialogue__avatar">${dessin(74)}</div>
      <div class="dialogue__bulle">
        <div class="dialogue__nom">${nomForce || noms[qui] || ''}</div>
        <div class="dialogue__texte">${texte}</div>
      </div>
    </div>`;
  }

  return { decor, dialogue, scratchy, nova, kaya, pixel, bug, teteChat };
})();

if (typeof window !== 'undefined') window.Illus = Illus;
