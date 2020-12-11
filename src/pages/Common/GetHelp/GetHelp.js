import React, {useEffect, useState} from "react";
import WaitingForHelp from "./WaitingForHelp";
import RequestHelp from "./RequestHelp";
import {useDispatch, useSelector} from "react-redux";
import {helperStatus, helpGigStatus} from "../../../utils/Constants";
import {auth, database} from "../../../firebase";
import {getHelpGig} from "../../../Store/Actions/UsersActions";
import HelpAccepted from "./HelpAccepted";
const GetHelp = ()=> {
	const dispatch = useDispatch();
	const [isHelpRequestAssigned,setHelpRequestAssigned] = useState(false);
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const {helpGig} = stateProps;
	useEffect(()=>{
		if(helpGig && helpGig.status === helpGigStatus.ACTIVE){
			setHelpRequestAssigned(true);
		}
	},[helpGig]);
	useEffect(()=>{
		database
			.ref("helpGigs").child(auth.currentUser.uid).on("value", (snapshot) => {
				if(snapshot.val() && Object.entries(snapshot.val()).length > 0) {
					dispatch(getHelpGig(snapshot.val()));
				}
			});
	},[]);
	if(helpGig && helpGig.status === helpGigStatus.ASSIGNED){
		return <HelpAccepted helperId={helpGig.helperId}  onCancel={()=>setHelpRequestAssigned(false)} />
	}
	if(isHelpRequestAssigned){
		return <WaitingForHelp onCancel={()=>setHelpRequestAssigned(false)} />;
	}
	else {
		return <RequestHelp onRequest={()=>{setHelpRequestAssigned(true); }} />;
	}
};
export default GetHelp;