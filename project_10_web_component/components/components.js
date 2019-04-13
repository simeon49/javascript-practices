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
    console.log('init ...');
    this.isInint = false;
  }

  connectedCallback() {
    console.log('connect call back...');
    const shadowRoot = this.attachShadow({mode: 'open'});
    // const shadowRoot = this;
    shadowRoot.innerHTML = `
    <style>
      img {
        width: 128px;
        height: 128px;
      }
    </style>

    <img src="${this.getCountryFlag(this.country)}" />
    `;
    this.isInint = true;
  }

  get country() {
    return this.getAttribute('country');
  }

  set country(country) {
    this.setAttribute('country', country);
    const img = this.shadowRoot.querySelector('img');
    img.src = this.getCountryFlag(this.country);
  }

  getCountryFlag(country) {
    country = country.toLowerCase();
    let path = _FLAGS_PATH_MAP[country];
    path = path ? path : _FLAGS_PATH_MAP.unknown;
    return path;
  }
}

customElements.define('national-flag', NationalFlag);

// document.querySelector('html').addEventListener('click', e => {
//   console.log(e.composed);
//   console.log(e.composedPath());
// });
