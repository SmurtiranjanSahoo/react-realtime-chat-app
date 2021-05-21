import { SEND_MESSAGE, SET_LOADING } from "./action.type";

export default (state, action) => {
  switch (action.type) {
    case SEND_MESSAGE:
      return action.payload == null
        ? { ...state, messages: [] }
        : { ...state, messages: action.payload };

    case SET_LOADING:
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
};
