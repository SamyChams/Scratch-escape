# 🔁 LOOP — l'appli dont on ne sort pas

**Escape game pédagogique pour apprendre les rudiments de Scratch — classe de 5ᵉ.**

Il est 23 h 47. L'élève a dit « encore une dernière » onze fois. Et là, l'application
refuse de se fermer : **Nova**, l'algorithme, ne compte pas le laisser partir.
Pour se déconnecter, il va falloir apprendre à lire le code de l'appli.

👉 **[Jouer](index.html)** · **[Cahier de cours](memo.html)** · **[Espace enseignant](professeur.html)**

> ⚠️ **À faire avant la première séance :** le corrigé enseignant est protégé par le mot de passe
> `labo404`, qui est public puisqu'il est écrit ici. Change-le sur la page **[Outils](outils.html)**
> avant de mettre le site à disposition des élèves.

---

## Chaque élève joue un parcours différent

C'est le cœur du dispositif. À chaque étape, l'élève fait un **choix** — sans bonne ni
mauvaise réponse — et ce choix décide des **deux énigmes** qu'il va rencontrer.

**20 énigmes sont écrites, un élève en joue 10.** Deux voisins n'ont donc aucun exercice
en commun, ce qui limite la recopie et rend le rejeu intéressant.

La règle de conception est stricte : **on branche sur la forme, jamais sur la notion.**
Les cinq notions sont traversées quel que soit le chemin. Deux élèves travaillent tous
les deux les boucles — l'un sur une transition vidéo qui bégaie, l'autre sur le scroll infini.

Et ce n'est pas un artifice : dans la fiction, c'est **l'algorithme** qui adapte ce qu'il
propose. Que deux élèves n'aient pas le même contenu, c'est précisément le sujet du jeu —
et un point d'appui pour parler de bulles algorithmiques en éducation aux médias.

## Les 5 étapes

| Étape | Notion travaillée | Les deux branches |
|-------|-------------------|-------------------|
| 🎛 L'Éditeur | interface, catégories de blocs, ordre des instructions | fouiller seul · se faire guider par Kaya |
| 🎯 Les Filtres | repère (x ; y), direction, déplacements | le sticker · le sous-titre |
| 🔁 Le Montage | boucles bornées et infinies, angles | la transition qui bégaie · le scroll infini |
| 🔀 La Modération | si… alors… sinon, conditions | le filtre anti-commentaires · le badge vérifié |
| 💠 L'Algorithme | variables, initialisation, messages | démonter le compteur · prévenir tous les comptes |

Chaque réglage réparé donne **un chiffre** du code de vérification à deux chiffres qui
déverrouille l'étape suivante. À la fin, l'élève obtient une **attestation imprimable**
avec son temps, ses étoiles, son mode et le parcours qu'il a suivi.

### Le profil que Nova construit

À chaque choix, Nova note une étiquette sur l'élève — « préfère se débrouiller seul »,
« défend les autres avant lui-même »… — sans jamais le lui demander. À la fin, elle affiche
le portrait qu'elle a constitué, et explique que c'est exactement ce que fait un algorithme
de recommandation, à ceci près qu'il ne montre jamais la fiche. C'est le moment le plus
directement exploitable en éducation aux médias.

## Les personnages

| | Qui | Rôle |
|---|---|---|
| 💠 | **NOVA** | l'algorithme de LOOP. Elle sait ce que tu regardes et combien de temps. C'est elle qui te retient. |
| 🎧 | **Kaya** | une créatrice coincée dans l'appli, qui streame encore. C'est elle qui donne les indices. |
| 🐈 | **@scratchy** | un compte à 3 abonnés que personne ne suit — mais qui a lu tout le code de l'appli. |
| 💬 | **Ilyes & Nour** | le groupe de discussion, qui s'inquiète en arrière-plan. |

L'histoire ne se termine pas par la destruction de l'antagoniste : l'élève découvre que
Nova n'est qu'un programme à qui on a donné **un seul ordre** — `ajouter 1 à temps_passé`,
en boucle. Ce sont des humains qui ont écrit cette ligne. C'est là que la leçon de
programmation et la leçon d'esprit critique se rejoignent.

