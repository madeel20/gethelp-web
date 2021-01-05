import { GetHelp } from "../Constants/GetHelp";
import { auth, database, firestore } from "../../firebase";
import { convertDBSnapshoptToArrayOfObject, convertToArray } from "../../utils/helpers";
import { helperStatus, helpGigStatus, UserRoles } from "../../utils/Constants";

export const insertHelp = (payload, CB) => dispatch => {
	dispatch({ type: GetHelp.INSERTING_HELP, payload: { loading: true } });
	database
		.ref("helpGigs").child(auth.currentUser.uid)
		.update(payload)
		.then(async () => {
			dispatch({ type: GetHelp.HELP_INSERTED, payload: { loading: false } });
			dispatch({ type: GetHelp.INSERTING_HELP, payload: { loading: false } });
			CB && CB();
			// await findHelper();
		})
		.catch((err) => {
			console.log(err);
			dispatch({ type: GetHelp.INSERTING_HELP, payload: { loading: false } });
			CB && CB();
		});

};
export const updateHelpStatus = (payload, CB) => dispatch => {
	dispatch({ type: GetHelp.CANCEL_HELP, payload: { loading: true } });
	database
		.ref("helpGigs").child(auth.currentUser.uid)
		.update(payload)
		.then(() => {
			dispatch({ type: GetHelp.CANCEL_HELP, payload: { loading: false } });
			CB && CB();
		})
		.catch((err) => {
			console.log(err);
			dispatch({ type: GetHelp.CANCEL_HELP, payload: { loading: false } });
			CB && CB();
		});
};
export const updateHelpGig = (gidId, payload, CB) => dispatch => {
	dispatch({ type: GetHelp.UPDATE_HELP_GIG, payload: { loading: true } });
	database
		.ref("helpGigs").child(gidId)
		.update(payload)
		.then(() => {
			dispatch({ type: GetHelp.UPDATE_HELP_GIG, payload: { loading: false } });
			CB && CB();
		})
		.catch((err) => {
			console.log(err);
			dispatch({ type: GetHelp.UPDATE_HELP_GIG, payload: { loading: false } });
			CB && CB();
		});
};
export const setAssignedUserOfHelperUser = (payload, CB) => dispatch => {
	database
		.ref("helpers").child(auth.currentUser.uid)
		.update(payload)
		.then(() => {
			CB && CB();
		})
		.catch((err) => {
			console.log(err);
			CB && CB();
		});
};
export const insertIntoAcceptedGigs = (gigId, CB) => dispatch => {
	dispatch({ type: GetHelp.INSERT_ACCEPTED_GIG, payload: { loading: true } });
	database.ref("helpGigs").child(gigId).once("value").then(async res => {
		database
			.ref("acceptedGigs")
			.push({ ...res.val(), userId: gigId, acceptedTime: new Date().toUTCString() }).then(res => {
				dispatch({ type: GetHelp.INSERT_ACCEPTED_GIG, payload: { loading: false } });
				CB && CB(res.key);
			});
	});

};
