# Open_Data

Objectif projet :
Pouvoir sélectionner une localisation en France et un radius, et afficher une carte de la ville avec des marqueurs sur les points d'intérêts 
(monuments et lieux culturels ou sportifs) compris dans le rayon choisi autour de la localisation.

Pour construire notre projet nous avons tout d'abord récupéré des jeux de données en opendata d'une administration publique :
- API pour les équipements sportifs en France : 
  https://equipements.sports.gouv.fr/explore/dataset/data-es/api/
- API pour les lieux cultures en France : 
  https://data.culture.gouv.fr/explore/dataset/base-des-lieux-et-des-equipements-culturels/information/?disjunctive.type_equipement_ou_lieu&disjunctive.label_et_appellation&disjunctive.domaine&disjunctive.sous_domaines&disjunctive.departement

Nous avons ensuite vérifié la qualité des données : 
L'api pour les équipements sportifs a beaucoup de noms de variables mal définis ("caract" + nombre).
Ce point mis à part les données sont de bonne qualité.

Ensuite nous avons récupéré un jeu de données à croiser avec les API :
- Fichier contenant la localisation des villes françaises (et autres données sur les villes) : 
https://tableurs.com/base-de-donnees/base-de-donnees-des-villes-francaises/


Une fois la carte affichée, les utilisateurs peuvent enrichir les données en ajoutant une note à un des lieux d'intérêts affichés.

Stratégie de consommation des données tierces :
Nous stockons le fichier des villes en local, puis lorsque l'utilisateur choisit une localisation et un radius, puis on récupère les lieux d'intérêts 
correspondant aux coordonnées (+ rayon) en appelant les API.
