import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PersistentDrawerLeft from "../components/Drawer";
import {useSelector} from "react-redux";
import HelperUser from "../pages/HelperUser/HelperUser";
import {UserRoles} from "../utils/Constants";
import {HelperUserRoutes, NormalUserRoutes} from "../pages/Routes";
import {MappedElement} from "../utils/helpers";
const HelperUserStack = ()=>{
	return (
		<Router>
			<PersistentDrawerLeft routes={HelperUserRoutes}/>
			<div className="layout">
				<Switch>
					<MappedElement data={HelperUserRoutes} renderElement={(obj, index )=>{
						return	<Route key={obj.route} path={obj.route} component={obj.component} exact={obj.exact}>
						</Route>;
					}} />
				</Switch>
			</div>
		</Router>
	);
};
const UserStack = ()=>{
	return (
		<Router>
			<PersistentDrawerLeft routes={NormalUserRoutes}/>
			<div className="layout">
				<Switch>
					<MappedElement data={NormalUserRoutes} renderElement={(obj, index )=>{
						return	<Route key={obj.route} path={obj.route} component={obj.component} exact={obj.exact}>
						</Route>;
					}} />
				</Switch>
			</div>
		</Router>
	);
};
const MainStack = ()=>{
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const { data } = stateProps;
	return (
		<>{data.role === UserRoles.NORMAL_USER? <UserStack/>:<HelperUserStack/>}</>
	);
};

export default MainStack;
