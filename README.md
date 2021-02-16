![](CosmaLogo.png)

Cosma est un logiciel de visualisation de graphe documentaire. Il permet de représenter des documents interreliés sous la forme d’un réseau interactif dans une interface web.

<!-- Capture d'écran -->

# 1. Présentation

Le logiciel repose sur trois principes : la modularité, l'interopérabilité et la portabilité.

## Modularité

Cosma fonctionne avec un répertoire de fichiers au format texte. Vous pouvez gérer librement vos fichiers : stockage local uniquement, synchronisation via un service tiers comme Dropbox, versionnement avec git… Installez Cosma, indiquez-lui où sont vos fichiers et continuez à travailler avec votre éditeur de texte favori. Désinstaller Cosma n'a aucune incidence sur vos fichiers.

## Interopérabilité

Les logiciels s'envolent mais les données restent. Cosma ne prescrit pas de logiciel d'écriture, mais son fonctionnement repose sur l'adoption simultanée de plusieurs normes d'écriture qui visent à accroître l'interopérabilité et la pérennité des données :

- YAML pour la configuration du logiciel et les métadonnées des fichiers ;
- Markdown pour le contenu des fichiers ;
- une syntaxe de type wiki (doubles crochets) pour créer des liens internes ;
- des identifiants uniques qui servent de cibles aux liens internes.

Cet ensemble de normes correspond à l'intersection de plusieurs cultures textuelles : documentation, wikis, prise de notes avec la méthode Zettelkasten ou encore écriture académique avec Pandoc. Les environnements d'écriture qui partagent cette approche fonctionnent particulièrement bien en tandem avec Cosma.

Exemples :

- l'éditeur Markdown [Zettlr](https://zettlr.com) ;
- l'extension [Foam](https://foambubble.github.io/foam/) pour les éditeurs Visual Studio Code et VSCodium.

## Portabilité

Cosma se divise en deux parties : le **cosmographe**, qui est une interface de fabrication, et le **cosmoscope**, qui est une interface de visualisation.

Le **cosmographe** est un logiciel basé sur NodeJS qui inclut deux fonctionnalités principales. La première consiste à faciliter la création de documents aux normes de Cosma via un formulaire. La seconde consiste à lire un répertoire de documents, le modéliser sous la forme de données au format JSON, et générer un **cosmoscope** à partir de ces données.

<!-- Capture d'écran -->

Le **cosmoscope** est un fichier HTML à ouvrir avec un navigateur web. Il contient une représentation graphique interactive du répertoire de documents analysé par le cosmographe, avec de nombreuses fonctionnalités : graphe interactif, index, moteur de recherche, filtres d'affichage, enregistrement de vues, paramétrage de l'algorithme de dessin, affichage des documents avec liste des liens et rétroliens, etc.

<!-- Capture d'écran -->

Ce fichier HTML se suffit à lui-même : il contient à la fois les données et l'interface, sans aucune dépendance logicielle. Par conséquent, vous pouvez partager un cosmoscope aussi facilement que n'importe quelle pièce jointe. Et Cosma stocke une copie de chaque cosmoscope généré dans un répertoire sur votre machine.

# 2. Installation

## Pré-requis

Installer [NodeJS](https://nodejs.org/fr/) version 12 ou supérieure.

## Téléchargement

Télécharger le dépôt git en saisissant la commande ci-dessous dans un terminal, ou en cliquant sur le lien suivant : <https://github.com/hyperotlet/cosma/archive/master.zip>

```bash
git clone https://github.com/hyperotlet/cosma.git
```

## Installation

Installer les dépendances nécessaires au bon fonctionnement de l'application :

```bash
cd cosma
npm i
```

Exécuter la commande suivante pour créer le fichier de configuration (`config.yml`) :

```bash
node app
```

## Configuration

Le fichier de configuration est au format YAML. La hiérarchie des paramètres est mise en œuvre par l'indentation, c'est-à-dire la présence d'espaces en début de ligne. L'utilisation de tabulations dans l'indentation est interdite en YAML. Pour l'unité d'indentation, il est conseillé de choisir un multiple de 2 (2 ou 4) et de s'y tenir pour tout le fichier.

La configuration peut contenir les paramètres suivants :

`files_origin` : chemin du répertoire de fichiers à utiliser.

`export_target` : chemin vers le répertoire d'export des cosmoscopes.

`radiusMax` (nombre entier) : distance maximale du mode focus. Le mode focus modifie l'affichage du graphe pour n'afficher que la fiche sélectionnée et ses connexions immédiates (distance = 1). On peut augmenter le rayon du mode focus pour étendre l'affichage au connexions des connexions (distance = 2) et ainsi de suite (distance = n). `radiusMax` fixe une valeur maximum pour cette distance.

`types` : types de fiches.

`hierarchy` : types de liens.

`color` (nom de couleur prédéfini ou valeur RVB, HEX, HSL, RVBA et HSLA) : couleur du type de fiche ou de lien.

`graph_params` : paramètres de l'algorithme de dessin du graphe.

- `center` : position `x` et `y` du graphe dans la page.
- `charge` :
	- `enabled` (booléen `true` ou `false`)
	- `strength` (nombre entier) : force de la répulsion entre les nœuds
	- `distanceMin` : distance minimum entre les nœuds
	- `distanceMax` : distance maximum entre les nœuds
- `collide` : empêche le recouvrement des nœuds.
	- `enabled` (booléen `true` ou `false`) : active ou désactive l'option.
- `link` :
	- `color` : couleur des liens par défaut
	- `highlightColor` : couleur des liens en surbrillance
	- `enabled` (booléen `true` ou `false`) : active ou désactive l'option.
	- `distance` (nombre entier) : longueur des liens
	- `iterations` (nombre entier) : nombre d'itérations pour imposer ce paramètre
- `node` :
	- `sizeCoeff` (nombre entier) : coefficient appliqué à la taille des nœuds (2 = double ; 3 = triple ; etc.)
- `forceX` : exerce une force qui contraint les nœuds à se rapprocher de l'axe horizontal.
	- `enabled` (booléen `true` ou `false`) : active ou désactive l'option.
	- `strength` (nombre entier) : force de l'attraction.
- `forceY` : exerce une force qui contraint les nœuds à se rapprocher de l'axe vertical.
	- `enabled` (booléen `true` ou `false`) : active ou désactive l'option.
	- `strength` (nombre entier) : force de l'attraction.

`views` : vues enregistrées.

<!-- Exemple de configuration ? -->

# 3. Utilisation

## Utilisation du cosmographe

Créer une nouvelle fiche :

```bash
node app record
node app autorecord <titre> <type> <mots-clés>
```

`<type>` doit correspondre à l'un des types définis dans la configuration. `<mots-clés>` doit correspondre à une liste de mots-clés

Ceci génère un fichier avec la structure suivante :

```
---
title: Titre du document
id: 20201209111625
type: undefined
tags:
  - tag 1
  - tag 2
---


```

L'identifiant `id` doit être une suite de chiffres unique.

Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heure, minute et seconde) sur le modèle de certains logiciels de prise de notes type Zettelkasten comme The Archive ou Zettlr.

