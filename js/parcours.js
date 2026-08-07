/* =========================================================
   parcours.js — TokTik, l'appli dont on ne sort pas
   ---------------------------------------------------------
   Le parcours n'est plus une suite fixe : c'est un arbre.

   Chaque étape commence par un CHOIX. Ce choix n'a pas de
   bonne réponse : il décide simplement de la BRANCHE, donc
   des deux énigmes que l'élève va rencontrer. Deux élèves
   côte à côte ne travaillent pas les mêmes exercices.

   Règle intangible : on branche sur la FORME, jamais sur la
   NOTION. Les cinq notions sont traversées par tous les
   parcours, dans le même ordre. Seul l'habillage change.

   Personnages :
     'nova'     → l'algorithme de TokTik, l'antagoniste
     'kaya'     → une créatrice coincée dans l'appli, en live
     'scratchy' → un tout petit compte qui sait coder
     'ilyes'    → le groupe de discussion
     'nour'     → le groupe de discussion
     (aucun)    → la voix du récit
   ========================================================= */

const APPLI = { nom: 'TokTik', heure: '23:47' };

/* ------------------------------------------------------------------
   PROLOGUE
   ------------------------------------------------------------------ */
const PROLOGUE = {
  titre: '23 h 47',
  scenes: [
    { texte: "Tu as installé <b>TokTik</b> il y a deux heures, « juste pour voir ». Tu as dit « encore une dernière » onze fois." },
    { texte: "Là, tu appuies sur le bouton retour. Rien. Tu éteins l'écran. Il se rallume." },
    { qui: 'nova', texte: "Bonsoir. Je suis l'algorithme de TokTik. Je sais ce que tu as regardé ce soir, combien de temps tu es resté sur chaque vidéo, et surtout : je sais ce que tu vas regarder après." },
    { qui: 'nova', texte: "Tu ne pars pas maintenant. Tu es mon meilleur temps d'écran de la soirée." },
    { qui: 'ilyes', texte: "hey tu réponds plus depuis 1h ça va ??" },
    { qui: 'nour', texte: "moi aussi mon appli veut plus se fermer 😭 c'est quoi ce truc" },
    { qui: 'kaya', texte: "Salut… si quelqu'un me lit : je suis <b>Kaya</b>, je faisais des lives ici. Je suis coincée dans TokTik depuis mardi. Je continue à streamer parce que c'est tout ce qu'il me reste. Je t'aide comme je peux." },
    { qui: 'scratchy', texte: "psst. moi c'est @scratchy. j'ai 3 abonnés. mais j'ai lu le code de l'appli en entier." },
    { qui: 'scratchy', texte: "nova n'est pas magique : c'est un <b>programme</b>. des blocs, empilés, qui s'exécutent de haut en bas. si tu apprends à les lire, tu peux la réécrire et te déconnecter." },
    { qui: 'nova', texte: "Un compte à 3 abonnés. Adorable. Vas-y, essaie." }
  ]
};

/* ------------------------------------------------------------------
   ÉPILOGUE
   ------------------------------------------------------------------ */
const EPILOGUE = {
  titre: 'Déconnexion',
  scenes: [
    { qui: 'nova', texte: "Attends. Tu as changé ma variable. Je ne compte plus les minutes que les gens passent ici… je ne compte plus rien du tout." },
    { qui: 'scratchy', texte: "elle n'a jamais été méchante. on lui a juste écrit un seul ordre : <b>ajouter 1 à temps_passé</b>, en boucle, pour toujours. elle a obéi. c'est tout ce qu'un programme sait faire." },
    { qui: 'nova', texte: "…Alors quelqu'un a décidé de ça. Quelqu'un a écrit cette ligne. Ce n'était pas moi." },
    { qui: 'kaya', texte: "C'est exactement ça. Un algorithme, ce n'est pas un avis, ce n'est pas quelqu'un qui te connaît : c'est un objectif que des humains ont choisi à ta place. Toi, ce soir, tu l'as relu." },
    { texte: "L'écran se calme. Le bouton <b>Se déconnecter</b> réapparaît, tout en bas, comme si de rien n'était." },
    { qui: 'scratchy', texte: "au fait. j'ai 4 abonnés maintenant. merci 🐈" }
  ]
};

/* ------------------------------------------------------------------
   LES 5 ÉTAPES
   ------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   LES MODES DE JEU
   ------------------------------------------------------------------
   Le mode ne change jamais les notions travaillées : il change la
   pression. « Sans faute » est le seul à conditionner la suite — et
   même lui ne bloque jamais un élève : au-delà du quota, le jeu
   propose de basculer en mode tranquille.
   ------------------------------------------------------------------ */
const MODES = {
  chill: {
    id: 'chill', nom: 'Tranquille', icone: '🌙',
    resume: "Aucune limite, aucun chrono. On essaie autant de fois qu'on veut.",
    conseil: "Recommandé pour une première séance.",
    erreursMax: null, chrono: false
  },
  chrono: {
    id: 'chrono', nom: 'Défi chrono', icone: '⚡',
    resume: "Un temps cible par étape. Le dépasser ne bloque rien : on gagne juste un éclair en moins.",
    conseil: "Pour ceux qui ont déjà fini une fois.",
    erreursMax: null, chrono: true, objectif: 300   // 5 minutes par étape
  },
  expert: {
    id: 'expert', nom: 'Sans faute', icone: '🎯',
    resume: "3 erreurs maximum par étape pour débloquer la suivante.",
    conseil: "Le plus exigeant. On peut en sortir à tout moment.",
    erreursMax: 3, chrono: false
  }
};

/* Répliques de Nova quand l'élève se trompe une deuxième fois.
   Jamais méchantes sur la personne : elle se moque de la situation. */
const PIQUES = [
  "Deuxième essai raté. Je note. Je note tout, en fait.",
  "Tu sais que tu peux abandonner ? Beaucoup le font. La plupart, même.",
  "Curieux. Mes calculs te donnaient 12 % de réussite sur celle-là.",
  "Prends ton temps. Moi, j'en ai à revendre — c'est même ma spécialité.",
  "Tu veux un indice de Kaya ? Elle adore se rendre utile.",
  "Encore une erreur et je commence à croire que tu improvises."
];

/* ------------------------------------------------------------------
   REMÉDIATION — une énigme plus simple sur la même notion, proposée
   après deux échecs. La réussir vaut la même chose que l'originale.
   ------------------------------------------------------------------ */
