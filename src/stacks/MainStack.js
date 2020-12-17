import React, {useEffect, useRef} from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PersistentDrawerLeft from "../components/Drawer";
import { useSelector} from "react-redux";
import { UserRoles} from "../utils/Constants";
import {HelperUserRoutes, NormalUserRoutes} from "../pages/Routes";
import { MappedElement} from "../utils/helpers";
import {auth, database} from "../firebase";
import CheckForThumbUpRequest from "../components/CheckForThumbUpRequest";
const HelperUserStack = ()=>{
	const intervaObj = useRef();
	useEffect(()=>{
		intervaObj.current = setInterval(()=>updateLastActive(),
			10000);
		return ()=> {
			clearInterval(intervaObj.current);
		};
	},[]);
	const updateLastActive = ()=>{
		database
			.ref("helpers").child(auth.currentUser.uid)
			.update({lastActive: new Date().toUTCString()})
	}
	return (
		<>
			<PersistentDrawerLeft routes={HelperUserRoutes}/>
			<div className="layout">
				<Switch>
					<MappedElement data={HelperUserRoutes} renderElement={(obj, index )=>{
						return	<Route key={obj.route} path={obj.route} component={obj.component} exact={obj.exact}>
						</Route>;
					}} />
				</Switch>
			</div>
		</>
	);
};
const UserStack = ()=>{
	return (
		<>
			<PersistentDrawerLeft routes={NormalUserRoutes}/>
			<div className="layout">
				<Switch>
					<MappedElement data={NormalUserRoutes} renderElement={(obj, index )=>{
						return	<Route key={obj.route} path={obj.route} component={obj.component} exact={obj.exact}>
						</Route>;
					}} />
				</Switch>
			</div>
		</>
	);
};
const MainStack = ()=>{
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const { data } = stateProps;
	return (
		<Router>
			<CheckForThumbUpRequest />
			{data.role === UserRoles.NORMAL_USER?
				<UserStack/>:
				<HelperUserStack/>
			}
		</Router>
	);
};

export default MainStack;
