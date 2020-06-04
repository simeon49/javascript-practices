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
<<<<<<< HEAD
    console.log('init ...');
=======
>>>>>>> 9c98cd0f73019f60066f9a22794c2d8157ac5784
    this.isInint = false;
  }

  connectedCallback() {
<<<<<<< HEAD
    console.log('connect call back...');
    const shadowRoot = this.attachShadow({mode: 'open'});
    // const shadowRoot = this;
    shadowRoot.innerHTML = `
    <style>
      img {
        width: 50px;
        height: 50px;
      }
    </style>

    <img src="${this.getCountryFlag(this.country)}" />
=======
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
>>>>>>> 9c98cd0f73019f60066f9a22794c2d8157ac5784
    `;
    this.isInint = true;
  }

<<<<<<< HEAD
=======
  disconnectedCallback() {
    console.log('disconnectedCallback is called.');
  }

>>>>>>> 9c98cd0f73019f60066f9a22794c2d8157ac5784
  get country() {
    return this.getAttribute('country');
  }

  set country(country) {
<<<<<<< HEAD
    this.setAttribute('country', country);
  }

  getCountryFlag(country) {
=======
    console.log(`set country: ${country}`);
    this.setAttribute('country', country);
    const img = this.shadowRoot.querySelector('img');
    img.src = this._getCountryFlag(this.country);
  }

  _getCountryFlag(country) {
>>>>>>> 9c98cd0f73019f60066f9a22794c2d8157ac5784
    country = country.toLowerCase();
    let path = _FLAGS_PATH_MAP[country];
    path = path ? path : _FLAGS_PATH_MAP.unknown;
    return path;
  }
}
<<<<<<< HEAD

=======
// 定义 national-flag 标签
>>>>>>> 9c98cd0f73019f60066f9a22794c2d8157ac5784
customElements.define('national-flag', NationalFlag);

// document.querySelector('html').addEventListener('click', e => {
//   console.log(e.composed);
//   console.log(e.composedPath());
// });
