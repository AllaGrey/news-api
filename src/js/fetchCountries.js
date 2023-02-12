function fetchCountries(name) {
  const URL = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(URL).then(response => response.json());
}

export { fetchCountries };
