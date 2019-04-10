const carouselLinks = document.querySelectorAll('.image-tn a');
const carouselLinksArray = [...carouselLinks];
const carousel = document.querySelector('figure img');
const carouselPara = document.querySelector('figcaption');

carouselLinksArray.forEach(carouselLink =>
  carouselLink.addEventListener('click', runCarousel),
);

function runCarousel() {
  const imageHref = event.target.parentNode.getAttribute('href');
  console.log(imageHref);
  const titleText = event.target.title;
  console.log(titleText);
  carousel.setAttribute('src', imageHref);
  carouselPara.innerHTML = titleText;
  event.preventDefault();
}
//////

document.addEventListener('click', clickHandlers);

var nyt =
  'https://api.nytimes.com/svc/topstories/v2/nyregion.json?api-key=OuQiMDj0xtgzO80mtbAa4phGCAJW7GKa';

function clickHandlers() {
  if (event.target.matches('#pull')) {
    document.querySelector('body').classList.toggle('show-nav');
    event.preventDefault();
  }
  if (event.target.matches('.content-video a')) {
    videoSwitch();
    event.preventDefault();
  }
}

var videoSwitch = function() {
  const iFrame = document.querySelector('iframe');
  const videoLinks = document.querySelectorAll('.content-video a');
  videoLinks.forEach(videoLink => videoLink.classList.remove('active'));
  event.target.classList.add('active');
  const videoToPlay = event.target.getAttribute('href');
  iFrame.setAttribute('src', videoToPlay);
};

var addContent = function(data) {
  var looped = '';

  for (i = 0; i < data.results.length; i++) {
    looped += `
      <div class="item">
        <h3>${data.results[i].title}</h3>
        <p>${data.results[i].abstract}</p>
      </div>
      `;
  }
  if (document.querySelector('.content .blog')) {
    document.querySelector('.content .blog').innerHTML = looped;
  }
};

var getData = function() {
  fetch(nyt)
    .then(response => response.json())
    .then(json => addContent(json));
};

getData();
