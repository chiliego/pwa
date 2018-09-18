import { html } from '@polymer/lit-element';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import { PageViewElement } from './page-view-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyXiaomi extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Xiaomi Robot</h2>
        
        
        
        <paper-input id="room" class="search" label="Raum" on-change="${i => props._newRoomNameInput = i.target}">
        </paper-input>
        <paper-input id="coordinates" class="search" label="Koordinaten" on-change="${i => props._newRoomCoordsInput = i.target}">
        </paper-input>
       <paper-button raised class="indigo" on-click="${() => this.addRoom()}">Hinzufügen</paper-button>
       <!--<button on-click="${() => this.addRoom()}">Neuer Raum</button>-->
      </section>
    `
  }

  constructor() {
    super();
    this.rooms = [];
  }

  static get properties() { return {
    rooms: Array,
    _newRoomName: String,
    _newRoomCoords: String,
    _newRoomNameInput: Object,
    _newRoomCoordsInput: Object

  }}

  addRoom() {
    if(this._newRoomNameInput === undefined){
      console.log("No room Name!");
      return;
    }

    if(this._newRoomNameInput === undefined){
      console.log("No coordinates!");
      return;
    }

    console.log("Room: " + this._newRoomNameInput.value);
    console.log("Coords: " + this._newRoomCoordsInput.value);

    this.rooms.push({name: this._newRoomNameInput.value, coords: this._newRoomCoordsInput.value})

    this._newRoomNameInput.value = "";
    this._newRoomCoordsInput.value = "";
  }
}

window.customElements.define('my-xiaomi', MyXiaomi);