import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import NearMeIcon from "@material-ui/icons/NearMe";
import Switch from "@material-ui/core/Switch";
import {Link} from "react-router-dom";
import {auth, database,firestore} from "../../firebase";
import {getHelperUserData, updateHelperUserStatus} from "../../Store/Actions/UsersActions";
import {helperStatus, helpGigStatus,UserRoles} from "../../utils/Constants";
import Request from "./Request";
import {convertDBSnapshoptToArrayOfObject, convertToArray} from "../../utils/helpers";
import Button from "@material-ui/core/Button";
const Home = ()=>{
	const dispatch = useDispatch();
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const [isRequestAccepted,setIsRequestAccepted] = useState(false);
	const { data, activeStatus,helperUserData } = stateProps;
	useEffect(()=>{
		try {
			database
				.ref("helpers").child(auth.currentUser.uid).on("value", (snapshot) => {
					dispatch(updateHelperUserStatus({status: snapshot && snapshot.val() && Object.entries(snapshot.val()).length>1?snapshot.val().status : helperStatus.AVAILABLE}));
					dispatch(getHelperUserData(snapshot && snapshot.val() && Object.entries(snapshot.val()).length>2?snapshot.val():{assignedUser:""}));
				});
		}
		catch (e) {
			console.log(e);
		}
		// assignHelpers();
	},[]);
	if(helperUserData.assignedUser!=="" && helperUserData.assignedTime && (new Date().getTime() - new Date(helperUserData.assignedTime).getTime())/1000 < 120){
		return <Request onAccepted={()=>setIsRequestAccepted(true)}/>;
	}
	if(isRequestAccepted) {
		return (
			<div className={"container"}>
				<Paper elevation={0} className={"m-4 p-4 d-flex flex-column justify-content-center"}>
					<h4>Hey, {data.fullName} go to your google meet link to help! </h4>
					<Button color={"primary"} className={' mt-4 mt-4'} onClick={()=>setIsRequestAccepted(false)} >Done</Button>
				</Paper>
			</div>
		);
	}
	return (
		<div className={"container"} >
			<h1>{data.fullName}</h1>
			<div className={"d-flex flex-direction-row"}>
				<Paper elevation={0} className={"m-4 p-4"} >
					<p>	Are you available to help? </p>
					<Switch
						checked={activeStatus}
						onChange={(e)=>dispatch(updateHelperUserStatus({status:!activeStatus}))}
						color="primary"
						name="checkedB"
						inputProps={{ "aria-label": "primary checkbox" }}
					/>
				</Paper>
				<Link to={"/get-help"}><Paper elevation={0} className={"m-4 p-4 d-flex flex-column align-items-center help-container"} >
					<p>	I need help! </p>
					<NearMeIcon fontSize="large" />
				</Paper>
				</Link>
			</div>
			<p>If you switch toggle to ‘yes,’ keep this tab open; </p><p>You can focus on other tabs. You’ll receive a notification if someone needs help.
			</p>
			<p>Your google meet to help others is: {data.meetLink}</p>
		</div>
	);
};

export default Home;