function getRickMortysData () {
  const uriAPI = 'https://rickandmortyapi.com/api/character/'

  return fetch(uriAPI).
  then(response => response.json());
}

function eraseElements(elementus){
  if( elementus != null ){
    while (elementus.firstChild){
      elementus.removeChild(elementus.firstChild);
    }
  }
  
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

  const homeContainer = document.getElementById('home');

  eraseElements(homeContainer)

  locationHelper('/home');

  /**
   * IDK if it was a good validation
   */
  firstRnd = Math.floor(Math.random() * 20); 
  secondRnd = Math.floor(Math.random() * 20); 
  while (secondRnd ===firstRnd) {
    secondRnd = Math.floor(Math.random() * 20); 
  }
  thirdRnd = Math.floor(Math.random() * 20);
  while (thirdRnd ===firstRnd || thirdRnd ===secondRnd) {
    thirdRnd = Math.floor(Math.random() * 20); 
  }
  

  console.log(imagesDOM[firstRnd], imagesDOM[secondRnd], imagesDOM[thirdRnd])

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

  /**
   * Adding Action for display details
   */
  
  characterContainer.addEventListener('click',
  function(event){
    const clickedElement = event.target;

    if(clickedElement.nodeName == 'IMG' ){
      
      eraseElements(detailsContainer);
      
      const details = paintDetails(clickedElement);
      locationHelper('/details');
      detailsContainer.appendChild(details[0]);
      detailsContainer.classList.remove('hiddenBlock');
      characterContainer.classList.add('hiddenBlock');
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

  const unordererList = document.querySelectorAll('.header-item');
  const homeContainer = document.getElementById('home');
  const charsContainer = document.getElementById('characters');
  const detailsContainer = document.getElementById('details');
  
  function showMore(){
    //for display all
    homeContainer.classList.add('hiddenBlock')
    detailsContainer.classList.add('hiddenBlock');
    charsContainer.classList.remove('hiddenBlock');

  }

  function showLess(){
    //for display home
    detailsContainer.classList.add('hiddenBlock');
    charsContainer.classList.add('hiddenBlock')
    homeContainer.classList.remove('hiddenBlock');
  }

  unordererList[0].addEventListener('click', function() {
    showLess();
  });



  const buttonForToggle = document.querySelector('.button');

  buttonForToggle.addEventListener('click', function() {
    


    if(charsContainer.classList[1] === 'hiddenBlock'){
      showMore();
      this.innerHTML = 'Show Less ...';
      paintCharacters(imagesParsed);
    }else{
      showLess();
      this.innerHTML = 'Show More ...';
      locationHelper('/home');
    }


  });

  /**
   * rules
   */



}

getRickMortysData().then(buildApp);
