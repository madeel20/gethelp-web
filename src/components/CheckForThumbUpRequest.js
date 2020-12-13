import React, {useEffect, useRef, useState} from "react";
import {database, auth, firestore} from "../firebase";
import {convertDBSnapshoptToArrayOfObject, convertToArray, MappedElement} from "../utils/helpers";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert/Alert";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {GetHelp} from "../Store/Constants/GetHelp";
import LinearProgress from "@material-ui/core/LinearProgress";
import Notifier from "react-desktop-notification";
import {websiteLink} from "../utils/Constants";
const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const CheckForThumbsUpRequest = ()=>{
	const [currentGig,setCurrentGig] = useState({});
	const [open,setOpen] = useState(false);
	const [helperUser,setHelperUser] = useState({});
	const [intervalFlag,setIntervalFlag] = useState(Math.random())
	const intervalObj = useRef();
	const [loading,setLoading] = useState(false);
	useEffect(()=>{
	   intervalObj.current =  setInterval(()=>
			database.ref("acceptedGigs").once("value").then((snap)=>{
				let res = convertDBSnapshoptToArrayOfObject(snap);
				// filter gig where user id is of current user
				res = res.filter(it=>it.userId===auth.currentUser.uid);
				// check if there any gig whose thump up is not set ... and the time is greater then 2 min
				res = res.filter(it=>!it.hasOwnProperty("thumbsUp") && ((new Date().getTime() - new Date(it.acceptedTime).getTime())/1000)> 600 );
                console.log(res)
				if(res.length>0){
					firestore.collection("users").where("id","==",res[0].helperId).get().then(r=>{
						if(r.docs.length>0){
						    console.log(r.docs)
							setHelperUser(convertToArray(r.docs)[0]);
							Notifier.start("Would you like to give your helper "+ convertToArray(r.docs)[0].fullName +" a thumbs-up?");
							setCurrentGig(res[0]);
							setOpen(true);
                            clearInterval(intervalObj.current);
						}
					});
				}
			}),3000);
		return ()=>{
			clearInterval(intervalObj.current);
		};
	},[intervalFlag]);
	const handleNo = ()=>{
		setLoading(true);
		database.ref("acceptedGigs").child(currentGig.id).update({thumbsUp:false}).then(()=>{
			setLoading(false);
			setOpen(false);
			// start listener again
			setIntervalFlag(Math.random());
		});
	};
	const handleYes = ()=>{
		setLoading(true);
		database.ref("acceptedGigs").child(currentGig.id).update({thumbsUp:true}).then(()=>{
			setLoading(false);
			setOpen(false);
            // start listener again
            setIntervalFlag(Math.random());
		});
	};
	return (
		<>
			<Snackbar open={open} autoHideDuration={10000} onClose={()=>setOpen(false)}>
				<div className={"d-flex flex-column justify-content-center align-items-center c-notification"}>
					{loading ? <LinearProgress style={{width:"300px"}} /> :
						<>   {currentGig && <>
                            Would you like to give your helper {helperUser.fullName} a thumbs-up?
							<span><Button onClick={handleYes} className={"mr-4"} color={"primary"}>Yes</Button>
								<Button onClick={handleNo} color={"secondary"}>No
								</Button></span></>}
						</>    }
				</div>
			</Snackbar>
		</>
	);
};

export default CheckForThumbsUpRequest;