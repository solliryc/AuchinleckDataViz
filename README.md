# AuchinleckDataViz
![homepage](screenshots/homepage.PNG)

## Demo
https://solliryc.github.io/AuchinleckDataViz/

## Description
Le Auchinleck Manuscript est un recueil de poèmes produit à Londres dans les années 1330, qui fait office d'oeuvre de référence de la période du Middle English (env. de 1050 à 1500). Composé de 43 poèmes, le Auchinleck Manuscript donne de nombreuses informations sur l'état de la langue anglaise et la formation des dialectes à une époque où la langue anglaise n'était pas uniformisé.

Il est donc intéressant d'analyser de quelles étymologies viennent les mots présents dans l'ouvrage et à quel moment ces mots ont fait leur apparition dans la langue anglaise. De plus, le fait que le Auchinleck Manuscript soit composé de plusieurs textes distincts, d'auteurs différents, permet d'observer des différences entre l'un ou l'autre des poèmes.

## Données
La récupération des données nécessaires s'est effectuée en deux temps. D'abord, il a fallu récupérer les données concernant le Manuscript en isolant les mots qui composent ses textes (son lexique). Ensuite, il a fallu trouver pour chacun des mots du lexique ses données etymologiques et temporelles, au moyen du Middle English Dictionary, le dictionnaire de référence pour cette forme de la langue anglaise.

Il n'existe pas de fichier de données du Auchinleck Manuscript prêt à être analysé. Il a fallu donc utiliser la version numérisée en HTML du [Auchinleck Manuscript](https://auchinleck.nls.uk/), éditée par David Burnley et Alison Wiggins, a été mise en ligne en 2003. Cette version a été archivée [en format XML](https://ota.bodleian.ox.ac.uk/repository/xmlui/handle/20.500.12024/2493) par le Oxford Text Archive, un catalogue de contenu numérique littéraire et linguistique. A partir de ces fichiers XML, il a été possible d'extraire une liste de tous les mots uniques qui apparaissent dans le texte, soit un total de 16'673 mots.

Variables disponibles pour chaque mot:
* lexicon_word: la forme du mot tel qu'il apparaît dans le texte
* occurrences_manuscript: le nombre de fois que le mot apparaît dans tous les textes
* nbr_texts: le nombre de textes dans lequel le mot apparaît
* (poème): indique pour chaque poème, si le mot en fait partie (1 si oui, 0 si non)
* (poème)_occurrences: le nombre de fois que le mot apparaît dans chaque poème

Comme pour le Auchinleck Manuscript, il n'existe pas de fichier de données du Middle English Dictionary (MED) prêt à être analysé. Il a fallu donc récupérer les données à partir de la version numérique du [MED](https://quod.lib.umich.edu/m/middle-english-dictionary). Cette version du MED comporte plus de 54'000 entrées, qui sont homogènes au niveau de la mise-en-forme, mais pas uniformes au niveau du contenu. Certaines entrées ont des données étymologiques et temporelles, d'autres pas. L'année d'apparition d'un mot dans la langue est récupérée dans les citations associées à ce mot. Les années qui figurent dans les citations sont données sous la forme d'un intervalle de 25 ou 50 ans. Si plusieurs intervalles sont donnés, le plus ancien est retenu comme l'intervalle durant lequel le mot est apparu. Au total, 54'507 entrées du MED ont été extraites.

Variables disponibles pour chaque entrée:
* med_word: la forme du mot dans le dictionnaire
* year_1: l'intervalle durant lequel est apparu le mot
* year_from_1: la limite inférieure de l'intervalle durant lequel est apparu le mot
* year_to_1: la limite supérieure de l'intervalle durant lequel est apparu le mot
* (étymologie): indique pour chaque étymologie, si le mot en vient (1 si oui, 0 si non)

Une fois ces deux jeux données récupérés, il a fallu les mettre en commun. Il n'a été gardé que les mots du Auchinleck Manuscript pour lesquels une correspondance avec une entrée du MED pouvait être établie. Cette correspondance avec le MED a été réalisée grâce au moteur de recherche disponible sur le site du MED.

Ainsi, un lexique de 14'378 mots, répartis dans 43 poèmes différents, totalisant 309'351 occurrences, et comprenant 96 étymologies différentes, a été produit.

## Fonctionnalités
### Barre de recherche
![alt text](screenshots/searchbar_1.PNG)

La barre de recherche permet de voir les données disponibles pour chacun des mots du lexique du Auchinleck Manuscript. Le champ de recherche comporte une fonction de saisie semi-automatique. Il est possible de naviguer dans les suggestions soit avec les flèches du clavier et la touche <i>Enter</i> soit avec la souris.

La recherche d'un mot du lexique affiche 6 champs en-dessous de la barre:
* le mot
* l'intervalle durant lequel le mot est apparu dans le Middle English
* le ou les étymologies du mot
* le nombre de fois que le mot apparaît dans le manuscript
* le nombre de poèmes dans lequel le mot apparaît
* le lien vers l'entrée du mot dans le MED

### Distribution d'un mot dans les poèmes
![alt text](screenshots/piechart_1.PNG)

La recherche d'un mot fait aussi apparaître un camembert (pie chart) en-dessous de la barre de recherche. Ce camembert indique le nombre de fois (occurrences) que le mot cherché apparaît dans les poèmes où on le trouve. En survolant un des arcs de cercle du camembert, une infobulle indique le titre du poème correspondant et le nombre d'occurrences.

### Mots les plus fréquents dans un poème
![alt text](screenshots/lollipopchart_1.PNG)

