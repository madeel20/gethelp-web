import Vendors from "../Constants/Vendors";

const initialState = {
    loading:true,
    data:[],
    menuItems:[],
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case Vendors.GET_ALL_VENDORS:
            return {
                ...state,...action.payload
            };
        case Vendors.APPROVE_VENDOR:
            return {
                ...state,...action.payload
            };
        case Vendors.GET_VENDOR_MENU:
            return {...state, ...action.payload }
        default:
            return state;
    }
};
