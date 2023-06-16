import { fetchRecipes } from "./data.js";

// function clickDropdown() {
//   const result = console.log("j'ai clické");
//   return result;
// }

// const toto = document.querySelectorAll(".dropdown");
// toto.addEventListener("click", myFunctionClick);

// function myFunctionClick() {
//   console.log("j'ai clické");
// }

fetchRecipes()
  .then((recipes) => {
    console.log(recipes);

    const dropdown = document.querySelector(".dropdown");

    dropdown.addEventListener("click", toggleDropdown);

    // function toggleDropdown() {
    //   console.log("j'ai clické");
    // }

    function filterList() {
      // Code de filtrage du dropdown
      // Utilisez les données des recettes (variable "recipes") ici
    }

    // Fonction "toggleDropdown" à comme parametre dropdown
    function toggleDropdown(dropdown) {
      console.log("j'ai clické");

      // constante  dropdownContent dans laquel mon parametre doropdown va chercher la class .dropdown-content
      const dropdownContent = document.getElementById("dropdown-content");
      // faire une boucle sur dropdown content qui sera un tableau
      console.log(dropdownContent);
      // constante  dropdownArrow dans laquel mon parametre doropdown va chercher la class .dropdown-arrow
      const dropdownArrow1 = document.getElementById("arrow1");
      const dropdownArrow2 = document.getElementById("arrow2");
      const dropdownArrow3 = document.getElementById("arrow3");
      // J'ajoute  une class show à dropdownContent
      dropdownContent.classList.toggle("show");
      // J'ajoute  une class opened à dropdownArrow
      dropdownArrow1.classList.toggle("opened");
      dropdownArrow2.classList.toggle("opened");

      dropdownArrow3.classList.toggle("opened");

      // si ma class.dropdown-content à la class show
      if (dropdownContent.classList.contains("show")) {
        //ALORS
        const dropdownListScrollable = dropdownContent.querySelector(
          ".dropdown-list-scrollable"
        );
        const maxHeight =
          window.innerHeight - dropdownContent.getBoundingClientRect().top - 20;
        dropdownListScrollable.style.maxHeight = maxHeight + "px";
      }
    }

    function filterList() {
      const dropdown = this.parentNode.parentNode;
      const searchInputDropdown = dropdown.querySelector(
        ".search-input-dropdown"
      );
      const dropdownList = dropdown.querySelector(".dropdown-list");
      const searchValue = searchInputDropdown.value.toLowerCase();
      const items = Array.from(dropdownList.getElementsByTagName("li"));
      const selectedTags = getSelectedTags();

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
          hasAllSelectedTags(cardTags, selectedTags)
        ) {
          cardContainer.style.display = "block";
        } else {
          cardContainer.style.display = "none";
        }
      });
    }

    const searchInputDropdowns = document.querySelectorAll(
      ".search-input-dropdown"
    );
    searchInputDropdowns.forEach(function (input) {
      input.addEventListener("input", filterList);
    });

    function createSelectOptions(selectElement, options) {
      selectElement.innerHTML = "";

      options.forEach((option) => {
        const newOption = document.createElement("li");
        newOption.textContent = option;
        newOption.addEventListener("click", function () {
          addTag(option, selectElement.id);
        });
        selectElement.appendChild(newOption);
      });
    }

    const ingredientsList = document.querySelector("#ingredients");
    const appliancesList = document.querySelector("#appareils");
    const utensilsList = document.querySelector("#ustensils");

    const ingredients = recipes.reduce((acc, recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (!acc.includes(ingredient.ingredient)) {
          acc.push(ingredient.ingredient);
        }
      });
      return acc;
    }, []);
    createSelectOptions(ingredientsList, ingredients);

    const appliances = recipes.reduce((acc, recipe) => {
      if (!acc.includes(recipe.appliance)) {
        acc.push(recipe.appliance);
      }
      return acc;
    }, []);
    createSelectOptions(appliancesList, appliances);

    const utensils = recipes.reduce((acc, recipe) => {
      recipe.ustensils.forEach((utensil) => {
        if (!acc.includes(utensil)) {
          acc.push(utensil);
        }
      });
      return acc;
    }, []);
    createSelectOptions(utensilsList, utensils);

    function getSelectedTags() {
      const selectedTags = Array.from(
        document.querySelectorAll(".tag-item.selected")
      ).map((tag) => tag.innerText.toLowerCase());
      return selectedTags;
    }

    function getTagsForRecipe(recipeId) {
      // Code pour récupérer les tags associés à une recette à partir de son ID
      // Retourne un tableau de tags
    }

    function hasAllSelectedTags(cardTags, selectedTags) {
      return selectedTags.every((tag) => cardTags.includes(tag));
    }

    function addTag(tagText, dropdownId) {
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

      toggleDropdown(dropdown);

      filterRecipesByTags();
    }

    function removeTag(tag, dropdownId) {
      const tagsContainer = document.querySelector("#tags-container");
      tagsContainer.removeChild(tag);

      const dropdownItem = document.querySelector(`#${dropdownId} li`);
      dropdownItem.classList.remove("hidden");

      filterRecipesByTags();
    }

    function filterRecipesByTags() {
      const selectedTags = Array.from(
        document.querySelectorAll("#tags-container .tag .content")
      );
      console.log(selectedTags);
      const selectedIngredients = [];
      const selectedAppliances = [];
      const selectedUtensils = [];

      selectedTags.forEach((tag) => {
        const tagName = tag.textContent.toLowerCase();
        console.log(tag.parentNode.classList);
        console.log(tagName);
        if (tag.parentNode.classList.contains("ingredients")) {
          console.log('toto');
          selectedIngredients.push(tagName);
        } else if (tag.parentNode.classList.contains("appareils")) {
          selectedAppliances.push(tagName);
        } else if (tag.parentNode.classList.contains("ustensils")) {
          selectedUtensils.push(tagName);
        }
      });

      recipes.forEach((recipe) => {
        const { id } = recipe;
        const cardContainer = document.querySelector(
          `#card-container .col[data-recipe-id="${id}"]`
        );
        const shouldDisplay = checkRecipeTags(
          recipe,
          selectedIngredients,
          selectedAppliances,
          selectedUtensils
        );
      

        if (cardContainer) {
          cardContainer.style.display = shouldDisplay ? "block" : "none";
        }
      });
    }
