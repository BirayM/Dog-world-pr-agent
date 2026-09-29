# Plan de test E2E - Dog World

Ce plan de test couvre les fonctionnalités principales de l'application "Chiens du Monde" suite aux changements dans la configuration CI/CD.

## Scénarios de test

### 1. Navigation et Affichage initial
- **Objectif** : Vérifier que l'application se charge et affiche les données par défaut.
- **Actions** :
    - Naviguer vers l'URL de base.
- **Attentes** :
    - Le titre "Chiens du Monde" est visible.
    - Au moins 5 cartes de chiens sont affichées par défaut.
    - Les boutons de filtrage par région sont présents.

### 2. Filtrage par Région
- **Objectif** : Vérifier que le filtrage par région fonctionne correctement.
- **Actions** :
    - Cliquer sur le filtre "Europe".
    - Cliquer sur le filtre "Asie".
- **Attentes** :
    - Pour "Europe", seules les races d'Europe s'affichent (ex: Berger Allemand).
    - Pour "Asie", seul l'Akita Inu s'affiche (initialement).

### 3. Ajout d'un Nouveau Chien
- **Objectif** : Vérifier qu'un utilisateur peut ajouter une nouvelle race.
- **Actions** :
    - Remplir le formulaire avec un nom, un pays, une région et une description (> 10 caractères).
    - Cliquer sur "Ajouter".
- **Attentes** :
    - Un message de succès "Chien ajouté !" s'affiche.
    - La nouvelle carte de chien est visible dans la liste.
    - Le compteur de chiens a augmenté.

### 4. Validation du Formulaire
- **Objectif** : Vérifier que les contraintes de validation sont respectées.
- **Actions** :
    - Essayer d'ajouter un chien avec une description de moins de 10 caractères.
- **Attentes** :
    - Un message d'erreur s'affiche (provenant de l'API).
    - Le chien n'est pas ajouté à la liste.

### 5. Sécurité (XSS)
- **Objectif** : S'assurer que les entrées utilisateurs sont correctement échappées.
- **Actions** :
    - Ajouter un chien avec du code HTML/JS dans le nom.
- **Attentes** :
    - Le code est rendu comme du texte et n'est pas exécuté.
