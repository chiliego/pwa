import {
  LOGIN,
  LOGIN_INPUT,
  LOGIN_INPUT_ERROR,
  RESET_LOGIN_INPUT_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED
} from "../actions/login";

const login = (state = {input: {}, errors: []}, action) => {
  console.log(state);
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.bearer
      };
    case LOGIN_INPUT:
      return {
        ...state,
        input: {...state.input, ...action.input}
      };
    case LOGIN_INPUT_ERROR:
      return {
        ...state,
        errors: action.errors
      };
    case RESET_LOGIN_INPUT_ERROR:
      return {
        ...state,
        errors: []
      };
    default:
      return state;
  }
}

export default login;