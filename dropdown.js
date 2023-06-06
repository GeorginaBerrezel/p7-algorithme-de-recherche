
  // DROP DOWN
  // Fonction pour afficher ou masquer le contenu du dropdown
  function toggleDropdown(dropdown) {
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    const dropdownArrow = dropdown.querySelector('.dropdown-arrow');
    dropdownContent.classList.toggle('show');
    dropdownArrow.classList.toggle('opened');
  
    // Ajout d'un ajustement pour recalculer la hauteur maximale du contenu scrollable
    if (dropdownContent.classList.contains('show')) {
      const dropdownListScrollable = dropdownContent.querySelector('.dropdown-list-scrollable');
      const maxHeight = window.innerHeight - dropdownContent.getBoundingClientRect().top - 20; // Ajustez la marge en conséquence
      dropdownListScrollable.style.maxHeight = maxHeight + 'px';
    }
  }
  
  // Événement pour filtrer la liste au fur et à mesure que l'utilisateur tape dans le champ de recherche
  function filterList() {
    const dropdown = this.parentNode.parentNode;
    const searchInputDropdown = dropdown.querySelector('.search-input-dropdown');
    const dropdownList = dropdown.querySelector('.dropdown-list');
    const searchValue = searchInputDropdown.value.toLowerCase();
    const items = Array.from(dropdownList.getElementsByTagName('li'));
    const selectedTags = getSelectedTags();
  
    items.forEach(function(item) {
      const text = item.innerText.toLowerCase();
      if (text.includes(searchValue)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  
    // Filtrer les recettes en fonction de la valeur de recherche
    const query = searchValue.trim(); // Trim pour supprimer les espaces vides
    const matchingRecipes = searchRecipes(query);
    const cardContainers = document.querySelectorAll('#card-container .col');
    
    cardContainers.forEach((cardContainer) => {
      const recipeId = parseInt(cardContainer.getAttribute('data-recipe-id'));
      const cardTags = getTagsForRecipe(recipeId);
  
      if (matchingRecipes.includes(recipeId) && hasAllSelectedTags(cardTags, selectedTags)) {
        cardContainer.style.display = 'block'; // Afficher les cartes correspondant à la recherche et aux tags sélectionnés
      } else {
        cardContainer.style.display = 'none'; // Masquer les cartes qui ne correspondent pas à la recherche ou aux tags sélectionnés
      }
    });
  }
  
  
  
  const searchInputDropdowns = document.querySelectorAll('.search-input-dropdown');
  searchInputDropdowns.forEach(function(input) {
    input.addEventListener('input', filterList);
  });
  
  
  // Fonction pour créer les options de filtre
  function createSelectOptions(selectElement, options) {
    selectElement.innerHTML = ''; // Effacer les éléments existants
  
    options.forEach((option) => {
      const newOption = document.createElement("li");
      newOption.textContent = option;
      newOption.addEventListener('click', function() {
        addTag(option, selectElement.id);
      });
      selectElement.appendChild(newOption);
    });
  }
  
  // Récupérer les éléments <ul> correspondants
  const ingredientsList = document.querySelector('#ingredients');
  const appliancesList = document.querySelector('#appareils');
  const utensilsList = document.querySelector('#ustensils');
  
  // Créer les options de filtre pour les ingrédients
  const ingredients = recipes.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!acc.includes(ingredient.ingredient)) {
        acc.push(ingredient.ingredient);
      }
    });
    return acc;
  }, []);
  createSelectOptions(ingredientsList, ingredients);
  
  // Créer les options de filtre pour les appareils
  const appliances = recipes.reduce((acc, recipe) => {
    if (!acc.includes(recipe.appliance)) {
      acc.push(recipe.appliance);
    }
    return acc;
  }, []);
  createSelectOptions(appliancesList, appliances);
  
  // Créer les options de filtre pour les ustensiles
  const utensils = recipes.reduce((acc, recipe) => {
    recipe.ustensils.forEach((utensil) => {
      if (!acc.includes(utensil)) {
        acc.push(utensil);
      }
    });
    return acc;
  }, []);
  createSelectOptions(utensilsList, utensils);
