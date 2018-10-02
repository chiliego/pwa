import { html } from '@polymer/lit-element';
import { repeat } from 'lit-html/directives/repeat.js';

import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import { getRooms, addRoom, roomInput } from '../actions/xiaomi.js';

// We are lazy loading its reducer.
import xiaomi from '../reducers/xiaomi.js';
store.addReducers({
  xiaomi
});

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import { PageViewElement } from './page-view-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyXiaomi extends connect(store)(PageViewElement) {
  render() {
      const {rooms, errors, roomName, roomCoords} = this;
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
        <div>
            ${repeat(errors, (error) => html`
              <p>${error}</p>
            `)}            
        </div>
        <paper-input id="room" class="newRoomInput" label="Raum" 
        .value="${roomName}"
        @change="${i => store.dispatch(roomInput({name: i.target.value}))}">
        </paper-input>
        <paper-textarea id="coordinates" class="newRoomInput" label="Koordinaten" 
        .value="${roomCoords}"
        @value-changed="${i =>store.dispatch(roomInput({coords: i.target.value}))}">
        </paper-textarea>
       <paper-button raised class="ipaper-textareandigo" @click="${() => store.dispatch(addRoom())}">Hinzufügen</paper-button>
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
  }

  static get properties() { return {
    rooms: Array,
    errors: Array,
    roomName: String,
    roomCoords: String,
  }}

  firstUpdated() {
    store.dispatch(getRooms());
  }

  _stateChanged(state) {
    this.rooms = state.xiaomi.rooms;
    this.errors = state.xiaomi.errors;

    this.roomName = state.xiaomi.input.name;
    this.roomCoords = state.xiaomi.input.coords;
  }
}

window.customElements.define('my-xiaomi', MyXiaomi);