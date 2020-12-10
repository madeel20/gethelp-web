import React, {useEffect} from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PersistentDrawerLeft from "../components/Drawer";
import {useDispatch, useSelector} from "react-redux";
import {helpGigStatus, UserRoles} from "../utils/Constants";
import {HelperUserRoutes, NormalUserRoutes} from "../pages/Routes";
import { MappedElement} from "../utils/helpers";
import {auth, database} from "../firebase";
import {getHelpGig} from "../Store/Actions/UsersActions";

const HelperUserStack = ()=>{
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
		<Router>{data.role === UserRoles.NORMAL_USER? <UserStack/>:<HelperUserStack/>}</Router>
	);
};

export default MainStack;
