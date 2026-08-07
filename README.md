# 🐈 L'Évasion du Labo 404

**Escape game pédagogique pour apprendre les rudiments de Scratch — classe de 5ᵉ.**

Scratchy, le chat de Scratch, est prisonnier d'un vieux serveur infecté par un virus.
Pour le libérer, il faut traverser **5 salles**, résoudre **15 énigmes** et ouvrir
**5 cadenas**… en découvrant au passage les blocs, les coordonnées, les boucles,
les tests et les variables.

👉 **[Jouer](index.html)** · **[Cahier de cours](memo.html)** · **[Espace enseignant](professeur.html)**

> ⚠️ **À faire avant la première séance :** le corrigé enseignant est protégé par le mot de passe
> `labo404`, qui est public puisqu'il est écrit ici. Change-le sur la page **[Outils](outils.html)**
> avant de mettre le site à disposition des élèves.

---

## Ce que le jeu contient

| Salle | Notion travaillée | Énigmes |
|-------|-------------------|---------|
| 1. 🧱 Le Hall des Briques | Interface, catégories de blocs, ordre des instructions | reliage couleurs · QCM · remise en ordre d'un script |
| 2. 🧭 Le Couloir des Coordonnées | Repère (x ; y), direction, déplacements | QCM · calcul · **labyrinthe à programmer** |
| 3. 🔁 La Salle des Miroirs | Boucles, angles d'un polygone | QCM · calcul d'angle · **script à trous exécutable** |
| 4. 🔀 Le Laboratoire des Choix | si… alors… sinon, conditions, capteurs | QCM · trace d'exécution · script à compléter |
| 5. 💾 Le Cœur du Serveur | Variables, initialisation, messages | trace de variable · QCM · script final |

Chaque énigme résolue donne **un chiffre** du code de la porte. À la fin,
l'élève obtient un **diplôme d'évasion imprimable** avec son temps et ses étoiles.

### Une histoire, pas une liste d'exercices

Le parcours est mis en scène de bout en bout : un **prologue**, une **transition** après chaque
porte franchie, un **épilogue**, et trois personnages qui accompagnent l'élève.

| | Personnage | Rôle |
|---|---|---|
| 🐈 | **Scratchy** | le chat prisonnier, l'enjeu de la partie |
| 🤖 | **Pixel** | le drone allié : c'est lui qui donne les indices |
| 👾 | **Le Bug** | le virus : il lance les défis et se moque des abandons |

Chaque énigme est introduite par une **mise en scène** qui explique ce que l'élève est en train
de faire dans l'histoire (réparer une manette, éclairer un couloir, ouvrir une cage), plutôt que
de poser une question hors-sol. Chaque salle a son **décor illustré** et sa propre couleur, qui
teinte toute l'interface.

Les répliques **s'écrivent lettre après lettre**, comme dans un jeu d'aventure. L'élève avance
avec la **barre Espace** (ou Entrée, ou un clic) :

- pendant que le texte défile → la touche affiche la réplique d'un coup ;
- quand la réplique est finie → la touche passe à la suivante.

Un bouton **« Tout afficher »** permet de sauter la séquence, et les énigmes n'apparaissent
qu'une fois le dialogue d'entrée terminé. Un dialogue déjà vu ne se rejoue pas quand on revient
dans la salle. L'animation est automatiquement désactivée si le système de l'élève demande de
réduire les animations.

### Pensé pour la classe

- **Aucun échec possible** : pas de compte à rebours, on peut se tromper autant de fois qu'on veut.
- **Deux indices progressifs** par énigme, plus un accès permanent au cahier de cours.
- **Feedback pédagogique** : chaque mauvaise réponse explique *pourquoi* elle est fausse.
- **Sauvegarde automatique** dans le navigateur : on peut reprendre à la séance suivante.
- **Corrigé chiffré** pour l'enseignant sur `professeur.html` (voir plus bas).

---

## Utilisation

### En classe, sans rien installer

Télécharger le dossier et **double-cliquer sur `index.html`**. C'est tout :
pas de serveur, pas de compte, pas de connexion Internet nécessaire.
Rien n'est envoyé sur le réseau, aucune donnée personnelle n'est collectée
(la progression reste dans le `localStorage` du poste, clé `labo404-partie-v1`).

### Publier en ligne (GitHub Pages)

Dans les réglages du dépôt : **Settings → Pages → Branch : `main` / dossier `/ (root)`**.
Le site est un site statique, il fonctionne tel quel.

### Servir en local (facultatif)

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

---

## Structure du projet

