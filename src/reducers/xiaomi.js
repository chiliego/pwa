import {
  ADD_ROOM,
  GET_ROOMS,
  ROOM_INPUT,
  ROOM_INPUT_ERROR,
  RESET_ROOM_INPUT_ERROR,
  SELECT_ROOM
} from '../actions/xiaomi';

const xiaomi = (state = {rooms: {}, input: {}, errors: []}, action) => {
  switch (action.type) {
    case GET_ROOMS:
      return {
        ...state,
        rooms: action.rooms
      };
    case ADD_ROOM:
      return {
        ...state,
        rooms: [...state.rooms, action.room]
      };
    case ROOM_INPUT:
      return {
        ...state,
        input: {...state.input, ...action.input}
      };
    case ROOM_INPUT_ERROR:
      return {
        ...state,
        errors: action.errors
      };
    case RESET_ROOM_INPUT_ERROR:
      return {
        ...state,
        errors: []
      };
    case SELECT_ROOM:
      const rooms = state.rooms;
      const room = rooms[action.id];
      const _room = {...room, selected: true}
      const _rooms = {...rooms, [action.id]:_room}
      return {
        ...state,
        rooms: _rooms
      };
    default:
      return state;
  }
}

export default xiaomi;