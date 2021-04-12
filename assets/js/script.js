var issueContainer = document.getElementById('issues');
var fetchButton = document.getElementById('fetch-button');
var ingredientID = document.getElementById('ingredients');
var ingredientIDShow = document.getElementById('yourIngredients');
var selectedElement = document.getElementById('choosen');
var addList = document.getElementById('addList');
var cardsShow = document.querySelector('.card');
var cardGroup = document.querySelector('#card-group');
var cardGroup2 = document.querySelector('#card-group2');
var clearBtn = document.querySelector('#clearBtn');

var ingredientsAll = JSON.parse(localStorage.getItem("todos")) || [];
console.log(ingredientsAll);

getStorage();

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
      alert('Error: ' + response.statusText);
    }
  })
  .catch(function (error) {
    alert('Unable to connect to cat facts');
  });


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



      for (var i = 0; i < 5; i++) {
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

      for (var i = 5; i < 10; i++) {
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


fetchButton.addEventListener('click', getApi);

function addToList(event) {
  event.preventDefault();
  var search = ingredientID.value.trim().toUpperCase();
  ingredientsAll.push(search);
  var newIngredientBtn = document.createElement('button');
  newIngredientBtn.classList = 'btn btn-primary m-1';
  newIngredientBtn.textContent = search;
  newIngredientBtn.setAttribute("data-index", search);
  ingredientIDShow.append(newIngredientBtn);
  var newIngredientCross = document.createElement('i');
  newIngredientCross.classList = 'm-1 fas fa-times';
  newIngredientBtn.append(newIngredientCross);
  document.getElementById("ingredients").value = "";
  storeTodos();
  getStorage()
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


function storeTodos() {
  // Stringify and set key in localStorage to todos array
  localStorage.setItem("todos", JSON.stringify(ingredientsAll));
}

// on click run clear storage
clearBtn.addEventListener("click", clearStorage);


function clearStorage() {
  localStorage.clear();
  ingredientIDShow.innerHTML = "";
  cardGroup.innerHTML = "";
  cardGroup2.innerHTML = "";
  ingredientsAll = [];
};

// Add click event to todoList element
ingredientIDShow.addEventListener("click", function (event) {
  var element = event.target;

  console.log(element);
  // Checks if element is a button
  if (element.matches("button") === true) {
    var index = element.getAttribute("data-index");
    const newArray = ingredientsAll.filter(item => item !== index)
    ingredientsAll = newArray;
    console.log(newArray);
    storeTodos();
    getStorage();
  }
});

