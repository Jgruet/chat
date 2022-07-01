# Documentation

## Avant-propos
Ce projet a été développé pendant une semaine de formation sur socket.io

Pour lancer le projet :  
```npm run dev``` ou ```npm run start```

______________________
## Diagrammes


### <ins>**Cas d'utilisation**

Voici les différentes fonctionnalités développées disponibles sur le projet.

![Cas d'utilisation](/public/css/img/diagrammes/use-case3.drawio.png)


<ins>Lecture d'un cas d'utilisation :

Un utilisateur doit pouvoir envoyer un message. Pour se faire il doit d'abord avoir rejoint un canal, et a dû se connecter au préalable
____________
### <ins>**Diagramme de classes**

Le projet est développé en POO. Le diagramme de classes nous permet de voir les différentes briques logicielles qui seront ammenées à intéragir entre elles.

![Diagramme de classes](/public/css/img/diagrammes/class.drawio.png)


<ins>Explication du fonctionnement Front-end

2 classes sont présentes pour gérer le front du projet. **UserInface** écoute les actions de l'utilisateur et créé des évènement personnalisés qui sont à leur tour écoutés par **ClientChat**. **ClientChat** se charge ensuite d'émettre vers la couche Back-end.

**ClientChat** reçoit les évènement emit par le Back-end et grâce à la composition, fait réagir d'interface utilisateur.
_______________________
### <ins>**Diagramme de séquence**

Les diagrammes de séquences détaillent le parcours de l'information entre les différentes briques logicielles de l'application.  
En général, on retrouve un diagramme de séquence par cas d'utilisation.

![Diagramme de séquence](/public/css/img/diagrammes/sequence2.drawio.png)


## Stack technique
---------------

### Back-end

*   Serveur node.js v16.14 - sans express.js
*   Socket.io
*   JS natif
*   Architecture POO

### Front-end

*   JS natif
*   Bootstrap.css pour l'applicaton
*   Pico.css pour la documentation
*   Ressources graphiques : [wowpedia](https://wowpedia.fandom.com/), [wowhead](http://fr.wowhead.com)

## Compétences développées
-----------------------

*   Mettre en place une communication bilatérale client - serveur grâce à socket.io
*   Coder en programmation orientée objet en JavaScript
*   Utiliser les conventions JavaScript ES2015+
*   Créer une animation CSS ex-nihilo
*   Intégrer des éléments externes pour créer un thème CSS spécifique (border, textures, icones)