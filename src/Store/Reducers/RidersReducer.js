import Riders from "../Constants/Riders";
import Vendors from "../Constants/Vendors";
const initialState = {
    loading:false,
    data:[],
};
export default (state = initialState, action = {}) => {
    switch (action.type) {
        case Riders.GET_ALL_RIDERS:
            return {
                ...state,...action.payload
            };
        case Riders.APPROVE_RIDER:
            return {
                ...state,...action.payload
            };
        default:
            return state;
    }
};