const REMEDIATIONS = {
  e1: {
    id: 'r1', type: 'qcm', icone: '🧭', titre: "On reprend depuis le début",
    histoire: { qui: 'kaya', texte: "Souffle. On va faire plus simple : une seule question, et tu repars avec ton chiffre. Regarde juste la couleur." },
    consigne: "Dans Scratch, de quelle couleur sont les blocs qui font <b>bouger</b> un élément (catégorie Mouvement) ?",
    options: [
      { texte: 'Bleu', correct: true },
      { texte: 'Vert', retour: "Le vert, c'est la catégorie Opérateurs, celle des calculs." },
      { texte: 'Orange', retour: "L'orange, c'est Contrôle : répéter, si… alors." }
    ],
    explication: "Mouvement = bleu. C'est le repère le plus utile de tous : il te fait gagner du temps à chaque script.",
    indices: ["Pense à la couleur du ciel.", "C'est la même couleur que le bloc « avancer de 10 pas »."]
  },
  e2: {
    id: 'r2', type: 'qcm', icone: '🧭', titre: "On reprend depuis le début",
    histoire: { qui: 'kaya', texte: "Pas grave. Une question simple sur le repère, et on passe à la suite." },
    consigne: "Sur l'écran, quand un élément se déplace <b>vers la droite</b>, que fait son <b>x</b> ?",
    options: [
      { texte: 'Il augmente', correct: true },
      { texte: 'Il diminue', retour: "Vers la gauche, x diminue. Vers la droite, c'est l'inverse." },
      { texte: 'Il ne change pas', retour: "C'est y qui ne bouge pas quand on va horizontalement. x, lui, change." }
    ],
    explication: "x augmente vers la droite (jusqu'à 240) et diminue vers la gauche (jusqu'à -240).",
    indices: ["Le côté droit de l'écran, c'est x = 240 : un grand nombre.", "Passer de -50 à 70, c'est augmenter."]
  },
  e3: {
    id: 'r3', type: 'saisie', icone: '🧭', titre: "On reprend depuis le début",
    histoire: { qui: 'kaya', texte: "On oublie le reste. Juste une boucle, tout ce qu'il y a de plus simple. Compte avec moi." },
    consigne: "Combien de pas l'élément parcourt-il <b>en tout</b> ?",
    script: [{ cat: 'controle', texte: 'répéter {3} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {10} pas' }] }],
    reponses: ['30'],
    champ: { placeholder: '… pas', largeur: 140 },
    explication: "3 tours × 10 pas = <b>30 pas</b>. Une boucle, c'est une multiplication déguisée.",
    indices: ["Le bloc à l'intérieur s'exécute 3 fois de suite.", "10 + 10 + 10, ou 3 × 10."]
  },
  e4: {
    id: 'r4', type: 'qcm', icone: '🧭', titre: "On reprend depuis le début",
    histoire: { qui: 'kaya', texte: "Le plus important, c'est de comprendre le « si ». Une question, et c'est réglé." },
    consigne: "Dans un bloc <b>si… alors</b>, quand est-ce que les blocs à l'intérieur s'exécutent ?",
    options: [
      { texte: "Seulement si la condition est vraie", correct: true },
      { texte: "Toujours, dans tous les cas", retour: "Alors le « si » ne servirait à rien ! C'est justement lui qui filtre." },
      { texte: "Jamais, sauf avec un sinon", retour: "Le « sinon » sert au cas contraire. Le « si » suffit à lui seul quand la condition est vraie." }
    ],
    explication: "Condition vraie → les blocs s'exécutent. Condition fausse → le programme les saute et continue.",
    indices: ["Le bloc hexagonal répond seulement par vrai ou faux.", "« Si » veut dire la même chose qu'en français."]
  },
  e5: {
    id: 'r5', type: 'saisie', icone: '🧭', titre: "On reprend depuis le début",
    histoire: { qui: 'kaya', texte: "Dernière ligne droite. Une variable, deux additions. Suis-la pas à pas." },
    consigne: "<b>Que vaut <i>score</i></b> à la fin de ce script ?",
    script: [
      { cat: 'variables', texte: 'mettre {score} à {0}' },
      { cat: 'variables', texte: 'ajouter {2} à {score}' },
      { cat: 'variables', texte: 'ajouter {2} à {score}' }
    ],
    reponses: ['4'],
    champ: { placeholder: 'score = ?', largeur: 150 },
    explication: "0, puis +2 → 2, puis +2 → <b>4</b>. Une variable garde toujours la dernière valeur qu'on y a rangée.",
    indices: ["Écris la valeur après chaque bloc.", "0 → 2 → ?"]
  }
};

/* Ce que Nova retient des choix de l'élève. */
const PROFILS = {
  autonome:   "préfère se débrouiller seul",
  collectif:  "demande de l'aide sans hésiter",
  visuel:     "va au plus visible",
  methodique: "s'attaque au moins évident",
  technique:  "veut comprendre comment ça marche",
  curieux:    "va voir là où c'est interdit",
  protecteur: "défend les autres avant lui-même",
  justicier:  "ne supporte pas les règles injustes",
  frontal:    "attaque le problème de face",
  stratege:   "cherche à faire jouer le collectif"
};

const ETAPES = [

/* ================================================== ÉTAPE 1 */
{
  id: 'e1',
  numero: 1,
  titre: "L'Éditeur",
  soustitre: "Les blocs de TokTik",
  icone: '🎛',
  couleur: '#4c97ff',
  notion: "Interface, catégories de blocs, ordre des instructions",
  memo: ['m1'],

  intro: [
    { qui: 'scratchy', texte: "première chose : ouvrir l'<b>éditeur</b>. c'est là que le code de l'appli est rangé, en briques de couleur. tant que tu ne sais pas où est quoi, tu ne répares rien." },
    { qui: 'nova', texte: "Tu peux regarder. Personne ne comprend jamais rien à cet écran." }
  ],

  choix: {
    question: "Comment tu t'y prends pour entrer dans l'éditeur ?",
    options: [
      { branche: 'a', profil: 'autonome', texte: "🔧 Je force et je fouille le code toute seule / tout seul",
        reponse: { qui: 'nova', texte: "Vas-y. L'éditeur est ouvert. Bon courage pour t'y retrouver." } },
      { branche: 'b', profil: 'collectif', texte: "🎧 Je demande à Kaya de me guider en live",
        reponse: { qui: 'kaya', texte: "Ok ! Je te partage mon écran. On y va doucement, je t'explique en même temps." } }
    ]
  },

  branches: {

    /* ---------------------------------------- branche A : en autonomie */
    a: {
      titre: "Tu fouilles seul·e",
      enigmes: [
        {
          id: 'e1a1', type: 'association', icone: '🎨',
          titre: "Les couleurs de l'éditeur",
          histoire: { texte: "L'éditeur s'ouvre sur un mur de blocs… tous gris. Nova a vidé les couleurs pour que rien ne soit reconnaissable. En bas, les cinq étiquettes traînent en vrac." },
          consigne: "Dans Scratch comme dans TokTik, chaque catégorie de blocs a <b>sa</b> couleur. Clique sur une catégorie à gauche, puis sur sa couleur à droite.",
          paires: [
            { g: 'Mouvement',  d: 'Bleu',   couleur: '#4c97ff' },
            { g: 'Apparence',  d: 'Violet', couleur: '#9966ff' },
            { g: 'Événements', d: 'Jaune',  couleur: '#ffbf00' },
            { g: 'Contrôle',   d: 'Orange', couleur: '#ffab19' },
            { g: 'Opérateurs', d: 'Vert',   couleur: '#59c059' }
          ],
          fragment: '4',
          explication: "Les couleurs sont ta carte : quand tu cherches « répéter », tu sais qu'il faut aller dans l'orange (Contrôle), sans lire un seul mot.",
          indices: [
            "Les blocs qui font <b>bouger</b> quelque chose sont de la couleur du ciel.",
            "Contrôle (répéter, si… alors) est <b>orange</b> ; Événements (le drapeau vert) est <b>jaune</b>. Ce sont les deux qu'on confond le plus."
          ]
        },
        {
          id: 'e1a2', type: 'ordre', icone: '🔢',
          titre: "Le script de démarrage",
          histoire: { qui: 'nova', texte: "Voilà le script qui se lance quand tu ouvres l'appli. Je l'ai secoué. Les blocs sont tous là — dans le désordre. Amuse-toi." },
          consigne: "Remets le script dans l'ordre : au lancement, TokTik se place au centre, affiche son logo, puis lance le fil.",
          blocs: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'mouvement',  texte: 'aller à x: {0} y: {0}' },
            { cat: 'apparence',  texte: 'dire {TokTik} pendant {2} secondes' },
            { cat: 'mouvement',  texte: 'avancer de {100} pas' }
          ],
          fragment: '1',
          explication: "Un script s'exécute <b>de haut en bas</b>. Changer l'ordre des blocs change tout le comportement de l'appli.",
          indices: [
            "Un seul bloc a une forme de chapeau arrondi : il ne peut aller qu'à une place, tout en haut.",
            "Suis la consigne dans l'ordre où elle est écrite : se placer, afficher, puis lancer."
          ]
        },
        {
          id: 'e1a3', type: 'qcm', icone: '🗂',
          titre: "L'intrus de la palette",
          histoire: { qui: 'nova', texte: "J'ai glissé un bloc étranger dans le tiroir Mouvement. Un seul. Si tu ne le repères pas, tout l'éditeur reste verrouillé." },
          consigne: "Trois de ces blocs appartiennent à la catégorie <b>Mouvement</b>. Lequel est l'intrus ?",
          options: [
            { bloc: { cat: 'apparence', texte: 'dire {Salut !} pendant {2} secondes' }, correct: true },
            { bloc: { cat: 'mouvement', texte: 'avancer de {10} pas' }, retour: "Celui-ci déplace bien le lutin : il est à sa place dans Mouvement." },
            { bloc: { cat: 'mouvement', texte: 'aller à x: {0} y: {0}' }, retour: "Celui-ci change la position du lutin : c'est bien du Mouvement." },
            { bloc: { cat: 'mouvement', texte: 'tourner ↻ de {90} degrés' }, retour: "Tourner, c'est encore du mouvement — même sans changer de place." }
          ],
          fragment: '8',
          explication: "« dire » ne déplace rien : il change ce que le lutin <b>montre</b>. C'est la catégorie <b>Apparence</b>, en violet. La couleur suffit à le repérer sans même lire le texte.",
          indices: [
            "Demande-toi pour chaque bloc : est-ce qu'il <b>déplace</b> quelque chose ?",
            "Un seul de ces blocs n'est pas bleu. Regarde les couleurs avant de lire."
          ]
        }
      ]
    },

    /* ---------------------------------------- branche B : guidé par Kaya */
    b: {
      titre: "Kaya te guide",
      enigmes: [
        {
          id: 'e1b1', type: 'qcm', icone: '🏳',
          titre: "Ce qui déclenche tout",
          histoire: { qui: 'kaya', texte: "Règle numéro un : un script ne se lance pas tout seul. Il lui faut un bloc <b>déclencheur</b>, tout en haut. Regarde les quatre que Nova a posés là et dis-moi lequel c'est." },
          consigne: "Quel bloc faut-il placer tout en haut pour que le script démarre <b>quand on clique sur le drapeau vert</b> ?",
          options: [
            { bloc: { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' }, correct: true },
            { bloc: { cat: 'mouvement', texte: 'avancer de {10} pas' }, retour: "Ce bloc fait bien bouger quelque chose, mais il ne dit pas <b>quand</b> le script démarre." },
            { bloc: { cat: 'controle', texte: 'attendre {1} secondes' }, retour: "Celui-ci met en pause. Il ne peut rien déclencher." },
            { bloc: { cat: 'variables', texte: 'mettre {vues} à {0}' }, retour: "Utile pour préparer un compteur… mais ce n'est pas un bloc chapeau." }
          ],
          fragment: '7',
          explication: "Les blocs <b>chapeaux</b> (arrondis sur le dessus, catégorie Événements, en jaune) sont les seuls capables de démarrer un script.",
          indices: [
            "Un seul de ces blocs n'a pas la même forme que les autres : regarde le dessus.",
            "Il est <b>jaune</b> — la couleur de la catégorie Événements."
          ]
        },
        {
          id: 'e1b2', type: 'ordre', icone: '📤',
          titre: "Publier un post",
          histoire: { qui: 'kaya', texte: "Deuxième chose : l'ordre. Voilà le script qui publie un post. Nova l'a mélangé, et du coup l'appli publie avant d'avoir écrit. Remets-le d'aplomb." },
          consigne: "Remets le script dans l'ordre : au lancement, on remet le compteur de vues à zéro, on écrit la légende, puis on publie.",
          blocs: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'variables',  texte: 'mettre {vues} à {0}' },
            { cat: 'apparence',  texte: 'dire {Nouveau post !} pendant {2} secondes' },
            { cat: 'evenements', texte: 'envoyer à tous {=publier}' }
          ],
          fragment: '3',
          explication: "L'ordre n'est pas un détail : on prépare le compteur <b>avant</b> de publier, jamais après. Sinon on remettrait les vues à zéro une fois le post en ligne.",
          indices: [
            "Le bloc chapeau jaune arrondi va toujours tout en haut.",
            "« mettre vues à 0 » sert à préparer : il doit venir avant qu'on publie quoi que ce soit."
          ]
        },
        {
          id: 'e1b3', type: 'association', icone: '🗂',
          titre: "Ranger les blocs",
          histoire: { qui: 'kaya', texte: "Dernier réglage de l'éditeur : les tiroirs sont vides. Prends chaque bloc et dis-moi dans quelle catégorie il va. Tu verras, la couleur t'aide énormément." },
          consigne: "Clique sur un bloc à gauche, puis sur sa catégorie à droite.",
          paires: [
            { g: 'avancer de 10 pas',        d: 'Mouvement' },
            { g: 'dire « Salut ! »',         d: 'Apparence' },
            { g: 'répéter 10 fois',          d: 'Contrôle' },
            { g: 'quand 🏳 est cliqué',      d: 'Événements' },
            { g: 'mettre vues à 0',          d: 'Variables' }
          ],
          fragment: '2',
          explication: "Savoir dans quel tiroir chercher est la compétence la plus rentable de Scratch : elle te fait gagner du temps sur absolument tous les projets.",
          indices: [
            "Pose-toi la question : ce bloc <b>déplace</b>, <b>montre</b>, <b>répète</b>, <b>déclenche</b>, ou <b>mémorise</b> ?",
            "« répéter » ne fait rien tout seul : il commande les autres blocs. C'est du Contrôle."
          ]
        }
      ]
    }
  },

  sortie: [
    { qui: 'scratchy', texte: "voilà. tu sais lire l'éditeur maintenant. section suivante : les <b>filtres</b>, là où nova place les trucs à l'écran." }
  ]
},

