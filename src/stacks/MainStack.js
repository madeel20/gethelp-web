import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PersistentDrawerLeft from "../components/Drawer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { UserRoles, websiteLink } from "../utils/Constants";
import { HelperUserRoutes, NormalUserRoutes } from "../pages/Routes";
import { MappedElement, showNotification } from "../utils/helpers";
import { auth, database, firestore } from "../firebase";
import { getHelperUserData, updateHelperUserStatus } from "../Store/Actions/UsersActions";
import { helperStatus } from "../utils/Constants";
import CheckForThumbUpRequest from "../components/CheckForThumbUpRequest";
const HelperUserStack = () => {
	const intervaObj = useRef();
	const dispatch = useDispatch();
	const stateProps = useSelector(({ User }) => {
		return { ...User };
	});
	const { data, activeStatus, helperUserData } = stateProps;
	useEffect(() => {
		intervaObj.current = setInterval(() => updateLastActive(),
			5000);
		try {
			database
				.ref("helpers").child(auth.currentUser.uid).on("value", (snapshot) => {
					dispatch(updateHelperUserStatus({ status: snapshot && snapshot.val() && Object.entries(snapshot.val()).length > 1 ? snapshot.val().status : helperStatus.AVAILABLE }));
					dispatch(getHelperUserData(snapshot && snapshot.val() && Object.entries(snapshot.val()).length > 2 ? snapshot.val() : { assignedUser: "", assignedTime: "" }));
				});
		}
		catch (e) {
			console.log(e);
		}
		return () => {
			clearInterval(intervaObj.current);
		};
	}, []);
	useEffect(() => {
		if (helperUserData.hasOwnProperty('assignedUser') && helperUserData.assignedUser !== "") {
			database.ref("helpGigs").child(helperUserData.assignedUser).once("value").then(res => {
				firestore.collection("users").where("id", "==", helperUserData.assignedUser).get().then(res => {
					showNotification(res.docs[0].data().fullName + " needs your help!");
				});
			}
			);
		}
	}, [helperUserData.assignedUser]);
	const updateLastActive = () => {
		database
			.ref("helpers").child(auth.currentUser.uid)
			.update({ lastActive: new Date().toUTCString() })
	};

	return (
		<>
			<PersistentDrawerLeft routes={HelperUserRoutes} />
			<div className="layout">
				<Switch>

					<MappedElement data={HelperUserRoutes} renderElement={(obj, index) => {
						return <Route key={obj.route} path={obj.route} component={obj.component} exact={obj.exact}>
						</Route>;
					}} />
				</Switch>
			</div>
		</>
	);
};
const UserStack = () => {
	return (
		<>
			<PersistentDrawerLeft routes={NormalUserRoutes} />
			<div className="layout">
				<Switch>
					<MappedElement data={NormalUserRoutes} renderElement={(obj, index) => {
						return <Route key={obj.route} path={obj.route} component={obj.component} exact={obj.exact}>
						</Route>;
					}} />
				</Switch>
			</div>
		</>
	);
};
const MainStack = () => {
	const stateProps = useSelector(({ User }) => {
		return { ...User };
	});
	const { data } = stateProps;
	return (
		<Router>
			<CheckForThumbUpRequest />
			{data.role === UserRoles.NORMAL_USER ?
				<UserStack /> :
				<HelperUserStack />
			}
		</Router>
	);
};

export default MainStack;
