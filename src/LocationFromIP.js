// dependencies / things imported
import { LitElement, html, css } from 'lit';
import { UserIP } from './UserIP.js';
import '@lrnwebcomponents/wikipedia-query/wikipedia-query.js'; //added

export class LocationFromIP extends LitElement {
  static get tag() {
    return 'location-from-ip';
  }

  constructor() {
    super();
    this.UserIpInstance = new UserIP();
    this.locationEndpoint = 'https://freegeoip.app/json/';
    this.long = null;
    this.lat = null; //changed to null
    this.city = null; //added
    this.country = null; //added
    this.location = 'Map'; //?????
  }

  // I'm not really sure what the "reflect" is doing other than its a boolean value
  // my guess is that its ensuring the long/lat are numbers, but its purpose isnt clear to me
  static get properties() {
    return {
      long: { type: Number, reflect: true },
      lat: { type: Number, reflect: true },
      city: { type: String, reflect: true}, //added
      country: {type: String, reflect: true}, //added
      location: {type: String, reflect: true}
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }

  // im not really sure what "async" means in this context
  async getGEOIPData() {
    const IPClass = new UserIP();
    // im not really sure what the "await" is doing
    const userIPData = await IPClass.updateUserIP();
    return fetch(this.locationEndpoint + userIPData.ip)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        // this.long + this.lat will be capturing where the user is based on IP
        // (using properties w/ type number)
        // not entirely sure that this part is correct
        this.long = data.long;
        this.lat = data.lat;
        this.city = data.city;
        this.location = `${this.city}, ${this.country}`;
        //do i console.log here?
        console.log(`Location: ${this.location}`); //added but unsure

        return data;
      });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  render() {
    // this function runs every time a properties() declared variable changes
    // this means you can make new variables and then bind them this way if you like

    const url = `https://maps.google.com/maps?q=${this.long},${this.lat}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return html`<iframe title="Location" src="${url}"></iframe> 
      <a href="$https://www.google.com/maps/@${this.lat},${this.long},14z"><p style ="text-align:left">Location via Google Maps</a></p>
    
      <wikipedia-query search="${this.city}"></wikipedia-query>
      <wikipedia-query search="${this.country}"></wikipedia-query>
      <wikipedia-query search="${this.location}"></wikipedia-query> `; //super unsure of this stuff
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);
