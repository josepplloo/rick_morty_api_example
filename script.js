function getRickMortysData () {
  const uriAPI = 'https://rickandmortyapi.com/api/character/'

  return fetch(uriAPI).
  then(response => response.json());
}


/**
 * https://bost.ocks.org/mike/shuffle/
 * @param {*} array 
 */
function shuffle(array) {
  var copy = [], n = array.length, i;

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * array.length);

    // If not already shuffled, move it to the new array.
    if (i in array) {
      copy.push(array[i]);
      delete array[i];
      n--;
    }
  }

  return copy;
}

function parserAssistant(stringDOM) {
  const parser = new DOMParser();
  const parsedDOM = parser.parseFromString(stringDOM, "text/html")
        .body.children;
  return parsedDOM;
}

function paintButton(){
  const buttonDOM = (`
        <button class="button" type="button">
          Show More ...
        </button>
    `) ;
    
    const buttonParserd =parserAssistant(buttonDOM);

    buttonContainer = document.querySelector(".button-container")
    buttonContainer.appendChild(buttonParserd[0]);
}

function paintHome(imagesDOM){
  firstRnd = Math.floor(Math.random() * 21); 
  secondRnd = Math.floor(Math.random() * 21); 
  thirdRnd = Math.floor(Math.random() * 21);

  console.log(imagesDOM[firstRnd], imagesDOM[secondRnd], imagesDOM[thirdRnd])

  const homeContainer = document.getElementById('home');
  homeContainer.appendChild(imagesDOM[firstRnd]);
  homeContainer.appendChild(imagesDOM[secondRnd]);
  homeContainer.appendChild(imagesDOM[thirdRnd]);

}

function paintCharacters(imagesDOM){
  const characterContainer = document.querySelector('.nav');
  characterContainer.innerHTML= imagesDOM;
}



 function buildApp(data){
  const preprosesingData = data.results.map(item => {
    return  {id,name, status,image} = item;
  });

  const imagesDOM = preprosesingData.map(item => {
    return (`
        <img id="${item.id}" src="${item.image}" alt="${item.name}" class="char-img"/>
    `) ;
  });
  
  const imagesParsed = parserAssistant(imagesDOM);

  paintHome(imagesParsed);
  paintButton();

}

getRickMortysData().then(buildApp);

