// J'importe ma fonction "fetchRecipes" qui va récupérer les donner dans data.js qui provient de mes recettes en JSON
import { fetchRecipes } from './data.js';

// Récuperer dans ma constante searchInput son ID dans le DOM
const searchInput = document.getElementById("search-input");

// Stock mes recettes dans une variable "recipes" dans un tableau vide qui sera rempli par la suite
let recipes = [];

// Fonction "fetchRecipes" récupère les recettes depuis le fichier JSON
fetchRecipes()
  .then((data) => {
    recipes = data;

    // Ecouteur d'évènement dans l'input de ma constante "searchInput"
    searchInput.addEventListener("input", function() {
      // Création d'une constante "inputValue" qui contient la valeur de mon "searchInput"
      const inputValue = searchInput.value;
      // Création d'une constante "matchingRecipes" qui contient une fonction "searchRecipes" qui a pour paramètre la valeur de "inputValue"
      const matchingRecipes = searchRecipes(inputValue);
      console.log(matchingRecipes);
      // Fonction "updateSearchCounter" qui contient comme paramètre la longeur de "matchingRecipes"
      updateSearchCounter(matchingRecipes.length); // Mettre à jour le compteur avec le nombre de recettes correspondantes
    });

    // Creation de la fonction "searchRecipes" qui a comme paramètre query
    function searchRecipes(query) {
      // le paramètre query contient le fonction bas de casse
      query = query.toLowerCase();
      // Création de le constant "matchingRecipes" qui contient un tableau vide
      const matchingRecipes = [];

      // Création d'une boucle  sur le JSON qui contient toutes mes recettes 
      recipes.forEach((recipe) => {
        // constante qui contient les paramètres d'une recette et qui est stocké dans mon paramètre précédents "RECIPE"
        const { name, ingredients, appliance, ustensils } = recipe;
        // condition SI
        if (
          // mon parametre name passe en minuscule et je regarde si y a la requete dedans (ce tape l'utilisateur)
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

      updateDropdowns(query);

      const cardContainers = document.querySelectorAll('#card-container .col');
      cardContainers.forEach((cardContainer) => {
        const recipeId = parseInt(cardContainer.getAttribute('data-recipe-id'));
        if (matchingRecipes.includes(recipeId)) {
          cardContainer.style.display = 'block';
        } else {
          cardContainer.style.display = 'none';
        }
      });

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

    const cardContainer = document.getElementById('card-container');

    recipes.forEach((recipe) => {
      const cardCol = document.createElement('div');
      cardCol.classList.add('col');
      cardCol.setAttribute('data-recipe-id', recipe.id);

      const card = document.createElement('div');
      card.classList.add('card');
      card.style.border = 'none';
      card.style.borderRadius = '21px';
      card.style.position = 'relative'; // Ajouter cette ligne

      const cardImage = document.createElement('img');
      cardImage.classList.add('bd-placeholder-img', 'card-img-top');
      const imageName = `Recette${recipe.id.toString().padStart(2, '0')}.jpg`; // Génère le nom de l'image en fonction de l'ID de la recette
      cardImage.src = `../img/${imageName}`; // Utilise le chemin relatif vers le dossier "image" et le nom de l'image généré
      cardImage.style.height = '255px';
      cardImage.style.borderRadius = '21px 21px 0 0';
      cardImage.style.width = '100%';
      cardImage.style.objectFit = 'cover';

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const cardSubTitle = document.createElement('p');
      cardSubTitle.textContent = 'Recette :';
      cardSubTitle.style.textTransform = "uppercase";
      cardSubTitle.style.color = "#7A7A7A";
      cardSubTitle.style.fontFamily = "Anton";

      const cardTitle = document.createElement('h5');
      cardTitle.classList.add('card-title');
      cardTitle.textContent = recipe.name;

      const cardText = document.createElement('p');
      cardText.classList.add('card-text');
      cardText.textContent = recipe.description;

      const cardDetails = document.createElement('div');
      cardDetails.classList.add('card-details');

      const servings = document.createElement('p');
      servings.textContent = `Servings: ${recipe.servings} pers`;
      servings.style.fontFamily = "Anton";
      servings.style.fontSize = "14px";

      const cardSubTitleIngredients = document.createElement('p');
      cardSubTitleIngredients.textContent = 'Ingrédients :';
      cardSubTitleIngredients.style.textTransform = "uppercase";
      cardSubTitleIngredients.style.color = "#7A7A7A";
      cardSubTitleIngredients.style.fontFamily = "Anton";

      const ingredientsList = document.createElement('ul');
      ingredientsList.classList.add('ingredients-list');
      recipe.ingredients.forEach((ingredientObj) => {
        const listItem = document.createElement('li');
        const { ingredient, quantity, unit } = ingredientObj;

        const ingredientName = document.createElement('span');
        ingredientName.classList.add('ingredient-name');
        ingredientName.textContent = ingredient;
        listItem.appendChild(ingredientName);

        if (quantity && unit) {
          const ingredientDetails = document.createElement('span');
          ingredientDetails.classList.add('ingredient-details');
          ingredientDetails.textContent = `${quantity} ${unit}`;
          listItem.appendChild(document.createElement('br'));
          listItem.appendChild(ingredientDetails);
        }

        ingredientsList.appendChild(listItem);
      });

      cardDetails.appendChild(servings);
      cardDetails.appendChild(ingredientsList);

      const cardButtons = document.createElement('div');
      cardButtons.classList.add('d-flex', 'justify-content-between', 'align-items-center');
      const smallText = document.createElement('small');
      smallText.classList.add('text-muted', 'small-text'); // Ajouter la classe "small-text"
      smallText.textContent = `${recipe.time} mins`;

      cardBody.appendChild(cardSubTitle);
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      cardBody.appendChild(cardSubTitleIngredients);
      cardBody.appendChild(cardDetails);
      cardBody.appendChild(cardButtons);
      cardBody.appendChild(smallText); // Déplacer smallText ici

      card.appendChild(cardImage);
      card.appendChild(cardBody);

      cardCol.appendChild(card);
      cardContainer.appendChild(cardCol);
    });

    const searchCounter = document.createElement('div');
    searchCounter.classList.add('search-counter');
    document.querySelector('.search-counter').appendChild(searchCounter);

    function updateSearchCounter(count) {
      searchCounter.textContent = `${count} RECETTES`;
    }

    updateSearchCounter(recipes.length);
  })
  .catch((error) => {
    console.log("Une erreur s'est produite lors de la récupération des recettes :", error);
  });
