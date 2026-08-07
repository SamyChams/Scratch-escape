/* =========================================================
   salles.js — le scénario, les 5 salles et leurs énigmes
   ---------------------------------------------------------
   Types d'énigmes disponibles :
     qcm         → question à choix multiples
     association → relier deux colonnes
     ordre       → remettre des blocs dans le bon ordre
     saisie      → écrire une réponse (nombre ou mot)
     grille      → construire un programme et le faire tourner
     trous       → compléter un script (nombres ou blocs à choisir)

   Personnages utilisables dans les dialogues :
     'pixel'    → le drone allié, celui qui souffle les indices
     'bug'      → le virus, l'antagoniste
     'scratchy' → le chat prisonnier

   NOTE : les corrigés ne sont volontairement PAS dans ce fichier.
   Ils vivent chiffrés dans js/corrige-chiffre.js (voir outils.html).
   Le code de chaque cadenas n'est pas stocké non plus : il est
   reconstitué à partir des chiffres (« fragment ») des énigmes.
   ========================================================= */

/* ------------------------------------------------------------------
   PROLOGUE — joué une seule fois, avant la première salle
   ------------------------------------------------------------------ */
const PROLOGUE = {
  titre: "8 h 47 — salle informatique",
  scenes: [
    { texte: "Ce matin, le vieux serveur du fond de la salle s'est mis à clignoter tout seul. Sur l'écran, trois lettres et trois chiffres : <b>LABO 404</b>. Puis une petite silhouette est apparue, en vol stationnaire…" },
    { qui: 'pixel', texte: "Enfin quelqu'un ! Je suis <b>Pixel</b>, drone de maintenance. Un virus a pris le contrôle du serveur et il a enfermé <b>Scratchy</b> tout au fond, dans le Cœur du Serveur. Moi, je sais réparer des câbles… mais je ne sais pas programmer." },
    { qui: 'bug', texte: "Un humain ? Vraiment ? Cinq salles, cinq cadenas, et pas un seul d'entre vous capable d'aligner trois blocs dans le bon ordre. Va-t'en pendant qu'il en est encore temps." },
    { qui: 'pixel', texte: "Ne l'écoute pas. Chaque salle cache <b>trois énigmes</b>, et chaque énigme résolue te donne <b>un chiffre</b> du cadenas de la porte. Je reste avec toi : si tu bloques, demande-moi un indice, j'en ai deux en réserve à chaque fois. Prêt ?" },
    { qui: 'scratchy', texte: "Miaou… (Traduction de Pixel : « dépêche-toi, il fait froid ici. »)" }
  ]
};

/* ------------------------------------------------------------------
   ÉPILOGUE — après la dernière salle
   ------------------------------------------------------------------ */
const EPILOGUE = {
  scenes: [
    { qui: 'bug', texte: "Non… NON ! Tu n'étais qu'un élève de cinquième ! Comment as-tu pu… les boucles… les variables… tout ça en une heure ?!" },
    { qui: 'pixel', texte: "Parce qu'il ou elle a fait ce que tu n'as jamais su faire : <b>lire le cours</b>, <b>tester</b>, et <b>recommencer quand ça ne marchait pas</b>. C'est ça, programmer." },
    { qui: 'scratchy', texte: "MIAOU ! (Traduction : « merci, tu m'as sauvé. Maintenant, on va coder pour de vrai ? »)" }
  ]
};

