const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    adminOrder: null,
    pagination: {},
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_ADMIN_ORDERS":
            return {
                ...state,
                adminOrder: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };
           case "FETCH_ORDERS_REQUEST":
              return {
                ...state,
                loading: true,
                error: null,
              };

            case "FETCH_ORDERS_SUCCESS":
              return {
                ...state,
                loading: false,
                orders: action.payload,
                error: null,
              };

            case "FETCH_ORDERS_FAILURE":
              return {
                ...state,
                loading: false,
                error: action.payload,
              };

            // Fetch Order Details
            case "FETCH_ORDER_DETAILS_REQUEST":
              return {
                ...state,
                loading: true,
                error: null,
              };

            case "FETCH_ORDER_DETAILS_SUCCESS":
              return {
                ...state,
                loading: false,
                currentOrder: action.payload,
                error: null,
              };

            case "FETCH_ORDER_DETAILS_FAILURE":
              return {
                ...state,
                loading: false,
                error: action.payload,
              };

            // Cancel Order
            case "CANCEL_ORDER_REQUEST":
              return {
                ...state,
                loading: true,
                error: null,
              };

            case "CANCEL_ORDER_SUCCESS":
              return {
                ...state,
                loading: false,
                orders: state.orders.map((order) =>
                  order.orderId === action.payload.orderId
                    ? { ...order, orderStatus: "CANCELLED" }
                    : order
                ),
                currentOrder:
                  state.currentOrder?.orderId === action.payload.orderId
                    ? { ...state.currentOrder, orderStatus: "CANCELLED" }
                    : state.currentOrder,
                error: null,
              };

            case "CANCEL_ORDER_FAILURE":
              return {
                ...state,
                loading: false,
                error: action.payload,
              };
                default:
                    return state;
            }
};