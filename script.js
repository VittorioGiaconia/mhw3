function reset(){
  const divs = document.querySelectorAll('.choice-grid div');
  const image = document.querySelectorAll('.checkbox');
  for(let i of image){
    i.src = 'images/unchecked.png';
  }
  for (let d of divs){
    d.classList.remove('overlay');
    d.classList.remove('coloresfondo');
  }
  const inizio = document.querySelector('#restart');
  inizio.classList.add('fine_test');
  
  for(let i=0;i<27; i++){
    divs[i].addEventListener('click', seleziona);
  }
  risp.one= null;
  risp.two = null;
  risp.three = null;
  
}


function seleziona(event)
{
  const scelta = event.currentTarget;
  const image = scelta.querySelector('.checkbox');
  const divs = document.querySelectorAll('.choice-grid div'); 
  image.src = 'images/checked.png';
  scelta.classList.remove('overlay');
  scelta.classList.add('coloresfondo');

  sfondo(scelta);

  const choiceid = scelta.dataset.choiceId;
  const questionid = scelta.dataset.questionId;

  risp[questionid]=choiceid;
  if(risp.one !== null && risp.two !== null && risp.three !== null){
    for(let i=0;i<27; i++){
      divs[i].removeEventListener('click', seleziona);
    }
    const risultato = personality(risp);

    const h2 = document.querySelector('h2');
    const para = document.querySelector('p');
    h2.textContent = RESULTS_MAP[risultato].title;
    para.textContent = RESULTS_MAP[risultato].contents;
    
    const fine = document.querySelector('.fine_test');
    fine.classList.remove('fine_test');
   
    const botton_reset = document.querySelector('#reset');
    botton_reset.addEventListener('click', reset);

  }

}


function sfondo(risposta){
  const v1= document.querySelectorAll('.choice-grid div');
  for(const p of v1){
    if (p.dataset.choiceId !== risposta.dataset.choiceId && p.dataset.questionId === risposta.dataset.questionId){
      p.classList.remove('coloresfondo');
      const imagenot = p.querySelector('.checkbox').src = 'images/unchecked.png';
      p.classList.add('overlay');
    }
  }
}

function personality(risposta){
  
  if(risposta.one === risposta.two || risposta.one === risposta.three)
  return risposta.one;
  else if(risposta.two === risposta.three)
  return risposta.two;
  else if (risposta.one !== risposta.two && risposta.one !== risposta.three)
  return risposta.one;
   
}
function onJson(json){
  const results = json.hits;
  const foto = document.querySelector('#library');
  foto.innerHTML = '';
  for (let r of results){
    const img = document.createElement('img');
    img.src = r.largeImageURL;
    foto.appendChild(img);
  }
  
}
function onResponse(Response){
  return Response.json();

}

function search(event){
  event.preventDefault();

  const ricerca = document.querySelector('#oggetto_ricercato')
  const ricerca_valore = encodeURIComponent(ricerca.value);
  console.log('-->' + ricerca_valore);
  rest_url= url + '?key=' + chiave + '&q=' + ricerca_valore + '&per_page=' + max_ris;
  fetch(rest_url).then(onResponse).then(onJson);

}


const form = document.querySelector('#primo_form');
form.addEventListener('submit', search);
const max_ris = 9;
const chiave= '26910272-59b46b3f2d3942d3027df90e0';
const url = 'https://pixabay.com/api/';


const image = document.querySelectorAll('.choice-grid div');

for(let i=0;i<27; i++){
  image[i].addEventListener('click', seleziona);
}

const risp = {
  'one':null,
  'two':null,
  'three':null,
}
//---------------------------------------

function onJson_pt2(json) {
  console.log('JSON ricevuto');
  console.log(json);
  const library = document.querySelector('#album-view');
  library.innerHTML = '';
  const results = json.albums.items;
  let max_results = results.length;
  if(max_results > 9)
    max_results = 9;
  for(let i=0; i<max_results; i++)
  {
    const albums = results[i]
    const title = albums.name;
    const selected_image = albums.images[0].url;
    const album = document.createElement('div');
    album.classList.add('album');
    const img = document.createElement('img');
    img.src = selected_image;
    const caption = document.createElement('span');
    caption.textContent = title;
    album.appendChild(img);
    album.appendChild(caption);
    library.appendChild(album);
  }
}

function onResponse(response) {
  console.log('Risposta ricevuta');
  return response.json();
}

function search_pt2(event)
{
  event.preventDefault();
  const album_input = document.querySelector('#album');
  const album_value = encodeURIComponent(album_input.value);
  console.log('Eseguo ricerca: ' + album_value);
  fetch("https://api.spotify.com/v1/search?type=album&q=" + album_value,
    {
      headers:
      {
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponse).then(onJson_pt2);
}

function onTokenJson(json)
{
  console.log(json)
  token = json.access_token;
}

function onTokenResponse(response)
{
  return response.json();
}

const client_id = '994c8430a563416398b36b6a1c7316b5';
const client_secret = 'c5fb8a354a334e10b67e8605d110dc5a';
let token;
fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);

const form_2 = document.querySelector('#secondo_form');
form_2.addEventListener('submit', search_pt2)