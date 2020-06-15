# AuchinleckDataViz
![homepage](screenshots/homepage.PNG)

## Demo
https://solliryc.github.io/AuchinleckDataViz/

## Description
Le Auchinleck Manuscript est un recueil de poèmes produit à Londres dans les années 1330, qui fait office d'oeuvre de référence de la période du Middle English (env. de 1050 à 1500). Composé de 43 poèmes, le Auchinleck Manuscript donne de nombreuses informations sur l'état de la langue anglaise à cette période et la formation des dialectes à une époque où l'anglais n'était pas uniformisé.

Il est donc intéressant d'analyser de quelles étymologies viennent les mots présents dans l'ouvrage et à quel moment ces mots ont fait leur apparition dans la langue anglaise. De plus, le fait que le Auchinleck Manuscript soit composé de plusieurs textes distincts, d'auteurs différents, permet d'observer des différences entre l'un ou l'autre des poèmes.

## Données
La récupération des données nécessaires s'est effectuée en deux temps. D'un côté, il a fallu récupérer les données concernant le Manuscript en isolant les mots qui composent ses textes (son lexique). De l'autre, il a fallu trouver pour chacun des mots du lexique ses données etymologiques et temporelles, au moyen des données disponibles dans le Middle English Dictionary, le dictionnaire de référence pour cette forme de la langue anglaise.

Il n'existe pas de fichier de données du Auchinleck Manuscript prêt à être analysé. Il a fallu donc utiliser la version numérisée en HTML du [Auchinleck Manuscript](https://auchinleck.nls.uk/), éditée par David Burnley et Alison Wiggins, a été mise en ligne en 2003. Cette version a été archivée [en format XML](https://ota.bodleian.ox.ac.uk/repository/xmlui/handle/20.500.12024/2493) par le Oxford Text Archive, un catalogue de contenu numérique littéraire et linguistique. 

Comme pour le Auchinleck Manuscript, il n'existe pas de fichier de données du Middle English Dictionary (MED) prêt à être analysé. Il a fallu donc récupérer les données à partir de la version numérique du [MED](https://quod.lib.umich.edu/m/middle-english-dictionary).

## Fonctionnalités
### Bar de recherche
![alt text](screenshots/searchbar_1.PNG)

### Pie Chart
![alt text](screenshots/piechart_1.PNG)

### Lollipop chart
![alt text](screenshots/lollipopchart_1.PNG)

### Histogram
![alt text](screenshots/histogram_1.PNG)

### Bar chart
![alt text](screenshots/barchart_1.PNG)

## Discussion


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
