function getRickMortysData () {
  const uriAPI = 'https://rickandmortyapi.com/api/character/'

  return fetch(uriAPI).
  then(response => response.json());
}

function findImages(data){

  const imagesDOM = data.map(item => {
     return (`
         <img id="${item.id}" src="${item.image}" alt="${item.name}" class="char-img"/>
     `) ;
  });

  console.log(imagesDOM);

  const headerContainer = document.querySelector('.header');

  headerContainer.innerHTML=imagesDOM;

}



 function buildApp(data){
  const preprosesingData = data.results.map(item => {
    return  {id,name, status,image} = item;
  });

  findImages(data.results);

}

getRickMortysData().then(buildApp);

