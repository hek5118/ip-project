import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/accent-card';

class NasaSearch extends LitElement {
  constructor() {
    super();
    this.NasaImages = [];
    this.term = '';
  }

  static get properties() {
    return {
      term: { type: String, reflect: true },
      NasaImages: {
        type: Array,
      },
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'term' && this[propName]) {
        this.getNasaData();
      } else if (propName === 'NasaImages') {
        this.render();
      } else if (propName === 'NasaImages') {
        this.dispatchEvent(
          new CustomEvent('results-changed', {
            detail: {
              value: this.NasaImages,
            },
          })
        );
      }
    });
  }

  updateTerm(value) {
    this.term = value;
    this.getNasaData();
  }

  async getNasaData() {
    // let term = document.querySelector("term").value;
    // document.querySelector("term").term = document.querySelector("term").value;
    return fetch(
      `https://images-api.nasa.gov/search?media_type=image&q=${this.term}`
      // adding in the search term to the end of the url for updated search
    )
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        // console.log(data);
        this.NasaImages = [];
        // grabbed from coursedates.js
        data.collection.items.forEach(element => {
          // not sure why we need collections
          if (element.links[0].href !== undefined) {
            const simplifiedInfo = {
              imagesrc: element.links[0].href,
              title: element.data[0].title,
              description: element.data[0].description,
            };
            // console.log(simplifiedInfo);
            this.NasaImages.push(simplifiedInfo);
          }
        });
        return data;
      });
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 2px solid black;
        min-height: 100px;
      }
      date-card {
        display: inline-flex;
      }
      :host([view='list']) ul {
        margin: 20px;
      }
    `;
  }

  render() {
    return html`
      ${this.NasaImages.map(
        item => html`
          <accent-card image-src="${item.imagesrc}">
            <div slot="heading">${item.title}</div>
            <div slot="content">${item.description}</div>
          </accent-card>
        `
      )}
    `;
  }
}
customElements.define('nasa-image-search', NasaSearch);