/////
    function verifierPresence(selectedTagsText, recipeContent) {
      console.log(selectedTagsText);
      console.log(recipeContent);

      for (let i = 0; i < selectedTagsText.length; i++) {
        if (!recipeContent.includes(selectedTagsText[i])) {
          return false;
        }
      }
      return true;
    }
//////

    function checkRecipeTags(
      recipe,
      selectedIngredients,
      selectedAppliances,
      selectedUtensils
    ) {
      console.log('checkRecipeTags');
      const { ingredients, appliance, ustensils } = recipe;

      if (selectedIngredients.length > 0) {
        const recipeIngredients = ingredients.map((ingredient) =>
          ingredient.ingredient.toLowerCase()
        );
        console.log(selectedIngredients);
        console.log(verifierPresence(selectedIngredients,recipeIngredients));
        return verifierPresence(selectedIngredients,recipeIngredients);
      }

      if (
        selectedAppliances.length > 0 &&
        !selectedAppliances.includes(appliance.toLowerCase())
      ) {
        return false;
      }

      if (selectedUtensils.length > 0) {
        const recipeUtensils = ustensils.map((utensil) =>
          utensil.toLowerCase()
        );
        const hasAllUtensils = selectedUtensils.every((utensil) =>
          recipeUtensils.includes(utensil)
        );

        if (!hasAllUtensils) {
          return false;
        }
      }

      return true;
    }
  })
  .catch((error) => {
    console.log(
      "Une erreur s'est produite lors de la récupération des recettes :",
      error
    );
  });

  // variable resultat qui stock celui des mon input ou tag 

  // recuperer les tags qui a dans les recettes restantent