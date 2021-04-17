var fetchButton = document.getElementById('fetch-button');
var ingredientID = document.getElementById('ingredients');
var ingredientIDShow = document.getElementById('yourIngredients');
var selectedElement = document.getElementById('choosen');
var addList = document.getElementById('addList');
var cardsShow = document.querySelector('.card');
var cardGroup = document.querySelector('#card-group');
var cardGroup2 = document.querySelector('#card-group2');
var clearBtn = document.querySelector('#clearBtn');

// string where ingredients are stored
var ingredientsAll = JSON.parse(localStorage.getItem("todos")) || [];

// get storage function when page reloads
getStorage();

// get storage from local storage
function getStorage() {
  ingredientIDShow.innerHTML = "";
  var storedStuff = JSON.parse(localStorage.getItem("todos"));
  if (storedStuff === null) {
    return;
  }
  for (var i = 0; i < storedStuff.length; i++) {
    var newIngredientBtn = document.createElement('button');
    newIngredientBtn.classList = 'btn btn-primary m-1';
    newIngredientBtn.textContent = storedStuff[i];
    newIngredientBtn.setAttribute("data-index", storedStuff[i]);
    ingredientIDShow.append(newIngredientBtn);
    var newIngredientCross = document.createElement('i');
    newIngredientCross.classList = 'm-1 fas fa-times';
    newIngredientCross.setAttribute("data-index", storedStuff[i]);
    newIngredientBtn.append(newIngredientCross);
  }
  if (storedStuff !== null) {
    ingredientsAll = storedStuff;
  }
};

// cat fact api start
var fURL = 'https://cat-fact.herokuapp.com/facts';
fetch(fURL)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        random = Math.floor(Math.random() * 5);
        $('#modal-body').text(data[random].text);
      });
    } else {
      $('#modal-body-error').text('Error: ' + response.statusText);
      $("#errorModal").modal('show');
    }
  })
  .catch(function (error) {
    $('#modal-body-error').text('Unable to connect to cat facts.');
    $("#errorModal").modal('show');
  });

document.getElementById('close-modal').onclick = function changeContent() {
  $("#factModal").modal("hide");
}

document.getElementById('close-modal-error').onclick = function changeContent() {
  $("#errorModal").modal("hide");
}


// cat fact api end        

