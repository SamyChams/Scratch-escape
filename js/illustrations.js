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

  const personnages = { scratchy, pixel, bug };

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

    /* Salle 1 — un mur de briques d'où s'échappent des blocs colorés */
    s1: () => cadre(`
      <g opacity=".5">
        ${rep(5, r => rep(17, c =>
          `<rect x="${c * 50 + (r % 2 ? -25 : 0)}" y="${r * 31}" width="46" height="27" rx="4" fill="#b5482f"/>`))}
      </g>
      <g>
        <rect x="70"  y="24"  width="92"  height="26" rx="7" fill="#ffbf00" transform="rotate(-4 116 37)"/>
        <rect x="96"  y="62"  width="104" height="26" rx="7" fill="#4c97ff"/>
        <rect x="76"  y="100" width="84"  height="26" rx="7" fill="#9966ff" transform="rotate(5 118 113)"/>
        <rect x="560" y="30"  width="98"  height="26" rx="7" fill="#59c059" transform="rotate(-7 609 43)"/>
        <rect x="586" y="76"  width="88"  height="26" rx="7" fill="#ffab19" transform="rotate(6 630 89)"/>
        <rect x="546" y="116" width="76"  height="24" rx="7" fill="#cf63cf" transform="rotate(-3 584 128)"/>
      </g>
      ${teteChat(400, 74, 32)}
      <g fill="#fff" opacity=".8">
        ${rep(9, i => `<circle cx="${230 + i * 38}" cy="${26 + (i * 37) % 100}" r="${1.4 + (i % 3) * .7}"/>`)}
      </g>`, '#4c97ff', 's1'),

    /* Salle 2 — un couloir en perspective avec le repère x / y */
    s2: () => cadre(`
      <g stroke="#7fd0ee" stroke-width="1.3" opacity=".6">
        ${rep(17, i => `<line x1="${i * 50}" y1="150" x2="${330 + i * 8}" y2="56"/>`)}
        ${rep(5, i => `<line x1="${370 - i * 90}" y1="${64 + i * 22}" x2="${430 + i * 90}" y2="${64 + i * 22}"/>`)}
      </g>
      <rect x="356" y="26" width="88" height="36" rx="6" fill="#0d1b3a" stroke="#7fd0ee" stroke-width="2"/>
      <text x="400" y="51" font-size="18" font-family="monospace" fill="#8ceaff" text-anchor="middle">x ; y</text>
      <g stroke="#ffbf00" stroke-width="3.4" stroke-linecap="round">
        <path d="M60 116 h70"/><path d="M60 116 v-54"/>
      </g>
      <path d="M132 116 l-10-6 v12 z" fill="#ffbf00"/>
      <path d="M60 58 l-6 10 h12 z" fill="#ffbf00"/>
      <text x="142" y="122" font-size="16" font-family="monospace" fill="#ffbf00">x</text>
      <text x="46" y="54" font-size="16" font-family="monospace" fill="#ffbf00">y</text>
      ${teteChat(660, 92, 26)}
      <path d="M700 92 h44" stroke="#ffe14d" stroke-width="4" stroke-linecap="round"/>
      <path d="M746 92 l-11-7 v14 z" fill="#ffe14d"/>`, '#5cb1d6', 's2'),

    /* Salle 3 — des miroirs qui répètent le même reflet */
    s3: () => cadre(`
      <g>
        ${rep(6, i => {
          const x = 60 + i * 122, o = (1 - i * 0.15).toFixed(2), h = 104 - i * 9;
          return `<rect x="${x}" y="${(150 - h) / 2}" width="76" height="${h}" rx="34"
                    fill="#2a1a4e" stroke="#ffab19" stroke-width="3" opacity="${o}"/>
                  ${teteChat(x + 38, 75, 24 - i * 1.6, o)}`;
        })}
      </g>
      <g fill="none" stroke="#ffe14d" stroke-width="4" stroke-linecap="round">
        <path d="M404 22 a24 24 0 1 1-18 9"/>
      </g>
      <path d="M382 26 l8 13 l-15 2 z" fill="#ffe14d"/>`, '#ffab19', 's3'),

    /* Salle 4 — l'aiguillage : deux portes, une condition */
    s4: () => cadre(`
      <rect x="90"  y="34" width="104" height="112" rx="9" fill="#1d3a2c" stroke="#59c059" stroke-width="3.5"/>
      <rect x="606" y="34" width="104" height="112" rx="9" fill="#3a1d2c" stroke="#ff6680" stroke-width="3.5"/>
      <circle cx="176" cy="92" r="5" fill="#59c059"/><circle cx="624" cy="92" r="5" fill="#ff6680"/>
      <text x="138" y="104" font-size="42" fill="#59c059" text-anchor="middle" font-family="monospace">✓</text>
      <text x="662" y="104" font-size="42" fill="#ff6680" text-anchor="middle" font-family="monospace">✕</text>
      <path d="M400 104 l-176 0 M400 104 l176 0" stroke="#ffbf00" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M224 104 l12-7 v14 z" fill="#ffbf00"/><path d="M576 104 l-12-7 v14 z" fill="#ffbf00"/>
      <path d="M322 18 h156 l26 30 l-26 30 h-156 l-26-30 z" fill="#59c059" stroke="#9df09d" stroke-width="2.5"/>
      <text x="400" y="57" font-size="22" font-weight="bold" fill="#0e2a0e" text-anchor="middle" font-family="monospace">si … ?</text>
      ${teteChat(400, 116, 24)}`, '#59c059', 's4'),

    /* Salle 5 — le cœur du serveur, Scratchy en cage */
    s5: () => cadre(`
      <g fill="#241436" stroke="#ff8c1a" stroke-width="2.5">
        <rect x="24" y="20" width="92" height="122" rx="7"/>
        <rect x="684" y="20" width="92" height="122" rx="7"/>
      </g>
      <g fill="#ffb45c">
        ${rep(6, i => `<rect x="36" y="${32 + i * 18}" width="68" height="9" rx="4.5" opacity="${0.3 + (i % 3) * 0.25}"/>`)}
        ${rep(6, i => `<rect x="696" y="${32 + i * 18}" width="68" height="9" rx="4.5" opacity="${0.3 + ((i + 1) % 3) * 0.25}"/>`)}
      </g>
      <path d="M116 56 q90 26 0 52 M684 56 q-90 26 0 52" fill="none" stroke="#ff8c1a" stroke-width="3.5" opacity=".55"/>
      <ellipse cx="400" cy="80" rx="120" ry="66" fill="#ffd08a" opacity=".13"/>
      <circle cx="400" cy="80" r="58" fill="#3a2150" opacity=".55"/>
      ${teteChat(400, 78, 34)}
      <g stroke="#ffe14d" stroke-width="3" opacity=".95">
        ${rep(9, i => `<path d="M${304 + i * 24} 16 v128"/>`)}
      </g>
      <path d="M296 16 h216 M296 144 h216" stroke="#ffe14d" stroke-width="5" stroke-linecap="round"/>`, '#ff8c1a', 's5')
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
    const noms = { scratchy: 'Scratchy', pixel: 'Pixel', bug: 'Le Bug' };
    const dessin = personnages[qui] || personnages.pixel;
    return `<div class="dialogue dialogue--${qui}">
      <div class="dialogue__avatar">${dessin(74)}</div>
      <div class="dialogue__bulle">
        <div class="dialogue__nom">${nomForce || noms[qui] || ''}</div>
        <div class="dialogue__texte">${texte}</div>
      </div>
    </div>`;
  }

  return { decor, dialogue, scratchy, pixel, bug, teteChat };
})();

if (typeof window !== 'undefined') window.Illus = Illus;