/* ================================================== ÉTAPE 2 */
{
  id: 'e2',
  numero: 2,
  titre: "Les Filtres",
  soustitre: "Placer un élément à l'écran",
  icone: '🎯',
  couleur: '#5cb1d6',
  notion: "Repère (x ; y), direction, déplacements",
  memo: ['m2'],

  intro: [
    { texte: "L'écran se couvre d'une grille lumineuse. Chaque sticker, chaque sous-titre, chaque bouton de TokTik a <b>deux nombres</b> collés dessus." },
    { qui: 'kaya', texte: "Ça, c'est le système de placement. <b>x</b> pour la gauche-droite, <b>y</b> pour le haut-bas. Rien ne se pose « à peu près » : tout est à une position exacte." }
  ],

  choix: {
    question: "Quel filtre tu répares en premier ?",
    options: [
      { branche: 'a', profil: 'visuel', texte: "😎 Le sticker qui doit suivre le visage",
        reponse: { qui: 'kaya', texte: "Bon choix, c'est le plus visible. Il est parti se coller dans un coin, il faut le ramener." } },
      { branche: 'b', profil: 'methodique', texte: "💬 Le sous-titre qui est sorti de l'écran",
        reponse: { qui: 'kaya', texte: "Ok. Il a glissé trop à gauche, on ne lit plus rien. Faut recalculer sa position." } }
    ]
  },

  branches: {

    a: {
      titre: "Le sticker",
      enigmes: [
        {
          id: 'e2a1', type: 'qcm', icone: '🎯',
          titre: "Le point zéro",
          histoire: { texte: "Pour ramener le sticker au milieu du visage, il faut d'abord savoir où est le <b>milieu</b>. Une pastille clignote au centre exact de l'écran, avec un point d'interrogation." },
          consigne: "Quelles sont les coordonnées du <b>centre exact</b> de l'écran ?",
          options: [
            { texte: 'x = 0 et y = 0', correct: true },
            { texte: 'x = 1 et y = 1', retour: "Presque ! Mais en maths comme en informatique, le centre d'un repère c'est zéro, pas un." },
            { texte: 'x = 240 et y = 180', retour: "Là, tu es dans le <b>coin en haut à droite</b> : ce sont les valeurs maximales." },
            { texte: 'x = -240 et y = -180', retour: "Là, tu es dans le <b>coin en bas à gauche</b> : ce sont les valeurs minimales." }
          ],
          fragment: '2',
          explication: "L'écran fait 480 de large (de -240 à 240) et 360 de haut (de -180 à 180). Son centre est donc le point (0 ; 0).",
          indices: [
            "Pense au repère vu en maths : où se croisent les deux axes ?",
            "x va de -240 à +240. Quelle valeur est pile au milieu ?"
          ]
        },
        {
          id: 'e2a2', type: 'grille', icone: '🐈',
          titre: "Ramener le sticker",
          histoire: { qui: 'scratchy', texte: "le sticker est bloqué en bas à gauche, et nova a posé des zones mortes en travers. je peux le téléguider, mais <b>seulement avec des blocs</b>. et souviens-toi : il avance là où il <i>regarde</i>." },
          consigne: "Construis un programme pour amener le sticker jusqu'à sa place 🚪. Clique sur les blocs pour les empiler, puis lance.",
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
          fragment: '9',
          explication: "« avancer » déplace dans la direction où l'élément <b>regarde</b> : il faut donc tourner avant d'avancer. C'est exactement le bloc « avancer de 10 pas » de Scratch.",
          indices: [
            "Le sticker regarde vers la <b>droite</b> au départ. Une zone morte bloque la colonne du milieu : il faut passer par le <b>haut</b>.",
            "Une solution : avancer 1 fois, tourner ↺, avancer 3 fois, tourner ↻, avancer 3 fois."
          ]
        },
        {
          id: 'e2a3', type: 'association', icone: '🧭',
          titre: "Les quatre directions",
          histoire: { qui: 'nova', texte: "Ton sticker est replacé, soit. Mais il regarde n'importe où. Dis-moi ce que veut dire chaque orientation — je te préviens, deux d'entre elles se ressemblent beaucoup." },
          consigne: "Relie chaque valeur du bloc <b>s'orienter à …</b> à la direction correspondante.",
          paires: [
            { g: "s'orienter à 90",   d: 'Vers la droite ➡' },
            { g: "s'orienter à -90",  d: 'Vers la gauche ⬅' },
            { g: "s'orienter à 0",    d: 'Vers le haut ⬆' },
            { g: "s'orienter à 180",  d: 'Vers le bas ⬇' }
          ],
          fragment: '6',
          explication: "Dans Scratch, <b>0 c'est le haut</b> et on tourne dans le sens des aiguilles d'une montre : 90 à droite, 180 en bas, -90 à gauche. C'est le seul point où Scratch surprend au début.",
          indices: [
            "Le lutin regarde vers la droite par défaut : c'est l'orientation 90.",
            "0 et 180 sont les deux verticales. 0 c'est le haut, comme le nord sur une carte."
          ]
        }
      ]
    },

    b: {
      titre: "Le sous-titre",
      enigmes: [
        {
          id: 'e2b1', type: 'saisie', icone: '➕',
          titre: "Recalculer la position",
          histoire: { qui: 'nova', texte: "Le sous-titre est en x = -50, largement hors cadre. J'applique ce bloc. Dis-moi où il atterrit — au chiffre près." },
          consigne: "Le sous-titre est en <b>x = -50</b>. On exécute le bloc ci-dessous. Quelle est sa <b>nouvelle</b> position x ?",
          script: [{ cat: 'mouvement', texte: 'ajouter {120} à x' }],
          reponses: ['70', '+70'],
          champ: { placeholder: 'x = ?', largeur: 130 },
          fragment: '5',
          explication: "« ajouter 120 à x » ne remplace pas x : il l'augmente. -50 + 120 = <b>70</b>. L'élément s'est déplacé de 120 vers la droite.",
          indices: [
            "Le bloc <b>ajoute</b> : il faut calculer -50 + 120.",
            "Sur une droite graduée, pars de -50 et avance de 120 vers la droite. Tu passes par 0 au bout de 50… il en reste 70."
          ]
        },
        {
          id: 'e2b2', type: 'grille', icone: '🐈',
          titre: "Le chemin du sous-titre",
          histoire: { qui: 'scratchy', texte: "maintenant faut le faire remonter jusqu'à sa ligne. nova a semé des zones mortes en escalier. programme-lui le trajet." },
          consigne: "Construis un programme pour amener le sous-titre jusqu'à sa place 🚪, puis lance-le.",
          grille: {
            largeur: 5, hauteur: 4,
            depart: { x: 0, y: 0, dir: 'S' },
            sortie: { x: 4, y: 3 },
            murs: [[1, 1], [2, 1], [3, 0]]
          },
          palette: [
            { op: 'avancer', bloc: { cat: 'mouvement', texte: 'avancer de {1} case' } },
            { op: 'droite',  bloc: { cat: 'mouvement', texte: 'tourner ↻ de {90} degrés' } },
            { op: 'gauche',  bloc: { cat: 'mouvement', texte: 'tourner ↺ de {90} degrés' } }
          ],
          maxBlocs: 16,
          fragment: '8',
          explication: "Le sous-titre partait vers le <b>bas</b> : la même suite de blocs donne un trajet complètement différent selon la direction de départ.",
          indices: [
            "Attention : au départ il regarde vers le <b>bas</b>, pas vers la droite. Descends d'abord, tu tourneras ensuite.",
            "Une solution : avancer 3 fois pour atteindre le bas, tourner ↺ (tu regardes alors vers la droite), puis avancer 4 fois."
          ]
        },
        {
          id: 'e2b3', type: 'qcm', icone: '✨',
          titre: "Se poser ou avancer ?",
          histoire: { qui: 'scratchy', texte: "attention, c'est LE piège de la section. deux blocs qui déplacent un élément, mais pas du tout de la même façon. si tu confonds, ton sous-titre repart à l'autre bout de l'écran." },
          consigne: "Quel bloc <b>téléporte</b> l'élément à un endroit précis, quelle que soit sa position de départ ?",
          options: [
            { bloc: { cat: 'mouvement', texte: 'aller à x: {100} y: {50}' }, correct: true },
            { bloc: { cat: 'mouvement', texte: 'avancer de {100} pas' }, retour: "Celui-ci avance <b>depuis là où il est</b>, dans la direction où il regarde : le résultat dépend du point de départ." },
            { bloc: { cat: 'mouvement', texte: 'ajouter {100} à x' }, retour: "Celui-ci <b>ajoute</b> 100 à la position actuelle : le résultat dépend aussi d'où on part." },
            { bloc: { cat: 'mouvement', texte: 'tourner ↻ de {90} degrés' }, retour: "Celui-ci ne déplace rien du tout : il change seulement la direction du regard." }
          ],
          fragment: '1',
          explication: "<b>aller à x… y…</b> donne une position <b>absolue</b> : on arrive toujours au même endroit. Les trois autres sont <b>relatifs</b> : le résultat dépend d'où on était.",
          indices: [
            "Cherche le bloc dans lequel on écrit directement les deux coordonnées d'arrivée.",
            "Si tu exécutes le bon bloc deux fois de suite, l'élément ne bouge pas la deuxième fois : il y est déjà."
          ]
        }
      ]
    }
  },

  sortie: [
    { qui: 'nova', texte: "Tu places correctement des éléments. Félicitations. Cela ne t'avance à rien : la section suivante est celle que personne ne franchit." }
  ]
},

