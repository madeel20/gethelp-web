import Users from "../Constants/Users";
const initialState = {
	loading:false,
	updatingSubjectLoading:false,
	data:{},
	newData:{},
};
export default (state = initialState, action = {}) => {
	switch (action.type) {
	case Users.GET_USER_DATA:
		return {
			...state,data:action.payload
		};
	case Users.INSERT_USER_DETAILS:
	case Users.UPDATING_SUBJECTS:
		return {
			...state,...action.payload
		};
	case Users.SET_NEW_USER_DATA:
		return {
			...state, newData : {...state.newData , ...action.payload}
		};
	case Users.UPDATE_SUBJECTS:
		return {
			...state, data: {...state.data,subjects:action.payload.subjects}
		};
	default:
		return state;
	}
};
