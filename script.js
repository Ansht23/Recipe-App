const searchBar = document.querySelector(".searchBar");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetails = document.querySelector(".recipe-info");
const closeBtn = document.querySelector(".recipe-close-Btn");

const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  recipeContainer.classList.remove("has-recipes"); // Reset layout when searching

  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();

    recipeContainer.innerHTML = "";

    if (!response.meals) {
      recipeContainer.innerHTML = "<h2>No recipes found</h2>";
      return;
    }

    recipeContainer.classList.add("has-recipes"); // Switch to grid layout

    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3> 
        <p>Category: ${meal.strCategory}</p>
        <p>Area: ${meal.strArea} Dish</p>
      `;

      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML =
      "<h2>There was an error while fetching recipes.</h2>";
  }
};

const fetchIngredients = (meal) => {
  let ingredientList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientList;
};

const openRecipePopup = (meal) => {
  recipeDetails.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients: </h3>
    <ul class="ingredientList"> ${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    `;
  recipeDetails.parentElement.style.display = "block";
};

closeBtn.addEventListener("click", () => {
  recipeDetails.parentElement.style.display = "none";
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBar.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = "<h2>Please enter a meal</h2>";
    return;
  }
  fetchRecipes(searchInput);
});

searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});
