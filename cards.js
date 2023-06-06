export function getRecipes() {
    return fetch('data/recipes.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log('error', e);
      });
  }
  
  
//CREATION DE MES CARD QUI CONTIENNENT MES DONNEES JSON "recipes" mes recettes
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
//   servings.style.color = "#7A7A7A";
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