// Récupérer les tags sélectionnés
function getSelectedTags() {
    const selectedTags = Array.from(document.querySelectorAll('.tag-item.selected')).map((tag) => tag.innerText.toLowerCase());
    return selectedTags;
  }
  
  // Récupérer les tags pour une recette donnée
  function getTagsForRecipe(recipeId) {
    // Code pour récupérer les tags associés à une recette à partir de son ID
    // Retourne un tableau de tags
  }
  
  // Vérifier si une recette a tous les tags sélectionnés
  function hasAllSelectedTags(cardTags, selectedTags) {
    return selectedTags.every((tag) => cardTags.includes(tag));
  }
  
  // Fonction pour ajouter un tag
  function addTag(tagText, dropdownId) {
    const tagsContainer = document.querySelector('#tags-container');
  
    // Créer l'élément du tag
    const tag = document.createElement('div');
    tag.classList.add('tag');
  
    // Ajouter le texte du tag
    const tagTextElement = document.createElement('span');
    tagTextElement.textContent = tagText;
    tag.appendChild(tagTextElement);
  
    // Ajouter le bouton de suppression du tag
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function () {
      removeTag(tag, dropdownId);
    });
    tag.appendChild(closeButton);
  
    // Ajouter une classe au tag en fonction du dropdown d'origine
    tag.classList.add(dropdownId);
  
    // Masquer l'élément correspondant dans le dropdown
    const dropdownItem = document.querySelector(`#${dropdownId} li`);
    dropdownItem.classList.add('hidden');
  
    // Ajouter le tag à la liste des tags
    tagsContainer.appendChild(tag);
  
    // Réinitialiser le champ de recherche du dropdown correspondant
    const dropdown = document.querySelector(`#${dropdownId}`);
    const searchInputDropdown = dropdown.querySelector('.search-input-dropdown');
    // searchInputDropdown.value = '';
  
    // Masquer le contenu du dropdown
    toggleDropdown(dropdown);
  
    // Filtrer les recettes en fonction des tags
    filterRecipesByTags();
  }
  
  
  // Fonction pour supprimer un tag
  function removeTag(tag, dropdownId) {
    const tagsContainer = document.querySelector('#tags-container');
    tagsContainer.removeChild(tag);
  
    // Réafficher l'élément correspondant dans le dropdown
    const dropdownItem = document.querySelector(`#${dropdownId} li`);
    dropdownItem.classList.remove('hidden');
  
    // Filtrer les recettes en fonction des tags
    filterRecipesByTags();
  }
  
  
  // Filtrer les recettes en fonction des tags sélectionnés
  function filterRecipesByTags() {
    const selectedTags = Array.from(document.querySelectorAll('#tags-container .tag'));
    const selectedIngredients = [];
    const selectedAppliances = [];
    const selectedUtensils = [];
  
    // Collecter les tags sélectionnés pour chaque catégorie
    selectedTags.forEach((tag) => {
      const tagName = tag.textContent.toLowerCase();
      if (tag.classList.contains('ingredients')) {
        selectedIngredients.push(tagName);
      } else if (tag.classList.contains('appareils')) {
        selectedAppliances.push(tagName);
      } else if (tag.classList.contains('ustensils')) {
        selectedUtensils.push(tagName);
      }
    });
  
    // Filtrer les recettes en fonction des tags sélectionnés
    recipes.forEach((recipe) => {
      const { id } = recipe;
      const cardContainer = document.querySelector(`#card-container .col[data-recipe-id="${id}"]`);
      const shouldDisplay = checkRecipeTags(recipe, selectedIngredients, selectedAppliances, selectedUtensils);
  
      if (cardContainer) {
        cardContainer.style.display = shouldDisplay ? 'block' : 'none';
      }
    });
  }
  
  // Vérifier si une recette correspond aux tags sélectionnés
  function checkRecipeTags(recipe, selectedIngredients, selectedAppliances, selectedUtensils) {
    const { ingredients, appliance, ustensils } = recipe;
  
    // Vérifier les ingrédients
    if (selectedIngredients.length > 0) {
      const recipeIngredients = ingredients.map((ingredient) => ingredient.ingredient.toLowerCase());
      const hasAllIngredients = selectedIngredients.every((ingredient) => recipeIngredients.includes(ingredient));
  
      if (!hasAllIngredients) {
        return false;
      }
    }
  
    // Vérifier l'appareil
    if (selectedAppliances.length > 0 && !selectedAppliances.includes(appliance.toLowerCase())) {
      return false;
    }
  
    // Vérifier les ustensiles
    if (selectedUtensils.length > 0) {
      const recipeUtensils = ustensils.map((utensil) => utensil.toLowerCase());
      const hasAllUtensils = selectedUtensils.every((utensil) => recipeUtensils.includes(utensil));
  
      if (!hasAllUtensils) {
        return false;
      }
    }
  
    return true;
  }

// Ajouter un élément de compteur dans le HTML
const searchCounter = document.createElement('div');
searchCounter.classList.add('search-counter');
document.querySelector('.search-counter').appendChild(searchCounter);

// Mettre à jour le compteur
function updateSearchCounter(count) {
  searchCounter.textContent = `${count} RECETTES`;
}

// Mettre à jour le compteur initial avec le nombre total de recettes
updateSearchCounter(recipes.length);

