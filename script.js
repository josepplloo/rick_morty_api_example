function getRickMortysData () {
  const uriAPI = 'https://rickandmortyapi.com/api/character/'

  return fetch(uriAPI).
  then(response => response.json());
}

/**
   * BUG ALERT, The page does not redirect
   * onli change the url
   */
function locationHelper (whereIAm){
  history.replaceState({
    id: 'whereIAm'
    }, '', whereIAm);
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

function paintDetails(item){
  

  const detailDOM = (`
    <div>
      <img id="${item.id}" src="${item.src}" alt="${item.alt}" class="char-img"/>
      <h3>${item.alt}</h3>
      <p>${item.attributes.status.value}</p>
    </div>  
    `) ;
  return parserAssistant(detailDOM);
}

function paintHome(imagesDOM){

  locationHelper('/home');

  firstRnd = Math.floor(Math.random() * 21); 
  secondRnd = Math.floor(Math.random() * 21); 
  thirdRnd = Math.floor(Math.random() * 21);

  /**
   * BUG ALERT, sometimes the same image apear or some
   * ones disapiar
   */
  console.log(imagesDOM[firstRnd], imagesDOM[secondRnd], imagesDOM[thirdRnd])

  const homeContainer = document.getElementById('home');
  homeContainer.appendChild(imagesDOM[firstRnd]);
  homeContainer.appendChild(imagesDOM[secondRnd]);
  homeContainer.appendChild(imagesDOM[thirdRnd]);

}

function paintCharacters(imagesDOM){
  locationHelper('/characters');

  const characterContainer = document.getElementById('characters');
  const detailsContainer = document.getElementById('details');

  for (const iterator of imagesDOM) {
    characterContainer.appendChild(iterator);
  }

  characterContainer.addEventListener('click',
  function(event){
    const clickedElement = event.target;

    if(clickedElement.nodeName == 'IMG' ){
      const details = paintDetails(clickedElement);
      locationHelper('/details');
      detailsContainer.appendChild(details[0]);
      detailsContainer.classList.remove('blackHole');
      characterContainer.classList.add('blackHole');
    }
     
  });
}



 function buildApp(data){
  const preprosesingData = data.results.map(item => {
    return  {id,name, status,image} = item;
  });

  const imagesDOM = preprosesingData.map(item => {
    return (`
        <img id="${item.id}" src="${item.image}" 
        alt="${item.name}" class="char-img" 
        status ="${item.status}" />
    `) ;
  });
  
  const imagesParsed = parserAssistant(imagesDOM);

  paintHome(imagesParsed);
  paintButton();

  const buttonForToggle = document.querySelector('.button');

  buttonForToggle.addEventListener('click', function() {
    const homeContainer = document.getElementById('home');
    const charsContainer = document.getElementById('characters');

    if(charsContainer.classList[1] === 'blackHole'){
      homeContainer.classList.add('blackHole')
      this.innerHTML = 'Show Less ...';
      charsContainer.classList.remove('blackHole');
      paintCharacters(imagesParsed);
    }else{
      this.innerHTML = 'Show More ...';
      charsContainer.classList.add('blackHole')
      homeContainer.classList.remove('blackHole');
      locationHelper('/home');
    }


  });

}

getRickMortysData().then(buildApp);

