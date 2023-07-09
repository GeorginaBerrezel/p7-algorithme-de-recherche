import { fetchRecipes } from "./data.js";
// recuoérer que les recettes filtré
// pleine par défault et la faire evoluer
// console.log pour voir si j'ai bien une liste trié

fetchRecipes()
  .then((recipes) => {
    // Affichage de toutes mes recettes yo !
    // console.log(recipes);
    // Selection de toutes mes class .dropdown
    const dropdowns = document.querySelectorAll(".dropdown");
    // Boucle sur chacun de mes dropdown via ma constante dropdownS
    // J'ajoute un écouteur d'evenement pour activer le toggle de mon dropdown
    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", toggleDropdown);
  
    });
    // Function pour mon TOGGLE
    function toggleDropdown(event) {
      // console.log("J'ai cliqué");
      
      let dropdown = event.target.parentNode; // Chaque dropdown est composé de l'évènement de sa cible actuelle
          // IF .classList.contains (dropdown-arrow) dropdow = dropdown.parentNode  
      console.log(dropdown);
      const dropdownContent = dropdown?.querySelector(".dropdown-content"); // S'il existe, je selectionne mon .dropdown-content
      const dropdownArrows = dropdown?.querySelectorAll(".dropdown-arrow");// S'il existe, je selectionne mon .dropdown-arrow
    
      if (dropdownContent) {
        dropdownContent.classList.toggle("show"); // SI je passe dans dropdownContent alors je lui ajoute la class show
      }
    
      if (dropdownArrows) { // SI je passe dans dropdownArrows
        dropdownArrows.forEach((arrow) => { // ALORS pour toutes mes arrow 
          arrow.classList.toggle("opened"); // je lui ajoute la class "opened"
        });
      }
    
      if (dropdownContent?.classList.contains("show")) { // SI dropdownContent EXISTE et qu'il contient la class "show"
         // Vérifie si la classe "show" est présente dans la liste des classes de dropdownContent
        // L'opérateur ?. permet de s'assurer que dropdownContent est défini avant d'accéder à ses propriétés
        const dropdownListScrollable = dropdownContent.querySelector(".dropdown-list-scrollable"); // Récupère l'élément avec la classe "dropdown-list-scrollable" à l'intérieur de dropdownContent
        const maxHeight = window.innerHeight - dropdownContent.getBoundingClientRect().top - 20; // Calcule la hauteur maximale pour dropdownListScrollable en fonction de la position de dropdownContent dans la fenêtre
        dropdownListScrollable.style.maxHeight = maxHeight + "px"; // Définit la hauteur maximale de dropdownListScrollable en utilisant la valeur calculée
      }
    }
    
    
    // Function qui filtre mes recettes
    function filterRecipes() {
      // console.log('je passe dans ma fonction filterRecipes');
      const dropdowns = document.querySelectorAll(".dropdown");

      dropdowns.forEach((dropdown) => {
        // const dropdownContent = dropdown.querySelector(".dropdown-content");
        const searchInputDropdown = dropdown.querySelector(
          ".search-input-dropdown"
        );
        const dropdownList = dropdown.querySelector(".dropdown-list");
        const searchValue = searchInputDropdown.value.toLowerCase();
        const items = Array.from(dropdownList.getElementsByTagName("li"));

        // Display les li des items

        items.forEach(function (item) {
          const text = item.innerText.toLowerCase();
          if (text.includes(searchValue)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });

        const query = searchValue.trim();
        const matchingRecipes = searchRecipes(query);
        const cardContainers = document.querySelectorAll("#card-container .col");

        cardContainers.forEach((cardContainer) => {
          const recipeId = parseInt(cardContainer.getAttribute("data-recipe-id"));
          const cardTags = getTagsForRecipe(recipeId);

          if (
            matchingRecipes.includes(recipeId) &&
            hasAllSelectedTags(cardTags, getSelectedTags())
          ) {
            cardContainer.style.display = "block";
          } else {
            cardContainer.style.display = "none";
          }
        });
      });
    }

    const searchInputDropdowns = document.querySelectorAll(".search-input-dropdown");
    searchInputDropdowns.forEach((input) => {
      input.addEventListener("input", filterRecipes);
    });


    //fonction qui créer les li dans mon dropdown-content
    function createSelectOptions(selectElement, options) {

      // console.log(options);
     
      selectElement.innerHTML = "";
      // console.log('toto', selectElement);

      options.forEach((option) => {
        const newOption = document.createElement("li");
        newOption.textContent = option;

        // console.log(newOption);

        newOption.addEventListener("click", function () {
          addTag(option, selectElement.id); // select element correspond à un de mes ingrédients qui se trouve dans un li
        });
        selectElement.appendChild(newOption);
      });
    }
    // // Les li sont ensnuite ajouté dans mes 3 listes d'ingrédients

    const ingredientsList = document.querySelector("#ingredients");
    const appliancesList = document.querySelector("#appareils");
    const utensilsList = document.querySelector("#ustensils");

    const ingredients = recipes.reduce((acc, recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (!acc.includes(ingredient.ingredient)) {
          acc.push(ingredient.ingredient);
          // console.log('toto',acc);
        }
      });
      return acc;
    }, []);
    createSelectOptions(ingredientsList, ingredients);
    // console.log(ingredients);

    const appliances = recipes.reduce((acc, recipe) => {
      if (!acc.includes(recipe.appliance)) {
        acc.push(recipe.appliance);
      }
      return acc;
    }, []);
    createSelectOptions(appliancesList, appliances);
    // console.log(appliances);


    const utensils = recipes.reduce((acc, recipe) => {
      recipe.ustensils.forEach((utensil) => {
        if (!acc.includes(utensil)) {
          acc.push(utensil);
        }
      });
      return acc;
    }, []);
    createSelectOptions(utensilsList, utensils);
    // console.log(utensils);

    // console.log(ingredientsList, appliancesList, utensilsList);

    function addTag(tagText, dropdownId) {
      // console.log('je passe dans ma fonction addTag')

      const tagsContainer = document.querySelector("#tags-container");


      const tag = document.createElement("div");
      tag.classList.add("tag");

      const tagTextElement = document.createElement("span");
      tagTextElement.textContent = tagText;
      tagTextElement.classList.add("content");
      tag.appendChild(tagTextElement);

      const closeButton = document.createElement("span");
      closeButton.classList.add("close-button");
      closeButton.innerHTML = "&times;";
      closeButton.addEventListener("click", function () {
        removeTag(tag, dropdownId);
      });
      tag.appendChild(closeButton);

      tag.classList.add(dropdownId);

      const dropdownItem = document.querySelector(`#${dropdownId} li`);
      dropdownItem.classList.add("hidden");

      tagsContainer.appendChild(tag);

      // toggleDropdown();


      // cette fonction permet de faire le tri grace aux filtres selectionnées
      filterRecipesByTags();
      // le bug: c'est comme si la fonction "filterRecipesByTags()" ne se lance jamais
      // et verifier comment la fonction sais quelles tags à été selectionnés ?

      // Utiliser la fonction de recherche habituelle, avec les tags selectionnés

    }

    function removeTag(tag, dropdownId) {
      const tagsContainer = document.querySelector("#tags-container");
      tagsContainer.removeChild(tag);

      const dropdownItem = document.querySelector(`#${dropdownId} li`);
      dropdownItem.classList.remove("hidden");

      filterRecipesByTags();
    }

    function filterRecipesByTags() {
      // console.log('je passe dans ma fonction filterRecipesByTags');

      const selectedTags = Array.from(
        document.querySelectorAll("#tags-container .tag .content")
      );
      // console.log(selectedTags);
      const selectedIngredients = [];
      const selectedAppliances = [];
      const selectedUstensils = [];

      selectedTags.forEach((tag) => {
        const tagName = tag.textContent.toLowerCase();
        // console.log(tag.parentNode.classList);
        // console.log(tagName);

        // c'est ici que le filtre de tri, vérifie si les ingredients/appareils/ustensils
        if (tag.parentNode.classList.contains("ingredients")) {
          // console.log('toto');
          selectedIngredients.push(tagName);
        } else if (tag.parentNode.classList.contains("appareils")) {
          // console.log('tata');

          selectedAppliances.push(tagName);
        } else if (tag.parentNode.classList.contains("ustensils")) {
          // console.log('titi');

          selectedUstensils.push(tagName);
        }
      });

      recipes.forEach((recipe) => {
    

        const { id } = recipe;
        const cardContainer = document.querySelector(
          `#card-container .col[data-recipe-id="${id}"]`
        );
        // console.log(cardContainer);

        const shouldDisplay = checkRecipeTags(
          recipe,
          selectedIngredients,
          selectedAppliances,
          selectedUstensils
        );
        // console.log(shouldDisplay);


        if (cardContainer) {
          
          cardContainer.style.display = shouldDisplay ? "block" : "none";
         
          // console.log('wesh wesh',cards);
          // console.log(`Nombre de cartes : ${numberOfCards}`);

        }

      });

      const searchCounter = document.createElement('div');
      searchCounter.classList.add('search-counter');
      document.querySelector('.search-counter').appendChild(searchCounter);
      
      function updateSearchCounter(numberOfCards) {
        searchCounter.textContent = `${numberOfCards} RECETTES`;
      }

      const cards = document.querySelectorAll('.col[style*="display: block"]');
      const numberOfCards = cards.length;
      updateSearchCounter(numberOfCards);

    }

    function verifierPresence(selectedTagsText, recipeContent) {
      // console.log('je passe dans ma fonction verifierPresence');
      // console.log(selectedTagsText);
      // console.log(recipeContent);

      for (let i = 0; i < selectedTagsText.length; i++) {
        if (!recipeContent.includes(selectedTagsText[i])) {
          return false;
        }
      }
      return true;
    }

    function checkRecipeTags(
      recipe,
      selectedIngredients,
      selectedAppliances,
      selectedUstensils
    ) { 
      // console.log('checkRecipeTags');
      const { ingredients, appliances, ustensils } = recipe;
      // console.log(recipe);
      if (selectedIngredients.length > 0) {
        const recipeIngredients = ingredients.map((ingredient) =>
          ingredient.ingredient.toLowerCase()
        );
        return verifierPresence(selectedIngredients, recipeIngredients);

      }

      if (selectedAppliances.length > 0) {
        console.log(appliances);
        return verifierPresence(selectedAppliances, recipeAppliances);
      }
      

      if (selectedUstensils.length > 0) {
        const recipeUtensils = ustensils.map((ustensil) =>
        ustensil.ustensil.toLowerCase()
        );
        return verifierPresence(selectedUstensils, recipeUtensils);
      }

      // return true;
    }

    // Le bloc de code suivant est ajouté ici pour compléter le script

    fetchRecipes()
      .then(() => {
        // Le reste du code de votre gestionnaire d'erreur ici
      })
      .catch((error) => {
        console.log(
          "Une erreur s'est produite lors de la récupération des recettes :",
          error
        );
      });

  })
  .catch((error) => {
    console.log(
      "Une erreur s'est produite lors de la récupération des recettes :",
      error
    );
  });



