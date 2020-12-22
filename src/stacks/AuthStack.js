import React from "react";
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
const AuthStack = ()=>{
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<SignIn/>
				</Route>
				<Route path={"/sign-up"}>
					<SignUp />
				</Route>
			</Switch>
		</Router>
	);
};

export default AuthStack;