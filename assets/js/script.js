var issueContainer = document.getElementById('issues');
var fetchButton = document.getElementById('fetch-button');
var ingredientID = document.getElementById('ingredients');
var ingredientIDShow = document.getElementById('yourIngredients');
var selectedElement = document.getElementById('choosen');
var addList = document.getElementById('addList');
var cardsShow = document.querySelector('.card');
var cardGroup = document.querySelector('#card-group');
var cardGroup2 = document.querySelector('#card-group2');

// Set var parse to local storage
var savedIngredients = JSON.parse(localStorage.getItem("ingredients")) || []
console.log(savedIngredients)
window.addEventListener("load", function() {
  savedIngredients.forEach(function(ingredient) {
    var newIngredientBtn = document.createElement('p');
    newIngredientBtn.textContent = ingredient;
    ingredientIDShow.append(newIngredientBtn);
    document.getElementById("ingredients").value = "";
  })
})
var ingredientsAll = [];

function getApi() {
  var plusSymbol = ingredientsAll.join("+");
  console.log(plusSymbol);
  var selectedValue = selectedElement.value;

  if (selectedValue == 'None') {
    var requestUrl = 'https://api.edamam.com/search?q=' + plusSymbol + '&app_id=a708b654&app_key=1a35f3bcb285e9a50396ce817d7c521b';

  } else {
    var requestUrl = 'https://api.edamam.com/search?q=' + plusSymbol + '&app_id=a708b654&app_key=1a35f3bcb285e9a50396ce817d7c521b&health=' + selectedValue;
  }

  console.log(requestUrl);

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (ingredientsAll == "") {
        alert('You have not added any ingredients yet. Use the green plus symbol button to add each ingredient.');
        return;
      } else if (data.hits.length === 0) {
        alert('There are no recipes available for your combination of ingredients. You may have spelled an ingredient wrong, or your search may be just too weird.');
        return;
      }



      for (var i = 0; i < 4; i++) {
        newCard = document.createElement('div');
        newCard.classList = 'card';
        cardGroup.appendChild(newCard);
        // newCard.setAttribute('style', 'width: 350px');
        innerCard = document.createElement('div');
        innerCard.classList = 'card-body';
        newCard.appendChild(innerCard);

        var recipeImg = document.createElement('img');
        // recipeImg.classList = 'card-img-top';
        recipeImg.setAttribute('src', data.hits[i].recipe.image);
        newCard.append(recipeImg);

        cardContent = document.createElement('h5');
        cardContent.textContent = data.hits[i].recipe.label;
        innerCard.appendChild(cardContent);

        cardContent2 = document.createElement('a')
        cardContent2.setAttribute('href', data.hits[i].recipe.url);
        cardContent2.classList = 'btn btn-primary';
        // cardContent2.textContent = data.hits[i].recipe.url;
        cardContent2.textContent = "See recipe";
        innerCard.appendChild(cardContent2);

      }

      for (var i = 4; i < 9; i++) {
        newCard = document.createElement('div');
        newCard.classList = 'card';
        cardGroup2.appendChild(newCard);
        // newCard.setAttribute('style', 'width: 350px');
        innerCard = document.createElement('div');
        innerCard.classList = 'card-body';
        newCard.appendChild(innerCard);

        var recipeImg = document.createElement('img');
        // recipeImg.classList = 'card-img-top';
        recipeImg.setAttribute('src', data.hits[i].recipe.image)
        newCard.append(recipeImg);

        cardContent = document.createElement('h5');
        cardContent.textContent = data.hits[i].recipe.label;
        innerCard.appendChild(cardContent);

        cardContent2 = document.createElement('a')
        cardContent2.setAttribute('href', data.hits[i].recipe.url);
        cardContent2.classList = 'btn btn-primary';
        // cardContent2.textContent = data.hits[i].recipe.url;
        cardContent2.textContent = "See recipe";
        innerCard.appendChild(cardContent2);

      }
    });
}
// Start local storage
function saveToLocalStorage (ingredient) {
  var ingredientArr = []
  if(localStorage.getItem("ingredients") === null) {
      ingredientArr = []
  } else {
      ingredientArr = JSON.parse(localStorage.getItem("ingredients"))
  }
  ingredientArr.push(ingredient)
  localStorage.setItem("ingredients", JSON.stringify(ingredientArr))
}
// End local storage

fetchButton.addEventListener('click', getApi);

function addToList(event) {
  event.preventDefault();
  var search = ingredientID.value.trim().toUpperCase();
  ingredientsAll.push(search);
  console.log(ingredientsAll);
  var newIngredientBtn = document.createElement('p');
  newIngredientBtn.textContent = search;
  ingredientIDShow.append(newIngredientBtn);
  document.getElementById("ingredients").value = "";
  console.log(search)
  saveToLocalStorage(search) //save to local storage
}


addList.addEventListener('click', addToList);


ingredientID.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("addList").click();
  }
});