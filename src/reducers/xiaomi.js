import {
  ADD_ROOM,
  GET_ROOMS
} from '../actions/xiaomi';

const xiaomi = (state = {rooms: []}, action) => {
  switch (action.type) {
    case GET_ROOMS:
      return {
        ...state,
        rooms: action.rooms
      };
    default:
      return state;
  }
}

export default xiaomi;