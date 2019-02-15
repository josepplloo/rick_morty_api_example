let page = 1;

/**
 * Return object from promise
 */
function getRickMortysData()  {
  const uriAPI = `https://rickandmortyapi.com/api/character/?page=${page}`;
  return fetch(uriAPI).
  then(response => response.json());
}

/**
 *
 * @param {Object} data 
 * 
 */
function getDataForPage(data){
  const resultData = data.results.map(item => {
    return  {id,name, status,image} = item;
  });
  return resultData;
}

/**
 * 
 * @param {Object} data 
 * @returns imagesDOM {Object} 
 */
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

/**
 * Removes Elements from the DOM
 * @param {Element} elementus 
 */
function eraseElements(elementus){
  if( elementus != null ){
    while (elementus.firstChild){
      elementus.removeChild(elementus.firstChild);
    }
  }
  
}

/**
* change the url
*@param {String} whereIAm
*/
function locationHelper (whereIAm){
  history.replaceState({
    id: 'whereIAm'
    }, '', whereIAm);
}


/**
 * Return a DOM
 * @param {String} stringDOM 
 */
function parserAssistant(stringDOM) {
  const parser = new DOMParser();
  const parsedDOM = parser.parseFromString(stringDOM, "text/html")
        .body.children;
  return parsedDOM;
}


/**
 * Creates Left DOM's Button  
 */
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

/**
 * Creates Rigth DOM's Buttons 
 */
function paintPagination(){

  const buttonDOM = (`
      <div class="pagination hiddenBlock">
        <button class="button hiddenBlock" type="button">
           < Page 
        </button>
        <button class="button" type="button">
          Page >
        </button>
      </div>  
    `) ;
    
    const buttonParserd =parserAssistant(buttonDOM);

    buttonContainer = document.querySelector(".button-container")
    buttonContainer.appendChild(buttonParserd[0]);
    buttonspagination = document.querySelectorAll('.pagination')
    
}

/**
 * Creates Detail DOM   
 * @param {Object} item
 */
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

/**
 * Create DOM for Home
 * @param {Object} data 
 */
function paintHome(data){

  const homeContainer = document.getElementById('home');

  const imagesDOM = buildImgFromData(data);
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

/**
 * Create Character's DOM
 * @param {Object} data 
 */
function paintCharacters(data){
  
  const characterContainer = document.getElementById('characters');
  eraseElements(characterContainer);
  locationHelper('/characters');

  const imagesDOM = buildImgFromData(data);

  imagesDOM.map(item =>{
    const imagesParsed = parserAssistant(item);
    characterContainer.appendChild(imagesParsed[0]);
  });
  

}



/**
 * Contains logic for the App
 * @param {Object} data 
 */function buildApp(data){

  const unordererList = document.querySelectorAll('.header-item');
  const homeContainer = document.getElementById('home');
  const charsContainer = document.getElementById('characters');
  const detailsContainer = document.getElementById('details');
  paintButton();
  const buttonForToggle = document.querySelector('.button');
  paintPagination();
  const buttonspagination = document.querySelectorAll('.pagination')

  paintHome(data);

  
  function showMore(){
    //for display all
    homeContainer.classList.add('hiddenBlock')
    detailsContainer.classList.add('hiddenBlock');
    charsContainer.classList.remove('hiddenBlock');
    buttonspagination[0].classList.remove('hiddenBlock');

  }

  function showLess(){
    //for display home
    buttonspagination[0].classList.add('hiddenBlock');
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
    paintCharacters(data);
  });

  buttonForToggle.addEventListener('click', function() {

    if(charsContainer.classList[1] === 'hiddenBlock'){
      showMore();
      this.innerHTML = 'Show Less ...';
      paintCharacters(data);
      
    }else{
      showLess();
      this.innerHTML = 'Show More ...';
      locationHelper('/home');
    }
  });

  buttonspagination[0].addEventListener('click', function(event) {

    const clickedElement = event.target;
    
    if(clickedElement.innerText === buttonspagination[0].children[1].innerText){
      page ++;
      getRickMortysData().then(getDataForPage).then(paintCharacters);

      buttonspagination[0].children[0].classList.remove('hiddenBlock')
    }
    if(clickedElement.innerText === buttonspagination[0].children[0].innerText){
      page --;
      
      getRickMortysData().then(getDataForPage).then(paintCharacters);

      buttonspagination[0].children[0].classList.remove('hiddenBlock')
    }

  }); 
  

  charsContainer.addEventListener('click',
  function(event){
    const clickedElement = event.target;

    if(clickedElement.nodeName == 'IMG' ){
      
      eraseElements(detailsContainer);
      
      const details = paintDetails(clickedElement);
      locationHelper('/details');
      detailsContainer.appendChild(details[0]);
      detailsContainer.classList.remove('hiddenBlock');
      charsContainer.classList.add('hiddenBlock');
      buttonspagination[0].classList.add('hiddenBlock')
      
    }   
  });

 
}

getRickMortysData().then(getDataForPage).then(buildApp);
