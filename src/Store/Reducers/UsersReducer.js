import Users from "../Constants/Users";
const initialState = {
	loading:false,
	updatingSubjectLoading:false,
	meetingLoading:false,
	data:{},
	helpGig:{},
	newData:{},
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
	case Users.UPDATING_SUBJECTS:
	case Users.UPDATING_MEETING_LINK:
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
	case Users.UPDATE_MEETING_LINK:
		return {...state,data: {...state.data,meetLink:action.payload}};
	default:
		return state;
	}
};
