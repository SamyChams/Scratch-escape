# 🐈 L'Évasion du Labo 404

**Escape game pédagogique pour apprendre les rudiments de Scratch — classe de 5ᵉ.**

Scratchy, le chat de Scratch, est prisonnier d'un vieux serveur infecté par un virus.
Pour le libérer, il faut traverser **5 salles**, résoudre **15 énigmes** et ouvrir
**5 cadenas**… en découvrant au passage les blocs, les coordonnées, les boucles,
les tests et les variables.

👉 **[Jouer](index.html)** · **[Cahier de cours](memo.html)** · **[Espace enseignant](professeur.html)**

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

### Pensé pour la classe

- **Aucun échec possible** : pas de compte à rebours, on peut se tromper autant de fois qu'on veut.
- **Deux indices progressifs** par énigme, plus un accès permanent au cahier de cours.
- **Feedback pédagogique** : chaque mauvaise réponse explique *pourquoi* elle est fausse.
- **Sauvegarde automatique** dans le navigateur : on peut reprendre à la séance suivante.
- **Corrigé complet** pour l'enseignant sur `professeur.html`.

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
index.html          Accueil : scénario, nom de code, reprise de partie
jeu.html            Le jeu (salles, énigmes, cadenas, diplôme)
memo.html           Le cahier de cours : 6 fiches, imprimables
professeur.html     Fiche pédagogique + corrigé complet

css/style.css       Habillage général (thème « laboratoire »)
css/blocs.css       Rendu des blocs façon Scratch 3

js/blocs.js         Fabrique de blocs Scratch en HTML
js/cours.js         Contenu des 6 fiches de cours
js/salles.js        Scénario, 5 salles, 15 énigmes, corrigés
js/jeu.js           Moteur du jeu et des 6 types d'énigmes
js/memo.js          Affichage des fiches
js/progression.js   Sauvegarde, chronomètre, étoiles
js/audio.js         Bruitages synthétisés (aucun fichier son)

tests/parcours-complet.js   Test automatisé du parcours (Playwright, facultatif)
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

Penser à ajuster le `code` de la salle si le nombre d'énigmes change :
il correspond aux `fragment` mis bout à bout, dans l'ordre des énigmes.

---

## Tests

Un parcours automatisé résout les 15 énigmes, ouvre les 5 cadenas et vérifie
qu'aucune erreur JavaScript n'apparaît :

```bash
npm install playwright
python3 -m http.server 8765 &
node tests/parcours-complet.js
```

---

## Crédits

Projet pédagogique pour le cycle 4 (thème « Algorithmique et programmation »).

Scratch est un projet du **MIT Media Lab** (<https://scratch.mit.edu>).
Ce site n'y est pas affilié : il imite l'apparence des blocs uniquement pour
faciliter le transfert des élèves vers le vrai logiciel.
