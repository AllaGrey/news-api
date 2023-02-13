import '../css/styles.css';
import debounce from 'lodash.debounce';
import NewsApiService from './api.js';
import LoadMoreBtn from './components/loadMore';

const refs = {
  form: document.querySelector('.form'),
  newsWrapper: document.querySelector('.newsWrapper'),
};

const newsApiService = new NewsApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.loadMoreBtn',
  isHiden: true,
});
console.log(loadMoreBtn);

console.log(refs.form);
console.log(refs.newsWrapper);

refs.form.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', fetchArticles);

function onSearch(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const value = form.elements[0].value.trim();
  newsApiService.searchQuery = value;
  clearMarkup();
  newsApiService.resetPage();
  loadMoreBtn.show();
  loadMoreBtn.disable();

  fetchArticles().finally(() => refs.form.reset());
}

function fetchArticles() {
  return newsApiService
    .getNews()
    .then(articles => {
      if (articles.length === 0) throw new Error('No data');
      console.log(articles);

      return articles.reduce(
        (markup, article) => createMarkup(article) + markup,
        ''
      );
    })
    .then(markup => {
      updateNewsList(markup);
      loadMoreBtn.enable();
    })
    .catch(onError);
}

function clearMarkup() {
  refs.newsWrapper.innerHTML = '';
}

function updateNewsList(markup) {
  refs.newsWrapper.insertAdjacentHTML('beforeend', markup);
}

function onError(err) {
  console.log(err);
}

function createMarkup({ author, title, description, url, urlToImage }) {
  return `
    <div class="article-card">
      <h2 class="article-title">${title}</h2>
      <img class="article-img" src="${urlToImage}" alt="" />
      <h3 class="article-author">${author || 'Anonimous'}</h3>
      <p class="article-description">${description}</p>
      <a class="article-url" href="${url}" target="_blank">Read more</a>
    </div>
    `;
}
