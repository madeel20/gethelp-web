import React, { useEffect, useRef, useState } from "react";
import WaitingForHelp from "./WaitingForHelp";
import RequestHelp from "./RequestHelp";
import { useDispatch, useSelector } from "react-redux";
import { helperStatus, helpGigStatus } from "../../../utils/Constants";
import { auth, database } from "../../../firebase";
import { getHelpGig, updateHelperUserStatus } from "../../../Store/Actions/UsersActions";
import HelpAccepted from "./HelpAccepted";
import { useHistory } from 'react-router-dom'
import { showNotification } from "../../../utils/helpers";
import { Button, Paper } from "@material-ui/core";
const GetHelp = () => {
	const dispatch = useDispatch();
	const [isHelpRequestAssigned, setHelpRequestAssigned] = useState(false);
	const isNotificationAlreadyShown = useRef(false);
	const [isRequestTimedOut, setIsRequestTimedOut] = useState(false);
	const history = useHistory();
	const stateProps = useSelector(({ User }) => {
		return { ...User };
	});
	const { helpGig, data } = stateProps;
	useEffect(() => {
		dispatch(updateHelperUserStatus({ status: helperStatus.NOT_AVAILABLE }))
		if (helpGig && helpGig.status === helpGigStatus.ACTIVE) {
			setHelpRequestAssigned(true);
		}
		if (helpGig && helpGig.status === helpGigStatus.TIMEOUT) {
			showNotification("Sorry, No Helper is currently available! Try Again.");
			setIsRequestTimedOut(true);
			isNotificationAlreadyShown.current = true;
			database.ref("helpGigs").child(auth.currentUser.uid).update({ status: helpGigStatus.CANCELLED });
		}
	}, [helpGig]);
	useEffect(() => {
		database
			.ref("helpGigs").child(auth.currentUser.uid).on("value", (snapshot) => {
				if (snapshot && snapshot.val() && Object.entries(snapshot.val()).length > 0) {
					dispatch(getHelpGig(snapshot.val()));
				}
			});
	}, []);
	if (isRequestTimedOut) {
		return (
			<Paper className={"p-4  text-center"}>
				<h5>Whoops, No match found!</h5>
				<Button onClick={() => setIsRequestTimedOut(false)} color={"secondary"}>
					Please Try Again later
				</Button>
			</Paper>
		);
	}
	if (helpGig && helpGig.status === helpGigStatus.ASSIGNED && ((new Date().getTime() - new Date(helpGig.dateTime).getTime()) / 1000) < 900) {
		return <HelpAccepted helperId={helpGig.helperId} user={data} helpGig={helpGig} onCancel={() => { setHelpRequestAssigned(false); history.push("/"); }} />;
	}
	if (isHelpRequestAssigned && helpGig && (helpGig.status === helpGigStatus.ACTIVE || helpGig.status === helpGigStatus.REQUESTED_TO_ASSIGN)) {
		return <WaitingForHelp onCancel={() => { setHelpRequestAssigned(false); history.push("/"); }} />;
	}
	else {
		return <RequestHelp onRequest={() => { setHelpRequestAssigned(true); }} />;
	}
};
export default GetHelp;