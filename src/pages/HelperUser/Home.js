import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import NearMeIcon from "@material-ui/icons/NearMe";
import Switch from "@material-ui/core/Switch";
import {Link} from "react-router-dom";
import {auth, database} from "../../firebase";
import {getHelperUserData, updateHelperUserStatus} from "../../Store/Actions/UsersActions";
import {helperStatus} from "../../utils/Constants";
import Request from "./Request";
import Button from "@material-ui/core/Button";
const Home = ()=>{
	const dispatch = useDispatch();
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const [isRequestAccepted,setIsRequestAccepted] = useState(false);
	const { data, activeStatus,helperUserData } = stateProps;
	if(helperUserData.assignedUser!=="" && helperUserData.assignedTime && (new Date().getTime() - new Date(helperUserData.assignedTime).getTime())/1000 < 60000){
		return <Request onAccepted={()=>setIsRequestAccepted(true)}/>;
	}
	if(isRequestAccepted) {
		return (
			<div className={"container"}>
				<Paper elevation={0} className={"m-4 p-4 d-flex flex-column justify-content-center text-center"}>
					<h4>Hey {data.fullName}, go to your google meet link to help! </h4>
					<a href={data.meetLink} target={'_blank'} className={"mt-2"}> <p>{data.meetLink}</p></a>
					<Button color={"primary"} className={" mt-4 mt-4"} onClick={()=>setIsRequestAccepted(false)} >Done</Button>
					<p className="mt-2">Click 'DONE' after the meeting session is finished.</p>
				</Paper>
			</div>
		);
	}
	return (
		<div className={"container"} >
			<h1 className={"c-h1"}>{data.fullName}</h1>
			<div className={"d-flex flex-direction-row hel"}>
				<Paper elevation={0} className={"m-4 p-4"} >
					<p className="c-p">	Are you available to help? </p>
					<Switch
						checked={activeStatus}
						onChange={(e)=>dispatch(updateHelperUserStatus({status:!activeStatus}))}
						color="primary"
						name="checkedB"
						inputProps={{ "aria-label": "primary checkbox" }}
					/> 
					<p className="link-hint mt-2">Please use the “Edit Subjects” link on the left to select<br/> or update subjects you would like to help with.</p>
				</Paper>
				<Link to={"/get-help"}><Paper elevation={0} className={"m-4 p-4 d-flex flex-column align-items-center help-container"} >
					<p className="c-p">	I need help! </p>
					<NearMeIcon fontSize="large" />
				</Paper>
				</Link>
			</div>
			<p>If you switch toggle to ‘yes,’ keep this tab open; </p>
			<p>You can be on another tab, but you’ll receive a notification if someone needs help from you.</p>
			<p>Your Google Meet link is at the upper left under your name.</p>
		</div>
	);
};

export default Home;