let page = 1;

/**
 * Returns object from promise
 */
function getRickMortysData()  {
  const uriAPI = `https://rickandmortyapi.com/api/character/?page=${page}`;
  return fetch(uriAPI).
  then(response => response.json());
}

/**
 * Returns filtered data
 * @param {Object} data 
 */
function getDataForPage(data) {
  const resultData = data.results.map(item => {
    return  {id, name, status, image} = item;
  });
  return resultData;
}

/**
 * Creates DOM Template of an image
 * @param {Object} data 
 * @returns imagesDOM {Object} 
 */
function buildImgFromData(data) {
  const imagesDOM = data.map(({id, image, name, status}) => {
    return (`
        <img src="${image}" 
        alt="${name}" class="char-img" 
        status ="${status}" data-id="${id}"/>
    `) ;

  }).join('');
  return imagesDOM;
}

/**
   * TODO : Make a function for this
   * First generate RND Numbers
   */
function randomHelper() { 
  firstRnd = Math.floor(Math.random() * 20); 
  secondRnd = Math.floor(Math.random() * 20); 
  while (secondRnd === firstRnd) {
    secondRnd = Math.floor(Math.random() * 20); 
  }
  thirdRnd = Math.floor(Math.random() * 20);
  while (thirdRnd === firstRnd || thirdRnd === secondRnd) {
    thirdRnd = Math.floor(Math.random() * 20); 
  }

  return [firstRnd, secondRnd, thirdRnd];
}

/**
* change the url
*@param {String} whereIAm
*/
function locationHelper (whereIAm, charId){
  history.replaceState({
    whereIAm :whereIAm,
    ActualPage : page,
    characterId : charId
    }, '', whereIAm);
}

/**
 *Function for make apear and disapiar pagination buttons 
 */
function helperPagination(buttonspagination){
   
  if(page > 1||page < 25){
    buttonspagination.children[0].classList.remove('hiddenBlock')
    buttonspagination.children[1].classList.remove('hiddenBlock')
  }
  if(page === 1){
    buttonspagination.children[0].classList.add('hiddenBlock')
  }
  if(page === 25){
    buttonspagination.children[1].classList.add('hiddenBlock')
  }
  
}

/**
 * Creates Rigth DOM's Buttons 
 */
function paintPagination() {

  const buttonDOM = (`
      <button class="button" type="button">
        Show More ...
      </button>
      <div class="pagination hiddenBlock">
        <button class="button hiddenBlock" type="button">
           < Page 
        </button>
        <button class="button" type="button">
          Page >
        </button>
      </div>  
    `) ;
    
    buttonContainer = document.querySelector(".button-container")
    buttonContainer.innerHTML = buttonDOM;
    
}

/**
 * Creates Detail DOM   
 * @param {Object} item
 */
function paintDetails(item) {
  const detailDOM = (`
    <div>
      <img src="${item.src}" alt="${item.alt}" class="char-img" data-id="${item.id}" />
      <h3>${item.alt}</h3>
      <p>${item.attributes.status.value}</p>
    </div>  
    `) ;
  return detailDOM;
}

/**
 * Create DOM for Home
 * @param {Object} data 
 */
function paintHome(data) {
  randomArray= randomHelper();
  const homeData = [data[randomArray[0]], data[randomArray[1]], data[randomArray[2]]];
  const imagesDOM = buildImgFromData(homeData);
  locationHelper('/home','');
  const homeContainer = document.getElementById('home');

  homeContainer.innerHTML = imagesDOM;

}

/**
 * Create Character's DOM
 * @param {Object} data 
 */
function paintCharacters(data) {
  const characterContainer = document.getElementById('characters');
  locationHelper('/characters','');
  const imagesDOM = buildImgFromData(data);
  characterContainer.innerHTML = imagesDOM;
}



/**
 * Contains logic for the App
 * @param {Object} data 
 */
function buildApp(data) {

  const unordererList = document.querySelectorAll('.header-item');
  const homeContainer = document.getElementById('home');
  const charsContainer = document.getElementById('characters');
  const detailsContainer = document.getElementById('details');
  paintPagination();
  const buttonspagination = document.querySelectorAll('.pagination')
  const buttonForToggle = document.querySelector('.button');

  paintHome(data);
  paintCharacters(data);

  function showMore() {
    //for display all
    locationHelper('/characters','');
    homeContainer.classList.add('hiddenBlock')
    detailsContainer.classList.add('hiddenBlock');
    charsContainer.classList.remove('hiddenBlock');
    buttonspagination[0].classList.remove('hiddenBlock');

  }

  function showLess() {
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
  });

  buttonForToggle.addEventListener('click', function() {

    if(charsContainer.classList[1] === 'hiddenBlock'){
      showMore();
      this.innerHTML = 'Show Less ...';
    }else{
      showLess();
      this.innerHTML = 'Show More ...';
      locationHelper('/home','');
    }
  });

  buttonspagination[0].addEventListener('click', function(event) {

    const clickedElement = event.target;

    if(clickedElement.innerText === buttonspagination[0].children[1].innerText) {
      page ++;
      getRickMortysData().then(getDataForPage).then(paintCharacters);
      helperPagination(buttonspagination[0]);
    }
    if(clickedElement.innerText === buttonspagination[0].children[0].innerText) {
      page --;
      getRickMortysData().then(getDataForPage).then(paintCharacters);
      helperPagination(buttonspagination[0]);
    }

  }); 
  

  charsContainer.addEventListener('click',
  function(event) {
    const clickedElement = event.target;

    if(clickedElement.nodeName == 'IMG' ) {
      
      const details = paintDetails(clickedElement);
      locationHelper('/details',clickedElement.dataset.id);
      detailsContainer.innerHTML= details;
      detailsContainer.classList.remove('hiddenBlock');
      charsContainer.classList.add('hiddenBlock');
      buttonspagination[0].classList.add('hiddenBlock')
      
    }   
  });

 
}

getRickMortysData().then(getDataForPage).then(buildApp);