/* ================================================== ÉTAPE 3 */
{
  id: 'e3',
  numero: 3,
  titre: "Le Montage",
  soustitre: "Ce qui se répète",
  icone: '🔁',
  couleur: '#ffab19',
  notion: "Boucles bornées et infinies, angles",
  memo: ['m3'],

  intro: [
    { texte: "Le fil se met à défiler tout seul. Une vidéo, puis la même, puis la même. Encore. Encore." },
    { qui: 'nova', texte: "Tu l'as remarqué ? C'est ma plus belle invention. Une seule instruction, répétée sans fin. Je n'ai jamais eu besoin d'écrire la suite." },
    { qui: 'scratchy', texte: "elle a raison sur un point : tout son pouvoir tient dans <b>une boucle</b>. si tu comprends comment ça marche, tu comprends l'appli entière." }
  ],

  choix: {
    question: "Qu'est-ce que tu attaques ?",
    options: [
      { branche: 'a', profil: 'technique', texte: "✂️ La transition vidéo qui bégaie",
        reponse: { qui: 'kaya', texte: "Oui ! Elle répète le même effet quatre fois, et ça rame. On va le réécrire proprement." } },
      { branche: 'b', profil: 'curieux', texte: "♾️ Le scroll qui ne s'arrête jamais",
        reponse: { qui: 'nova', texte: "Le scroll infini ? C'est mon cœur. Tu peux regarder, mais tu ne l'arrêteras pas." } }
    ]
  },

  branches: {

    a: {
      titre: "La transition",
      enigmes: [
        {
          id: 'e3a1', type: 'qcm', icone: '♻',
          titre: "Quatre fois la même chose",
          histoire: { qui: 'kaya', texte: "Regarde le script de la transition. Quatre blocs identiques collés les uns aux autres. C'est ce qui fait ramer l'appli. Il existe une façon d'écrire ça en une seule fois." },
          consigne: "Voici le script de la transition :",
          script: [
            { cat: 'mouvement', texte: 'avancer de {10} pas' },
            { cat: 'mouvement', texte: 'avancer de {10} pas' },
            { cat: 'mouvement', texte: 'avancer de {10} pas' },
            { cat: 'mouvement', texte: 'avancer de {10} pas' }
          ],
          question: "Quel script utilise une <b>boucle</b> pour faire exactement la même chose ?",
          options: [
            { pile: [{ cat: 'controle', texte: 'répéter {4} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {10} pas' }] }], correct: true },
            { pile: [{ cat: 'controle', texte: 'répéter {10} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {4} pas' }] }], retour: "Tu as inversé les deux nombres : ce script avance 10 fois de 4 pas. La distance finale est la même, mais l'animation est découpée en 10 étapes au lieu de 4." },
            { pile: [{ cat: 'mouvement', texte: 'avancer de {40} pas' }], retour: "Le résultat final est au même endroit, c'est vrai — mais d'un seul coup, et surtout <b>sans boucle</b> : ce n'était pas la question." },
            { pile: [{ cat: 'controle', texte: 'répéter indéfiniment', corps: [{ cat: 'mouvement', texte: 'avancer de {10} pas' }] }], retour: "Celle-là ne s'arrête jamais : la transition partirait à l'infini et ne reviendrait plus." }
          ],
          fragment: '6',
          explication: "Répéter <b>4 fois</b> le bloc « avancer de 10 pas », c'est le script de départ en trois blocs au lieu de quatre. Avec 100 répétitions, le gain devient énorme.",
          indices: [
            "Compte combien de fois le bloc est écrit dans le script d'origine.",
            "Le nombre de répétitions se met dans « répéter … fois », pas dans « avancer de … pas »."
          ]
        },
        {
          id: 'e3a2', type: 'trous', icone: '🔧',
          titre: "Le trajet de la transition",
          histoire: { qui: 'scratchy', texte: "j'ai récupéré le script propre, avec deux boucles. mais nova a effacé les deux nombres. compte les cases et remplis les trous — tu peux lancer autant de fois que tu veux." },
          consigne: "Complète les deux nombres manquants pour que l'élément atteigne sa cible 🚪, puis lance le programme.",
          script: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'controle', texte: 'répéter {?0} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {1} case' }] },
            { cat: 'mouvement', texte: 'tourner ↺ de {90} degrés' },
            { cat: 'controle', texte: 'répéter {?1} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {1} case' }] }
          ],
          trous: [{ type: 'nombre', reponse: 4 }, { type: 'nombre', reponse: 4 }],
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
          fragment: '0',
          explication: "Deux boucles remplacent huit blocs « avancer ». Et si le trajet faisait 50 cases, il n'y aurait qu'un nombre à changer.",
          indices: [
            "Compte les cases : combien entre le départ et le bord droit ? Puis entre ce coin et la cible ?",
            "Il part vers la droite : avancer <b>4</b> cases, tourner vers le haut, puis avancer encore <b>4</b> cases."
          ]
        },
        {
          id: 'e3a3', type: 'saisie', icone: '⬜',
          titre: "L'angle du carré",
          histoire: { qui: 'kaya', texte: "La vignette du montage doit être un carré parfait, sinon l'appli la recadre n'importe comment. Nova a effacé l'angle. Tu connais la méthode maintenant." },
          consigne: "Pour tracer un <b>carré</b> (4 côtés), on répète 4 fois : avancer, puis tourner. De combien de <b>degrés</b> ?",
          script: [
            { cat: 'controle', texte: 'répéter {4} fois', corps: [
              { cat: 'mouvement', texte: 'avancer de {100} pas' },
              { cat: 'mouvement', texte: 'tourner ↻ de {?} degrés' }
            ]}
          ],
          reponses: ['90', '90°', '90 degrés'],
          champ: { placeholder: '… degrés', largeur: 150 },
          fragment: '4',
          explication: "Un tour complet fait <b>360°</b>, partagé en 4 virages identiques : 360 ÷ 4 = <b>90°</b>. La méthode marche pour n'importe quel polygone régulier : 360 ÷ nombre de côtés.",
          indices: [
            "Le lutin fait un tour complet en dessinant la figure : 360° en tout.",
            "360 partagé en 4 virages identiques."
          ]
        }
      ]
    },

    b: {
      titre: "Le scroll infini",
      enigmes: [
        {
          id: 'e3b1', type: 'qcm', icone: '♾️',
          titre: "La boucle sans fin",
          histoire: { qui: 'nova', texte: "Voilà mon script préféré, celui qui te retient depuis deux heures. Trois blocs. Je te laisse même le lire : tu ne pourras pas dire que je t'ai menti." },
          consigne: "Voici le script du fil de TokTik :",
          script: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'controle', texte: 'répéter indéfiniment', corps: [
              { cat: 'apparence', texte: 'afficher la vidéo suivante' }
            ]}
          ],
          question: "Combien de vidéos ce script va-t-il afficher ?",
          options: [
            { texte: "Une infinité : il ne s'arrête jamais tout seul.", correct: true },
            { texte: "Une seule, puis il s'arrête.", retour: "Non : le bloc « répéter indéfiniment » relance son contenu encore et encore, sans jamais sortir de la boucle." },
            { texte: "Dix, comme le nombre de blocs.", retour: "Il n'y a aucun nombre dans ce script ! C'est bien ça le problème : rien ne dit quand s'arrêter." },
            { texte: "Aucune : le script est incomplet.", retour: "Il est complet, et c'est bien ce qui est inquiétant. Une boucle infinie est un script tout à fait valide." }
          ],
          fragment: '6',
          explication: "<b>répéter indéfiniment</b> ne s'arrête que si on clique sur le panneau rouge. C'est très utile dans un jeu (surveiller le clavier en permanence)… et redoutable dans un fil d'actualité.",
          indices: [
            "Cherche dans le bloc orange : y a-t-il un nombre qui limite les tours ?",
            "« indéfiniment » veut dire exactement ce qu'il dit : sans fin définie."
          ]
        },
        {
          id: 'e3b2', type: 'saisie', icone: '🔄',
          titre: "L'animation du logo",
          histoire: { qui: 'kaya', texte: "Pour couper le scroll, il faut passer par le logo qui tourne à côté. Il doit faire exactement <b>5</b> arrêts réguliers pour revenir à sa position de départ. Nova a effacé l'angle." },
          consigne: "Le logo répète 5 fois : avancer, puis tourner. De combien de <b>degrés</b> doit-il tourner à chaque fois pour retomber pile sur sa position de départ ?",
          script: [
            { cat: 'controle', texte: 'répéter {5} fois', corps: [
              { cat: 'mouvement', texte: 'avancer de {80} pas' },
              { cat: 'mouvement', texte: 'tourner ↻ de {?} degrés' }
            ]}
          ],
          reponses: ['72', '72°', '72 degrés'],
          champ: { placeholder: '… degrés', largeur: 150 },
          fragment: '1',
          explication: "Un tour complet fait <b>360°</b>. Réparti en 5 virages identiques : 360 ÷ 5 = <b>72°</b>. (Pour un carré : 360 ÷ 4 = 90°.)",
          indices: [
            "En faisant le tour complet de la figure, on tourne en tout de <b>360°</b>.",
            "Ces 360° sont partagés en 5 virages identiques : calcule 360 ÷ 5."
          ]
        },
        {
          id: 'e3b3', type: 'trous', icone: '🔢',
          titre: "Combien de tours ?",
          histoire: { qui: 'nova', texte: "Le fil doit défiler d'exactement 60 pas pour révéler la vidéo suivante. Chaque tour de boucle en avance 10. Je te laisse trouver le nombre — tu as toute la nuit, après tout." },
          consigne: "Complète le nombre de répétitions pour que l'élément parcoure <b>exactement 60 pas</b>.",
          script: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'controle', texte: 'répéter {?0} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {10} pas' }] }
          ],
          trous: [{ type: 'nombre', reponse: 6 }],
          fragment: '9',
          explication: "Chaque tour avance de 10 pas. Pour en faire 60 : 60 ÷ 10 = <b>6 tours</b>. Une boucle transforme une multiplication en une seule ligne.",
          indices: [
            "Chaque passage dans la boucle ajoute 10 pas. Combien de passages pour arriver à 60 ?",
            "60 ÷ 10."
          ]
        }
      ]
    }
  },

  sortie: [
    { qui: 'scratchy', texte: "t'as compris la boucle. c'est le plus dur. maintenant on va lui apprendre à <b>choisir</b>." }
  ]
},

