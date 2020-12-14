
import Users from "../Constants/Users";
import {insertToFirestore, updateDataInFireStoreDocumentByFieldName} from "../../firebase/helpers";
import {auth,database} from "../../firebase/index";
export const getHelpGig = (payload) => async (dispatch) => {
	dispatch({type: Users.GET_HELP_GIG_DATA, payload: payload });
};
export const setNewUserData = (data)=> dispatch =>{
	dispatch({type: Users.SET_NEW_USER_DATA, payload: data});
};
export const insertDetails = (payload,CB) => dispatch => {
	dispatch({type:Users.INSERT_USER_DETAILS,payload: {loading:true}});
	insertToFirestore(
		payload,
		"users",
		async () => {
			dispatch({type:Users.INSERT_USER_DETAILS,payload: {loading:false}});
			CB && CB();
		}
	).catch(err=> {
		console.log(err);
		dispatch({type:Users.INSERT_USER_DETAILS,payload: {loading:false}});
	});

};
export const updateSubjects = (payload,CB) => dispatch => {
	dispatch({type:Users.UPDATING_SUBJECTS,payload: {updatingSubjectLoading:true}});
	updateDataInFireStoreDocumentByFieldName("email",
		auth.currentUser.email,
		"users",
		payload,
		async () => {
			dispatch({type:Users.UPDATE_SUBJECTS,payload: payload});
			dispatch({type:Users.UPDATING_SUBJECTS,payload: {updatingSubjectLoading:false}});
			CB && CB();
		}
	).catch(err=> {
		console.log(err);
		dispatch({type:Users.UPDATING_SUBJECTS,payload: {updatingSubjectLoading:false}});
	});

};
export const updateMeetingLink = (payload,CB) => dispatch => {
	dispatch({type:Users.UPDATING_MEETING_LINK,payload: {meetingLoading:true}});
	updateDataInFireStoreDocumentByFieldName("email",
		auth.currentUser.email,
		"users",
		payload
		,
		async () => {
			dispatch({type:Users.UPDATE_MEETING_LINK,payload: payload.meetLink });
			dispatch({type:Users.UPDATING_MEETING_LINK,payload: {meetingLoading:false}});
			CB && CB();
		}
	).catch(err=> {
		console.log(err);
		dispatch({type:Users.UPDATING_MEETING_LINK,payload: {meetingLoading:false}});
	});

};
export const updateHelperUserStatus = (payload,CB) => dispatch =>{
	if( auth && auth.currentUser && auth.currentUser.uid) {
		database
			.ref("helpers").child(auth.currentUser.uid)
			.update(payload)
			.then((res) => {
				dispatch({type: Users.UPDATE_HELPER_USER_STATUS, payload: payload.status});
				CB && CB();
			})
			.catch((err) => {
				console.log(err);
				CB && CB(err);
			});
	}
};
export const getHelperUserData = (payload,CB) => dispatch =>{
	dispatch({type:Users.GET_HELPER_USER_DATA,payload: payload });
};

