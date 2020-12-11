import React, {useEffect} from "react";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import NearMeIcon from "@material-ui/icons/NearMe";
import Switch from "@material-ui/core/Switch";
import {Link} from "react-router-dom";
import {auth, database,firestore} from "../../firebase";
import {getHelperUserData, updateHelperUserStatus} from "../../Store/Actions/UsersActions";
import {helperStatus, helpGigStatus,UserRoles} from "../../utils/Constants";
import Request from "./Request";
import {convertDBSnapshoptToArrayOfObject, convertToArray} from "../../utils/helpers";
const Home = ()=>{
	const dispatch = useDispatch();
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const { data, activeStatus,helperUserData } = stateProps;
	useEffect(()=>{
		try {
			database
				.ref("helpers").child(auth.currentUser.uid).on("value", (snapshot) => {
					dispatch(updateHelperUserStatus({status: Object.entries(snapshot.val()).length>1?snapshot.val().status : helperStatus.AVAILABLE}));
					dispatch(getHelperUserData(Object.entries(snapshot.val()).length>2?snapshot.val():{assignedUser:""}));
				});
		}
		catch (e) {
			console.log(e);
		}
		// assignHelpers();
	},[]);
	if(helperUserData.assignedUser!==""){
		return <Request/>;
	}
	const assignHelpers = async ()=>{
		// get all the current help gigs
		let helpGigs = await database.ref("helpGigs").once("value");
		// convert gig to array of object
		helpGigs = helpGigs.val()? convertDBSnapshoptToArrayOfObject(helpGigs):[] ;
		// select only those gigs.. who are active and assigned to a helper
		helpGigs = await helpGigs.filter(gig=>gig.status===helpGigStatus.ACTIVE || gig.status=== helpGigStatus.REQUESTED_TO_ASSIGN);
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
		// now loop through each help gig
		 await  helpGigs.forEach( async helpGig => {
			// filter helpers by grade --> equal or greater then user grade
			finalHelpersData = await finalHelpersData.filter(it => parseInt(it.grade) === parseInt(helpGig.grade) || parseInt(it.grade) > parseInt(helpGig.grade));

			// filter by subject
			finalHelpersData = await finalHelpersData.filter(it => it.subjects.filter(subject => subject.id === helpGig.subjectId).length > 0);

			// if the filtred helpers are greater then 0 then further go forward
			if (finalHelpersData.length > 0) {
				// loop through each filtered helper user
				finalHelpersData.forEach(async finalHelperUser=>{
					// check if the helper asked is empty or the current helperis not in the list of helpers asked
					if(!helpGig.helpersAsked || helpGig.helpersAsked.indexOf(finalHelperUser.id) === -1) {

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
							assignedUser: helpGig.id,
							requestedToAssign: [...helperData.val().requestedToAssign || [], {
								userId: auth.currentUser.uid,
								dateTime: new Date().toUTCString()
							}],
						});
					}
				});
			}
		});
	};
	return (
		<div className={"container"} >
			<h1>{data.fullName}</h1>
			<div className={"d-flex flex-direction-row"}>
				<Paper elevation={0} className={"m-4 p-4"} >
					<p>	Are you available to help? </p>
					<Switch
						checked={activeStatus}
						onChange={(e)=>dispatch(updateHelperUserStatus({status:!activeStatus}))}
						color="primary"
						name="checkedB"
						inputProps={{ "aria-label": "primary checkbox" }}
					/>
				</Paper>
				{/*<Link to={"/get-help"}><Paper elevation={0} className={"m-4 p-4 d-flex flex-column align-items-center help-container"} >*/}
				{/*	<p>	I need help! </p>*/}
				{/*	<NearMeIcon fontSize="large" />*/}
				{/*</Paper>*/}
				{/*</Link>*/}
			</div>
			<p>If you switch toggle to ‘yes,’ keep this tab open; </p><p>You can focus on other tabs. You’ll receive a notification if someone needs help.
			</p>
			<p>Your google meet to help others is: {data.meetLink}</p>
		</div>
	);
};

export default Home;