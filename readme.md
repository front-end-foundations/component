# VII - Components

The Dev branch of this repo is where we left off in session 8.

Log in to Github and create an empty repo called components.

** Download the zip file **

## Homework

Work on a final project. See session 7 for guidelines (TLDR - few).

## Exercise - A Site Redesign

## Deployment

We'll use [Netlify](https://www.netlify.com/) to put this on the web. Register and/or log in to [app.netlify.com](https://app.netlify.com) and drag and drop the `_site` folder onto the web browser window to upload the contents [live to the web](https://zealous-kilby-113356.netlify.com/).

We can also hook into a Github branch to set up [continuous delpoyment](https://app.netlify.com/start). Here is a [sample](https://agitated-bartik-814348.netlify.com/) with [admin](https://agitated-bartik-814348.netlify.com/admin).

* use the terminal to create and checkout a new branch

```sh
$ git branch dev
$ git checkout dev
```

In the future you will be able to merge your dev branch with the master branch and have your site updated automatically.

Make sure the branch is clean, then checkout the main (master) branch and push to Github. Netlify will take over from there - running the eleventy command to create a `_site` folder and putting that on its CDN.

```sh
$ git add .
$ git commit -m 'commit message'
$ git checkout master
$ git push -u origin master
```


## Video Component

Add the component to `layout.html`

```html
<section>
  {% include components/video.html %}
</section>
```

Note: our clickHandlers function is getting out of hand. You could use a separate function to tame it a bit:

```js
function clickHandlers(){
  if (event.target.matches('#pull')){
    document.querySelector('body').classList.toggle('show-nav');
    event.preventDefault();
  }
  if (event.target.matches('.content-video a')){
    videoSwitch()
    event.preventDefault();
  }
}

var videoSwitch = function () {
  const iFrame = document.querySelector('iframe');
    const videoLinks = document.querySelectorAll('.content-video a');
    videoLinks.forEach(videoLink => videoLink.classList.remove('active'));
    event.target.classList.add('active');
    const videoToPlay = event.target.getAttribute('href');
    iFrame.setAttribute('src', videoToPlay);
}
```

## Refactoring Components

Suppose we want to remove the video content from all pages except Home and Videos. We also want to add the video section to the video page without the aside.

Split the video.html component into video-article.html and video-aside.html in the components folder.

Create `components/video-article`

```html
<div class="content-video">
  <iframe src="https://player.vimeo.com/video/326317981" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
  <ul class="btn-list">
    <li>
      <a class="active" href="https://player.vimeo.com/video/326317981">Waves</a>
    </li>
    <li>
      <a href="https://player.vimeo.com/video/323437908">Gauchos</a>
    </li>
    <li>
      <a href="https://player.vimeo.com/video/315298268">Pueblo Textil</a>
    </li>
  </ul>
</div>
```

Create `components/video-aside`

```html
<h2>Videos About People</h2>
<p><strong>Waves</strong> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<p><strong>Gauchos</strong> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
<p><strong>True Love in Pueblo Textil</strong> Nine-year-old Maribel explains to us how it feels to be stricken with the world's oldest infliction: love.</p>
```

In `layout.html`, include the two new components using article and aside tags

```html
<section>
  <article>
    {% include components/video-article.html %}
  </article>
  <aside>
    {% include components/video-aside.html %}
  </aside>
</section>
```

Add to base.scss (wide screen only)

```css
section {
  @media(min-width: $break-med){
    max-width: $max-width;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-column-gap: 2rem;
    padding-top: 2rem;
    article {
      iframe {
        min-height: 300px;
      }
    }
  }
}
```

We want the video section to appear on only the home page and in the video page.

* Save out two copies of `layout.html` as `layouts/home.html` and `layouts/video.html`
* Use these templates for rendering e.g.:

`pages/home.md`

```yaml
---
layout: layouts/home.html
pageTitle: Home
navTitle: Home
date: 2010-01-01
permalink: /
---

{% for page in collections.pages %}
  <h2><a href="{{ page.url }}">{{ page.data.pageTitle | upcase }}</a></h2>
  <em>{{ page.date | date: "%Y-%m-%d" }}</em>
{% endfor %}
```

and `pages/videos.md`

```yaml
---
layout: layouts/video.html
pageTitle: Videos
navTitle: Videos
date: 2019-01-01
---

## Coming soon.

[Home](/)
```

Now `home.md` and `videos.md` are using the new layouts (layouts vs components).

Remove the article section from `layout.html` so it doesn't render on all pages.

### Thinning the Templates

The `videos.md` markdown file:

```md
---
layout: layouts/video.html
pageTitle: Videos
navTitle: Videos
date: 2019-01-01
---

Insisting that they had taken every measure to keep the message “extra top secret,” the Trump boys reportedly spent Wednesday defending their decision to send Saudi Arabia plans for a cool missile using their personal Etch A Sketch. “We spent, like, a million hours making that rocket look super good, so we had to send it to our friends in Sunny Arabia…

[Home](/)
```

There is a lot of duplication going on. Let's pass the `video.html` template into `layout.html` for processing.

The `video.html` template:

```html
---
layout: layouts/layout.html
---

<section id="videos">
<article>
{% include components/video-article.html %}
</article>
<aside>
{% include components/video-aside.html %}
</aside>
</section>
```

_NOTE_: our ajax file is overwriting the contents of our div and needs a touch up.

Target a div with a class of blog in the JS:

```js
  if (document.querySelector('.content .blog')) {
    document.querySelector('.content .blog').innerHTML = looped
  }
```

And apply that class to the blog page file:


```html
---
pageClass: blog
pageTitle: Blog
date: 2019-03-01
navTitle: Blog
---

<div class="blog"></div>
```

Perform the same thinning process for the `home.html` template.

Trim the `home.html` template

```html
---
layout: layouts/layout.html
---

<section id="videos">
<article>
{% include components/video-article.html %}
</article>
<aside>
{% include components/video-aside.html %}
</aside>
</section>

<div class="content">

    <h1>{{ pageTitle }}</h1>

    {{ content }}
    
</div>
```

### Final trim

New `video-section.html` in components:

```html
<section id="videos">
<article>
{% include components/video-article.html %}
</article>
<aside>
{% include components/video-aside.html %}
</aside>
</section>
```

Then in the `home.html` layout

```html
---
layout: layouts/layout.html
---

{% include components/video-section.html %}

<div class="content">

    <h1>{{ pageTitle }}</h1>

    {{ content }}
    
</div>
```

Then the `video.html` layout

```html
---
layout: layouts/layout.html
---

{% include components/video-article.html %}

{{ content }}
```

## Time Permitting

## Images Carousel

Add and new layout file `images.html` to layouts

```
---
layout: layouts/layout.html
---

{% include components/images.html %}

{{ content }}
```

In `images.md`

```
---
layout: layouts/images.html
pageTitle: Images
navTitle: Images
date: 2019-02-01
---

[Home](/)
```

Do a DOM review of this section of the page.

In a new `_carousel.scss`:

```css
.secondary aside {
	ul {
		display: flex;
		flex-wrap: wrap;
		align-content: space-around;
		li {
			flex-basis: 28%;
			margin: 2px;
			padding: 4px;
			background-color: #fff;
			border: 1px solid $dk-yellow;
			transition: all 0.2s linear;
			&:hover {
				transform: scale(1.1);
				box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
			}
		}
	}
}
```

Note transition:

```css
li img {
	...
	transition: all 0.2s linear;
	&:hover {
		transform: scale(1.1);
		box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
	}
```

### Content Slider 

The large image on the images page

```css
figure {
	position: relative;
	figcaption {
		padding: 1rem;
    background: rgba(0,0,0, 0.7);
    color: #fff;
		position: absolute;
		bottom: 0;
	}
}
```

```js
const carouselLinks = document.querySelectorAll('.image-tn a');
const carouselLinksArray = [...carouselLinks];
const carousel = document.querySelector('figure img');

carouselLinksArray.forEach(carouselLink =>
  carouselLink.addEventListener('click', runCarousel),
);

function runCarousel() {
  const imageHref = this.getAttribute('href');
  carousel.setAttribute('src', imageHref);
  event.preventDefault();
}
```

Set the text in the carousel.

Find the appropriate traversal `const titleText = this.firstChild.title`:

```js
function runCarousel() {
  const imageHref = event.target.parentNode.getAttribute('href');
  console.log(imageHref);
  const titleText = event.target.title;
  console.log(titleText);
  carousel.setAttribute('src', imageHref);
  event.preventDefault();
}
```

Create a pointer to the figcaption in order to manipulate its content:

```js
const carouselPara = document.querySelector('figcaption');
```

Set the innerHTML `carouselPara.innerHTML = titleText` of the paragraph:

```js
function runCarousel() {
  const imageHref = event.target.parentNode.getAttribute('href');
  console.log(imageHref);
  const titleText = event.target.title;
  console.log(titleText);
  carousel.setAttribute('src', imageHref);
  carouselPara.innerHTML = titleText;
  event.preventDefault();
}
```

## Notes

js ajax and localstorage

At a certain point I had to adjust the js to remove an error.

```
---
pageClass: blog
pageTitle: Blog
date: 2019-03-01
navTitle: Blog
---

<div class="blog"></div>
```

```js
document.addEventListener('click', clickHandlers)

var nyt = 'https://api.nytimes.com/svc/topstories/v2/nyregion.json?api-key=OuQiMDj0xtgzO80mtbAa4phGCAJW7GKa'

function clickHandlers(){
  if (event.target.matches('#pull')){
    document.querySelector('body').classList.toggle('show-nav');
    event.preventDefault();
  }
  if (event.target.matches('.content-video a')){
    const iFrame = document.querySelector('iframe');
    const videoLinks = document.querySelectorAll('.content-video a');
    videoLinks.forEach(videoLink => videoLink.classList.remove('active'));
    event.target.classList.add('active');
    const videoToPlay = event.target.getAttribute('href');
    iFrame.setAttribute('src', videoToPlay);
    event.preventDefault();
  }
}

var addContent = function(data){

  var looped = ''

  for(i=0; i<data.results.length; i++){
    looped += `
      <div class="item">
        <h3>${data.results[i].title}</h3>
        <p>${data.results[i].abstract}</p>
      </div>
      `
  }
  if (document.querySelector('.content .blog')){
    document.querySelector('.content .blog').innerHTML = looped
  }
}

var getData = function () {
	fetch(nyt)
  .then(response => response.json())
  .then(json => addContent(json))
}

getData();
```