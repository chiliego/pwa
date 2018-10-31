/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export const GET_ROOMS = 'GET_ROOMS';
export const REVERSE_ZONES = 'REVERSE_ZONES';
export const SELECT_ROOM = 'SELECT_ROOM';
export const DESELECT_ROOM = 'DESELECT_ROOM';
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS';
export const CHECKOUT_FAILURE = 'CHECKOUT_FAILURE';

const ROOM_LIST = [
    {
        "id": 1,
        "title": "Wohnzimmer",
        "coords": [[25205, 21600, 30329, 26433, 1]],
        "inventory": 1
    },
    {
        "id": 2,
        "title": "Flur",
        "coords": [[27600, 19600, 30329, 21600, 2]],
        "inventory": 1
    },
    {
        "id": 3,
        "title": "Küche",
        "coords": [[28400, 18688, 29600, 19600, 2], [28400, 15830, 30200, 18688, 2]],
        "inventory": 1
    },
    {
        "id": 4,
        "title": "Innenflur",
        "coords": [[30329, 19400, 32000, 21300, 1], [31129, 21300, 32000, 22600, 1]],
        "inventory": 1
    },
    {
        "id": 5,
        "title": "Kinderzimmer",
        "coords": [[30400, 22800, 34400, 23700, 1], [31100, 23700, 34400, 26433, 1]],
        "inventory": 1
    },
    {
        "id": 6,
        "title": "Bad",
        "coords": [[32000, 20400, 34400, 22100, 1]],
        "inventory": 1
    },
    {
        "id": 7,
        "title": "Schlafzimmer",
        "coords": [[30400, 15830, 34400, 19400, 1]],
        "inventory": 1
    }
];

export const getAllProducts = () => (dispatch, getState) => {
    // Here you would normally get the data from the server. We're simulating
    // that by dispatching an async action (that you would dispatch when you
    // succesfully got the data back)

    // You could reformat the data in the right format as well:
    const state = getState();
    const rooms = ROOM_LIST.reduce((obj, room) => {
        let _room = {...room};

        if(state.zonedClean.reverse){
            _room.coords = reverseCoordsIfNeeded(room.coords);
        }

        obj[room.id] = _room
        return obj
    }, {});

    dispatch({
        type: GET_ROOMS,
        rooms: rooms
    });
};

const reverseCoordsIfNeeded = (coords) => {
    let newCoords = [];

    for (let i = 0; i < coords.length; i++) {
        const currentCoord = coords[i];
        let x1 = 2 * 25600 - currentCoord[0];
        let y1 = 2 * 25600 - currentCoord[1];

        let x2 = 2 * 25600 - currentCoord[2];
        let y2 = 2 * 25600 - currentCoord[3];

        newCoords.push([x2, y2, x1, y1, currentCoord[4]])
    }

    return newCoords;
}

export const reverse = (option) => {
    return {
        type: REVERSE_ZONES,
        option
    }
}

export const checkout = (roomId) => (dispatch, getState) => {
    // Here you could do things like credit card validation, etc.
    // If that fails, dispatch CHECKOUT_FAILURE. We're simulating that
    // by flipping a coin :)
    const state = getState();
    const mergedZones = state.zonedClean.selectedRooms.addedIds
        .map(id => state.zonedClean.rooms[id].coords)
        .reduce((array, zone) => {
            array.push(...zone);
            return array
        }, []);

    // console.log(JSON.stringify(mergedZones));
    state.zonedClean.selectedRooms.addedIds
        .forEach(id => dispatch(deselectRoom(id)));

    fetch('http://localhost:3000/zonedClean', {
        method: 'PUT',
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(mergedZones)
    })
        .then(res => res.json())
        .then(console.log);
};

export const selectRoom = (roomId) => (dispatch, getState) => {
    const state = getState();
    // Just because the UI thinks you can add this to the cart
    // doesn't mean it's in the inventory (user could've fixed it);
    if (state.zonedClean.rooms[roomId].inventory > 0) {
        dispatch(selectRoomUnsafe(roomId));
    }
};

export const deselectRoom = (roomId) => {
    return {
        type: DESELECT_ROOM,
        roomId
    };
};

export const selectRoomUnsafe = (roomId) => {
    return {
        type: SELECT_ROOM,
        roomId
    };
};
