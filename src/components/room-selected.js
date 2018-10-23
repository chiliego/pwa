/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the elements needed by this element.
import { removeFromCartIcon } from './my-icons.js';
import './room-item.js';

// These are the actions needed by this element.
import { deselectRoom } from '../actions/rooms.js';

// These are the reducers needed by this element.
import { selectedRoomListSelector, cartTotalSelector } from '../reducers/rooms.js';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles.js';

class RoomSelected extends connect(store)(LitElement) {
  render() {
    return html`
      ${ButtonSharedStyles}
      <style>
        :host { display: block; }
      </style>
      <p ?hidden="${this._items.length !== 0}">Please add some products to cart.</p>
      ${this._items.map((item) =>
        html`
          <div>
            <room-item .name="${item.title}" .coords="${item.coords}"></room-item>
            <button
                @click="${this._removeButtonClicked}"
                data-index="${item.id}"
                title="Remove from cart">
              ${removeFromCartIcon}
            </button>
          </div>
        `
      )}
    `;
  }

  static get properties() { return {
    _items: { type: Array },
  }}

  _removeButtonClicked(e) {
    store.dispatch(deselectRoom(e.currentTarget.dataset['index']));
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._items = selectedRoomListSelector(state);
  }
}

window.customElements.define('room-selected', RoomSelected);
