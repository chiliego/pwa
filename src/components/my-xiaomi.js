import { html } from '@polymer/lit-element';
import { repeat } from 'lit-html/directives/repeat.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import { getRooms } from '../actions/xiaomi.js';

// We are lazy loading its reducer.
import xiaomi from '../reducers/xiaomi.js';
store.addReducers({
  xiaomi
});

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import { PageViewElement } from './page-view-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyXiaomi extends connect(store)(PageViewElement) {
  render() {
      const {rooms} = this;
      let newRoomInput = {};
      return html`
      ${SharedStyles}
      <style>
        section > paper-button {
            display: block;
            max-width: 15%;
            text-align: center;
        }
        
        .newRoomInput {
            
        }
      
      </style>
      <section>
        <h2>Xiaomi Robot</h2>
        <div>
        <paper-input id="room" class="newRoomInput" label="Raum" @change="${i => newRoomInput.name = i.target}">
        </paper-input>
        <paper-input id="coordinates" class="newRoomInput" label="Koordinaten" @change="${i => newRoomInput.coords = i.target}">
        </paper-input>
       <paper-button raised class="indigo" @click="${() => this.addRoom(newRoomInput)}">Hinzufügen</paper-button>
        </div>
      </section>
      <section>
        <ul>
            ${repeat(rooms, (room) => html`
                <li>${room.name}: ${room.coords}</li>
            `)}
        </ul> 
      </section>
    `
  }

  constructor() {
    super();
    // this.rooms = [{name: "Küche", coords: "[[25600,25600,25600,25600,1]]"}];
  }

  static get properties() { return {
    rooms: Array,
  }}

  firstUpdated() {
    store.dispatch(getRooms());
  }

  _stateChanged(state) {
    this.rooms = state.xiaomi.rooms;
  }

  addRoom(newRoomInput) {
    if(newRoomInput.name === undefined){
      console.log("No room Name!");
      return;
    }

    if(newRoomInput.coords === undefined){
      console.log("No coordinates!");
      return;
    }

    console.log("Room: " + newRoomInput.name.value);
    console.log("Coords: " + newRoomInput.coords.value);
    let newRoom = {name: newRoomInput.name.value, coords: newRoomInput.coords.value}

    this.rooms=[...this.rooms,newRoom];

    newRoomInput.name.value = "";
    newRoomInput.coords.value = "";
  }
}

window.customElements.define('my-xiaomi', MyXiaomi);