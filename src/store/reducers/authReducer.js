const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
    error: null,
    address: [],
    clientSecret: null,
    selectedUserCheckoutAddress: null,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_USER":
            return { ...state, user: action.payload };
        case "USER_ADDRESS":
            return { ...state, address: action.payload };
        case "SELECT_CHECKOUT_ADDRESS":
            return { ...state, selectedUserCheckoutAddress: action.payload };
        case "REMOVE_CHECKOUT_ADDRESS":
            return { ...state, selectedUserCheckoutAddress: null };
        case "CLIENT_SECRET":
            return { ...state, clientSecret: action.payload };
        case "REMOVE_CLIENT_SECRET_ADDRESS":
            return { ...state, clientSecret: null, selectedUserCheckoutAddress: null };
        case "LOG_OUT":
            return { 
                user: null,
                address: null,
             };
        case "UPDATE_USER":
      const updatedUser = {
        ...state.user,
        ...action.payload
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
      };
    
    case "GET_PROFILE_REQUEST":
    case "UPDATE_PROFILE_REQUEST":
    case "CHANGE_PASSWORD_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case "GET_PROFILE_SUCCESS":
    case "UPDATE_PROFILE_SUCCESS":
      const profileUser = {
        ...state.user,
        ...action.payload
      };
      localStorage.setItem("user", JSON.stringify(profileUser));
      return {
        ...state,
        loading: false,
        user: profileUser,
        error: null,
      };
    
    case "CHANGE_PASSWORD_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
      };
    
    case "GET_PROFILE_FAILURE":
    case "UPDATE_PROFILE_FAILURE":
    case "CHANGE_PASSWORD_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
             
        default:
            return state;
    }
};