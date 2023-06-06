import { getRecipes } from './data/recipies.json';

getRecipes()
  .then((recipes) => {
    // Utilisez les données des recettes ici
    console.log(recipes);
  })
  .catch((error) => {
    console.log('Une erreur s'est produite lors de la récupération des recettes :', error);
  });
