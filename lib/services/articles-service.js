import config from './config.js';

const ArticlesService = {
  apiUrl: config.apiUrl,
  apiKey: config.apiKey,
  api: config.apiKey,

  async getData(from) {
    const dataFromServer = await this._fetchData(`${from}`);
    return dataFromServer.response;
  },

  getArticles(url) {
    const requestUrl = url + this.apiKey;
    return this.getData(requestUrl);
  },

  getSelectedArticle(articleId) {
    const requestUrl = `${articleId}?show-blocks=body&${this.apiKey}`;
    return this.getData(requestUrl);
  },

  async _fetchData(url) {
    let result;
    try {
      const response = await fetch(this.apiUrl + url);
      result = await response.json();
    } catch (err) {
      result = err;
    }

    return result;
  },
};

export default ArticlesService;
