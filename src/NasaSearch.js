import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/accent-card';

class NasaSearch extends LitElement {

constructor() {
    super();
    this.nasaImages = []; //array
    this.term = '';
}


static get properties() {
    return {
      nasaImages: { type: Array},
      term: {type: String, reflect: true},
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'term' && this[propName]) {
        this.getNasaData();
      }
      
      else if (propName === 'nasaImages') {
        this.render();
      }
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

   updateTerm(){
    //let term = document.querySelector("#term").value;
    //document.querySelector("#term").term = document.querySelector("#term").value;
    //var form = document.forms[0];
    // var selectElement = form.querySelector('input[name="term"]');
    // var selectedValue = selectElement.value;
    // return selectedValue;

}

  async getNasaData() {
      return fetch(
          `https://images-api.nasa.gov/search?media_type=image&q=` + this.term //adding user term to the "q=" at the end tocreate the search
      )
      .then(resp => {
          if(resp.ok) {
              return resp.json();
          }
          return false;
      })
      .then(data => {
          //console.log(data);
          this.nasaImages = [];

          data.collection.items.forEach(element => { //trying out collections +forEach instead of for loop 
              if(element.links[0].href !== undefined) {
                  const simplifiedInfo = {
                      imagesrc: element.links[0].href,
                      title: element.data[0].title,
                      description: element.data[0].description, //based off of  CourseDates? unsure
                  };
                  //console.log(simplifiedInfo);
                  this.nasaImages.push(simplifiedInfo);
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
      ${this.nasaImages.map(
        item => html`
          <accent-card imagesrc="${item.imagesrc}">
            <div slot="heading">${item.title}</div>
            <div slot="content">${item.description}</div>
          </accent-card>
        `
      )}
    `;
  }
}





customElements.define('nasa-image-search', NasaSearch);