import React, {useEffect, useState} from "react";
import WaitingForHelp from "./WaitingForHelp";
import RequestHelp from "./RequestHelp";
const GetHelp = ()=> {
	const [isHelpRequestAssigned,setHelpRequestAssigned] = useState(false);
	useEffect(()=>{

	},[]);
	if(isHelpRequestAssigned){
		return <WaitingForHelp onCancel={()=>setHelpRequestAssigned(false)} />;
	}
	else {
		return <RequestHelp onRequest={()=>{setHelpRequestAssigned(true); }} />;
	}
};

export default GetHelp;