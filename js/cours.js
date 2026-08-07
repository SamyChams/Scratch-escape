/* =========================================================
   cours.js — le « cahier de cours »
   Contenu des fiches de rappel, partagé entre memo.html
   et la fenêtre d'aide accessible pendant le jeu.
   ========================================================= */

const COURS = [

  /* ------------------------------------------------- FICHE 1 */
  {
    id: 'm1',
    icone: '🧱',
    titre: "L'atelier de Scratch",
    resume: "L'écran de Scratch, les lutins et les catégories de blocs.",
    sections: [
      { t: 'p', texte: "Scratch est un logiciel de <b>programmation par blocs</b> : au lieu d'écrire du texte, on emboîte des briques colorées comme des Lego. Impossible de faire une faute d'orthographe !" },
      { t: 'liste', titre: "Les 4 zones de l'écran", items: [
        "<b>La scène</b> (en haut à droite) : le petit théâtre où le programme se joue.",
        "<b>Les lutins</b> (sous la scène) : les personnages et objets que l'on programme. Le chat s'appelle Scratchy.",
        "<b>La palette de blocs</b> (à gauche) : toutes les briques disponibles, rangées par catégories de couleur.",
        "<b>La zone de script</b> (au milieu) : l'espace de travail où l'on glisse les blocs pour les emboîter."
      ]},
      { t: 'p', texte: "Le <b>drapeau vert 🏳</b> lance le programme, le <b>panneau rouge ⏹</b> l'arrête." },
      { t: 'tableau', titre: "Les catégories et leurs couleurs", entetes: ["Catégorie", "Couleur", "À quoi ça sert"], lignes: [
        ["Mouvement",  '<span class="puce-couleur" style="background:#4c97ff"></span>Bleu',        "déplacer et tourner le lutin"],
        ["Apparence",  '<span class="puce-couleur" style="background:#9966ff"></span>Violet',      "parler, changer de costume, de taille"],
        ["Son",        '<span class="puce-couleur" style="background:#cf63cf"></span>Rose',        "jouer des sons et des notes"],
        ["Événements", '<span class="puce-couleur" style="background:#ffbf00"></span>Jaune',       "démarrer un script (drapeau, touche…)"],
        ["Contrôle",   '<span class="puce-couleur" style="background:#ffab19"></span>Orange',      "répéter, tester, attendre"],
        ["Capteurs",   '<span class="puce-couleur" style="background:#5cb1d6"></span>Bleu clair',  "détecter une touche, une couleur, la souris"],
        ["Opérateurs", '<span class="puce-couleur" style="background:#59c059"></span>Vert',        "calculer et comparer"],
        ["Variables",  '<span class="puce-couleur" style="background:#ff8c1a"></span>Orange foncé',"mémoriser des valeurs (score, vies…)"]
      ]},
      { t: 'blocs', legende: "Un <b>script</b> = des blocs emboîtés. Ils s'exécutent <b>de haut en bas</b>, dans l'ordre.", pile: [
        { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' },
        { cat: 'mouvement',  texte: 'aller à x: {0} y: {0}' },
        { cat: 'apparence',  texte: 'dire {Bonjour !} pendant {2} secondes' },
        { cat: 'mouvement',  texte: 'avancer de {100} pas' }
      ]},
      { t: 'astuce', texte: "Un script démarre toujours par un bloc <b>chapeau</b> (arrondi en haut) de la catégorie Événements. Sans chapeau, le script ne se lance pas tout seul." }
    ]
  },

  /* ------------------------------------------------- FICHE 2 */
  {
    id: 'm2',
    icone: '🧭',
    titre: "Se déplacer : coordonnées et direction",
    resume: "Le repère de la scène, les blocs de mouvement et les angles.",
    sections: [
      { t: 'p', texte: "La scène est un <b>repère</b>, comme en mathématiques. Chaque point a deux coordonnées : <b>x</b> (horizontale) et <b>y</b> (verticale)." },
      { t: 'liste', items: [
        "<b>x</b> va de <b>-240</b> (tout à gauche) à <b>+240</b> (tout à droite).",
        "<b>y</b> va de <b>-180</b> (tout en bas) à <b>+180</b> (tout en haut).",
        "Le <b>centre</b> de la scène est le point <b>(0 ; 0)</b>."
      ]},
      { t: 'blocs', legende: "Les blocs de déplacement les plus utilisés :", pile: [
        { cat: 'mouvement', texte: 'aller à x: {0} y: {0}' },
        { cat: 'mouvement', texte: 'avancer de {10} pas' },
        { cat: 'mouvement', texte: 'ajouter {10} à x' },
        { cat: 'mouvement', texte: 'tourner ↻ de {90} degrés' },
        { cat: 'mouvement', texte: "s'orienter à {90}" }
      ]},
      { t: 'p', texte: "<b>Attention à la différence :</b> <i>aller à x… y…</i> <b>téléporte</b> le lutin à un endroit précis, tandis que <i>avancer de 10 pas</i> le fait avancer <b>dans la direction où il regarde</b>." },
      { t: 'tableau', titre: "Les directions", entetes: ["Bloc", "Le lutin regarde vers…"], lignes: [
        ["s'orienter à 90",  "la droite ➡"],
        ["s'orienter à -90", "la gauche ⬅"],
        ["s'orienter à 0",   "le haut ⬆"],
        ["s'orienter à 180", "le bas ⬇"]
      ]},
      { t: 'astuce', texte: "<i>ajouter 10 à x</i> ne remplace pas x : il <b>ajoute</b> 10 à la valeur actuelle. Si x valait -50, il vaut ensuite -50 + 10 = -40." }
    ]
  },

  /* ------------------------------------------------- FICHE 3 */
  {
    id: 'm3',
    icone: '🔁',
    titre: "Répéter sans se fatiguer : les boucles",
    resume: "Répéter n fois, indéfiniment, jusqu'à… et le calcul des angles.",
    sections: [
      { t: 'p', texte: "Une <b>boucle</b> permet de répéter des instructions sans recopier les mêmes blocs. Le script devient plus court, plus lisible et plus facile à corriger." },
      { t: 'blocs', legende: "Les trois boucles de la catégorie Contrôle :", pile: [
        { cat: 'controle', texte: 'répéter {10} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {10} pas' }] },
        { cat: 'controle', texte: 'répéter indéfiniment', corps: [{ cat: 'mouvement', texte: 'tourner ↻ de {15} degrés' }] },
        { cat: 'controle', texte: "répéter jusqu'à ce que {#}",
          condition: { cat: 'capteurs', forme: 'booleen', texte: 'touché ? {=bord}' },
          corps: [{ cat: 'mouvement', texte: 'avancer de {5} pas' }] }
      ]},
      { t: 'liste', items: [
        "<b>répéter n fois</b> : on sait à l'avance combien de tours on veut faire.",
        "<b>répéter indéfiniment</b> : la boucle ne s'arrête jamais (jusqu'au panneau rouge). Idéal pour surveiller le clavier.",
        "<b>répéter jusqu'à ce que…</b> : la boucle s'arrête quand une condition devient vraie."
      ]},
      { t: 'p', texte: "Ces quatre blocs identiques…" },
      { t: 'blocs', pile: [
        { cat: 'mouvement', texte: 'avancer de {10} pas' },
        { cat: 'mouvement', texte: 'avancer de {10} pas' },
        { cat: 'mouvement', texte: 'avancer de {10} pas' },
        { cat: 'mouvement', texte: 'avancer de {10} pas' }
      ]},
      { t: 'p', texte: "…font exactement la même chose que cette boucle :" },
      { t: 'blocs', pile: [
        { cat: 'controle', texte: 'répéter {4} fois', corps: [{ cat: 'mouvement', texte: 'avancer de {10} pas' }] }
      ]},
      { t: 'astuce', texte: "<b>Dessiner un polygone régulier</b> : on répète <i>n</i> fois « avancer puis tourner de <b>360 ÷ n</b> degrés ». Carré : 360 ÷ 4 = <b>90°</b>. Triangle : 360 ÷ 3 = <b>120°</b>. Pentagone : 360 ÷ 5 = <b>72°</b>." }
    ]
  },

  /* ------------------------------------------------- FICHE 4 */
  {
    id: 'm4',
    icone: '🔀',
    titre: "Faire des choix : les tests",
    resume: "si… alors, si… alors… sinon, et les conditions.",
    sections: [
      { t: 'p', texte: "Un <b>test</b> permet au programme de choisir : il exécute des blocs <b>seulement si</b> une condition est vraie." },
      { t: 'blocs', legende: "Le bloc <b>si… alors</b> : s'il ne se passe rien, le programme continue sans rien faire.", pile: [
        { cat: 'controle', texte: 'si {#} alors',
          condition: { cat: 'capteurs', forme: 'booleen', texte: 'touche {=espace} pressée ?' },
          corps: [{ cat: 'mouvement', texte: 'ajouter {10} à y' }] }
      ]},
      { t: 'blocs', legende: "Le bloc <b>si… alors… sinon</b> : il y a toujours exactement un des deux chemins qui est suivi.", pile: [
        { cat: 'controle', texte: 'si {#} alors',
          condition: { cat: 'operateurs', forme: 'booleen', texte: '{score} > {10}' },
          corps:  [{ cat: 'apparence', texte: 'dire {Gagné !}' }],
          corps2: [{ cat: 'apparence', texte: 'dire {Perdu…}' }] }
      ]},
      { t: 'p', texte: "Les <b>conditions</b> sont des blocs en forme d'<b>hexagone</b> ⬡ : ils répondent seulement par <b>vrai</b> ou <b>faux</b>. On les trouve dans Capteurs (bleu clair) et Opérateurs (vert)." },
      { t: 'blocs', legende: "Quelques conditions courantes :", pile: [
        { cat: 'capteurs',   forme: 'booleen', texte: 'touche {=espace} pressée ?' },
        { cat: 'capteurs',   forme: 'booleen', texte: 'touché ? {=bord}' },
        { cat: 'operateurs', forme: 'booleen', texte: '{score} > {10}' },
        { cat: 'operateurs', forme: 'booleen', texte: '{x} = {0}' }
      ]},
      { t: 'piege', texte: "<b>Piège classique !</b> Le test <i>score > 10</i> est <b>faux</b> quand le score vaut exactement 10 : « strictement plus grand » ne comprend pas 10. Pour inclure 10, il faudrait tester <i>score > 9</i>." },
      { t: 'astuce', texte: "Pour qu'un test soit vérifié en permanence (par exemple pour surveiller le clavier), on le place à l'intérieur d'une boucle <b>répéter indéfiniment</b>." }
    ]
  },

  /* ------------------------------------------------- FICHE 5 */
  {
    id: 'm5',
    icone: '📦',
    titre: "Mémoriser : les variables",
    resume: "Créer, initialiser et modifier une variable (score, vies, temps).",
    sections: [
      { t: 'p', texte: "Une <b>variable</b> est une <b>boîte avec une étiquette</b> : elle porte un nom (<i>score</i>, <i>vies</i>, <i>chrono</i>…) et retient une valeur que le programme peut lire et modifier." },
      { t: 'blocs', legende: "Les blocs de la catégorie Variables (orange foncé) :", pile: [
        { cat: 'variables', texte: 'mettre {score} à {0}' },
        { cat: 'variables', texte: 'ajouter {1} à {score}' },
        { cat: 'variables', texte: 'afficher la variable {score}' },
        { cat: 'variables', texte: 'cacher la variable {score}' }
      ]},
      { t: 'liste', items: [
        "<b>mettre … à …</b> : range une valeur dans la boîte, en <b>effaçant</b> ce qu'il y avait avant.",
        "<b>ajouter … à …</b> : <b>augmente</b> la valeur déjà présente (ajouter -1 permet de retirer 1)."
      ]},
      { t: 'blocs', legende: "Exemple : à la fin de ce script, <b>score vaut 3</b>.", pile: [
        { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' },
        { cat: 'variables',  texte: 'mettre {score} à {0}' },
        { cat: 'controle',   texte: 'répéter {3} fois', corps: [{ cat: 'variables', texte: 'ajouter {1} à {score}' }] }
      ]},
      { t: 'astuce', texte: "<b>Toujours initialiser !</b> On place <i>mettre score à 0</i> juste après le drapeau vert. Sinon, au deuxième essai, le score repart de la valeur de la partie précédente." }
    ]
  },

  /* ------------------------------------------------- FICHE 6 */
  {
    id: 'm6',
    icone: '📡',
    titre: "Démarrer et communiquer : les événements",
    resume: "Les blocs chapeaux, les messages entre lutins.",
    sections: [
      { t: 'p', texte: "Les blocs <b>Événements</b> (jaunes) sont des <b>chapeaux</b> : ils se placent tout en haut d'un script et indiquent <b>quand</b> celui-ci doit démarrer." },
      { t: 'blocs', pile: [
        { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' },
        { cat: 'evenements', chapeau: true, texte: 'quand la touche {=espace} est pressée' },
        { cat: 'evenements', chapeau: true, texte: 'quand ce lutin est cliqué' }
      ]},
      { t: 'p', texte: "Pour faire réagir <b>plusieurs lutins en même temps</b>, on utilise les <b>messages</b> : un lutin envoie un message, tous ceux qui l'attendent démarrent leur script." },
      { t: 'blocs', legende: "Lutin n°1 — il donne le signal :", pile: [
        { cat: 'evenements', chapeau: true, texte: 'quand 🏳 est cliqué' },
        { cat: 'evenements', texte: 'envoyer à tous {=départ}' }
      ]},
      { t: 'blocs', legende: "Lutin n°2 — il obéit au signal :", pile: [
        { cat: 'evenements', chapeau: true, texte: 'quand je reçois {=départ}' },
        { cat: 'mouvement',  texte: 'avancer de {100} pas' }
      ]},
      { t: 'astuce', texte: "Un même message peut réveiller autant de lutins que l'on veut : c'est la façon la plus simple de synchroniser une scène de jeu." }
    ]
  }
];

if (typeof window !== 'undefined') window.COURS = COURS;
