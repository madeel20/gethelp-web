import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import NearMeIcon from "@material-ui/icons/NearMe";
import Switch from "@material-ui/core/Switch";
import {Link} from "react-router-dom";
import {auth, database, firestore} from "../../firebase";
import {getHelperUserData, updateHelperUserStatus} from "../../Store/Actions/UsersActions";
const Home = ()=>{
	const [currentRequest,setCurrentRequest] = useState({});
	const [requestUser,setRequestUser] = useState({});
	const dispatch = useDispatch();
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const { data, activeStatus,helperUserData } = stateProps;
	useEffect(()=>{
		database
			.ref("helpers").child(auth.currentUser.uid).on("value", (snapshot) => {
				dispatch(updateHelperUserStatus({status:snapshot.val().status}));
				dispatch(getHelperUserData(snapshot.val()));
			});
	},[]);
	useEffect(()=>{
		if(helperUserData.assignedUser!=="") {
			database.ref("helpGigs").child(helperUserData.assignedUser).once("value").then(res => {
				setCurrentRequest(res.val());
			}
			);
			firestore.collection("users").where("id","==",helperUserData.assignedUser).get().then(res=>{
				setRequestUser(res.docs[0].data());
			});
		}

	},[helperUserData.assignedUser]);
	if(helperUserData.assignedUser!==""){
		return <div className={"container"} >
			<h1>{data.fullName}</h1>
			<Paper className={"d-flex flex-direction-row"}>
				<h2> {currentRequest.subjectName}</h2>
				{Object.entries(currentRequest).length>0 &&
				<h2> {currentRequest.grade}</h2>
				}
			</Paper></div>;
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