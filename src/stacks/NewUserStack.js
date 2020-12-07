import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FirstStep from "../pages/NewUser/FirstStep";
const NewUserStack = ()=>{
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<FirstStep/>
				</Route>
			</Switch>
		</Router>
	);
};

export default NewUserStack;