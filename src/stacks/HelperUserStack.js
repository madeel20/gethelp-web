
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HelperUser from "../pages/HelperUser/HelperUser";
import PersistentDrawerLeft from "../components/Drawer";
const HelperUserStack = ()=>{
	return (
		<Router>
			<PersistentDrawerLeft/>
			<div className="App">
				<Switch>
					<Route path="/">
						<HelperUser />
					</Route>
				</Switch>
			</div>
		</Router>
	);
};
export default HelperUserStack;
