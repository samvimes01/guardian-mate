const ArticlesService = {
  async getData(from) {
    let requestUrl = this.apiUrl;
    if (from.match(/^search/i)) {
      requestUrl += `${from}&${this.apiKey}`;
    } else {
      requestUrl += `${from}?show-blocks=body&${this.apiKey}`;
    }
    const dataFromServer = await this._fetchData(`${requestUrl}`);
    return dataFromServer.response;
  },

  async _fetchData(url) {
    let result;
    try {
      const response = await fetch(url);
      result = await response.json();
    } catch (err) {
      result = err;
    }

    return result;
  },
};

export default ArticlesService;