```
index.html          Accueil : scénario, personnages, reprise de partie
jeu.html            Le jeu (récits, salles, énigmes, cadenas, diplôme)
memo.html           Le cahier de cours : 6 fiches, imprimables
professeur.html     Fiche pédagogique (libre) + corrigé (protégé)
outils.html         Changer le mot de passe / modifier le corrigé

css/style.css       Habillage général (thème « laboratoire »)
css/blocs.css       Rendu des blocs façon Scratch 3

js/blocs.js         Fabrique de blocs Scratch en HTML
js/illustrations.js Décors et personnages, dessinés en SVG
js/cours.js         Contenu des 6 fiches de cours
js/salles.js        Scénario, 5 salles, 15 énigmes, dialogues
js/jeu.js           Moteur du jeu et des 6 types d'énigmes
js/recit.js         Dialogues progressifs (machine à écrire, touche Espace)
js/memo.js          Affichage des fiches
js/progression.js   Sauvegarde, chronomètre, étoiles
js/audio.js         Bruitages synthétisés (aucun fichier son)
js/coffre.js        Chiffrement/déchiffrement du corrigé
js/corrige-chiffre.js  Le corrigé, chiffré (aucune réponse en clair)

tests/parcours-complet.js   Test automatisé du parcours (Playwright, facultatif)
tests/corrige-chiffre.js    Test automatisé de la protection du corrigé
```

Le projet est en **HTML/CSS/JavaScript pur** : aucune bibliothèque, aucune
dépendance, aucune étape de compilation. Tout est modifiable avec un simple
éditeur de texte.

---

## Adapter le contenu

Tout le contenu pédagogique est séparé du moteur.

- **Modifier une fiche de cours** → `js/cours.js`
- **Modifier / ajouter une énigme** → `js/salles.js`

Six types d'énigmes sont disponibles, tous pilotés par les données :

| Type | Ce que fait l'élève |
|------|---------------------|
| `qcm` | choisit parmi plusieurs réponses (texte ou blocs) |
| `association` | relie deux colonnes |
| `ordre` | remet des blocs dans l'ordre (flèches ▲▼ ou glisser-déposer) |
| `saisie` | écrit une réponse |
| `grille` | construit un programme et le fait tourner sur un plateau |
| `trous` | complète un script, puis le vérifie ou l'exécute |

Exemple minimal d'une énigme à ajouter dans le tableau `enigmes` d'une salle :

```js
{
  id: 's1e4',
  type: 'qcm',
  icone: '🎨',
  titre: "Ma nouvelle énigme",
  consigne: "La question posée à l'élève.",
  options: [
    { texte: "La bonne réponse", correct: true },
    { texte: "Une réponse fausse", retour: "Explication de l'erreur." }
  ],
  fragment: '7',                       // chiffre donné pour le cadenas
  explication: "Ce qu'il faut retenir.",
  indices: ["Premier indice.", "Deuxième indice, plus explicite."],
  solution: "La bonne réponse."        // affiché sur la page enseignant
}
```

Le code du cadenas n'est écrit nulle part : il est **reconstitué** à partir des `fragment`
des énigmes de la salle, dans l'ordre. Ajouter ou retirer une énigme allonge ou raccourcit
donc automatiquement le code, sans rien d'autre à modifier.

Pour la **mise en scène** d'une énigme, ajouter un champ `histoire` :

```js
histoire: { qui: 'pixel', texte: "Ce que Pixel dit à l'élève avant l'énigme." }
// ou, pour une description sans personnage :
histoire: { texte: "Ce que l'élève voit dans la salle." }
```

---

## Le corrigé enseignant et sa protection

Le corrigé **n'existe nulle part en clair** dans les fichiers du site. Il vit dans
`js/corrige-chiffre.js`, chiffré en **AES-256-GCM** avec une clé dérivée du mot de passe
enseignant (PBKDF2-SHA256, 250 000 itérations). Sans le mot de passe, le fichier est
inexploitable — y compris pour un élève qui ouvrirait le code source de la page.

**Changer le mot de passe** (à faire avant la première séance) : ouvrir `outils.html`,
saisir le mot de passe actuel (`labo404`), choisir le nouveau, cliquer sur
« Générer le fichier chiffré », puis remplacer `js/corrige-chiffre.js` par le fichier
téléchargé. La même page permet de relire et de modifier les solutions.

### Ce que cette protection ne couvre pas

Un site sans serveur envoie forcément au navigateur tout ce dont le jeu a besoin pour
fonctionner. Un élève qui sait ouvrir les outils de développement peut donc, en cherchant,
retrouver dans `js/salles.js` quelle réponse est marquée comme correcte. Ce qui est protégé,
c'est le **corrigé rédigé** — celui qu'on projette au tableau ou qu'on imprime.

Un verrouillage complet demanderait un site avec serveur, qui garderait les réponses de son
côté. En pratique, un élève capable de fouiller le code a de toute façon dépassé ce que la
séance cherche à évaluer.

---

## Tests

Deux tests automatisés : le premier résout les 15 énigmes et ouvre les 5 cadenas en vérifiant
qu'aucune erreur JavaScript n'apparaît ; le second vérifie que le corrigé reste invisible sans
mot de passe et que la rotation du mot de passe fonctionne.

```bash
npm install playwright
python3 -m http.server 8765 &
node tests/parcours-complet.js
node tests/corrige-chiffre.js
```

---

## Crédits

Projet pédagogique pour le cycle 4 (thème « Algorithmique et programmation »).

Scratch est un projet du **MIT Media Lab** (<https://scratch.mit.edu>).
Ce site n'y est pas affilié : il imite l'apparence des blocs uniquement pour
faciliter le transfert des élèves vers le vrai logiciel.
