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
    });

    this._articles.subscribe('refresh', () => {
      this._paginator.emit('paginate', 1);
    });

    this._articles.subscribe('expand', (articleToExpand) => {
      this._expandArticle(articleToExpand);
    });
  }

  async _expandArticle(article) {
    await this._articles.show(article);
  }

  async _showArticles(url) {
    await this._articles.show(url);
    this._paginator.changePaginatorInfo(this._articles.total);
  }

  _initPaginator() {
    this._paginator = new Paginator({
      element: document.querySelector('[data-component="paginator"]'),
    });

    this._paginator.subscribe('paginate', (pageNumber) => {
      const pageUrl = `search?page=${pageNumber}&`;
      this._showArticles(pageUrl);
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
