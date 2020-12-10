import React, {useEffect} from "react";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import NearMeIcon from "@material-ui/icons/NearMe";
import Switch from "@material-ui/core/Switch";
import {Link} from "react-router-dom";
import {auth, database} from "../../firebase";
import {getHelpGig, updateHelperUserStatus} from "../../Store/Actions/UsersActions";
import {GetHelp} from "../../Store/Constants/GetHelp";
import {helperStatus} from "../../utils/Constants";
const Home = ()=>{
	const dispatch = useDispatch();
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const { data, activeStatus } = stateProps;
	useEffect(()=>{
		database
			.ref("helpers").child(auth.currentUser.uid).child("status").on("value", (snapshot) => {
				dispatch(updateHelperUserStatus({status:snapshot.val()}))
			});
	},[]);

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