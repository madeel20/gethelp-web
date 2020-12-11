import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {loadSubjects} from "../../../Store/Actions/SubjectActions";
import Paper from "@material-ui/core/Paper/Paper";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Alert from "@material-ui/lab/Alert/Alert";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import {updateHelpStatus} from "../../../Store/Actions/HelpActions";
import {helperStatus, helpGigStatus} from "../../../utils/Constants";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import {auth, database, firestore} from "../../../firebase";
import {getHelperUserData, updateHelperUserStatus} from "../../../Store/Actions/UsersActions";
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
				Notifier.start(res.docs[0].data().fullName +" has accepted you request!");
			}
		});
	},[]);
	const handleDone = ()=>{
		dispatch(updateHelpStatus({status: helpGigStatus.CANCELLED},()=>{
			onCancel();
		}));
	};
    console.log(helperUser.meetLink)
	return (
		<div className={"container "} style={{height:"400px"}}>
			<Paper className={"p-4 text-center"}>
				{loading ?
					<CircularProgress size={30}/>
					:<>
						<h2> Your Request is Accepted By {helperUser.fullName} </h2>
						<a href={helperUser.meetLink} target={"_blank"}> Go To Meeting </a>
						<Button color={"secondary"} onClick={handleDone}> Done </Button>
					</>
				}
			</Paper>
		</div>
	);
};

export default HelpAccepted;