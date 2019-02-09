import Component from '../component.js';

import ArticlesService from '../services/articles-service.js';

export default class Articles extends Component {
  constructor({ element }) {
    super({ element });

    this.total = 0;

    this._render();

    this.on('click', 'articles-refresh', () => {
      this.emit('refresh');
    });

    this.on('click', 'article-header', (event) => {
      const articleElement = event.target.closest('[data-element="article-header"]');

      this.emit('expand', articleElement);
    });
  }


  show(arg = 'search?page=1&') {
    const article = arg;
    const url = arg;
    if (typeof arg !== 'string') {
      this._showArticle(article);
      return;
    }
    super.show();
    // eslint-disable-next-line consistent-return
    return ArticlesService.getArticles(url)
      .then((data) => {
        this._displayedArticles = data.results;
        this._refreshArticlesList(this._displayedArticles);
        this.total = data.pages;
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
      const shortNewsData = ArticlesService.getSelectedArticle(articleItem.id);
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
