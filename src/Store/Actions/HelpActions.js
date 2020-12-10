import Users from "../Constants/Users";
import {insertIntoDatabaseRef, insertToFirestore} from "../../firebase/helpers";
import {GetHelp} from "../Constants/GetHelp";
import {auth, database} from "../../firebase";
import {convertDBSnapshoptToArrayOfObject} from "../../utils/helpers";

export const insertHelp = (payload,CB) => dispatch => {
	dispatch({type:GetHelp.INSERTING_HELP,payload: {loading:true}});
	database
		.ref("helpGigs").child(auth.currentUser.uid)
		.update(payload)
		.then((res) => {
			dispatch({type:GetHelp.HELP_INSERTED,payload: {loading:false}});
			dispatch({type:GetHelp.INSERTING_HELP,payload: {loading:false}});
			CB && CB();
		})
		.catch((err) => {
			console.log(err);
			dispatch({type:GetHelp.INSERTING_HELP,payload: {loading:false}});
			CB && CB();
		});

};
export const updateHelpStatus = (payload,CB) => dispatch => {
	dispatch({type:GetHelp.CANCEL_HELP,payload: {loading:true}});
	database
		.ref("helpGigs").child(auth.currentUser.uid)
		.update(payload)
		.then((res) => {
			dispatch({type:GetHelp.CANCEL_HELP,payload: {loading:false}});
			CB && CB();
		})
		.catch((err) => {
			console.log(err);
			dispatch({type:GetHelp.CANCEL_HELP,payload: {loading:false}});
			CB && CB();
		});
};