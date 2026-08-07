/* =========================================================
   telephone.js — l'aperçu de TokTik pendant qu'on la répare
   ---------------------------------------------------------
   Un petit téléphone posé à côté des énigmes, qui montre
   l'état réel de l'application. Chaque étape a sa scène, et
   chaque scène porte trois défauts — un par énigme.

   Chaque défaut existe en deux versions dessinées :
     .casse-N  ce que l'on voit tant que l'énigme n'est pas résolue
     .ok-N     ce que l'on voit une fois qu'elle l'est

   C'est l'attribut data-r1 / data-r2 / data-r3 posé sur le <svg>
   qui décide laquelle des deux s'affiche. Comme la bascule passe
   par une transition CSS, la réparation se voit se produire.
   ========================================================= */

const Telephone = (() => {

  /* Le châssis : coque, encoche, écran. Le contenu vient s'y loger. */
  const chassis = (contenu) => `
    <rect x="1" y="1" width="148" height="298" rx="20"
          fill="var(--tel-coque)" stroke="var(--tel-bord)" stroke-width="2"/>
    <rect x="9" y="22" width="132" height="258" rx="9" fill="var(--tel-ecran)"/>
    <rect x="58" y="8" width="34" height="6" rx="3" fill="var(--tel-bord)"/>
    <g clip-path="url(#tel-fenetre)">${contenu}</g>
    <rect x="9" y="22" width="132" height="258" rx="9" fill="none"
          stroke="var(--tel-bord)" stroke-width="1" opacity=".6"/>`;

  /* Petite tête de chat, reprise du reste du jeu. */
  const minois = (x, y, r) => `
    <g transform="translate(${x} ${y}) scale(${r / 22})">
      <path d="M-14 -12 l-3 -18 l16 9 z" fill="#ff9a26"/>
      <path d="M14 -12 l3 -18 l-16 9 z" fill="#ff9a26"/>
      <circle cx="0" cy="0" r="20" fill="#ffb14d"/>
      <circle cx="-7" cy="-3" r="3.4" fill="#fff"/><circle cx="7" cy="-3" r="3.4" fill="#fff"/>
      <circle cx="-6" cy="-2.4" r="1.9" fill="#28304f"/><circle cx="8" cy="-2.4" r="1.9" fill="#28304f"/>
      <path d="M0 6 q-4 4 -7 1 M0 6 q4 4 7 1" fill="none" stroke="#e8760f" stroke-width="1.8" stroke-linecap="round"/>
    </g>`;

  const barre = (x, y, w, couleur, o = 1) =>
    `<rect x="${x}" y="${y}" width="${w}" height="11" rx="5.5" fill="${couleur}" opacity="${o}"/>`;

  /* ------------------------------------------------------------------
     Les cinq scènes. Chacune décrit trois réparations visibles.
     ------------------------------------------------------------------ */
  const scenes = {

    /* Étape 1 — l'éditeur : la palette, le script, l'intrus */
    e1: {
      titres: ['les couleurs', "l'ordre du script", "l'intrus"],
      dessin: `
        <text x="20" y="42" font-size="8" fill="var(--tel-doux)" font-family="monospace">ÉDITEUR</text>

        <g class="casse-1">
          ${barre(20, 50, 96, 'var(--tel-doux)', .45)}${barre(20, 66, 78, 'var(--tel-doux)', .45)}
          ${barre(20, 82, 88, 'var(--tel-doux)', .45)}
        </g>
        <g class="ok-1">
          ${barre(20, 50, 96, '#4c97ff')}${barre(20, 66, 78, '#9966ff')}${barre(20, 82, 88, '#ffbf00')}
        </g>

        <text x="20" y="116" font-size="8" fill="var(--tel-doux)" font-family="monospace">SCRIPT</text>
        <g class="casse-2">
          ${barre(44, 124, 70, '#ffab19', .75)}${barre(20, 140, 70, '#4c97ff', .75)}
          ${barre(52, 156, 62, '#59c059', .75)}
          <path d="M22 130 l100 40 M22 170 l100 -40" stroke="#ff6b8b" stroke-width="1.5" opacity=".7"/>
        </g>
        <g class="ok-2">
          ${barre(20, 124, 84, '#ffbf00')}${barre(20, 140, 84, '#4c97ff')}${barre(20, 156, 84, '#59c059')}
          <rect x="26" y="135" width="14" height="5" fill="#cc9900"/>
          <rect x="26" y="151" width="14" height="5" fill="#3373cc"/>
        </g>

        <text x="20" y="192" font-size="8" fill="var(--tel-doux)" font-family="monospace">TIROIR MOUVEMENT</text>
        <g class="casse-3">
          ${barre(20, 200, 60, '#4c97ff')}${barre(20, 216, 60, '#9966ff')}${barre(20, 232, 60, '#4c97ff')}
          <circle cx="98" cy="221" r="9" fill="#ff6b8b"/>
          <text x="98" y="225" font-size="11" text-anchor="middle" fill="#fff" font-weight="bold">!</text>
        </g>
        <g class="ok-3">
          ${barre(20, 200, 60, '#4c97ff')}${barre(20, 216, 60, '#4c97ff')}${barre(20, 232, 60, '#4c97ff')}
          <circle cx="98" cy="221" r="9" fill="#59c059"/>
          <path d="M93 221 l4 4 l8 -8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        </g>`
    },

    /* Étape 2 — les filtres : le repère, le sticker, le sous-titre */
    e2: {
      titres: ['le repère', 'le sticker', 'le sous-titre'],
      dessin: `
        <rect x="16" y="34" width="118" height="200" rx="7" fill="#1a2450"/>
        ${minois(75, 128, 30)}

        <g class="casse-1">
          <text x="75" y="52" font-size="8" text-anchor="middle" fill="var(--tel-doux)" font-family="monospace">? ; ?</text>
        </g>
        <g class="ok-1">
          <path d="M26 218 h34 M26 218 v-30" stroke="#ffc61a" stroke-width="1.6"/>
          <path d="M62 218 l-5 -3 v6 z" fill="#ffc61a"/><path d="M26 186 l-3 5 h6 z" fill="#ffc61a"/>
          <text x="66" y="222" font-size="8" fill="#ffc61a" font-family="monospace">x</text>
          <text x="18" y="184" font-size="8" fill="#ffc61a" font-family="monospace">y</text>
        </g>

        <g class="casse-2"><text x="28" y="52" font-size="15">😎</text></g>
        <g class="ok-2"><text x="82" y="132" font-size="14">😎</text></g>

        <g class="casse-3">
          <rect x="104" y="196" width="60" height="14" rx="4" fill="#0e1330" opacity=".85"/>
          <text x="110" y="206" font-size="8" fill="#fff" font-family="monospace">…titre</text>
        </g>
        <g class="ok-3">
          <rect x="34" y="196" width="82" height="14" rx="4" fill="#0e1330" opacity=".85"/>
          <text x="75" y="206" font-size="8" text-anchor="middle" fill="#fff" font-family="monospace">sous-titre</text>
        </g>`
    },

    /* Étape 3 — le montage : la transition, le logo, le scroll */
    e3: {
      titres: ['la transition', 'le logo', 'le scroll'],
      dessin: `
        <text x="20" y="42" font-size="8" fill="var(--tel-doux)" font-family="monospace">MONTAGE</text>

        <g class="casse-1">
          ${[0,1,2].map(i => `<rect x="${20 + i*38}" y="50" width="32" height="30" rx="4"
             fill="#2f1f52" stroke="#ffab19" stroke-width="1.4"/>${minois(36 + i*38, 65, 10)}`).join('')}
          <text x="75" y="94" font-size="7.5" text-anchor="middle" fill="#ff6b8b" font-family="monospace">image répétée ×3</text>
        </g>
        <g class="ok-1">
          ${[0,1,2].map(i => `<rect x="${20 + i*38}" y="50" width="32" height="30" rx="4"
             fill="#2f1f52" stroke="#ffab19" stroke-width="1.4"/>
             <rect x="${26 + i*38}" y="${58 + i*3}" width="20" height="${16 - i*3}" rx="2" fill="#ffab19" opacity=".8"/>`).join('')}
          <text x="75" y="94" font-size="7.5" text-anchor="middle" fill="#59c059" font-family="monospace">répéter 3 fois</text>
        </g>

        <g class="casse-2">
          <circle cx="75" cy="140" r="20" fill="none" stroke="var(--tel-doux)" stroke-width="2" opacity=".5"/>
          <path d="M75 140 l0 -14" stroke="var(--tel-doux)" stroke-width="2" transform="rotate(37 75 140)"/>
        </g>
        <g class="ok-2">
          <circle cx="75" cy="140" r="20" fill="none" stroke="#ffc61a" stroke-width="2" stroke-dasharray="4 5"/>
          <path d="M75 140 l0 -14" stroke="#ffc61a" stroke-width="2.4" stroke-linecap="round"/>
          <text x="75" y="172" font-size="7.5" text-anchor="middle" fill="#ffc61a" font-family="monospace">72° × 5</text>
        </g>

        <g class="casse-3">
          <rect x="126" y="190" width="5" height="70" rx="2.5" fill="var(--tel-doux)" opacity=".3"/>
          <rect x="126" y="196" width="5" height="20" rx="2.5" fill="#ff6b8b"/>
          <text x="20" y="214" font-size="7.5" fill="#ff6b8b" font-family="monospace">répéter</text>
          <text x="20" y="226" font-size="7.5" fill="#ff6b8b" font-family="monospace">indéfiniment</text>
        </g>
        <g class="ok-3">
          <rect x="126" y="190" width="5" height="70" rx="2.5" fill="var(--tel-doux)" opacity=".3"/>
          <rect x="126" y="238" width="5" height="22" rx="2.5" fill="#59c059"/>
          <text x="20" y="214" font-size="7.5" fill="#59c059" font-family="monospace">répéter 6 fois</text>
          <text x="20" y="228" font-size="7.5" fill="#59c059" font-family="monospace">puis on s'arrête</text>
        </g>`
    },

    /* Étape 4 — la modération : le filtre, le badge, les signalements */
    e4: {
      titres: ['le filtre', 'le badge', 'les signalements'],
      dessin: `
        <text x="20" y="42" font-size="8" fill="var(--tel-doux)" font-family="monospace">COMMENTAIRES</text>

        <g class="casse-1">
          ${[0,1].map(i => `<rect x="20" y="${50 + i*22}" width="110" height="17" rx="8.5"
             fill="#3a1d2c" stroke="#ff6b8b" stroke-width="1.3"/>
             <circle cx="31" cy="${58.5 + i*22}" r="5" fill="#ff6b8b" opacity=".6"/>
             <rect x="42" y="${55 + i*22}" width="${70 - i*18}" height="6" rx="3" fill="#ffb3c0" opacity=".55"/>`).join('')}
        </g>
        <g class="ok-1">
          ${[0,1].map(i => `<rect x="20" y="${50 + i*22}" width="110" height="17" rx="8.5"
             fill="var(--tel-ecran)" stroke="var(--tel-doux)" stroke-width="1.2" stroke-dasharray="3 3" opacity=".7"/>
             <text x="75" y="${62 + i*22}" font-size="7" text-anchor="middle" fill="var(--tel-doux)" font-family="monospace">masqué</text>`).join('')}
        </g>

        <g class="casse-2">
          <circle cx="34" cy="122" r="10" fill="#5a6ad0" opacity=".5"/>
          <text x="50" y="119" font-size="8" fill="var(--tel-clair)" font-family="monospace">@compte</text>
          <text x="50" y="130" font-size="7" fill="#ff6b8b" font-family="monospace">9 999 abonnés</text>
          <circle cx="122" cy="122" r="7" fill="#ff6b8b"/>
          <text x="122" y="126" font-size="9" text-anchor="middle" fill="#fff" font-weight="bold">✕</text>
        </g>
        <g class="ok-2">
          <circle cx="34" cy="122" r="10" fill="#5a6ad0" opacity=".5"/>
          <text x="50" y="119" font-size="8" fill="var(--tel-clair)" font-family="monospace">@compte</text>
          <text x="50" y="130" font-size="7" fill="#59c059" font-family="monospace">10 000 abonnés</text>
          <circle cx="122" cy="122" r="7" fill="#59c059"/>
          <path d="M118 122 l3 3 l6 -6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
        </g>

        <g class="casse-3">
          <path d="M75 176 l24 9 v20 q0 18 -24 27 q-24 -9 -24 -27 v-20 z"
                fill="none" stroke="var(--tel-doux)" stroke-width="2" opacity=".45"/>
          <text x="75" y="248" font-size="7.5" text-anchor="middle" fill="var(--tel-doux)" font-family="monospace">filtre éteint</text>
        </g>
        <g class="ok-3">
          <path d="M75 176 l24 9 v20 q0 18 -24 27 q-24 -9 -24 -27 v-20 z"
                fill="#1d3a2c" stroke="#59c059" stroke-width="2"/>
          <path d="M66 204 l6 6 l14 -15" fill="none" stroke="#59c059" stroke-width="2.6" stroke-linecap="round"/>
          <text x="75" y="248" font-size="7.5" text-anchor="middle" fill="#59c059" font-family="monospace">filtre actif</text>
        </g>`
    },

    /* Étape 5 — l'algorithme : le compteur, la variable, le signal */
    e5: {
      titres: ['le compteur', 'la variable', 'le signal'],
      dessin: `
        <text x="20" y="42" font-size="8" fill="var(--tel-doux)" font-family="monospace">ALGORITHME</text>

        <g class="casse-1">
          <rect x="20" y="50" width="110" height="30" rx="6" fill="#0e1433" stroke="#ff6b8b" stroke-width="1.5"/>
          <text x="27" y="63" font-size="7" fill="#ffb3c0" font-family="monospace">temps_passé</text>
          <text x="27" y="75" font-size="11" fill="#ff6b8b" font-family="monospace" font-weight="bold">00:47:12</text>
        </g>
        <g class="ok-1">
          <rect x="20" y="50" width="110" height="30" rx="6" fill="#0e1433" stroke="#59c059" stroke-width="1.5"/>
          <text x="27" y="63" font-size="7" fill="#9df09d" font-family="monospace">temps_passé</text>
          <text x="27" y="75" font-size="11" fill="#59c059" font-family="monospace" font-weight="bold">00:00:00</text>
        </g>

        <g class="casse-2">
          <rect x="20" y="96" width="110" height="28" rx="6" fill="#0e1433" stroke="var(--tel-doux)" stroke-width="1.4"/>
          <text x="27" y="108" font-size="7" fill="var(--tel-doux)" font-family="monospace">énergie</text>
          <text x="27" y="119" font-size="10" fill="#ff6b8b" font-family="monospace">non initialisée</text>
        </g>
        <g class="ok-2">
          <rect x="20" y="96" width="110" height="28" rx="6" fill="#0e1433" stroke="#c56bff" stroke-width="1.4"/>
          <text x="27" y="108" font-size="7" fill="#d6a8ff" font-family="monospace">énergie</text>
          <text x="27" y="119" font-size="10" fill="#c56bff" font-family="monospace">mettre à 0 ✓</text>
        </g>

        <g class="casse-3">
          <circle cx="75" cy="180" r="16" fill="none" stroke="var(--tel-doux)" stroke-width="2" opacity=".5"/>
          <path d="M67 172 l16 16 M83 172 l-16 16" stroke="#ff6b8b" stroke-width="2" stroke-linecap="round"/>
          <text x="75" y="216" font-size="7.5" text-anchor="middle" fill="var(--tel-doux)" font-family="monospace">signal bloqué</text>
        </g>
        <g class="ok-3">
          <circle cx="75" cy="180" r="9" fill="#59c059"/>
          <path d="M88 168 a16 16 0 0 1 0 24 M96 161 a25 25 0 0 1 0 38"
                fill="none" stroke="#59c059" stroke-width="1.8" opacity=".85" stroke-linecap="round"/>
          <path d="M62 168 a16 16 0 0 0 0 24 M54 161 a25 25 0 0 0 0 38"
                fill="none" stroke="#59c059" stroke-width="1.8" opacity=".85" stroke-linecap="round"/>
          <text x="75" y="228" font-size="7.5" text-anchor="middle" fill="#59c059" font-family="monospace">envoyé à tous</text>
        </g>`
    }
  };


  /* ------------------------------------------------------------------
     Le fil qui défile — utilisé dans le prologue.
     Au départ il défile tout seul sous le pouce ; passé en mode
     « bloqué », le défilement se fige et le pouce continue dans le vide.
     ------------------------------------------------------------------ */
  function fil() {
    const carte = (y, teinte, i) => `
      <g transform="translate(0 ${y})">
        <rect x="16" y="0" width="118" height="86" rx="8" fill="${teinte}"/>
        ${minois(52, 40, 17)}
        <rect x="76" y="26" width="46" height="6" rx="3" fill="#fff" opacity=".55"/>
        <rect x="76" y="38" width="34" height="6" rx="3" fill="#fff" opacity=".35"/>
        <circle cx="82" cy="62" r="5" fill="#ff3b5c"/>
        <rect x="92" y="59" width="${18 + i * 5}" height="6" rx="3" fill="#fff" opacity=".4"/>
      </g>`;

    // Six cartes, deux teintes en alternance : le motif se répète toutes
    // les deux cartes, ce qui rend la boucle de défilement invisible.
    const teintes = ['#2a2150', '#1e2a56'];
    const cartes = [0, 1, 2, 3, 4, 5]
      .map((i) => carte(28 + i * 94, teintes[i % 2], i)).join('');

    return `<svg viewBox="0 0 150 300" class="tel tel-fil" role="img"
                 aria-label="Un téléphone dont le fil de vidéos défile sans fin sous un pouce.">
      <defs><clipPath id="fil-fenetre"><rect x="9" y="22" width="132" height="258" rx="9"/></clipPath></defs>

      <rect x="1" y="1" width="148" height="298" rx="20"
            fill="var(--tel-coque)" stroke="var(--tel-bord)" stroke-width="2"/>
      <rect x="9" y="22" width="132" height="258" rx="9" fill="var(--tel-ecran)"/>
      <rect x="58" y="8" width="34" height="6" rx="3" fill="var(--tel-bord)"/>

      <g clip-path="url(#fil-fenetre)">
        <g class="tel-fil__defile">${cartes}</g>

        <!-- le pouce qui balaie vers le haut -->
        <g class="tel-fil__pouce">
          <circle cx="104" cy="0" r="13" fill="#fff" opacity=".16"/>
          <circle cx="104" cy="0" r="7" fill="#fff" opacity=".5"/>
        </g>

        <!-- ce qui apparaît une fois l'appli bloquée -->
        <g class="tel-fil__bloc">
          <rect x="9" y="22" width="132" height="258" fill="#0a0e24" opacity=".82"/>
          <g transform="translate(75 132)">
            <circle r="21" fill="none" stroke="#ff6b8b" stroke-width="3"/>
            <path d="M-11 -11 l22 22" stroke="#ff6b8b" stroke-width="3" stroke-linecap="round"/>
          </g>
          <text x="75" y="182" font-size="9.5" text-anchor="middle"
                fill="#ff8fa3" font-family="monospace">impossible</text>
          <text x="75" y="196" font-size="9.5" text-anchor="middle"
                fill="#ff8fa3" font-family="monospace">de fermer</text>
        </g>
      </g>

      <rect x="9" y="22" width="132" height="258" rx="9" fill="none"
            stroke="var(--tel-bord)" stroke-width="1" opacity=".6"/>
    </svg>`;
  }

  /**
   * Fabrique l'aperçu d'une étape.
   * `reparees` est un tableau de trois booléens, dans l'ordre des énigmes.
   */
  function ecran(idEtape, reparees = []) {
    const s = scenes[idEtape];
    if (!s) return '';
    const etat = (i) => (reparees[i] ? '1' : '0');
    return `<svg viewBox="0 0 150 300" class="tel" role="img"
                 data-r1="${etat(0)}" data-r2="${etat(1)}" data-r3="${etat(2)}"
                 aria-label="Aperçu de TokTik : ${reparees.filter(Boolean).length} réglage(s) sur 3 réparé(s)">
      <defs><clipPath id="tel-fenetre"><rect x="9" y="22" width="132" height="258" rx="9"/></clipPath></defs>
      ${chassis(s.dessin)}
    </svg>`;
  }

  /** Le nom des trois réparations d'une étape, pour la légende. */
  function titres(idEtape) {
    return (scenes[idEtape] || {}).titres || [];
  }

  return { ecran, titres, fil };
})();

if (typeof window !== 'undefined') window.Telephone = Telephone;