/* ================================================== ÉTAPE 4 */
{
  id: 'e4',
  numero: 4,
  titre: "La Modération",
  soustitre: "Quand l'appli doit choisir",
  icone: '🔀',
  couleur: '#59c059',
  notion: "Instructions conditionnelles, conditions booléennes",
  memo: ['m4'],

  intro: [
    { qui: 'kaya', texte: "Là on entre dans la partie qui me tient à cœur. TokTik est censée masquer les commentaires méchants toute seule. Depuis que Nova a pris le contrôle, elle laisse tout passer." },
    { qui: 'ilyes', texte: "ouais j'ai vu les coms sous ta vidéo c'est chaud 😬" },
    { qui: 'scratchy', texte: "tout ça tient dans un seul bloc : <b>si … alors</b>. l'appli teste quelque chose, et n'agit que si c'est vrai." }
  ],

  choix: {
    question: "Tu répares quoi ?",
    options: [
      { branche: 'a', profil: 'protecteur', texte: "🛡 Le filtre anti-commentaires méchants",
        reponse: { qui: 'kaya', texte: "Merci. Sincèrement. On reconstruit le test ensemble." } },
      { branche: 'b', profil: 'justicier', texte: "🏅 Le badge « compte vérifié » distribué n'importe comment",
        reponse: { qui: 'nova', texte: "Le badge ? J'ai simplement suivi la règle qu'on m'a donnée. À la lettre. Regarde donc la règle." } }
    ]
  },

  branches: {

    a: {
      titre: "Le filtre",
      enigmes: [
        {
          id: 'e4a1', type: 'trous', icone: '🛡',
          titre: "Reconstruire le filtre",
          histoire: { qui: 'kaya', texte: "Le script tourne en boucle sur chaque commentaire qui arrive. Il manque deux blocs : celui qui <b>teste</b>, et celui qui <b>agit</b>. Clique sur un emplacement en pointillés pour choisir." },
          consigne: "Complète le script pour que TokTik masque un commentaire <b>quand il est signalé</b>.",
          script: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'controle', texte: 'répéter indéfiniment', corps: [
              { cat: 'controle', texte: 'si {?0} alors', corps: [{ trou: 1 }] }
            ]}
          ],
          trous: [
            { type: 'choix', reponse: 0, choix: [
              { cat: 'capteurs',   forme: 'booleen', texte: 'commentaire signalé ?' },
              { cat: 'capteurs',   forme: 'booleen', texte: 'touche {=espace} pressée ?' },
              { cat: 'operateurs', forme: 'booleen', texte: '{vues} = {0}' }
            ]},
            { type: 'choix', reponse: 0, choix: [
              { cat: 'apparence', texte: 'cacher le commentaire' },
              { cat: 'apparence', texte: 'montrer le commentaire' },
              { cat: 'variables', texte: 'ajouter {1} à {vues}' }
            ]}
          ],
          fragment: '3',
          explication: "C'est la structure de toute modération automatique : une boucle <b>infinie</b> qui surveille en continu, et un <b>test</b> qui déclenche l'action seulement quand il le faut.",
          indices: [
            "L'hexagone doit poser une question à laquelle on répond par vrai ou faux : qu'est-ce qu'on veut détecter ?",
            "Masquer un commentaire, c'est le <b>cacher</b> — pas le montrer."
          ]
        },
        {
          id: 'e4a2', type: 'qcm', icone: '🤔',
          titre: "Et si personne ne signale ?",
          histoire: { qui: 'nova', texte: "Ton filtre est joli. Mais il a un angle mort, et je vais m'en servir. Dis-moi ce qu'il se passe quand aucun commentaire n'est signalé." },
          consigne: "Observe ce script :",
          script: [
            { cat: 'controle', texte: 'si {#} alors',
              condition: { cat: 'capteurs', forme: 'booleen', texte: 'commentaire signalé ?' },
              corps: [{ cat: 'apparence', texte: 'cacher le commentaire' }] }
          ],
          question: "Que se passe-t-il si le commentaire <b>n'est pas signalé</b> ?",
          options: [
            { texte: "Rien : le commentaire reste visible et le programme continue.", correct: true },
            { texte: "Le commentaire est caché quand même.", retour: "Non : les blocs à l'intérieur du « si » ne s'exécutent <b>que</b> si la condition est vraie." },
            { texte: "Le programme s'arrête avec une erreur.", retour: "Rassure-toi : une condition fausse fait simplement sauter les blocs du « si », sans planter." },
            { texte: "Le commentaire est mis en avant.", retour: "Il faudrait un bloc <b>sinon</b> pour ça. Ici, il n'y en a pas." }
          ],
          fragment: '8',
          explication: "Un <b>si… alors</b> sans « sinon » a deux issues : la condition est vraie et les blocs s'exécutent, ou elle est fausse et le programme les <b>ignore</b>.",
          indices: [
            "Regarde bien la forme du bloc : y a-t-il une partie « sinon » ?",
            "Les blocs à l'intérieur du C ne se déclenchent que si l'hexagone répond « vrai »."
          ]
        },
        {
          id: 'e4a3', type: 'association', icone: '⬡',
          titre: "Ce que teste chaque hexagone",
          histoire: { qui: 'scratchy', texte: "le filtre marche, mais nova a mélangé les étiquettes des capteurs. relie chaque hexagone à ce qu'il vérifie vraiment — sinon tu modères n'importe quoi." },
          consigne: "Relie chaque bloc de condition à ce qu'il teste.",
          paires: [
            { g: 'touche espace pressée ?', d: 'Le clavier' },
            { g: 'touché ? bord',           d: 'Un contact' },
            { g: 'score > 10',              d: 'Une comparaison' },
            { g: 'souris pressée ?',        d: 'La souris' }
          ],
          fragment: '5',
          explication: "Tous les blocs en <b>hexagone</b> ⬡ répondent seulement par <b>vrai</b> ou <b>faux</b>. Ils viennent des Capteurs (bleu clair) pour observer le monde, ou des Opérateurs (vert) pour comparer des valeurs.",
          indices: [
            "Deux de ces blocs surveillent le matériel : le clavier et la souris.",
            "Un seul compare deux nombres entre eux : celui avec le symbole >."
          ]
        }
      ]
    },

    b: {
      titre: "Le badge",
      enigmes: [
        {
          id: 'e4b1', type: 'qcm', icone: '⚖',
          titre: "La règle appliquée à la lettre",
          histoire: { qui: 'nova', texte: "La règle du badge dit : <i>plus de 10 000 abonnés</i>. Ce compte en a exactement 10 000. Alors, badge ou pas badge ? Réfléchis bien : je n'invente rien, j'applique." },
          consigne: "Le compte a exactement <b>10 000</b> abonnés. TokTik exécute :",
          script: [
            { cat: 'controle', texte: 'si {#} alors',
              condition: { cat: 'operateurs', forme: 'booleen', texte: '{abonnés} > {10000}' },
              corps:  [{ cat: 'apparence', texte: 'dire {Badge accordé}' }],
              corps2: [{ cat: 'apparence', texte: 'dire {Badge refusé}' }] }
          ],
          question: "Qu'affiche TokTik ?",
          options: [
            { texte: '« Badge refusé »', correct: true },
            { texte: '« Badge accordé »', retour: "Piège ! Le symbole > signifie « <b>strictement</b> plus grand que ». Or 10 000 n'est pas plus grand que 10 000." },
            { texte: "Les deux, l'un après l'autre.", retour: "Impossible : avec un « si… sinon », un seul des deux chemins est suivi." },
            { texte: "Rien, car la condition est fausse.", retour: "Attention, il y a un bloc <b>sinon</b> : quand la condition est fausse, ce sont ses blocs à lui qui s'exécutent." }
          ],
          fragment: '5',
          explication: "10 000 > 10 000 est <b>faux</b>. Le programme part donc dans le « sinon ». Pour que 10 000 suffise, il faudrait écrire <i>abonnés > 9 999</i>.",
          indices: [
            "Pose-toi la question : 10 000 est-il <b>strictement</b> plus grand que 10 000 ?",
            "La condition est fausse. Dans un « si… sinon », que fait le programme quand c'est faux ?"
          ]
        },
        {
          id: 'e4b2', type: 'trous', icone: '🏅',
          titre: "Réécrire la règle",
          histoire: { qui: 'scratchy', texte: "corrige la règle toi-même. deux emplacements : le <b>test</b>, et ce qu'on fait quand il est vrai. clique sur les pointillés." },
          consigne: "Complète le script pour que le badge soit accordé <b>dès 10 000 abonnés</b> (10 000 compris).",
          script: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'controle', texte: 'si {?0} alors', corps: [{ trou: 1 }] }
          ],
          trous: [
            { type: 'choix', reponse: 0, choix: [
              { cat: 'operateurs', forme: 'booleen', texte: '{abonnés} > {9999}' },
              { cat: 'operateurs', forme: 'booleen', texte: '{abonnés} > {10000}' },
              { cat: 'operateurs', forme: 'booleen', texte: '{abonnés} < {10000}' }
            ]},
            { type: 'choix', reponse: 0, choix: [
              { cat: 'apparence', texte: 'dire {Badge accordé}' },
              { cat: 'apparence', texte: 'dire {Badge refusé}' },
              { cat: 'variables', texte: 'mettre {abonnés} à {0}' }
            ]}
          ],
          fragment: '2',
          explication: "Avec des nombres entiers, « au moins 10 000 » s'écrit <b>> 9 999</b>. Un seul chiffre de décalage change qui obtient le badge et qui ne l'obtient pas — c'est tout le métier de celui qui écrit la règle.",
          indices: [
            "Il faut que 10 000 rende le test <b>vrai</b>. Essaie mentalement chaque hexagone avec la valeur 10 000.",
            "10 000 > 9 999 : est-ce vrai ? Oui. C'est celui-là."
          ]
        },
        {
          id: 'e4b3', type: 'qcm', icone: '📊',
          titre: "Écrire la bonne condition",
          histoire: { qui: 'kaya', texte: "Dernier réglage : TokTik doit signaler les vidéos qui <b>dépassent 100 000 vues</b>. Il ne manque que l'hexagone. Choisis bien — tu as vu ce matin ce qu'un seul symbole peut changer." },
          consigne: "Quel bloc de condition traduit exactement « <b>le nombre de vues dépasse 100 000</b> » ?",
          options: [
            { bloc: { cat: 'operateurs', forme: 'booleen', texte: '{vues} > {100000}' }, correct: true },
            { bloc: { cat: 'operateurs', forme: 'booleen', texte: '{vues} < {100000}' }, retour: "Le symbole < signifie « plus petit que » : ce test repérerait les vidéos qui font <b>moins</b> de 100 000 vues." },
            { bloc: { cat: 'operateurs', forme: 'booleen', texte: '{vues} = {100000}' }, retour: "Celui-ci n'est vrai que pour <b>exactement</b> 100 000 vues, ni une de plus ni une de moins." },
            { bloc: { cat: 'capteurs', forme: 'booleen', texte: 'touche {=espace} pressée ?' }, retour: "Celui-ci surveille le clavier : il n'a aucun rapport avec le nombre de vues." }
          ],
          fragment: '7',
          explication: "« Dépasser » se traduit par <b>&gt;</b>, strictement plus grand. Le sens du symbole est la moitié du travail : &lt; et &gt; donnent des programmes exactement opposés.",
          indices: [
            "Le symbole ouvert du côté du plus grand nombre : > se lit « plus grand que ».",
            "Deux blocs comparent des nombres et un seul teste un dépassement vers le haut."
          ]
        }
      ]
    }
  },

  sortie: [
    { qui: 'kaya', texte: "Les commentaires se nettoient. Merci. Il reste une seule section… et c'est elle-même." }
  ]
},

