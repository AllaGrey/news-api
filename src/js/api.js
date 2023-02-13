const ENDPOINT = `https://newsapi.org/v2/everything`;
const options = {
  headers: {
    'X-Api-Key': '96e25f8285fd45ed9f51a9acbee3a44d',
  },
};
export default class NewsApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }
  getNews() {
    const URL = `${ENDPOINT}?q=${this.searchQuery}&pageSize=8&page=${this.page}`;

    return fetch(URL, options)
      .then(response => response.json())
      .then(({ articles }) => {
        this.incrementPage();
        return articles;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
