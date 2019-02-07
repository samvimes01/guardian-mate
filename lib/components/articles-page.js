import Component from '../component.js';

import Articles from './articles.js';

import Paginator from './paginator.js';

export default class ArticlesPage extends Component {
  constructor({ element }) {
    super({ element });

    this._render();

    this._initArticles();

    this._initPaginator();

    this._showArticles();
  }

  async _initArticles() {
    this._articles = new Articles({
      element: document.querySelector('[data-component = "articles-page"]'),
      apiUrl: 'https://content.guardianapis.com/',
      apiKey: 'api-key=test',
    });

    this._articles.subscribe('refresh', () => {
      this._showArticles();
    });

    this._articles.subscribe('expand', (oneArticle) => {
      this._showArticles(oneArticle);
    });

    // костыль - при первой загрузке промис не срабатывает
    this._articles.subscribe('total', total => this._paginator.changePaginatorInfo(total));
  }

  _showArticles(oneArticle = null, url) {
    this._articles.show(oneArticle, url);
    // не пойму как сделать что при первой загрузке срабатывало
    // this._articles.pagesTotal
    //   .then(data => this._paginator.changePaginatorInfo(data));
  }

  _initPaginator() {
    this._paginator = new Paginator({
      element: document.querySelector('[data-component="paginator"]'),
    });

    this._paginator.subscribe('paginate', (pageNumber) => {
      const pageUrl = `search?page=${pageNumber}`;
      this._showArticles(null, pageUrl);
      this._paginator._changeCurrentPage(pageNumber);
    });
  }

  _render() {
    this._element.innerHTML = `
    <header>
      <h1>The Guardian news</h1>
    </header>

    <section data-component="articles-page"></section>
    <section data-component="paginator" class="paginator"></section>
    `;
  }
}