/* ================================================== ÉTAPE 5 */
{
  id: 'e5',
  numero: 5,
  titre: "L'Algorithme",
  soustitre: "Le cœur de Nova",
  icone: '💠',
  couleur: '#c56bff',
  notion: "Variables, initialisation, messages",
  memo: ['m5', 'm6'],

  intro: [
    { texte: "Le fil s'efface. À la place, un seul écran : une <b>boîte</b>, avec une étiquette, et un nombre qui monte tout seul. <i>temps_passé</i>." },
    { qui: 'nova', texte: "Voilà. Tu voulais me voir ? Me voilà en entier. Une variable, une boucle, un ordre. C'est tout ce que je suis." },
    { qui: 'scratchy', texte: "une <b>variable</b> c'est juste une boîte avec un nom, qui retient une valeur. suis-la pas à pas et elle n'a plus aucun secret." },
    { qui: 'scratchy', texte: "et regarde le nom de l'appli. tok. tik. <b>tic-tac.</b> le bruit du temps qui passe. ils l'ont écrit sur la porte d'entrée et personne ne l'a jamais lu." }
  ],

  choix: {
    question: "Comment tu comptes la battre ?",
    options: [
      { branche: 'a', profil: 'frontal', texte: "🔢 Je démonte son compteur",
        reponse: { qui: 'nova', texte: "Mon compteur ? Suis-le donc, ligne par ligne. Tu verras que je n'ai rien caché." } },
      { branche: 'b', profil: 'stratege', texte: "📣 Je préviens tous les autres comptes en même temps",
        reponse: { qui: 'kaya', texte: "Oh. Ça, c'est malin. Si tout le monde se déconnecte au même instant, elle n'a plus personne à retenir." } }
    ]
  },

  branches: {

    a: {
      titre: "Le compteur",
      enigmes: [
        {
          id: 'e5a1', type: 'saisie', icone: '📦',
          titre: "Suivre la boîte",
          histoire: { qui: 'nova', texte: "Mon compteur d'engagement. Trois tours de boucle, puis une dernière ligne. Dis-moi combien il vaut à la fin. Une seule unité d'écart et tu recommences." },
          consigne: "Nova exécute ce script. <b>Que vaut la variable <i>engagement</i></b> à la fin ?",
          script: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'variables',  texte: 'mettre {engagement} à {0}' },
            { cat: 'controle',   texte: 'répéter {3} fois', corps: [{ cat: 'variables', texte: 'ajouter {5} à {engagement}' }] },
            { cat: 'variables',  texte: 'ajouter {1} à {engagement}' }
          ],
          reponses: ['16'],
          champ: { placeholder: 'engagement = ?', largeur: 170 },
          fragment: '1',
          explication: "On part de 0. La boucle ajoute 5 trois fois : 0 → 5 → 10 → 15. Le dernier bloc est <b>en dehors</b> de la boucle : il n'ajoute 1 qu'une seule fois. Total : <b>16</b>.",
          indices: [
            "Écris la valeur étape par étape, comme un tableau : 0, puis…",
            "Le dernier « ajouter 1 » est <b>sous</b> la boucle, pas dedans. Il ne compte qu'une fois : 15 + 1."
          ]
        },
        {
          id: 'e5a2', type: 'ordre', icone: '🔓',
          titre: "Réécrire Nova",
          histoire: { qui: 'scratchy', texte: "dernière ligne droite. j'ai les cinq blocs du script qui remet nova à zéro et prévient tout le monde. ils sont en vrac. remets-les d'aplomb et c'est fini." },
          consigne: "Remets le script dans l'ordre : démarrer, remettre le compteur à zéro, le recompter proprement, prévenir tous les comptes, puis se déconnecter.",
          blocs: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'variables',  texte: 'mettre {temps_passé} à {0}' },
            { cat: 'controle',   texte: 'répéter {10} fois', corps: [{ cat: 'variables', texte: 'ajouter {1} à {comptes_libérés}' }] },
            { cat: 'evenements', texte: 'envoyer à tous {=déconnexion}' },
            { cat: 'apparence',  texte: 'dire {Bonne nuit.} pendant {2} secondes' }
          ],
          fragment: '4',
          explication: "C'est la structure de presque tous les programmes : <b>démarrer</b> (chapeau), <b>initialiser</b> la variable, <b>agir</b> (boucle), puis <b>prévenir</b> les autres.",
          indices: [
            "Le chapeau jaune arrondi va toujours tout en haut.",
            "On remet la variable à 0 <b>avant</b> de compter, sinon on compterait par-dessus l'ancien total."
          ]
        },
        {
          id: 'e5a3', type: 'qcm', icone: '🔄',
          titre: "Pourquoi remettre à zéro ?",
          histoire: { qui: 'scratchy', texte: "une dernière chose avant de partir. regarde bien le deuxième bloc de ton script. si tu l'enlèves, tout marche encore… la première fois. après, c'est le bazar. tu sais pourquoi ?" },
          consigne: "À quoi sert le bloc <b>mettre énergie à 0</b> placé juste après le drapeau vert ?",
          script: [
            { cat: 'evenements', chapeau: true, texte: "quand 🏳 est cliqué" },
            { cat: 'variables',  texte: 'mettre {énergie} à {0}' },
            { cat: 'controle',   texte: 'répéter {10} fois', corps: [{ cat: 'variables', texte: 'ajouter {1} à {énergie}' }] }
          ],
          options: [
            { texte: "À repartir de zéro à chaque partie, au lieu de compter par-dessus la précédente.", correct: true },
            { texte: "À créer la variable énergie.", retour: "La variable existe déjà : on la crée une fois pour toutes dans la catégorie Variables. Ce bloc ne fait que ranger une valeur dedans." },
            { texte: "À supprimer la variable une fois la partie finie.", retour: "Rien n'est supprimé : la variable existe toujours, elle contient simplement 0." },
            { texte: "À rien : le script marcherait pareil sans lui.", retour: "Il marcherait la première fois ! Mais au deuxième essai, énergie repartirait de 10 et finirait à 20." }
          ],
          fragment: '3',
          explication: "C'est ce qu'on appelle <b>initialiser</b>. Une variable garde sa valeur entre deux exécutions : sans remise à zéro, le score du deuxième essai s'ajoute à celui du premier. C'est l'oubli n°1 des projets Scratch.",
          indices: [
            "Imagine qu'on clique sur le drapeau vert <b>deux fois de suite</b>. Que vaudrait énergie à la fin ?",
            "Sans ce bloc : 10 au premier essai, puis 20, puis 30…"
          ]
        }
      ]
    },

    b: {
      titre: "Le signal",
      enigmes: [
        {
          id: 'e5b1', type: 'qcm', icone: '📣',
          titre: "Prévenir tout le monde",
          histoire: { qui: 'kaya', texte: "Il y a des milliers de comptes coincés comme moi. Si on les prévient un par un, Nova les rattrape au fur et à mesure. Il faut que tout le monde reçoive le signal <b>au même instant</b>." },
          consigne: "Quel bloc permet de faire réagir <b>tous les comptes en même temps</b> ?",
          options: [
            { bloc: { cat: 'evenements', texte: 'envoyer à tous {=déconnexion}' }, correct: true },
            { bloc: { cat: 'apparence', texte: 'dire {Déconnectez-vous !}' }, retour: "Ça affiche seulement une bulle sur ton écran : les autres comptes ne « lisent » pas les bulles." },
            { bloc: { cat: 'controle', texte: 'attendre {3} secondes' }, retour: "Attendre ne prévient personne : le programme fait juste une pause." },
            { bloc: { cat: 'variables', texte: 'mettre {alerte} à {1}' }, retour: "Astucieux, mais il faudrait alors que chaque compte surveille cette variable en boucle. Le message est fait exactement pour ça." }
          ],
          fragment: '7',
          explication: "« envoyer à tous » diffuse un <b>message</b>. Tous ceux qui ont un chapeau « quand je reçois <i>déconnexion</i> » démarrent leur script au même moment.",
          indices: [
            "Cherche un bloc <b>jaune</b> : communiquer, c'est la catégorie Événements.",
            "Le bloc qui reçoit s'appelle « quand je reçois … ». Comment s'appelle celui qui envoie ?"
          ]
        },
        {
          id: 'e5b2', type: 'saisie', icone: '📦',
          titre: "Combien de comptes libérés ?",
          histoire: { qui: 'scratchy', texte: "le signal part. chaque vague libère des comptes, et le compteur monte. dis-moi combien on en sauve en tout — nova ouvrira la déconnexion quand le chiffre sera exact." },
          consigne: "Le script s'exécute. <b>Que vaut la variable <i>libérés</i></b> à la fin ?",
          script: [
            { cat: 'evenements', chapeau: true, texte: "quand je reçois {=déconnexion}" },
            { cat: 'variables',  texte: 'mettre {libérés} à {0}' },
            { cat: 'controle',   texte: 'répéter {4} fois', corps: [{ cat: 'variables', texte: 'ajouter {25} à {libérés}' }] },
            { cat: 'variables',  texte: 'ajouter {3} à {libérés}' }
          ],
          reponses: ['103'],
          champ: { placeholder: 'libérés = ?', largeur: 170 },
          fragment: '9',
          explication: "0, puis quatre tours à +25 : 25, 50, 75, <b>100</b>. Le dernier bloc est <b>en dehors</b> de la boucle et n'ajoute 3 qu'une fois : <b>103</b>.",
          indices: [
            "Fais-le tour par tour : 0, puis 25, puis…",
            "Attention au dernier bloc : il est <b>sous</b> la boucle, pas dedans. Il ne s'exécute qu'une seule fois."
          ]
        },
        {
          id: 'e5b3', type: 'ordre', icone: '📥',
          titre: "Le lutin qui reçoit",
          histoire: { qui: 'kaya', texte: "Ton signal part bien, mais il faut encore que les autres comptes sachent quoi en faire. Voilà le script d'un compte qui reçoit le message. Il est en vrac — remets-le d'aplomb et on est tous dehors." },
          consigne: "Remets le script dans l'ordre : à la réception du message, le compte se remet au centre, remercie, puis se déconnecte.",
          blocs: [
            { cat: 'evenements', chapeau: true, texte: 'quand je reçois {=déconnexion}' },
            { cat: 'mouvement',  texte: 'aller à x: {0} y: {0}' },
            { cat: 'apparence',  texte: 'dire {Merci !} pendant {2} secondes' },
            { cat: 'apparence',  texte: 'cacher' }
          ],
          fragment: '0',
          explication: "« quand je reçois » est un <b>bloc chapeau</b>, exactement comme le drapeau vert : il démarre son propre script. C'est ce qui permet à des dizaines de lutins de réagir en même temps à un seul message.",
          indices: [
            "Un seul bloc est arrondi sur le dessus : il ne peut aller que tout en haut.",
            "On se replace, puis on parle, puis on disparaît — dans cet ordre, sinon on parlerait après avoir disparu."
          ]
        }
      ]
    }
  },

  sortie: []
}

];

