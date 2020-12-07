import Users from "../Constants/Users";
const initialState = {
    loading:false,
    data:[],
};
export default (state = initialState, action = {}) => {
    switch (action.type) {
        case Users.GET_ALL_USERS:
            return {
                ...state,...action.payload
            };
        default:
            return state;
    }
};