const SALLES = [

/* ============================================================ SALLE 1 */
{
  id: 's1',
  numero: 1,
  titre: "Le Hall des Briques",
  icone: '🧱',
  couleur: '#4c97ff',
  memo: ['m1'],

  entree: "La porte du Labo 404 claque derrière toi. Devant : un hall immense, tapissé de briques colorées qui flottent dans le vide. Sur la porte du fond, un cadenas à <b>trois molettes</b>.",
  dialogues: [
    { qui: 'pixel', texte: "Bienvenue dans le hall d'entrée. Avant de courir, il faut savoir <b>où on met les pieds</b> : ici, tout est rangé par couleur, comme dans le vrai Scratch. Trois énigmes, trois chiffres, et la porte s'ouvre." }
  ],
  sortie: "Clac ! Les trois molettes s'alignent. Les briques s'écartent en grinçant et laissent apparaître un long couloir quadrillé.",
  dialoguesSortie: [
    { qui: 'bug', texte: "Un coup de chance. La suite sera moins drôle : sans coordonnées, tu tourneras en rond jusqu'à la nuit." }
  ],

  enigmes: [

    {
      id: 's1e1',
      type: 'association',
      icone: '🎨',
      titre: "Le tableau des couleurs",
      histoire: { qui: 'pixel', texte: "Regarde ce mur : cinq casiers, un par catégorie de blocs. Le virus a arraché toutes les étiquettes de couleur et les a jetées par terre. Remets chaque couleur à sa place et le premier chiffre s'affichera." },
      consigne: "Dans Scratch, chaque catégorie de blocs a <b>sa</b> couleur. Clique sur une catégorie à gauche, puis sur sa couleur à droite pour les relier.",
      paires: [
        { g: 'Mouvement',  d: 'Bleu',        couleur: '#4c97ff' },
        { g: 'Apparence',  d: 'Violet',      couleur: '#9966ff' },
        { g: 'Événements', d: 'Jaune',       couleur: '#ffbf00' },
        { g: 'Contrôle',   d: 'Orange',      couleur: '#ffab19' },
        { g: 'Opérateurs', d: 'Vert',        couleur: '#59c059' }
      ],
      fragment: '4',
      explication: "Connaître les couleurs fait gagner un temps fou : quand on cherche « répéter », on sait qu'il faut regarder dans l'orange (Contrôle).",
      indices: [
        "Les blocs qui font <b>bouger</b> le lutin sont de la même couleur que le ciel.",
        "Contrôle (répéter, si… alors) est <b>orange</b>, Événements (le drapeau vert) est <b>jaune</b>. Ce sont les deux plus faciles à confondre."
      ]
    },

    {
      id: 's1e2',
      type: 'qcm',
      icone: '🏳',
      titre: "Qui démarre le script ?",
      histoire: { texte: "Au centre du hall, un pupitre de commande. Quatre blocs y sont posés, mais un seul accepte de se brancher sur la prise du haut — celle marquée d'un drapeau vert." },
      consigne: "Un script doit se lancer <b>quand on clique sur le drapeau vert</b>. Quel bloc faut-il placer tout en haut ?",
      options: [
        { bloc: { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' }, correct: true },
        { bloc: { cat: 'mouvement', texte: 'avancer de {10} pas' }, retour: "Ce bloc fait bien avancer le lutin, mais il ne dit pas <b>quand</b> le script démarre." },
        { bloc: { cat: 'controle', texte: 'attendre {1} secondes' }, retour: "Celui-ci met le programme en pause. Il ne peut pas le déclencher." },
        { bloc: { cat: 'variables', texte: 'mettre {score} à {0}' }, retour: "Très utile pour préparer une partie… mais ce n'est pas un bloc chapeau." }
      ],
      fragment: '9',
      explication: "Les blocs <b>chapeaux</b> (arrondis en haut, catégorie Événements) sont les seuls capables de démarrer un script.",
      indices: [
        "Cherche le bloc qui a une forme différente des autres : arrondi sur le dessus.",
        "Il est <b>jaune</b> : c'est la couleur de la catégorie Événements."
      ]
    },

    {
      id: 's1e3',
      type: 'ordre',
      icone: '🔢',
      titre: "Le script mélangé",
      histoire: { qui: 'bug', texte: "Ce petit script d'accueil ? Je l'ai secoué comme une boîte de Lego. Les blocs sont tous là, bien sûr… mais dans le désordre. Amuse-toi bien." },
      consigne: "Le virus a mélangé ce script ! Remets les blocs dans l'ordre pour que Scratchy se place au centre, dise « Bonjour ! », puis avance.",
      blocs: [
        { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' },
        { cat: 'mouvement',  texte: 'aller à x: {0} y: {0}' },
        { cat: 'apparence',  texte: 'dire {Bonjour !} pendant {2} secondes' },
        { cat: 'mouvement',  texte: 'avancer de {100} pas' }
      ],
      fragment: '1',
      explication: "Un script s'exécute <b>de haut en bas</b> : l'ordre des blocs change complètement le résultat.",
      indices: [
        "Quel bloc a une forme de chapeau ? Il ne peut aller qu'à une seule place : tout en haut.",
        "Relis la consigne dans l'ordre : se placer au centre, puis parler, puis avancer."
      ]
    }
  ]
},

/* ============================================================ SALLE 2 */
{
  id: 's2',
  numero: 2,
  titre: "Le Couloir des Coordonnées",
  icone: '🧭',
  couleur: '#5cb1d6',
  memo: ['m2'],

  entree: "Le sol du couloir est un immense quadrillage lumineux. Au plafond, deux règles graduées : l'une horizontale marquée <b>x</b>, l'autre verticale marquée <b>y</b>.",
  dialogues: [
    { qui: 'pixel', texte: "Attention où tu marches : les dalles éteintes sont des trous. Ici, on ne se déplace pas « un peu vers la droite », on donne des <b>coordonnées précises</b>. Exactement comme sur la scène de Scratch." }
  ],
  sortie: "Le quadrillage s'éteint dalle après dalle derrière toi. Au bout du couloir, une salle tapissée de miroirs qui répètent ton reflet à l'infini.",
  dialoguesSortie: [
    { qui: 'pixel', texte: "Bien joué ! Tu viens de faire ce que fait un lutin à chaque bloc « avancer » : regarder dans quelle direction il est tourné, <b>puis</b> bouger." }
  ],

  enigmes: [

    {
      id: 's2e1',
      type: 'qcm',
      icone: '🎯',
      titre: "Le point zéro",
      histoire: { texte: "Au milieu du couloir, une dalle plus brillante que les autres pulse doucement. Gravé dessus : « <i>Je suis le point d'où tout part. Sais-tu me nommer ?</i> »" },
      consigne: "Quelles sont les coordonnées du <b>centre exact</b> de la scène de Scratch ?",
      options: [
        { texte: 'x = 0 et y = 0', correct: true },
        { texte: 'x = 1 et y = 1', retour: "Presque ! Mais en informatique comme en maths, le centre d'un repère c'est zéro, pas un." },
        { texte: 'x = 240 et y = 180', retour: "Là, tu es dans le <b>coin en haut à droite</b> de la scène : ce sont les valeurs maximales." },
        { texte: 'x = -240 et y = -180', retour: "Là, tu es dans le <b>coin en bas à gauche</b> : ce sont les valeurs minimales." }
      ],
      fragment: '2',
      explication: "La scène mesure 480 pas de large (de -240 à 240) et 360 pas de haut (de -180 à 180). Son centre est donc le point (0 ; 0).",
      indices: [
        "Pense au repère vu en mathématiques : où se croisent les deux axes ?",
        "x va de -240 à +240. Quelle valeur est pile au milieu ?"
      ]
    },

    {
      id: 's2e2',
      type: 'saisie',
      icone: '➕',
      titre: "Le calcul du gardien",
      histoire: { qui: 'bug', texte: "Un petit calcul avant de passer. Ton chat était en x = -50 quand je l'ai attrapé, et je l'ai poussé avec ce bloc. Où a-t-il atterri ? Réponds… ou reste ici." },
      consigne: "Scratchy se trouve en <b>x = -50</b>. On exécute le bloc ci-dessous. Quelle est sa <b>nouvelle</b> abscisse x ?",
      script: [
        { cat: 'mouvement', texte: 'ajouter {120} à x' }
      ],
      reponses: ['70', '+70'],
      champ: { placeholder: 'x = ?', largeur: 130 },
      fragment: '7',
      explication: "« ajouter 120 à x » ne remplace pas x : il l'augmente. -50 + 120 = <b>70</b>. Le lutin s'est déplacé de 120 pas vers la droite.",
      indices: [
        "Le bloc <b>ajoute</b> : il faut calculer -50 + 120.",
        "Sur une droite graduée, pars de -50 et avance de 120 vers la droite. Tu passes par 0 après 50 pas… il en reste 70."
      ]
    },

    {
      id: 's2e3',
      type: 'grille',
      icone: '🐈',
      titre: "Le labyrinthe du couloir",
      histoire: { qui: 'pixel', texte: "Voilà le vrai passage : des dalles, des murs, et une porte tout au fond. Je peux téléguider ce petit Scratchy de secours, mais <b>uniquement avec des blocs</b>. Construis-lui le programme, et surtout : n'oublie pas qu'il avance là où il <i>regarde</i>." },
      consigne: "Construis un programme pour amener Scratchy jusqu'à la porte 🚪. Clique sur les blocs de la palette pour les ajouter, puis lance le programme.",
      grille: {
        largeur: 5, hauteur: 4,
        depart: { x: 0, y: 3, dir: 'E' },
        sortie: { x: 4, y: 0 },
        murs: [[2, 1], [2, 2], [2, 3]]
      },
      palette: [
        { op: 'avancer', bloc: { cat: 'mouvement', texte: 'avancer de {1} case' } },
        { op: 'droite',  bloc: { cat: 'mouvement', texte: 'tourner ↻ de {90} degrés' } },
        { op: 'gauche',  bloc: { cat: 'mouvement', texte: 'tourner ↺ de {90} degrés' } }
      ],
      maxBlocs: 16,
      fragment: '0',
      explication: "Bravo ! « avancer » déplace le lutin <b>dans la direction où il regarde</b> : il faut donc penser à tourner avant d'avancer. C'est exactement le principe du bloc « avancer de 10 pas ».",
      indices: [
        "Scratchy regarde vers la <b>droite</b> au départ. Un mur bloque la colonne du milieu : il faut passer par le <b>haut</b>.",
        "Une solution : avancer 1 fois, tourner ↺ (vers le haut), avancer 3 fois, tourner ↻ (vers la droite), avancer 3 fois."
      ]
    }
  ]
},

/* ============================================================ SALLE 3 */
{
  id: 's3',
  numero: 3,
  titre: "La Salle des Miroirs",
  icone: '🔁',
  couleur: '#ffab19',
  memo: ['m3'],

  entree: "Mille miroirs répètent ton image encore et encore, jusqu'à l'infini. Gravé dans l'un d'eux, en lettres tremblantes : « <i>Pourquoi écrire cent fois la même chose quand on peut la répéter ?</i> »",
  dialogues: [
    { qui: 'bug', texte: "Ma salle préférée. Ici, les paresseux gagnent : celui qui recopie cent fois le même bloc reste coincé, celui qui trouve la <b>boucle</b> passe. Tu es plutôt du genre à recopier, non ?" }
  ],
  sortie: "Les miroirs se figent, puis explosent en une pluie de pixels colorés. Derrière eux : une porte blindée, couverte d'interrupteurs marqués « SI » et « SINON ».",
  dialoguesSortie: [
    { qui: 'pixel', texte: "Trois blocs au lieu de vingt. Tu viens de comprendre pourquoi tous les programmeurs adorent les boucles !" }
  ],

  enigmes: [

    {
      id: 's3e1',
      type: 'qcm',
      icone: '♻',
      titre: "Le reflet identique",
      histoire: { texte: "Devant toi, deux miroirs. Le premier affiche un script tout en longueur. Le second est vide, et attend son <b>reflet exact</b> — en plus court." },
      consigne: "Voici un script du virus :",
      script: [
        { cat: 'mouvement', texte: 'avancer de {10} pas' },
        { cat: 'mouvement', texte: 'avancer de {10} pas' },
        { cat: 'mouvement', texte: 'avancer de {10} pas' },
        { cat: 'mouvement', texte: 'avancer de {10} pas' }
      ],
      question: "Quel script utilise une <b>boucle</b> pour faire exactement la même chose ?",
      options: [
        { pile: [{ cat: 'controle', texte: 'répéter {4} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {10} pas' }] }], correct: true },
        { pile: [{ cat: 'controle', texte: 'répéter {10} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {4} pas' }] }], retour: "Attention, tu as inversé les nombres : ce script avance 10 fois de 4 pas. Le lutin parcourt bien 40 pas, mais en 10 étapes au lieu de 4 : l'animation est différente." },
        { pile: [{ cat: 'mouvement', texte: 'avancer de {40} pas' }], retour: "Le lutin arrive au même endroit, c'est vrai… mais d'un seul coup, et surtout <b>sans boucle</b> : ce n'est pas ce qui était demandé." },
        { pile: [{ cat: 'controle', texte: 'répéter indéfiniment', corps: [{ cat: 'mouvement', texte: 'avancer de {10} pas' }] }], retour: "Celui-là ne s'arrête jamais ! Le lutin filerait jusqu'au bord de la scène et y resterait collé." }
      ],
      fragment: '3',
      explication: "Répéter <b>4 fois</b> le bloc « avancer de 10 pas », c'est exactement le script de départ, mais en trois blocs au lieu de quatre. Avec 100 répétitions, le gain devient énorme.",
      indices: [
        "Compte combien de fois le bloc est écrit dans le script du virus.",
        "Le nombre de répétitions va dans le bloc « répéter … fois », pas dans « avancer de … pas »."
      ]
    },

    {
      id: 's3e2',
      type: 'saisie',
      icone: '⭐',
      titre: "L'angle du pentagone",
      histoire: { qui: 'pixel', texte: "Au sol, une étoile à cinq branches est en train de se dessiner toute seule… mais elle s'arrête à chaque virage et attend un angle. Sans le bon nombre de degrés, la figure ne se refermera jamais." },
      consigne: "Pour tracer un <b>pentagone</b> (5 côtés), on répète 5 fois : avancer, puis tourner. De combien de <b>degrés</b> faut-il tourner à chaque fois ?",
      script: [
        { cat: 'controle', texte: 'répéter {5} fois', corps: [
          { cat: 'mouvement', texte: 'avancer de {80} pas' },
          { cat: 'mouvement', texte: 'tourner ↻ de {?} degrés' }
        ]}
      ],
      reponses: ['72', '72°', '72 degrés'],
      champ: { placeholder: '… degrés', largeur: 150 },
      fragment: '6',
      explication: "Pour un polygone régulier à <i>n</i> côtés, on tourne de <b>360 ÷ n</b> degrés. Ici : 360 ÷ 5 = <b>72°</b>. (Carré : 90°, triangle : 120°.)",
      indices: [
        "En faisant le tour complet de la figure, le lutin tourne en tout de <b>360°</b>.",
        "Ces 360° sont partagés en 5 virages identiques : calcule 360 ÷ 5."
      ]
    },

    {
      id: 's3e3',
      type: 'trous',
      icone: '🔧',
      titre: "Le script à trous",
      histoire: { qui: 'bug', texte: "J'ai gardé le programme de sortie, mais j'ai effacé les deux nombres des boucles. Bonne chance pour deviner : il y a mille combinaisons possibles… ou une seule, si tu sais compter les cases." },
      consigne: "Complète les deux nombres manquants pour que Scratchy atteigne la porte 🚪, puis lance le programme pour vérifier.",
      script: [
        { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' },
        { cat: 'controle', texte: 'répéter {?0} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {1} case' }] },
        { cat: 'mouvement', texte: 'tourner ↺ de {90} degrés' },
        { cat: 'controle', texte: 'répéter {?1} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {1} case' }] }
      ],
      trous: [
        { type: 'nombre', reponse: 4 },
        { type: 'nombre', reponse: 4 }
      ],
      grille: {
        largeur: 5, hauteur: 5,
        depart: { x: 0, y: 4, dir: 'E' },
        sortie: { x: 4, y: 0 },
        murs: [[1, 2], [2, 2], [3, 2]]
      },
      programme: (v) => [
        { op: 'repeter', n: v[0], corps: [{ op: 'avancer' }] },
        { op: 'tourner', sens: 'g' },
        { op: 'repeter', n: v[1], corps: [{ op: 'avancer' }] }
      ],
      fragment: '5',
      explication: "Deux boucles suffisent là où il fallait huit blocs « avancer ». Et si le couloir faisait 50 cases, il n'y aurait qu'un nombre à changer !",
      indices: [
        "Compte les cases : combien y en a-t-il entre Scratchy et le bord droit ? Puis entre ce coin et la porte ?",
        "Le lutin part vers la droite. Il doit avancer de <b>4</b> cases, tourner vers le haut, puis avancer encore de <b>4</b> cases."
      ]
    }
  ]
},