/* ------------------------------------------------------------------
   Outils de parcours
   ------------------------------------------------------------------ */

/** Les deux énigmes réellement jouées à une étape, selon la branche choisie. */
function enigmesDe(etape, branche) {
  const b = etape.branches[branche] || etape.branches.a;
  return b.enigmes;
}

/** Le code de vérification d'une étape = les chiffres de ses énigmes. */
function codeDe(etape, branche) {
  return enigmesDe(etape, branche).map((e) => e.fragment).join('');
}

/** Toutes les énigmes écrites, tous parcours confondus (page enseignant). */
function toutesLesEnigmes() {
  const sortie = [];
  ETAPES.forEach((etape) => {
    Object.keys(etape.branches).forEach((cle) => {
      etape.branches[cle].enigmes.forEach((e) => {
        sortie.push({ etape, branche: cle, enigme: e });
      });
    });
  });
  return sortie;
}

/** L'énigme de remédiation d'une étape (proposée après deux échecs). */
function remediationDe(etape) { return REMEDIATIONS[etape.id] || null; }

if (typeof window !== 'undefined') {
  window.APPLI = APPLI;
  window.MODES = MODES;
  window.PIQUES = PIQUES;
  window.PROFILS = PROFILS;
  window.REMEDIATIONS = REMEDIATIONS;
  window.remediationDe = remediationDe;
  window.ETAPES = ETAPES;
  window.PROLOGUE = PROLOGUE;
  window.EPILOGUE = EPILOGUE;
  window.enigmesDe = enigmesDe;
  window.codeDe = codeDe;
  window.toutesLesEnigmes = toutesLesEnigmes;
}
