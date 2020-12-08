
import Users from "../Constants/Users";
import {insertToFirestore} from "../../firebase/helpers";
export const getUsers = (CB) => async (dispatch) => {

};

export const setNewUserData = (data)=> dispatch =>{
	dispatch({type: Users.SET_NEW_USER_DATA, payload: data});
};

export const insertDetails = (payload,CB) => dispatch => {
	dispatch({type:Users.INSERT_USER_DETAILS,payload: {loading:true}})
	insertToFirestore(
		payload,
		"users",
		async () => {
			dispatch({type:Users.INSERT_USER_DETAILS,payload: {loading:false}})
			CB && CB();
		}
	).catch(err=> {
		console.log(err);
		dispatch({type:Users.INSERT_USER_DETAILS,payload: {loading:false}});
	});

};
