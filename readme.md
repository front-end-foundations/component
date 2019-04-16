# IX - Components

The Master branch of this repo is where we left off in session 8. The dev branch is being deployed to Netlify.

Log in to Github ** _Download the zip file_ ** and create an empty repo called components.

## Homework

Work on your final project.

## Review

* `https://www.11ty.io/docs/starter/`
* `https://session9-components.netlify.com/`

## Exercise continued - Site Redesign

`cd` into `component-master` and initialize a repository:

```sh
$ git init
$ git add .
$ git commit -m 'initial commit'
$ git remote add origin <your-github-repo>
$ git push -u origin master
```

## Deployment

We'll use [Netlify](https://www.netlify.com/) to put this on the web. Register and/or log in to [app.netlify.com](https://app.netlify.com) and drag and drop the `_site` folder onto the web browser window to upload the contents [live to the web](https://zealous-kilby-113356.netlify.com/).

We can also hook into a Github branch to set up [continuous delpoyment](https://app.netlify.com/start). Here is a [sample](https://agitated-bartik-814348.netlify.com/) with [admin](https://agitated-bartik-814348.netlify.com/admin).

Set Netlify for continuous deployment on the Master branch of your Github Component repo.

* use the terminal to create and checkout a new branch

```sh
$ git status 
$ git branch dev
$ git checkout dev
```

In the future you will be able to merge your dev branch into the master branch and have your site updated automatically.

Make sure the branch is clean, then checkout the main (master) branch and push to Github. Netlify will take over from there - running the eleventy command to create a `_site` folder and putting that on its CDN.

```sh
$ git add .
$ git commit -m 'commit message'
$ git checkout master
$ git push -u origin master
```

## JavaScript Review

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

We want to remove the video content from all pages except Home and Videos. 

We also want to add the video section to the video page without the aside.

We will split the `_includes/components/video.html` component into `video-article.html` and `video-aside.html` in the components folder.

Create `components/video-article.html`

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

Create `components/video-aside.html`

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

Add to `ignore/sass/base.scss` (wide screen only)

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

* Save out two copies of `layouts/layout.html` as `layouts/home.html` and `layouts/video.html`
* Use these templates for rendering e.g.:

Change the YAML frontmatter in `pages/home.md`

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

and in `pages/videos.md`

```yaml
---
layout: layouts/video.html
pageTitle: Videos
navTitle: Videos
date: 2019-01-01
---

Insisting that they had taken every measure to keep the message “extra top secret,” the Trump boys reportedly spent Wednesday defending their decision to send Saudi Arabia plans for a cool missile using their personal Etch A Sketch. “We spent, like, a million hours making that rocket look super good, so we had to send it to our friends in Sunny Arabia…

[Home](/)
```

Now `home.md` and `videos.md` are using the new layouts.

Remove the article section from `layout.html` so it doesn't render on all pages.

I.e. Remove this from `layout.html`:

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

The video article and aside should appear on only the videos and home link.

### Thinning the Templates

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

Target a div with a class of blog in `static/js/scripts.js`:

```js
if (document.querySelector('.content .blog')) {
  document.querySelector('.content .blog').innerHTML = looped
}
```

And apply that class to the blog page `pages/blog.html` file:


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

Trim the `home.html` template:

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

Now both the `home.html` and `video.html` layouts are referencing `layout.html` as a master template.

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

## CSS

We want to make the video larger on wide screens only.

Recall that we have the ability to insert a class name on the body tag of any page via `<body class="{{ pageClass }}">` in `layout.html`.

Change the front matter in `pages/videos.md` to add a `pageClass`:

```md
---
layout: layouts/video.html
pageTitle: Videos
navTitle: Videos
pageClass: videos
date: 2019-01-01
---
```

Then, in `ignore/scss/_video.scss`: 

```css
.videos iframe {
  min-height: 240px;
  @media(min-width: $break-med){
  min-height: 500px;
  }
}
```

## Images Carousel

Add and new layout file `images.html` to layouts

```
---
layout: layouts/layout.html
---

{% include components/images.html %}

{{ content }}
```

Review the `images.html` component.

In `images.md`

```
---
layout: layouts/images.html
pageTitle: Images
navTitle: Images
date: 2019-02-01
---

### Suspicious New WikiLeaks Document Dump Exposes How Awesome And Trustworthy U.S. Government Is

Releasing thousands of confidential pages detailing the operational excellence at every level, a suspicious new dump of WikiLeaks documents Monday exposed just how totally awesome and trustworthy the U.S. government is. According to the lengthy set of government cables emailed to dozens of world news organizations simultaneously along with a five-gigabyte…

```

Do a DOM review of this section of the page.

In a new linked `_carousel.scss`:

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

Note the transition:

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

Format the large image on the images page

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

Implementing the image swap in `scripts.js`:

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

Note the use of `this` above.

Set the text in the carousel.

Find the appropriate traversal `const imageHref = event.target.parentNode.getAttribute('href')`:

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

## Forms

Use the following in the `contact.html` component:

```html
<form name="contact" method="POST" action="/" autocomplete="true">
<fieldset>
  
  <input type="text" name="name" id="name" required autocomplete = "off" />
  <label for="name">Your name</label>
 
  <input type="email" name="email" id="email" required autocomplete = "off"   />
   <label for="email">Email address</label>

  
  <textarea name="message" id="message" placeholder="Your message" rows="7"></textarea>
  <label for="message">Your message</label>
  <button type="submit" name="submit">Send Message</button>
  </fieldset>
</form>
```

Bring the form into the layout via `contact.md`:

```yml
---
layout: layouts/contact.html
pageTitle: Contact Us
navTitle: Contact
date: 2019-04-01
---
```

and `layouts/video.html`:

```yml
---
layout: layouts/layout.html
---

{% include components/video-article.html %}

{{ content }}
```


`form`:

* action - Specifies where to send the form-data when a form is submitted
* autocomplete - Specifies whether a form should have autocomplete on or off
* method - Specifies the HTTP method to use when sending form-data
* name - Specifies the name of a form
* novalidate - turns validation off, typically used when you provide your own custom validations routines

`fieldset`: not really needed here. Allows the form to be split into multiple sections (e.g. shipping, billing)

`label`: The for attribute of the `<label>` tag should be equal to the id attribute of the related element to bind them together

`input`: Specifies an input field where the user can enter data. Is empty and consists of attributes only.

* can accept autocomplete and autofocus
* name - Specifies the name of an <input> element used to reference elements in a JavaScript, or to reference form data after a form is submitted
* type - the [most complex](https://www.w3schools.com/tags/att_input_type.asp) attribute, determines the nature of the input
* required - works with native HTML5 validation
* placeholder - the text the user sees before typing
* pattern - Specify a [regular expression](https://www.w3schools.com/TAGS/att_input_pattern.asp) that the `<input>` element's value is checked against on form submission
* title - use with pattern to specify extra information about an element, not form specific, often shown as a tooltip text, here - describes the pattern to help the user

Initial CSS:

```css
form {
  display: grid;
  padding: 2em 0;
}

form label {
  display: none;
}

input,
textarea,
button {
  width: 100%;
  padding: 1em;
  margin-bottom: 1em;
  font-size: 1rem;
}

input,
textarea {
  border: 1px solid #666;
}

button {
  border: 1px solid $link;
  background-color: $link;
  color: #fff;
  cursor: pointer;
}
```

Ender:

```html
<form name="contact" method="POST" data-netlify="true" action="/">
<fieldset>
  
  <input type="text" name="name" id="name" autocomplete="name" title="Please enter your name" required />
  <label for="name">Name</label>

  <input type="email" name="email" id="email" autocomplete="email" title="The domain portion of the email address is invalid (the portion after the @)." pattern="^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$" required />
    <label for="email">Email</label>

  <textarea name="message" id="message" placeholder="Write your message here" rows="7" required></textarea>
  <label for="message">Message</label>
  
  <button type="submit" name="submit">Send Message</button>
  </fieldset>
</form>
```

Try:

`autocomplete="off"`

Label effect:

```css
form {
  display: grid;
  padding: 2em 0;
  display: block;
  position: relative;
}

form label {
  display: block;
  position: relative;
  top: -42px;
  left: 16px;
  font-size: 16px;
  z-index: 1;
  transition: all 0.3s ease-out;
}

input:focus + label, input:valid + label{
  top: -80px;
  font-size: 0.875rem;
  color: #00aced;
}

input,
textarea,
button {
  width: 100%;
  padding: 1em;
  margin-bottom: 1em;
  font-size: 1rem;
}

input {
  display: block;
  position: relative;
  background: none;
  border: none;
  border-bottom: 1px solid $link;
  font-weight: bold;
  font-size: 16px;
  z-index: 2;
}

textarea {
  border: 1px solid $link;
}
textarea + label {
  display: none;
}
textarea:focus {
  outline: none;
}

input:focus, input:valid{
  outline: none;
  border-bottom: 1px solid $link;
}

button {
  border: 1px solid $link;
  background-color: $link;
  color: #fff;
  cursor: pointer;
}
```

https://www.netlify.com/docs/form-handling/

`data-netlify="true"`

Component: `contact.html`

Page: `contact.md`

```md
---
layout: layouts/contact.html
pageTitle: Contact Us
navTitle: Contact
date: 2019-04-01
---

[Home](/)
```

Layout: `contact.html`

```html
---
layout: layouts/layout.html
---

{% include components/contact.html %}
```

## Content Management

[Headless CMS](https://en.wikipedia.org/wiki/Headless_content_management_system) - a back-end only content management system built from the ground up as a content repository that makes content accessible via a RESTful API for display on any device.

[Netlify CMS](https://www.netlifycms.org/)

https://www.netlifycms.org/docs/add-to-your-site/

https://templates.netlify.com/template/eleventy-netlify-boilerplate/#about-deploy-to-netlify
https://github.com/danurbanowicz/eleventy-netlify-boilerplate/blob/master/admin/preview-templates/index.js

## Notes

js ajax and localstorage

prefetching and rendering the data


