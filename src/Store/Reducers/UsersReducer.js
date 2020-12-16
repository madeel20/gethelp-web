import Users from "../Constants/Users";
const initialState = {
	loading:false,
	updatingDetailsLoading:false,
	meetingLoading:false,
	data:{},
	helpGig:{},
	newData:{},
	activeStatus:false,
	helperUserData:{assignedUser:""}
};
export default (state = initialState, action = {}) => {
	switch (action.type) {
	case Users.GET_USER_DATA:
		return {
			...state,data:action.payload
		};
	case Users.GET_HELP_GIG_DATA:
		return {
			...state,helpGig:action.payload
		};
	case Users.INSERT_USER_DETAILS:
	case Users.UPDATING_PROFILE_DETAILS:
	case Users.UPDATING_MEETING_LINK:
		return {
			...state,...action.payload
		};
	case Users.SET_NEW_USER_DATA:
		return {
			...state, newData : {...state.newData , ...action.payload}
		};
	case Users.UPDATE_DETAILS:
		return {
			...state, data: {...state.data,...action.payload}
		};
	case Users.UPDATE_MEETING_LINK:
		return {...state,data: {...state.data,meetLink:action.payload}};
	case Users.UPDATE_HELPER_USER_STATUS:
		return {...state, activeStatus: action.payload};
	case Users.GET_HELPER_USER_DATA:
		return {...state, helperUserData: action.payload};
	default:
		return state;
	}
};
