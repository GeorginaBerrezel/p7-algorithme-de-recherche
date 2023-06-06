const searchInput = document.getElementById("search-input");

// Importe les recettes depuis le fichier JSON
import recipes from './data/recipes.json';

searchInput.addEventListener("input", function() {
  const inputValue = searchInput.value;
  const matchingRecipes = searchRecipes(inputValue);
  console.log(matchingRecipes);
  updateSearchCounter(matchingRecipes.length); // Mettre à jour le compteur avec le nombre de recettes correspondantes
});

function searchRecipes(query) {
  query = query.toLowerCase();
  const matchingRecipes = [];

  recipes.forEach((recipe) => {
    const { name, ingredients, appliance, ustensils } = recipe;

    if (
      name.toLowerCase().includes(query) ||
      ingredients.some(
        (ingredient) =>
          ingredient.ingredient.toLowerCase().includes(query)
      ) ||
      appliance.toLowerCase().includes(query) ||
      ustensils.some((ustensil) => ustensil.toLowerCase().includes(query))
    ) {
      matchingRecipes.push(recipe.id);
    }
  });

  const cardContainers = document.querySelectorAll('#card-container .col');
  cardContainers.forEach((cardContainer) => {
    const recipeId = parseInt(cardContainer.getAttribute('data-recipe-id'));
    if (matchingRecipes.includes(recipeId)) {
      cardContainer.style.display = 'block';
    } else {
      cardContainer.style.display = 'none';
    }
  });

  updateDropdowns(query);

  return matchingRecipes;
}

// Fonction pour mettre à jour les éléments du dropdown en fonction de la recherche
function updateDropdowns(query) {
  const dropdownLists = document.querySelectorAll('.dropdown-list');
  dropdownLists.forEach((dropdownList) => {
    const items = Array.from(dropdownList.getElementsByTagName('li'));

    items.forEach(function(item) {
      const text = item.innerText.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}
