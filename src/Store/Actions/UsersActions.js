
import Users from "../Constants/Users";
import {insertToFirestore} from "../../firebase/helpers";
export const getUsers = (CB) => async (dispatch) => {

};

export const setNewUserData = (data)=> dispatch =>{
	dispatch({type: Users.SET_NEW_USER_DATA, payload: data});
};

export const insertDetails = (payload,CB) => dispatch => {
	insertToFirestore(
		payload,
		"users",
		async () => {
			CB && CB();
		}
	);

};
