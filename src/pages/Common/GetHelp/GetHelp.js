import React, {useEffect, useRef, useState} from "react";
import WaitingForHelp from "./WaitingForHelp";
import RequestHelp from "./RequestHelp";
import {useDispatch, useSelector} from "react-redux";
import {helperStatus, helpGigStatus, websiteLink} from "../../../utils/Constants";
import {auth, database} from "../../../firebase";
import {getHelpGig, updateHelperUserStatus} from "../../../Store/Actions/UsersActions";
import HelpAccepted from "./HelpAccepted";
import Notifier from "react-desktop-notification";
import {useHistory} from 'react-router-dom'
const GetHelp = ()=> {
	const dispatch = useDispatch();
	const [isHelpRequestAssigned,setHelpRequestAssigned] = useState(false);
	const isNotificationAlreadyShown = useRef(false);
	const history = useHistory();
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const {helpGig} = stateProps;
	useEffect(()=>{
		dispatch(updateHelperUserStatus({status:helperStatus.NOT_AVAILABLE}))
		if(helpGig && helpGig.status === helpGigStatus.ACTIVE){
			setHelpRequestAssigned(true);
		}
		if(helpGig && helpGig.status === helpGigStatus.TIMEOUT && !isNotificationAlreadyShown.current){
			Notifier.start("Sorry, No Helper is currently available! Try Again.","",websiteLink);
			isNotificationAlreadyShown.current = true;
		}
	},[helpGig]);
	useEffect(()=>{
		database
			.ref("helpGigs").child(auth.currentUser.uid).on("value", (snapshot) => {
				if(snapshot && snapshot.val() && Object.entries(snapshot.val()).length > 0) {
					dispatch(getHelpGig(snapshot.val()));
				}
			});
	},[]);
	if(helpGig && helpGig.status === helpGigStatus.ASSIGNED && ((new Date().getTime() - new Date(helpGig.dateTime).getTime())/1000) < 900 ){
		return <HelpAccepted helperId={helpGig.helperId}  onCancel={()=>{setHelpRequestAssigned(false); history.push("/");}} />;
	}
	if(isHelpRequestAssigned  && helpGig && (helpGig.status === helpGigStatus.ACTIVE ||helpGig.status === helpGigStatus.REQUESTED_TO_ASSIGN  )){
		return <WaitingForHelp onCancel={()=>{setHelpRequestAssigned(false);history.push("/");}} />;
	}
	else {
		return <RequestHelp onRequest={()=>{setHelpRequestAssigned(true); }} />;
	}
};
export default GetHelp;