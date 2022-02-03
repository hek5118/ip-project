import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/accent-card';

class NasaSearch extends LitElement {

constructor() {
    super();
    this.nasaImages = []; //array
    //this.locationEndpoint = 'https://images-api.nasa.gov/';
}


static get properties() {
    return {
      view: { type: String, reflect: true },
      nasaImages: {
        type: Array,
      },
      loadData: {
        type: Boolean,
        reflect: true,
        attribute: 'load-data',
      },
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'loadData' && this[propName]) {
        this.getNasaData();
      }
      // when dates changes, fire an event for others to react to if they wish
      else if (propName === 'nasaImages') {
        this.dispatchEvent(
          new CustomEvent('results-changed', {
            detail: {
              value: this.nasaImages,
            },
          })
        );
      }
    });
  }

  async getNasaData() {
      let term = document.querySelector("#term").value;
      return fetch(
          //`https://images-api.nasa.gov/search?q=media_type=image`
          `https://images-api.nasa.gov/search?${term}&page=1&media_type=image`
      )
      .then(resp => {
          if(resp.ok) {
              return resp.json();
          }
          return false;
      })
      .then(data => {
          console.log(data);
          this.nasaImages = [];

          data.collection.items.forEach(element => {
              if(element.links[0].href != undefined) {
                  const moonInfo = {
                      imagesrc: element.links[0].href,
                      title: element.data[0].title,
                      description: element.data[0].description,
                  };
                  console.log(moonInfo);
                  this.nasaImages.push(moonInfo);
              }
          });
          return data;
      });
  }

  resetData() {
    this.nasaImages = [];
    this.loadData = false;
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
      ${this.view === 'list'
        ? html`
            <ul>
              ${this.nasaImages.map(
                item => html`
                  <li>
                    ${item.location} - ${item.month} - ${item.day} ${item.date}
                    - ${item.name} - ${item.start} - ${item.end}
                  </li>
                `
              )}
            </ul>
          `
        : html`
            ${this.nasaSearch.map(
              item => html`
                <date-card
                  location="${item.location}"
                  month="${item.month}"
                  day="${item.day}"
                  date="${item.date}"
                  title="${item.name}"
                  start-time="${item.start}"
                  end-time="${item.end}"
                ></date-card>
              `
            )}
          `}
    `;
  }





//customElements.define('nasa-image-search', NasaSearch);