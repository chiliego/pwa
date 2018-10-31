/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
  GET_ROOMS,
    REVERSE_ZONES,
  SELECT_ROOM,
  DESELECT_ROOM,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE
} from '../actions/rooms.js';
import { createSelector } from 'reselect';

const INITIAL_SELECTED_ROOMS = {
  addedIds: [],
  quantityById: {}
};

const UPDATED_CART = {
  addedIds: ['1'],
  quantityById: {'1': 1}
};

const zonedClean = (state = {reverse: false, rooms: {}, selectedRooms: INITIAL_SELECTED_ROOMS}, action) => {
  switch (action.type) {
      case REVERSE_ZONES:
        return {
            ...state,
            reverse: action.option
        }
    case GET_ROOMS:
      return {
        ...state,
        rooms: action.rooms
      };
    case SELECT_ROOM:
    case DESELECT_ROOM:
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        rooms: products(state.rooms, action),
        selectedRooms: selectedRooms(state.selectedRooms, action),
        error: ''
      };
    case CHECKOUT_FAILURE:
      return {
        ...state,
        error: 'Checkout failed. Please try again'
      };
    default:
      return state;
  }
};

// Slice reducer: it only reduces the bit of the state it's concerned about.
const products = (state, action) => {
  switch (action.type) {
    case SELECT_ROOM:
    case DESELECT_ROOM:
      const roomId = action.roomId;
      return {
        ...state,
        [roomId]: product(state[roomId], action)
      };
    default:
      return state;
  }
};

const product = (state, action) => {
  switch (action.type) {
    case SELECT_ROOM:
      return {
        ...state,
        inventory: state.inventory - 1
      };
    case DESELECT_ROOM:
      return {
        ...state,
        inventory: state.inventory + 1
      };
    default:
      return state;
  }
};

const selectedRooms = (state = INITIAL_SELECTED_ROOMS, action) => {
  switch (action.type) {
    case SELECT_ROOM:
    case DESELECT_ROOM:
      return {
        addedIds: addedIds(state.addedIds, state.quantityById, action),
        quantityById: quantityById(state.quantityById, action)
      };
    case CHECKOUT_SUCCESS:
      return INITIAL_SELECTED_ROOMS;
    default:
      return state;
  }
};

const addedIds = (state = INITIAL_SELECTED_ROOMS.addedIds, quantityById, action) => {
  const roomId = action.roomId;
  switch (action.type) {
    case SELECT_ROOM:
      if (state.indexOf(roomId) !== -1) {
        return state;
      }
      return [
        ...state,
        action.roomId
      ];
    case DESELECT_ROOM:
      // This is called before the state is updated, so if you have 1 item in the
      // cart during the remove action, you'll have 0.
      if (quantityById[roomId] <= 1) {
        // This removes all items in this array equal to productId.
        return state.filter(e => e !== roomId);
      }
      return state;
    default:
      return state;
  }
};

const quantityById = (state = INITIAL_SELECTED_ROOMS.quantityById, action) => {
  const roomId = action.roomId;
  switch (action.type) {
    case SELECT_ROOM:
      return {
        ...state,
        [roomId]: (state[roomId] || 0) + 1
      };
    case DESELECT_ROOM:
      return {
        ...state,
        [roomId]: (state[roomId] || 0) - 1
      };
    default:
      return state;
  }
};

export default zonedClean;

// Per Redux best practices, the shop data in our store is structured
// for efficiency (small size and fast updates).
//
// The _selectors_ below transform store data into specific forms that
// are tailored for presentation. Putting this logic here keeps the
// layers of our app loosely coupled and easier to maintain, since
// views don't need to know about the store's internal data structures.
//
// We use a tiny library called `reselect` to create efficient
// selectors. More info: https://github.com/reduxjs/reselect.

const selectedRoomsSelector = state => state.zonedClean.selectedRooms;
const roomsSelector = state => state.zonedClean.rooms;

// Return a flattened array representation of the items in the cart
export const selectedRoomListSelector = createSelector(
  selectedRoomsSelector,
  roomsSelector,
  (selectedRooms, rooms) => {
    const items = [];
    for (let id of selectedRooms.addedIds) {
      const item = rooms[id];
      items.push({id: item.id, title: item.title, amount: selectedRooms.quantityById[id], coords: item.coords});
    }
    return items;
  }
);

// Return the total cost of the items in the cart
export const cartTotalSelector = createSelector(
  selectedRoomsSelector,
  roomsSelector,
  (selectedRooms, rooms) => {
    let total = 0;
    for (let id of selectedRooms.addedIds) {
      const item = rooms[id];
      total += item.price * selectedRooms.quantityById[id];
    }
    return parseFloat(Math.round(total * 100) / 100).toFixed(2);
  }
);

// Return the number of items in the cart
export const cartQuantitySelector = createSelector(
  selectedRoomsSelector,
  selectedRooms => {
    let num = 0;
    for (let id of selectedRooms.addedIds) {
      num += selectedRooms.quantityById[id];
    }
    return num;
  }
);
