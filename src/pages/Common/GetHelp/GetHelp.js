import React, {useEffect, useState} from "react";
import WaitingForHelp from "./WaitingForHelp";
import RequestHelp from "./RequestHelp";
import {useSelector} from "react-redux";
import {helpGigStatus} from "../../../utils/Constants";
const GetHelp = ()=> {
	const [isHelpRequestAssigned,setHelpRequestAssigned] = useState(false);
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const {helpGig} = stateProps;
	useEffect(()=>{
		if(helpGig.status && helpGig.status === helpGigStatus.ACTIVE){
			setHelpRequestAssigned(true)
		}
	},[helpGig]);
	if(isHelpRequestAssigned){
		return <WaitingForHelp onCancel={()=>setHelpRequestAssigned(false)} />;
	}
	else {
		return <RequestHelp onRequest={()=>{setHelpRequestAssigned(true); }} />;
	}
};

export default GetHelp;