### Un mot sur les références

Le site n'imite **aucune plateforme réelle** et ne cite aucune marque : LOOP est
entièrement fictive. Ce sont les **formats** qui sont empruntés — le fil qu'on fait
défiler, le chat de groupe, le live et ses commentaires — parce qu'ils sont immédiatement
reconnaissables et qu'ils ne se démodent pas, contrairement à une tendance nommée qui
serait périmée en trois mois.

## Trois modes de jeu

Le mode ne change **ni les exercices ni les notions** : seulement la pression. On en change à tout
moment depuis la barre du haut, sans rien perdre.

| Mode | Ce qui change |
|---|---|
| 🌙 **Tranquille** (défaut) | aucune limite, aucun chrono. Recommandé pour une première séance. |
| ⚡ **Défi chrono** | un temps cible de 5 minutes par étape. Le dépasser ne bloque rien : on perd juste l'éclair. |
| 🎯 **Sans faute** | 3 erreurs maximum par étape pour débloquer la suivante. |

**Le mode exigeant ne piège jamais un élève.** Au moment où le quota est atteint, le jeu n'affiche
pas un échec : Kaya propose de basculer en mode tranquille — auquel cas tout ce qui est déjà réparé
est conservé — ou de recommencer l'étape. C'est ce garde-fou qui rend le mode utilisable en classe.

## Le filet de sécurité

Après **deux échecs sur la même énigme**, Kaya propose une *version plus simple* : une question courte
sur la même notion, qui rapporte **le même chiffre**. L'élève n'est jamais coincé et repart avec la
notion travaillée, même par un chemin plus court. Il y a une remédiation par notion, soit cinq en tout.

En parallèle, **Nova réagit** à la deuxième erreur — une pique, jamais sur l'élève, toujours sur la
situation. L'antagoniste existe aussi pendant le travail, pas seulement entre les étapes.

### Pensé pour la classe

- **Aucun échec possible** en mode tranquille : on se trompe autant de fois qu'on veut.
- **Deux indices progressifs** par énigme, donnés par Kaya, plus un accès permanent au cahier de cours.
- **Feedback pédagogique** : chaque mauvaise réponse explique *pourquoi* elle est fausse.
- **Sauvegarde automatique** dans le navigateur : on peut reprendre à la séance suivante.
- **Corrigé chiffré** pour l'enseignant (voir plus bas).

---

## Utilisation

### En classe, sans rien installer

Télécharger le dossier et **double-cliquer sur `index.html`**. C'est tout : pas de serveur,
pas de compte, pas de connexion Internet nécessaire. Rien n'est envoyé sur le réseau,
aucune donnée personnelle n'est collectée (la progression reste dans le `localStorage`
du poste, clé `loop-partie-v1`).

### Publier en ligne (GitHub Pages)

Un workflow de publication automatique est déjà en place (`.github/workflows/publier.yml`) :
il met le site en ligne à chaque modification de `main`, dès que Pages est disponible pour
le dépôt. **Pages est gratuit pour les dépôts publics** ; pour un dépôt privé, il faut un
abonnement GitHub Pro.

### Servir en local (facultatif)

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

---

## Structure du projet

```
index.html          Accueil : scénario, personnages, reprise de partie
jeu.html            Le jeu (récits, choix, énigmes, codes, attestation)
memo.html           Le cahier de cours : 6 fiches, imprimables
professeur.html     Fiche pédagogique (libre) + corrigé (protégé)
outils.html         Changer le mot de passe / modifier le corrigé

css/style.css       Habillage général
css/appli.css       L'habillage de LOOP (écran, messages, choix)
css/blocs.css       Rendu des blocs façon Scratch 3

js/parcours.js      Le scénario : 5 étapes, 10 branches, 20 énigmes,
                    5 remédiations, 3 modes de jeu
js/jeu.js           Moteur : parcours de l'arbre, récit, codes
js/enigmes.js       Les six types d'énigmes jouables
js/blocs.js         Fabrique de blocs Scratch en HTML
js/illustrations.js Personnages et décors des 5 étapes, dessinés en SVG
js/recit.js         Dialogues qui s'écrivent lettre après lettre
js/cours.js         Contenu des 6 fiches de cours
js/memo.js          Affichage des fiches
js/progression.js   Sauvegarde, branches, mode, quota, chronomètre, étoiles
js/audio.js         Bruitages synthétisés (aucun fichier son)
js/coffre.js        Chiffrement/déchiffrement du corrigé
js/corrige-chiffre.js  Le corrigé, chiffré (aucune réponse en clair)

tests/              Quatre tests automatisés (Playwright, facultatifs)
```

