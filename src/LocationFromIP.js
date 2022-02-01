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
    this.lat = null; 
    this.city = null; 
    this.region = null; 
    this.location = 'Map'; 
  }


  static get properties() {
    return {
      long: { type: Number, reflect: true },
      lat: { type: Number, reflect: true },
      city: { type: String, reflect: true}, //added
      region: {type: String, reflect: true}, //added
      //location: {type: String, reflect: true} //added
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }

  
  async getGEOIPData() {
    const IPClass = new UserIP();
    const userIPData = await IPClass.updateUserIP();
    return fetch(this.locationEndpoint + userIPData.ip)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        this.long = data.longitude;
        this.lat = data.latitude;
        this.city = data.city;
        this.region = data.region;
        console.log(data); 

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

    //<a href="https://www.google.com/maps/@${this.lat},${this.long},14z"><p style ="text-align:left">Location via Google Maps</a></p>

    //<a href="https://www.google.com/maps/@$4$77.910,14z"><p style ="text-align:left">Location via Google Maps</a></p>
    
    /*
    <br>
      <script>window.__appCDN="https://cdn.webcomponents.psu.edu/cdn/";</script>
      <script src="https://cdn.webcomponents.psu.edu/cdn/build.js"></script>
      
    */

    const url = `https://maps.google.com/maps?q=${this.lat},${this.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return html`<iframe title="Location" src="${url}"></iframe> 
      <a href="https://www.google.com/maps/@$4$77.910,14z"><p style ="text-align:left">Location via Google Maps</a></p>
    
      <br>
      <script>window.__appCDN="https://cdn.webcomponents.psu.edu/cdn/";</script>
      <script src="https://cdn.webcomponents.psu.edu/cdn/build.js"></script>

      <wikipedia-query search="${this.city}"></wikipedia-query>
      <wikipedia-query search="${this.region}"></wikipedia-query>
      <wikipedia-query search="${this.city}, ${this.region}"></wikipedia-query> `; //super unsure of this stuff
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);
