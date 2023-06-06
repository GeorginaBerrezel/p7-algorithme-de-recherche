export function fetchRecipes() {
  return fetch('./data/recipes.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("Une erreur s'est produite lors de la récupération des recettes :", error);
    });
}