Générer un cosmoscope :

```bash
node app modelize
```

Le fichier `cosmoscope.html` est exporté dans le répertoire défini dans la configuration. Ce fichier est également copié dans le répertoire `/history`, dans un sous-répertoire portant la date du jour, avec un sous-répertoire contenant les données au format JSON.

## Utilisation du cosmoscope

<!-- Description générale, portabilité -->

### Graphe

Cliquer sur un nœud le met en surbrillance, ainsi que ses connexions, et ouvre la fiche correspondante.

<!-- À compléter. Zoom etc. -->

### Index

Liste des fiches. L'affichage peut être trié par ordre alphabétique et par date de dernière modification (de manière croissante ou décroissante). Cliquer sur un titre sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante.

### Moteur de recherche

<!-- Préciser la bibliothèque sous-jacente ? -->

Cliquer sur une suggestion sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante.

### Filtres

Correspondent aux types de fiches renseignés dans le fichier de configuration. Cliquer sur un filtre permet de masquer ou de réafficher les fiches du type correspondant dans le graphe, l'index et les suggestions du moteur de recherche.

### Mots-clés

Correspondent à l'ensemble des mots-clés trouvés dans les fiches. Cliquer sur un mot-clé met en surbrillance toutes les fiches correspondantes dans le graphe.

### Paramètres du graphe

Configuration des différentes forces simulées par l'algorithme de dessin du graphe. Les valeurs par défaut peuvent être modifiées dans le fichier de configuration.

### Vues

À tout moment, l'état de l'interface (fiche sélectionnée, filtres actifs, mode focus) peut être sauvegardé pour un accès plus rapide. Cliquer sur le bouton « Sauvegarder la vue » insère un code dans le presse-papier de l'utilisateur. Ce code peut être ajouté dans le fichier de configuration : ceci ajoute un bouton vers la vue en question dans les cosmoscopes générés ultérieurement.

Exemple :

```
views:
  Une vue intéressante: eyJwb3MiOnsieCI6MCwieSI6MCwiem9vbSI6MX19
```

### Fiches

Les fiches sont présentées dans un volet latéral qui permet de consulter leur contenu, modifier l'affichage du graphe et naviguer dans le graphe via les liens.

Cliquer sur le bouton « Fermer » referme le volet et désélectionne le nœud correspondant dans le graphe.

Le contenu de la fiche est suivi d'une liste des fiches vers lesquelles elle renvoie (liens sortants) et des fiches qui pointent vers elle (liens entrants ou rétroliens).

Cliquer sur les différents niveaux de focus permet de modifier l'affichage du graphe pour isoler le nœud correspondant à la fiche. Le bouton `1` isole la fiche et ses connexions immédiates (distance = 1). Les boutons suivants étendent le rayon (`radius`) aux connexions situées à plusieurs liens de distance jusqu'au maximum permis par le paramètre `radiusMax` du fichier de configuration.

# Commandes

Modifier le chemin vers les fichiers sources :

```bash
node app import <path>
```

Modifier le chemin d'export du cosmoscope :

```bash
node app export <path>
```

Ajouter des types valides :

```bash
node app atype <name> <color>
```

Ajouter des vues :

```bash
node app aview <name> <key>
```