/* ============================================================ SALLE 4 */
{
  id: 's4',
  numero: 4,
  titre: "Le Laboratoire des Choix",
  icone: '🔀',
  couleur: '#59c059',
  memo: ['m4'],

  entree: "Deux couloirs, deux portes — une verte, une rouge — et entre les deux, un panneau d'aiguillage géant en forme d'hexagone qui clignote.",
  dialogues: [
    { qui: 'pixel', texte: "Ici, plus rien n'est automatique : le labo <b>pose une question</b> avant chaque passage, et t'envoie à gauche ou à droite selon la réponse. C'est exactement ce que fait le bloc <b>si… alors… sinon</b>." },
    { qui: 'bug', texte: "SI tu réponds juste, ALORS tu passes. SINON… tu recommences. Encore. Et encore." }
  ],
  sortie: "L'aiguillage bascule dans un grand fracas métallique et la porte verte s'ouvre. Derrière : un escalier qui descend vers le cœur du serveur. La dernière salle.",
  dialoguesSortie: [
    { qui: 'pixel', texte: "Descends doucement… il est juste en dessous. Et cette fois, il ne rigolera plus." }
  ],

  enigmes: [

    {
      id: 's4e1',
      type: 'qcm',
      icone: '⌨',
      titre: "Et si on n'appuie sur rien ?",
      histoire: { texte: "Une trappe est encastrée dans le plafond. À côté, un clavier avec une seule touche géante : ESPACE. Un écran affiche le script qui la contrôle." },
      consigne: "Observe ce script :",
      script: [
        { cat: 'controle', texte: 'si {#} alors',
          condition: { cat: 'capteurs', forme: 'booleen', texte: 'touche {=espace} pressée ?' },
          corps: [{ cat: 'mouvement', texte: 'ajouter {50} à y' }] }
      ],
      question: "Que se passe-t-il si le joueur <b>n'appuie sur aucune touche</b> ?",
      options: [
        { texte: "Rien du tout : le lutin ne bouge pas et le programme continue.", correct: true },
        { texte: "Le lutin monte quand même de 50.", retour: "Non : les blocs à l'intérieur du « si » ne s'exécutent <b>que</b> si la condition est vraie." },
        { texte: "Le programme s'arrête avec une erreur.", retour: "Rassure-toi, Scratch ne plante pas : une condition fausse fait simplement sauter les blocs du « si »." },
        { texte: "Le lutin descend de 50.", retour: "Il faudrait un bloc « sinon » avec « ajouter -50 à y » pour cela. Ici, il n'y a pas de « sinon »." }
      ],
      fragment: '8',
      explication: "Avec un <b>si… alors</b> sans « sinon », il y a deux issues : soit la condition est vraie et les blocs s'exécutent, soit elle est fausse et le programme les <b>ignore</b>.",
      indices: [
        "Regarde bien : y a-t-il un bloc « sinon » dans ce script ?",
        "Les blocs placés à l'intérieur du C ne se déclenchent que lorsque l'hexagone répond « vrai »."
      ]
    },

    {
      id: 's4e2',
      type: 'qcm',
      icone: '⚖',
      titre: "Le piège du gardien",
      histoire: { qui: 'bug', texte: "Approche, approche. Un simple test, un seul. Ton score est de 10 — pile 10, pas un de plus. Alors dis-moi : ce petit programme va-t-il te féliciter… ou se moquer de toi ?" },
      consigne: "La variable <b>score</b> vaut exactement <b>10</b>. On exécute :",
      script: [
        { cat: 'controle', texte: 'si {#} alors',
          condition: { cat: 'operateurs', forme: 'booleen', texte: '{score} > {10}' },
          corps:  [{ cat: 'apparence', texte: 'dire {Gagné !}' }],
          corps2: [{ cat: 'apparence', texte: 'dire {Perdu…}' }] }
      ],
      question: "Que dit Scratchy ?",
      options: [
        { texte: '« Perdu… »', correct: true },
        { texte: '« Gagné ! »', retour: "Piège ! Le symbole > signifie « <b>strictement</b> plus grand que ». Or 10 n'est pas plus grand que 10." },
        { texte: "Les deux, l'un après l'autre.", retour: "Impossible : avec un « si… sinon », un seul des deux chemins est suivi." },
        { texte: "Rien, car la condition est fausse.", retour: "Attention, il y a un bloc <b>sinon</b> : quand la condition est fausse, ce sont ses blocs à lui qui s'exécutent." }
      ],
      fragment: '1',
      explication: "10 > 10 est <b>faux</b>. Le programme suit donc la branche « sinon » et affiche « Perdu… ». Pour que 10 gagne, il faudrait écrire <i>score > 9</i>.",
      indices: [
        "Pose-toi la question : est-ce que 10 est <b>strictement</b> plus grand que 10 ?",
        "La condition est fausse. Dans un « si… sinon », que fait le programme quand la condition est fausse ?"
      ]
    },

    {
      id: 's4e3',
      type: 'trous',
      icone: '🎮',
      titre: "Le pilotage de Scratchy",
      histoire: { qui: 'pixel', texte: "La porte verte s'ouvre à distance, avec cette manette. Sauf que le virus a arraché deux blocs du programme de pilotage : celui qui <b>écoute le clavier</b> et celui qui <b>fait bouger</b>. Répare-le et on sort d'ici." },
      consigne: "Complète ce script pour que Scratchy se déplace <b>vers la droite</b> tant qu'on appuie sur la flèche droite. Clique sur un emplacement en pointillés, puis choisis le bon bloc.",
      script: [
        { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' },
        { cat: 'controle', texte: 'répéter indéfiniment', corps: [
          { cat: 'controle', texte: 'si {?0} alors', corps: [{ trou: 1 }] }
        ]}
      ],
      trous: [
        { type: 'choix', reponse: 0, choix: [
          { cat: 'capteurs',   forme: 'booleen', texte: 'touche {=flèche droite} pressée ?' },
          { cat: 'capteurs',   forme: 'booleen', texte: 'touche {=flèche gauche} pressée ?' },
          { cat: 'operateurs', forme: 'booleen', texte: '{x} = {0}' }
        ]},
        { type: 'choix', reponse: 0, choix: [
          { cat: 'mouvement', texte: 'ajouter {10} à x' },
          { cat: 'mouvement', texte: 'ajouter {-10} à x' },
          { cat: 'mouvement', texte: 'ajouter {10} à y' }
        ]}
      ],
      fragment: '4',
      explication: "C'est le script de déplacement le plus utilisé dans les jeux : une boucle <b>infinie</b> qui surveille le clavier, et un <b>test</b> qui déclenche le mouvement.",
      indices: [
        "L'hexagone doit tester la <b>flèche droite</b> : c'est un bloc bleu clair de la catégorie Capteurs.",
        "Aller vers la droite, c'est <b>augmenter x</b>. Ajouter 10 déplace vers la droite, ajouter -10 vers la gauche."
      ]
    }
  ]
},

/* ============================================================ SALLE 5 */
{
  id: 's5',
  numero: 5,
  titre: "Le Cœur du Serveur",
  icone: '💾',
  couleur: '#ff8c1a',
  memo: ['m5', 'm6'],

  entree: "Tu y es. Des câbles pulsent comme des veines le long des murs et, au centre de la pièce, une cage de lumière jaune. À l'intérieur : <b>Scratchy</b>.",
  dialogues: [
    { qui: 'scratchy', texte: "Miaou !! (Traduction de Pixel : « JE SAVAIS que tu viendrais ! »)" },
    { qui: 'bug', texte: "Assez ! Tu ne connais pas mes <b>variables</b>, petit humain. Trois dernières énigmes, et je te garantis que tu resteras coincé sur la première." },
    { qui: 'pixel', texte: "Une variable, c'est juste une boîte avec une étiquette. Garde ça en tête et suis la valeur pas à pas. On y est presque !" }
  ],
  sortie: "Le Bug se disloque en mille pixels qui retombent en pluie. La cage de lumière s'éteint… et Scratchy bondit dans tes bras en ronronnant.",
  dialoguesSortie: [],

  enigmes: [

    {
      id: 's5e1',
      type: 'saisie',
      icone: '📦',
      titre: "La boîte du Bug",
      histoire: { qui: 'bug', texte: "Voici la serrure de la cage : une variable que je remplis moi-même. Dis-moi combien elle vaut à la fin, sans te tromper d'une seule unité. Et attention où tu regardes : tout n'est pas dans la boucle." },
      consigne: "Le Bug exécute ce script. <b>Que vaut la variable <i>énergie</i></b> à la fin ?",
      script: [
        { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' },
        { cat: 'variables',  texte: 'mettre {énergie} à {0}' },
        { cat: 'controle',   texte: 'répéter {3} fois', corps: [{ cat: 'variables', texte: 'ajouter {5} à {énergie}' }] },
        { cat: 'variables',  texte: 'ajouter {1} à {énergie}' }
      ],
      reponses: ['16'],
      champ: { placeholder: 'énergie = ?', largeur: 160 },
      fragment: '5',
      explication: "On part de 0. La boucle ajoute 5 trois fois : 0 → 5 → 10 → 15. Puis le dernier bloc ajoute encore 1 : <b>16</b>. Le bloc final est <b>en dehors</b> de la boucle, il ne s'exécute donc qu'une seule fois.",
      indices: [
        "Écris la valeur de la variable étape par étape, comme un tableau : 0, puis…",
        "Attention : le dernier « ajouter 1 » est <b>sous</b> la boucle, pas dedans. Il ne compte qu'une fois : 15 + 1."
      ]
    },

    {
      id: 's5e2',
      type: 'qcm',
      icone: '📡',
      titre: "Le signal de libération",
      histoire: { qui: 'pixel', texte: "Trois lutins-gardiens bloquent la cage. Si tu les écartes un par un, les autres se remettent en place aussitôt : il faut qu'ils bougent <b>tous les trois en même temps</b>. Il existe un bloc exactement pour ça." },
      consigne: "Scratchy est enfermé par trois lutins-gardiens qui doivent tous s'écarter <b>en même temps</b>. Quel bloc permet de leur donner le signal ?",
      options: [
        { bloc: { cat: 'evenements', texte: 'envoyer à tous {=libération}' }, correct: true },
        { bloc: { cat: 'apparence', texte: 'dire {Poussez-vous !}' }, retour: "Cela affiche seulement une bulle de texte à l'écran : les autres lutins ne « lisent » pas les bulles !" },
        { bloc: { cat: 'controle', texte: 'attendre {3} secondes' }, retour: "Attendre ne prévient personne : le programme fait juste une pause." },
        { bloc: { cat: 'variables', texte: 'mettre {libération} à {1}' }, retour: "Astucieux, mais il faudrait alors que chaque gardien surveille la variable en boucle. Le message est fait exactement pour ça." }
      ],
      fragment: '2',
      explication: "« envoyer à tous » diffuse un <b>message</b>. Tous les lutins qui possèdent un chapeau « quand je reçois <i>libération</i> » démarrent leur script en même temps.",
      indices: [
        "Cherche un bloc <b>jaune</b> : la communication, c'est la catégorie Événements.",
        "Le bloc qui reçoit s'appelle « quand je reçois … ». Comment s'appelle celui qui envoie ?"
      ]
    },

    {
      id: 's5e3',
      type: 'ordre',
      icone: '🔓',
      titre: "Le programme de délivrance",
      histoire: { qui: 'pixel', texte: "Dernière ligne droite ! J'ai récupéré les cinq blocs du programme de libération dans les décombres, mais ils sont en vrac. Remets-les dans l'ordre et Scratchy est libre." },
      consigne: "Voici le programme qui libère Scratchy. Remets-le dans l'ordre : préparer le compteur, le remplir, donner le signal, puis fêter ça !",
      blocs: [
        { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' },
        { cat: 'variables',  texte: 'mettre {énergie} à {0}' },
        { cat: 'controle',   texte: 'répéter {10} fois', corps: [{ cat: 'variables', texte: 'ajouter {10} à {énergie}' }] },
        { cat: 'evenements', texte: 'envoyer à tous {=libération}' },
        { cat: 'apparence',  texte: 'dire {Je suis libre !} pendant {2} secondes' }
      ],
      fragment: '6',
      explication: "C'est la structure de presque tous les programmes : <b>démarrer</b> (chapeau), <b>initialiser</b> les variables, <b>agir</b> (boucle), puis <b>prévenir</b> les autres.",
      indices: [
        "Le chapeau jaune arrondi va toujours tout en haut.",
        "On met la variable à 0 <b>avant</b> de la remplir, sinon on compterait par-dessus l'ancienne partie."
      ]
    }
  ]
}

];

/** Le code d'un cadenas est la suite des chiffres de ses énigmes. */
function codeSalle(salle) {
  return salle.enigmes.map((e) => e.fragment).join('');
}

if (typeof window !== 'undefined') {
  window.SALLES = SALLES;
  window.PROLOGUE = PROLOGUE;
  window.EPILOGUE = EPILOGUE;
  window.codeSalle = codeSalle;
}
