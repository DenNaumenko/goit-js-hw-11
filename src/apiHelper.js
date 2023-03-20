import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

const simpleLightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const perPage = 40;

export async function callToService(text, page) {
  try {
    const result = await getImageByText(text, page);
    if (!result.totalHits) {
      return Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }

    if (!result.hits.length) {
      throw new Error();
    }

    const arrayOfImages = result.hits.map(element => {
      return `<a class="gallery__item" href="${element.largeImageURL}">
            <img src="${element.previewURL}" alt="" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <span>${element.likes}</span>
              </p>
              <p class="info-item">
                <b>Views</b>
                <span>${element.views}</span>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <span>${element.comments}</span>
              </p>
              <p class="info-item">
                <b>Downloads</b>
                <span>${element.downloads}</span>
              </p>
            </div>
        </a>`;
    });
    gallery.insertAdjacentHTML('beforeend', arrayOfImages.join(''));
    simpleLightbox.refresh();

    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      loadMore.style.display = 'block';
    }

    return true;
  } catch (err) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );

    loadMore.style.display = 'none';
    return false;
  }
}

function getImageByText(text, page) {
  return axios
    .get(
      `https://pixabay.com/api/?key=34202248-790695b57be5ff30dc9e16be7&q=${encodeURIComponent(
        text
      )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    )
    .then(resp => resp.data);
}

