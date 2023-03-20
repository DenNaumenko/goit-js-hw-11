import { callToService } from './apiHelper';

let nextPage = 1;
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
};
const observer = new IntersectionObserver(observerHandler, options);
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

form.addEventListener('submit', hendler);

async function hendler(e) {
  e.preventDefault();
  nextPage = 1;
  gallery.innerHTML = '';
  const result = await callToService(form.elements['searchQuery'].value, nextPage);

  if(result) {
    observer.observe(loadMore);
  }
}

function observerHandler(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      nextPage += 1;

      const result = await callToService(form.elements['searchQuery'].value, nextPage);

      if(result) {
        observer.unobserve(loadMore);
      }
    }
  });
}