// concatinate requestUrl using user parameters
function getApi() {
  var plusSymbol = ingredientsAll.join("+");

  var selectedValue = selectedElement.value;
  if (selectedValue == 'None') {
    var requestUrl = 'https://api.edamam.com/search?q=' + plusSymbol + '&app_id=a708b654&app_key=1a35f3bcb285e9a50396ce817d7c521b';
  } else {
    var requestUrl = 'https://api.edamam.com/search?q=' + plusSymbol + '&app_id=a708b654&app_key=1a35f3bcb285e9a50396ce817d7c521b&health=' + selectedValue;
  }



  // click the fetch button
  fetchButton.addEventListener('click', fetch);

  // calls API to fetch ingredients from edamam recipe finder
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cardGroup.innerHTML = "";
      cardGroup2.innerHTML = "";
      if (ingredientsAll == "") {

        $('#modal-body-error').text('You have not added any ingredients yet. Use the green plus symbol button to add each ingredient.');
        $("#errorModal").modal('show');
        return;
      } else if (data.hits.length === 0) {
        $('#modal-body-error').text('There are no recipes available for your combination of ingredients. You may have spelled an ingredient wrong, or your search may be just too weird.');
        $("#errorModal").modal('show');
        return;
      }

      if (document.getElementById('yes').checked) {
        $("#factModal").modal('show');
      }

      //  make row of 5 bootstrap cards for the recipes the API finds
      for (var i = 0; i < 5; i++) {
        newCard = document.createElement('div');
        newCard.classList = 'card';
        cardGroup.appendChild(newCard);
        innerCard = document.createElement('div');
        innerCard.classList = 'card-body';
        newCard.appendChild(innerCard);

        var recipeImg = document.createElement('img');
        recipeImg.setAttribute('src', data.hits[i].recipe.image);
        newCard.append(recipeImg);

        cardContent = document.createElement('h5');
        cardContent.textContent = data.hits[i].recipe.label;
        innerCard.appendChild(cardContent);

        cardContent2 = document.createElement('a')
        cardContent2.setAttribute('href', data.hits[i].recipe.url);
        cardContent2.setAttribute('target', '_blank');
        cardContent2.classList = 'btn btn-primary';
        cardContent2.textContent = "See recipe";
        innerCard.appendChild(cardContent2);
      }

      //  make another row of 5 bootstrap cards for the recipes the API finds
      for (var i = 5; i < 10; i++) {
        newCard = document.createElement('div');
        newCard.classList = 'card';
        cardGroup2.appendChild(newCard);
        innerCard = document.createElement('div');
        innerCard.classList = 'card-body';
        newCard.appendChild(innerCard);

        var recipeImg = document.createElement('img');
        recipeImg.setAttribute('src', data.hits[i].recipe.image)
        newCard.append(recipeImg);

        cardContent = document.createElement('h5');
        cardContent.textContent = data.hits[i].recipe.label;
        innerCard.appendChild(cardContent);

        cardContent2 = document.createElement('a')
        cardContent2.setAttribute('href', data.hits[i].recipe.url);
        cardContent2.setAttribute('target', '_blank');
        cardContent2.classList = 'btn btn-primary';
        cardContent2.textContent = "See recipe";
        innerCard.appendChild(cardContent2);
      }
    });

  // scrolls user down to the top of the first row of cards
  setTimeout(function afterTwoSeconds() {
    window.location.href = "https://mskippen.github.io/whats-in-my-pantry/#top";
  }, 2000)
}

//  when user clicks get recipe button run the getApi
fetchButton.addEventListener('click', getApi);

// add ingredient to list and create a button
function addToList(event) {
  event.preventDefault();

  // if no text in the ingredient field return from running the below code
  if (ingredientID.value === "") {
    $('#modal-body-error').text('You have not typed an ingredient in the ingredient field.');
    $("#errorModal").modal('show');
    return;
  }

  $('#confirm-fact').show();
  $('#yes-option').show();
  $('#no-option').show();

  var search = ingredientID.value.trim().toUpperCase();
  ingredientsAll.push(search);
  document.getElementById("ingredients").value = "";
  storeTodos();
  getStorage();
}

// when click on plus button add ingredient to array and create a button
addList.addEventListener('click', addToList);

ingredientID.addEventListener("keyup", function (event) {

  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    $('#confirm-fact').show();
    $('#yes-option').show();
    $('#no-option').show();

    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("addList").click();
  }
});


function storeTodos() {
  // Stringify and set key in localStorage to todos array
  localStorage.setItem("todos", JSON.stringify(ingredientsAll));
}

// on click run clear storage
clearBtn.addEventListener("click", clearStorage);

//  when use clicks on clear button the storage is cleared
function clearStorage() {
  localStorage.clear();
  ingredientIDShow.innerHTML = "";
  cardGroup.innerHTML = "";
  cardGroup2.innerHTML = "";
  ingredientsAll = [];
  $('#confirm-fact').hide();
  $('#yes-option').hide();
  $('#no-option').hide();
};

// Add click event to todoList element
ingredientIDShow.addEventListener("click", function (event) {
  var element = event.target;

  // Checks if element is a button
  if (element.matches("button") === true || element.matches("i") === true) {
    var index = element.getAttribute("data-index");
    const newArray = ingredientsAll.filter(item => item !== index)
    ingredientsAll = newArray;
    storeTodos();
    getStorage();
  }
});

$(document).ready(function () {
  $('#confirm-fact').hide();
  $('#yes-option').hide();
  $('#no-option').hide();
});