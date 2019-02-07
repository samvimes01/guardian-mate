import Component from '../component.js';

export default class Paginator extends Component {
  constructor({ element, currentPageNumber }) {
    super({ element });
    this._currentPageNumber = currentPageNumber;
    this._render();

    this.on('click', 'page-number', (event) => {
      if (this._currentPage === +event.target.dataset.pageNum) {
        return;
      }
      this._currentPage = +event.target.dataset.pageNum;
      this.emit('paginate', this._currentPage);
    });

    this.on('change', 'page-input', (event) => {
      if (this._currentPage === +event.target.value) {
        return;
      }
      this._currentPage = +event.target.value;
      this.emit('paginate', this._currentPage);
    });
  }

  _render() {
    this._element.innerHTML = `
      <span data-element = "page-number" data-page-num = "1" class = "button page-prev">< Previous Page</span>
      <input data-element = "page-input" class = "page-input" value = "1"> 
      <span class = "paginator-info"> of <span data-element = "page-info"></span> pages</span>
      <span data-element = "page-number" data-page-num = "2" class = "button page-next">Next Page ></span>
    `;
  }

  _changeCurrentPage(currentPageNumber) {
    const pageNumbersBtns = this._element.querySelectorAll('[data-element = "page-number"]');
    const prevPage = pageNumbersBtns[0];
    const nextPage = pageNumbersBtns[1];
    const pageInput = this._element.querySelector('[data-element = "page-input"]');

    pageInput.value = currentPageNumber;
    prevPage.dataset.pageNum = currentPageNumber === 1 ? 1 : currentPageNumber - 1;
    nextPage.dataset.pageNum = currentPageNumber + 1;
  }

  changePaginatorInfo(pages) {
    this._element.parentElement.querySelector('[data-element = "page-info"]').textContent = pages;
  }
}
