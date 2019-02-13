function getRickMortysData () {
  const uriAPI = 'https://rickandmortyapi.com/api/character/?page=1'

  return fetch(uriAPI).
  then(response => response.json());
}

function buildImgFromData(data){
  const imagesDOM = data.map(item => {
    return (`
        <img src="${item.image}" 
        alt="${item.name}" class="char-img" 
        status ="${item.status}" />
    `) ;

  });
  return imagesDOM;
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
      <img src="${item.src}" alt="${item.alt}" class="char-img"/>
      <h3>${item.alt}</h3>
      <p>${item.attributes.status.value}</p>
    </div>  
    `) ;
  return parserAssistant(detailDOM);
}

function paintHome(imgDOM){

  const homeContainer = document.getElementById('home');

  const imagesDOM = buildImgFromData(imgDOM);
  const imagesParsed = parserAssistant(imagesDOM);
  
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
  
  homeContainer.appendChild(imagesParsed[firstRnd]);
  homeContainer.appendChild(imagesParsed[secondRnd]);
  homeContainer.appendChild(imagesParsed[thirdRnd]);

}

function paintCharacters(imgDOM){
  
  const characterContainer = document.getElementById('characters');
  const detailsContainer = document.getElementById('details');
  eraseElements(characterContainer);

  locationHelper('/characters');

  const imagesDOM = buildImgFromData(imgDOM);

  imagesDOM.map(item =>{
    let imagesParsed = parserAssistant(item);
    characterContainer.appendChild(imagesParsed[0]);
  });
  
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

  const unordererList = document.querySelectorAll('.header-item');
  const homeContainer = document.getElementById('home');
  const charsContainer = document.getElementById('characters');
  const detailsContainer = document.getElementById('details');
  paintButton();
  const buttonForToggle = document.querySelector('.button');

  const preprosesingData = data.results.map(item => {
    return  {id,name, status,image} = item;
  });

  
  //const imagesDOM = buildImgFromData(preprosesingData);
  
  //const imagesParsed = parserAssistant(imagesDOM);

  paintHome(preprosesingData);

  
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
    buttonForToggle.innerHTML = 'Show More ...';

  });


  unordererList[1].addEventListener('click', function() {
    showMore();
    buttonForToggle.innerHTML = 'Show Less ...';
    paintCharacters(preprosesingData);
  });

  buttonForToggle.addEventListener('click', function() {

    if(charsContainer.classList[1] === 'hiddenBlock'){
      showMore();
      this.innerHTML = 'Show Less ...';
      paintCharacters(preprosesingData);
    }else{
      showLess();
      this.innerHTML = 'Show More ...';
      locationHelper('/home');
    }
  });

}

getRickMortysData().then(buildApp);
