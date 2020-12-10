import {GetHelp} from "../Constants/GetHelp";
import {auth, database, firestore} from "../../firebase";
import {convertDBSnapshoptToArrayOfObject, convertToArray} from "../../utils/helpers";
import {helperStatus, helpGigStatus, UserRoles} from "../../utils/Constants";

export const insertHelp = (payload,CB) => dispatch => {
	dispatch({type:GetHelp.INSERTING_HELP,payload: {loading:true}});
	database
		.ref("helpGigs").child(auth.currentUser.uid)
		.update(payload)
		.then(async () => {
			dispatch({type:GetHelp.HELP_INSERTED,payload: {loading:false}});
			dispatch({type:GetHelp.INSERTING_HELP,payload: {loading:false}});
			CB && CB();
			await findHelper();
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
		.then(() => {
			dispatch({type:GetHelp.CANCEL_HELP,payload: {loading:false}});
			CB && CB();
		})
		.catch((err) => {
			console.log(err);
			dispatch({type:GetHelp.CANCEL_HELP,payload: {loading:false}});
			CB && CB();
		});
};
export const updateHelpGig = (gidId,payload,CB) => dispatch => {
	dispatch({type:GetHelp.UPDATE_HELP_GIG,payload: {loading:true}});
	database
		.ref("helpGigs").child(gidId)
		.update(payload)
		.then(() => {
			dispatch({type:GetHelp.UPDATE_HELP_GIG,payload: {loading:false}});
			CB && CB();
		})
		.catch((err) => {
			console.log(err);
			dispatch({type:GetHelp.UPDATE_HELP_GIG,payload: {loading:false}});
			CB && CB();
		});
};
export const setAssignedUserOfHelperUser = (payload,CB) => dispatch => {
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
export const insertIntoAcceptedGigs = (gigId,CB) => dispatch => {
	dispatch({type:GetHelp.INSERT_ACCEPTED_GIG,payload: {loading:true}});
	 database.ref("helpGigs").child(gigId).once("value").then(async res=>{
		 await  database
			 .ref("acceptedGigs")
			 .push(res.val());
				 dispatch({type:GetHelp.INSERT_ACCEPTED_GIG,payload: {loading:false}});
				 CB && CB();
	 });

};
const findHelper=async ()=>{
	try {
		let helpGig = await database.ref("helpGigs").child(auth.currentUser.uid).once("value");
		//get all the helpers data
		let helpers = await firestore.collection("users").where("role", "==", UserRoles.HELPER_USER).get();

		// get all the helpers status and last Active related data
		let getHelperStatus = await database.ref("helpers").once("value");

		//convert into javascript array of objects
		helpers = convertToArray(helpers.docs, false);
		getHelperStatus = await convertDBSnapshoptToArrayOfObject(getHelperStatus).filter(t => t.status === helperStatus.AVAILABLE);

		// combine both firestore and
		let finalHelpersData = [];
		getHelperStatus.map(it => {
			finalHelpersData.push({...it, ...helpers.find(item => item.id === it.id)});
		});
		// filter those helpers whose last seen was 30 seconds ago and also match grade
		finalHelpersData = await finalHelpersData.filter(it => ((new Date().getTime() - new Date(it.lastActive).getTime()) / 1000) < 30);
		// filter by grade --> equal or greater then user grade
		finalHelpersData = await finalHelpersData.filter(it => parseInt(it.grade) === parseInt(helpGig.val().grade) || parseInt(it.grade) > parseInt(helpGig.val().grade));
		console.log(finalHelpersData,)
		// filter by subject
		finalHelpersData = await finalHelpersData.filter(it => it.subjects.filter(subject => subject.id === helpGig.val().subjectId).length > 0);
		// if the find a match then assign him user help gig
		if (finalHelpersData.length > 0) {
			// get the helper user
			let finalHelperUser = finalHelpersData[0];
			// match the subjects with the gig subject
			// assign the gig to the helper found
			await database.ref("helpGigs").child(auth.currentUser.uid).update({
				status: helpGigStatus.REQUESTED_TO_ASSIGN,
				helpersAsked: [finalHelperUser.id],
				lastHelperAssigned: finalHelperUser.id
			});
			// also update the helper data that a gig is requested for the helper
			let helperData = await database.ref("helpers").child(finalHelperUser.id).once("value");
			await database.ref("helpers").child(finalHelperUser.id).update({
				status: helperStatus.NOT_AVAILABLE,
				assignedUser: auth.currentUser.uid,
				requestedToAssign: [...helperData.val().requestedToAssign || [], {
					userId: auth.currentUser.uid,
					dateTime: new Date().toUTCString()
				}],
			});
		}
	}
	catch (err) {
		console.log(err);
	}
};
