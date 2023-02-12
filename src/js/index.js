import '../css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchInput: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
refs.searchInput.addEventListener(
  'input',
  debounce(onFillInput, DEBOUNCE_DELAY)
);

function onFillInput(e) {
  onClearPreSearch();
  const country = e.target.value.trim();
  if (country !== '') {
    fetchCountries(country)
      .then(response => {
        if (response.status === 404) {
          throw new Error('Oops, there is no country with that name');
        } else if (response.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (response.length > 1) {
          return response.reduce(
            (markup, country) => createMarkupList(country) + markup,
            ''
          );
        } else {
          const responseValues = {
            nameOfficial: response[0].name.official,
            capital: response[0].capital[0],
            flag: response[0].flags.svg,
            population: response[0].population,
            languages: Object.values(response[0].languages).join(', '),
          };
          return createCountryInfoCard(responseValues);
        }
      })
      .then(markup => updateCountryInfoCard(markup))
      .catch(err => onError(err));
  }
}

function createCountryInfoCard({
  nameOfficial,
  capital,
  population,
  flag,
  languages,
}) {
  const markup = `
  <div class="country__title-box">
      <img class="country__img" src=${flag} width="25" height="25" />  
  <h2 class="country__title">${nameOfficial}</h2>
  </div>
      <ul class="country__stats">
        <li class="stats__item"><b>Capital:</b> ${capital}</li>
        <li class="stats__item"><b>Population:</b> ${population}</li>
        <li class="stats__item"><b>Languages:</b> ${languages}</li>
    </ul>
    `;
  return markup;
}

function createMarkupList({ flags, name }) {
  const markup = `
  <ul class="country-list">
    <li class="country__item">
      <img class="item__img" src=${flags.svg} width="20" height="20" />  
      <h2 class="item__name">${name.official}</h2>
    </li>
  </ul>
  `;
  return markup;
}

function updateCountryInfoCard(markup) {
  refs.countryInfo.innerHTML = markup;
}

function onError(err) {
  Notiflix.Notify.failure(`${err}`);
}

function onClearPreSearch() {
  refs.countryInfo.innerHTML = '';
}