En cliquant sur un des arcs de cercle du camembert, un graphique lollipop (lollipop chart) apparaît sur la droite du camembert. Ce graphique indique les 10 mots les plus fréquents dans le poème séléctionné sur le camembert. Pour éviter d'afficher les mots les plus courants dans l'ensemble du Manuscript, les 30 mots les plus fréquents, qui apparaissent au moins dans 40 poèmes, ne sont pas pris en compte. En survolant avec la souris la "boule" au bout de chaque ligne du graphique, une infobulle indique le mot, le nombre d'occurrences dans le poème et le titre du poème.

### Distribution temporelle des mots
![alt text](screenshots/histogram_1.PNG)

Cet histogramme permet de voir sur l'ensemble du manuscrit la distribution temporelle des mots, en fonction de l'année approximative durant laquelle ils sont apparus dans la langue anglaise. L'approximation de l'année d'apparition est calculée comme la moyenne de l'intervalle donné dans le MED. La largeur de chaque colonne correspond à une période de 50 ans. En survolant une colonne avec la souris, une infobulle indique l'étymologie, l'intervalle temporel et le nombre absolu (ou la fréquence).

Trois options sont disponibles:
* Sélection des étymologies: possibilité de sélectionner jusqu'à 4 étymologies différentes pour comparer côte-à-côte la distribution temporelle des mots de différentes étymologies
* <i>Count</i> ou <i>Frequency</i>: possibilité d'alterner entre le nombre absolu et la fréquence 
* <i>Words</i> ou <i>Occurrences</i>: possiblité d'alterner entre le nombre de mots uniques (type) et le nombre d'apparitions des mots (token) 

### Nombre de mots par étymologie
![alt text](screenshots/barchart_1.PNG)

Ce diagramme en barre permet de voir le nombre de mots (ou d'occurrences) pour une ou plusieurs étymologies, dans un ou plusieurs poèmes. En survolant une colonne avec la souris, une infobulle indique l'étymologie et le nombre de mots (ou d'occurrences) que comprend cette étymologie dans les poèmes sélectionnés. La couleur assignée à chaque étymologie est la même dans l'histogramme et dans le diagramme en barre, afin de faciliter la lecture.

Trois options sont disponibles:
* Sélection des poèmes: possiblité de sélectionner entre 1 et 43 poèmes (l'ensemble du manuscrit)
* Séletion des étymologies: possiblité de sélectionner entre 1 et 96 étymologies, plus 5 catégories qui regroupent les étymologies
* <i>Words</i> ou <i>Occurrences</i>: possiblité d'alterner entre le nombre de mots uniques (type) et le nombre d'apparitions des mots (token) dans les textes sélectionnés

## Discussion
Ces visualisations permettent de se rendre de plusieurs choses au niveau de la langue du Middle English.

Tout d'abord, on peut voir l'influence grandissante du français et de ses étymologies associées au sein de la langue anglaise. On remarque cela grâce à l'histogramme en sélectionnant par exemple <i>Old English</i> et <i>Old French</i> (cf. image d'illustration de l'histogramme). Le nombre de mots venant du vieux français qui apparaissent dans le manuscrit font une entrée massive dans la langue du Middle English durant les années 1300-1350. Cet intervalle coincide avec les années de production du Auchinleck Manuscript.
En sélectionnant l'option <i>Occurrences</i>, on remarque toutefois que les mots venant du <i>Old French</i> sont moins utilisés que les mots venant du <i>Old English</i>, même dans l'intervalle 1300-1350. De manière générale, les mots d'orgine française sont moins utilisés que les mots d'une autre origine.

Le diagramme en barre permet lui de nous rendre compte à quel point le Middle English du Auchinleck Manuscript est composé de mots venant d'une multitude d'étymologies. On retrouve ainsi dans les étymologies qui comptent le plus de mots à la fois des origines nordiques (Old Icelandic), françaises (Old French), latines (Latin) ou anglaises (Old English). Cependant, comme pour l'histogramme, en sélectionnant l'option <i>Occurrences</i>, on remarque que les mots d'origine anglaise sont plus souvent utilisés que les mots d'autres origines.

Il serait intéressant d'obtenir une analyse de ces visualisations de la part d'une personne spécialiste du Middle English ou de la langue anglaise en général. Elle pourrait potentiellement interpréter ces résultats avec une plus grande certitude.

## A propos
### Librairies utilisées
* Bootstrap 4.5.0
* D3 5.16.0
* JQuery 3.5.1
* Popper 1.16
* tail.select 0.5.15

### Sources
* [The Auchinleck Manuscript](https://auchinleck.nls.uk/) (eds: David Burnley and Alison Wiggins, National Library of Scotland, 2003)
* <a href="https://ota.bodleian.ox.ac.uk/repository/xmlui/handle/20.500.12024/2493" target='_blank'>The Auchinleck Manuscript on the Oxford Text Archive</a> (eds David Burnley and Alison Wiggins, National Library of Scotland, Oxford Text Archive, 2003)
* <a href="https://quod.lib.umich.edu/m/middle-english-dictionary" target="_blank">Middle English Dictionary</a> (eds: Frances McSparran, Ann Arbor, et al., University of Michigan Library, 2000-2018)

### Auteur
Ce projet a été réalisé par Cyrille Gay-Crosier dans le cadre du cours de Master <i>Visualisation de données</i>, donné par Loïc Cattani, au printemps 2020, à l'UNIL.

### Remerciements
Rory Critten (MER en Anglais à l'UNIL) et Davide Picca (MER en Informatique pour les sciences humaines à l'UNIL) pour leur aide et leurs conseils dans la récupération et le traitement des données.
