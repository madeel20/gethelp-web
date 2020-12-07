import Users from "../Constants/Users";
const initialState = {
	loading:false,
	data:[],
	newData:{},
};
export default (state = initialState, action = {}) => {
	switch (action.type) {
	case Users.GET_ALL_USERS:
		return {
			...state,...action.payload
		};
	case Users.SET_NEW_USER_DATA:
		return {
			...state, newData : {...state.newData , ...action.payload}
		};
	default:
		return state;
	}
};
