import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import NearMeIcon from "@material-ui/icons/NearMe";
import Switch from "@material-ui/core/Switch";
import {Link} from "react-router-dom";
import {auth, database, firestore} from "../../firebase";
import {getHelperUserData, updateHelperUserStatus} from "../../Store/Actions/UsersActions";
import Notifier from "react-desktop-notification";
import {helperStatus} from "../../utils/Constants";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Button from "@material-ui/core/Button";
const Home = ()=>{
	const [currentRequest,setCurrentRequest] = useState({});
	const [requestUser,setRequestUser] = useState({});
	const [loading,setLoading] = useState(false);
	const dispatch = useDispatch();
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const { data, activeStatus,helperUserData } = stateProps;
	useEffect(()=>{
		try {
			database
				.ref("helpers").child(auth.currentUser.uid).on("value", (snapshot) => {
					dispatch(updateHelperUserStatus({status: Object.entries(snapshot.val()).length>0?snapshot.val().status : helperStatus.AVAILABLE}));
					 dispatch(getHelperUserData(Object.entries(snapshot.val()).length>2?snapshot.val():{assignedUser:""}));
				});
		}
		catch (e) {
			console.log(e);
		}
	},[]);
	useEffect(()=>{
		if(helperUserData.assignedUser!=="") {
			setLoading(true);
			database.ref("helpGigs").child(helperUserData.assignedUser).once("value").then(res => {
				setCurrentRequest(res.val());
				firestore.collection("users").where("id","==",helperUserData.assignedUser).get().then(res=>{
					setRequestUser(res.docs[0].data());
					Notifier.start(res.docs[0].data().fullName +" needs your help!");
					setLoading(false);
				});
			}
			);
		}

	},[helperUserData.assignedUser]);
	if(helperUserData.assignedUser!==""){
		return <div className={"container"} >
			<h1>Hi, {data.fullName}</h1>
			<Paper className={"d-flex flex-direction-row p-4 p-4"}>
				{loading ?
					<CircularProgress size={30}/>
					:
					<div className={"d-flex flex-column align-items-center"}>
						<h2>{requestUser.fullName} needs your help in {currentRequest.subjectName} of {currentRequest.grade} grade.</h2>
						<div className={"mt-4 mb-4"}>
							<Button color={"primary"} >Accept</Button><Button color={"secondary"}>Decline</Button>
						</div>
					</div>
				}
			</Paper>
		</div>;
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