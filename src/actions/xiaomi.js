export const ADD_ROOM = 'ADD_ROOM';
export const GET_ROOMS = 'GET_ROOMS';
export const ROOM_INPUT = 'ROOM_INPUT';
export const ROOM_INPUT_ERROR = 'ROOM_INPUT_ERROR';
export const RESET_ROOM_INPUT_ERROR = 'RESET_ROOM_INPUT_ERROR';
export const SELECT_ROOM = 'SELECT_ROOM';
const ROOM_LIST = {0:
  {id: 0, name: "Küche", coords: "[[25600,25600,35600,35600,1]]", selected: false}
};

export const getRooms = () => {
  return {
    type: GET_ROOMS,
    rooms: ROOM_LIST
  };
};

export const addRoom = () => (dispatch, getState) => {
  const state = getState();
  let name = state.xiaomi.input.name;
  let coords = state.xiaomi.input.coords;
  let err = [];

  dispatch({
    type: RESET_ROOM_INPUT_ERROR
  });

  if(name === undefined || name === ""){
    err = [...err, "Check name input"]
  }

  if(coords === undefined || coords === ""){
    err = [...err, "Check coordinate input"]
  }

  if(err.length > 0){
    dispatch({
      type: ROOM_INPUT_ERROR,
      errors: err
    })
  } else {
    dispatch({
      type: ADD_ROOM,
      room: {name: name, coords: coords, selected: false}
    });
    dispatch(roomInput({name: "", coords: ""}))
  }
};

export const roomInput = (input) => {
  return {
    type: ROOM_INPUT,
    input
  }
}

export const selectRoom = (id) => (dispatch, getState) => {
  const state = getState();
  // Just because the UI thinks you can add this to the cart
  // doesn't mean it's in the inventory (user could've fixed it);
  if (state.xiaomi.rooms[id].selected === false) {
    dispatch(selectRoomUnsafe(id));
  }
}

export const selectRoomUnsafe = (id) => {
  return {
    type: SELECT_ROOM,
    id
  };
}
