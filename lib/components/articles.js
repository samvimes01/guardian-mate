import Component from '../component.js';

import ArticlesService from '../services/articles-service.js';

export default class ArticlesPage extends Component {
  constructor({ element, apiUrl, apiKey }) {
    super({ element });

    ArticlesService.apiUrl = apiUrl;
    ArticlesService.apiKey = apiKey;

    this._render();

    this.on('click', 'articles-refresh', () => {
      this.emit('refresh');
    });

    this.on('click', 'article-header', (event) => {
      this.emit('expand', event.target);
    });
  }


  show(article, url = 'search?') {
    if (article) {
      this._showArticle(article);
      return;
    }
    super.show();
    const articles = ArticlesService.getData(url);
    articles
      .then((data) => {
        this._displayedArticles = data.results;
        this._refreshArticlesList(this._displayedArticles);
        // работает при переходе по страницам - но не после 1й загрузки
        // this.pagesTotal = Promise.resolve(data.pages);
        this.emit('total', data.pages);
      })
      .catch(() => {
        this._refreshArticlesList(false);
      });
  }

  _render() {
    this._element.innerHTML = `
    <div data-element="articles-refresh" class="button refresh">Refresh</div>
    <div data-element="articles-list" class="list"></div>
    `;
  }

  _refreshArticlesList(fetchedData) {
    let innerHtml = '';
    if (!fetchedData) {
      innerHtml = '<span class = "error">Sorry, we could not find news for you. Please, try again later.</span>';
    } else {
      innerHtml = `
      <ul class="articles">
      ${fetchedData.map(article => `
        <li class="article">
          <div data-element="article-header" data-id="${article.id}" class="article-header">${article.webTitle}<span data-element="header-arrow">▼</span></div>
          <div data-element="article-text" class="article-text"></div>
        </li>
      `).join('')}
      </ul>
      `;
    }
    this._element.querySelector('[data-element="articles-list"]').innerHTML = innerHtml;
  }

  _showArticle(article) {
    article.classList.toggle('highlighted');
    const shortArticle = article.nextElementSibling;
    shortArticle.classList.toggle('expanded');
    const arrowItem = article.querySelector('[data-element="header-arrow"]');
    arrowItem.innerHTML = arrowItem.innerHTML.codePointAt(0) === 9660 ? '▲' : '▼';
    const articleItem = this._displayedArticles.find(art => art.id === article.dataset.id);

    if (!articleItem.shortNews) {
      const shortNewsData = ArticlesService.getData(articleItem.id);
      shortNewsData
        .then((data) => {
          const shortNews = data.content.blocks.body[0].bodyTextSummary.slice(0, 300);
          articleItem.shortNews = shortNews;
          shortArticle.innerHTML = `
            <p>${shortNews}...</p>
            <a href="${data.content.webUrl}" target="_blank">Read full news</a>
            `;
        })
        .catch((err) => {
          shortArticle.textContent = err;
        });
    }
  }
}
