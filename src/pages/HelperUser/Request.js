import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper/Paper";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Button from "@material-ui/core/Button";
import {auth, database, firestore} from "../../firebase";
import Notifier from "react-desktop-notification";
import {useDispatch, useSelector} from "react-redux";
import {insertIntoAcceptedGigs, setAssignedUserOfHelperUser, updateHelpGig} from "../../Store/Actions/HelpActions";
import {helpGigStatus, websiteLink} from "../../utils/Constants";

const Request = ({onAccepted})=>{
	const dispatch = useDispatch();
	const [currentRequest,setCurrentRequest] = useState({});
	const [requestUser,setRequestUser] = useState({});
	const [loading,setLoading] = useState(false);
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const { data,helperUserData } = stateProps;
	useEffect(()=>{
		if(helperUserData.hasOwnProperty('assignedUser') && helperUserData.assignedUser!=="") {
			setLoading(true);
			database.ref("helpGigs").child(helperUserData.assignedUser).once("value").then(res => {
				setCurrentRequest(res.val());
				firestore.collection("users").where("id","==",helperUserData.assignedUser).get().then(res=>{
					setRequestUser(res.docs[0].data());
					// Notifier.start(res.docs[0].data().fullName +" needs your help!","",websiteLink);
					setLoading(false);
				});
			}
			);
		}
	},[helperUserData.assignedUser]);
	const handleCancel =()=>{
		setLoading(true);
		dispatch(updateHelpGig(helperUserData.assignedUser,{ status: helpGigStatus.ACTIVE},()=> {
			dispatch(setAssignedUserOfHelperUser({assignedUser: "",assignedTime:""}, () => {
				setLoading(false);
			}));
		}));
	};
	const handleAccept =()=>{
		setLoading(true);
		dispatch(updateHelpGig(helperUserData.assignedUser,{ status: helpGigStatus.ASSIGNED,helperId: auth.currentUser.uid,lastHelperAssignedTime:""},()=> {
			dispatch(insertIntoAcceptedGigs(helperUserData.assignedUser, () => {
				dispatch(setAssignedUserOfHelperUser({assignedUser: "",assignedTime:""}, () => {
					onAccepted();
					setLoading(false);
				}));
			}));
		}));
	};
	return (
		<div className={"container"} >
			<h1>Hi {data.fullName}</h1>
			<Paper className={"d-flex flex-direction-row p-4 p-4"}>
				{loading ?
					<CircularProgress size={30}/>
					:
					<div className={"d-flex flex-column align-items-center"}>
						<h5>{requestUser.fullName} of Grade {currentRequest.grade} needs your help in {currentRequest.subjectName}.</h5>
						<div className={"mt-4 mb-4"}>
							<Button color={"primary"} onClick={handleAccept} >Accept</Button>
							<Button color={"secondary"} onClick={handleCancel}>Decline</Button>
						</div>
					</div>
				}

			</Paper>
		</div>
	);
};

export default Request;