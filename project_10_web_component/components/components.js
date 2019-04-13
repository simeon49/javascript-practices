// web components

const _FLAGS_PATH_MAP = {
  'america': './components/assert/America.svg',
  'england': './components/assert/England.svg',
  'france': './components/assert/France.svg',
  'unknown': './components/assert/Unknown.svg',
};


class NationalFlag extends HTMLElement {
  constructor() {
    super();
    this.isInint = false;
  }

  connectedCallback() {
    console.log('connectedCallback is called.');
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
    <style>
      img {
        width: 128px;
        height: 128px;
      }
    </style>

    <img src="${this._getCountryFlag(this.country)}" />
    <slot><slot>
    `;
    this.isInint = true;
  }

  disconnectedCallback() {
    console.log('disconnectedCallback is called.');
  }

  get country() {
    return this.getAttribute('country');
  }

  set country(country) {
    console.log(`set country: ${country}`);
    this.setAttribute('country', country);
    const img = this.shadowRoot.querySelector('img');
    img.src = this._getCountryFlag(this.country);
  }

  _getCountryFlag(country) {
    country = country.toLowerCase();
    let path = _FLAGS_PATH_MAP[country];
    path = path ? path : _FLAGS_PATH_MAP.unknown;
    return path;
  }
}
// 定义 national-flag 标签
customElements.define('national-flag', NationalFlag);

// document.querySelector('html').addEventListener('click', e => {
//   console.log(e.composed);
//   console.log(e.composedPath());
// });
