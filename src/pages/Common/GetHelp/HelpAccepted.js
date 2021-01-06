import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { loadSubjects } from "../../../Store/Actions/SubjectActions";
import Paper from "@material-ui/core/Paper/Paper";
import Button from "@material-ui/core/Button";
import { updateHelpStatus } from "../../../Store/Actions/HelpActions";
import { helpGigStatus, websiteLink } from "../../../utils/Constants";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { auth, database, firestore } from "../../../firebase";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { convertDBSnapshoptToArrayOfObject, showNotification } from "../../../utils/helpers";

const HelpAccepted = ({ helperId, onCancel, helpGig,user }) => {
	const dispatch = useDispatch();
	const [helperUser, setHelperUser] = useState({});
	const [loading, setLoading] = useState(false);
	const [acceptedGigObj, setAcceptedObj] = useState([]);
	useEffect(() => {
		dispatch(loadSubjects());
	}, []);
	useEffect(() => {
		setLoading(true);
		firestore.collection("users").where("id", "==", helperId).get().then(res => {
			if (res.docs.length > 0) {
				setHelperUser(res.docs[0].data());
				setLoading(false);
				showNotification(res.docs[0].data().fullName + " has accepted you request!");
			}
		});
	}, []);
	useEffect(() => {
		if (helpGig && helpGig.acceptedGigsId) {
			database.ref("acceptedGigs").child(helpGig.acceptedGigsId).once("value").then(res => {
				setAcceptedObj({ ...res.val() });
			})
		}
	}, [helpGig])
	const handleDone = async () => {
		dispatch(updateHelpStatus({ status: helpGigStatus.CANCELLED, lastHelperAssigned: "", helpersAsked: [], helperId: "", dateTime: "" }, () => {
			onCancel();
		}));
	};
	const handleNo = () => {
		setLoading(true);
		database.ref("acceptedGigs").child(helpGig.acceptedGigsId).update({ thumbsUp: false }).then(() => {
			setLoading(false);
			setAcceptedObj({});
			// setOpen(false);
			// start listener again
			// setIntervalFlag(Math.random());
			handleDone();
		});
	};
	const handleYes = () => {
		setLoading(true);
		database.ref("acceptedGigs").child(helpGig.acceptedGigsId).update({ thumbsUp: true }).then(() => {
			setLoading(false);
			setAcceptedObj({});
			// setOpen(false);
			// start listener again
			// setIntervalFlag(Math.random());
			handleDone();
		});
	};
	return (
		<div className={"container "} style={{ height: "400px" }}>
			{loading ?
				<Paper className={"p-4 text-center"}><CircularProgress size={30} /></Paper>
				: <>
					<Paper className={"p-4  text-center"}>
						<h5>Congrats! {helperUser.fullName} would like to help you!</h5>
						<p className="c-p mt-4 mb-4">When you go to the meeting, make sure you’re logged onto<br/> the same personal Google account ({user?.email}).<br /> School accounts do not allow you to join Google meets.</p>
						<a href={helperUser.meetLink} target={"_blank"}> Go To Meeting </a>
						{/* <Button color={"secondary"} onClick={handleDone}> Done </Button> */}
						{/* <p className="c-p mt-4">Click 'DONE' after the meeting session is finished.</p> */}
					</Paper>
					{Object.entries(acceptedGigObj).length > 0 && !acceptedGigObj.hasOwnProperty('thumbsUp') &&
						<Paper className={"p-2 mt-4 text-center"}>
							<p>After you finish with the Google meeting, if you found the session helpful,<br/> please remember to give {helperUser.fullName} a thumbs up.</p>
							<span><Button onClick={handleYes} className={"mr-4"} color={"primary"}><ThumbUpAltIcon className={'thumbsup-icon'}/></Button>
								<Button onClick={handleNo} color={"secondary"}>Not this time
								</Button></span>
						</Paper>
					}
				</>
			}
		</div >
	);
};

export default HelpAccepted;