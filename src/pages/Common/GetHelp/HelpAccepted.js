import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {loadSubjects} from "../../../Store/Actions/SubjectActions";
import Paper from "@material-ui/core/Paper/Paper";
import Button from "@material-ui/core/Button";
import {updateHelpStatus} from "../../../Store/Actions/HelpActions";
import { helpGigStatus, websiteLink} from "../../../utils/Constants";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import {firestore} from "../../../firebase";
import Notifier from "react-desktop-notification";

const HelpAccepted =({helperId,onCancel})=>{
	const dispatch = useDispatch();
	const [helperUser,setHelperUser] = useState({});
	const [loading,setLoading] = useState(false);
	useEffect(()=>{
		dispatch(loadSubjects());
	},[]);
	useEffect(()=>{
		setLoading(true);
		firestore.collection("users").where("id","==",helperId).get().then(res=>{
			if(res.docs.length>0){
				setHelperUser(res.docs[0].data());
				setLoading(false);
				Notifier.start(res.docs[0].data().fullName +" has accepted you request!","",websiteLink);
			}
		});
	},[]);
	const handleDone = async ()=>{
		dispatch(updateHelpStatus({status: helpGigStatus.CANCELLED,lastHelperAssigned:"",helpersAsked:[],helperId:"",dateTime:""}, ()=>{
			onCancel();
		}));
	};
	return (
		<div className={"container "} style={{height:"400px"}}>
			<Paper className={"p-4 text-center"}>
				{loading ?
					<CircularProgress size={30}/>
					:<>
						<h5>Congrats! {helperUser.fullName} would like to help you!</h5>
						<p className="c-p">When you go to the meeting, make sure you’re logged onto the same personal Google account.<br/> School accounts do not allow you to join Google meets.</p>
						<a href={helperUser.meetLink} target={"_blank"}> Go To Meeting </a>
						<Button color={"secondary"} onClick={handleDone}> Done </Button>
						<p className="c-p mt-4">Click 'DONE' after the meeting session is finished.</p>
					</>
				}
			</Paper>
		</div>
	);
};

export default HelpAccepted;