HTML/CSS/JavaScript pur : aucune bibliothèque, aucune dépendance, aucune étape de
compilation. Tout est modifiable avec un simple éditeur de texte.

---

## Adapter le contenu

Tout le contenu pédagogique est séparé du moteur.

- **Modifier une fiche de cours** → `js/cours.js`
- **Modifier le scénario, un choix ou une énigme** → `js/parcours.js`

Six types d'énigmes sont disponibles, tous pilotés par les données :

| Type | Ce que fait l'élève |
|------|---------------------|
| `qcm` | choisit parmi plusieurs réponses (texte ou blocs) |
| `association` | relie deux colonnes |
| `ordre` | remet des blocs dans l'ordre (flèches ▲▼ ou glisser-déposer) |
| `saisie` | écrit une réponse |
| `grille` | construit un programme et le fait tourner sur un plateau |
| `trous` | complète un script, puis le vérifie ou l'exécute |

Chaque étape suit toujours la même forme :

```js
{
  id: 'e3', numero: 3, titre: "Le Montage", notion: "…",
  intro: [ { qui: 'nova', texte: "…" } ],     // récit d'entrée
  choix: {
    question: "Qu'est-ce que tu attaques ?",
    options: [
      { branche: 'a', texte: "…", reponse: { qui: 'kaya', texte: "…" } },
      { branche: 'b', texte: "…", reponse: { qui: 'nova', texte: "…" } }
    ]
  },
  branches: {
    a: { titre: "…", enigmes: [ /* deux énigmes */ ] },
    b: { titre: "…", enigmes: [ /* deux autres */ ] }
  },
  sortie: [ /* récit de sortie */ ]
}
```

Le code de vérification n'est écrit nulle part : il est reconstitué à partir des
`fragment` des deux énigmes de la branche jouée. Ajouter une énigme allonge donc
automatiquement le code, sans rien d'autre à modifier.

Pour la mise en scène d'une énigme, ajouter un champ `histoire` :

```js
histoire: { qui: 'kaya', texte: "Ce que Kaya dit avant l'énigme." }
// ou, sans personnage :
histoire: { texte: "Ce que l'élève voit à l'écran." }
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
retrouver dans `js/parcours.js` quelle réponse est marquée comme correcte. Ce qui est
protégé, c'est le **corrigé rédigé** — celui qu'on projette au tableau ou qu'on imprime.

Un verrouillage complet demanderait un site avec serveur, qui garderait les réponses de
son côté. En pratique, un élève capable de fouiller le code a de toute façon dépassé ce
que la séance cherche à évaluer.

---

## Tests

Quatre tests automatisés :

```bash
npm install playwright
python3 -m http.server 8765 &

node tests/parcours-complet.js       # résout réellement les 20 énigmes, les deux branches
node tests/embranchements.js         # vérifie que deux élèves n'ont aucun exercice commun
node tests/modes-et-remediation.js   # quota, porte de sortie, version simple, profil
node tests/corrige-chiffre.js        # vérifie la protection du corrigé
```

---

## Crédits

Projet pédagogique pour le cycle 4 (thème « Algorithmique et programmation »).

Scratch est un projet du **MIT Media Lab** (<https://scratch.mit.edu>). Ce site n'y est
pas affilié : il imite l'apparence des blocs uniquement pour faciliter le transfert des
élèves vers le vrai logiciel. LOOP est une application entièrement fictive.
