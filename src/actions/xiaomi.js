export const ADD_ROOM = 'ADD_ROOM';
export const GET_ROOMS = 'GET_ROOMS';

const ROOM_LIST = [
  {name: "Küche", coords: "[[25600,25600,35600,35600,1]]"}
];

export const getRooms = () => {
  return {
    type: GET_ROOMS,
    rooms: ROOM_LIST
  };
};

// export const addToCart = (productId) => (dispatch, getState) =>{
//   const state = getState();
//   // Just because the UI thinks you can add this to the cart
//   // doesn't mean it's in the inventory (user could've fixed it);
//   if (state.shop.products[productId].inventory > 0) {
//     dispatch(addToCartUnsafe(productId));
//   }
// };