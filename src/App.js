import React, {useEffect, useState} from "react";
import "./pages/index.scss";
import {Provider} from "react-redux";
import { auth } from "./firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import AuthStack from "./stacks/AuthStack";
import {store} from "./Store";
import HelperUserStack from "./stacks/HelperUserStack";
function App() {
	const [user, setuser] = useState(null);
	const [isLoading, setLoading] = useState(true);
	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				const { displayName, email } = user;
				setuser({
					displayName,
					email,
				});
				setLoading(false);
			}
			else {
				setuser(null);
				// eslint-disable-next-line no-mixed-spaces-and-tabs
			  setLoading(false);
			}
		});
	}, []);
	if(isLoading){
		return <div className="d-flex justify-content-center align-items-center c-h-100"> <CircularProgress /></div>;
	}
	if(!user){
		return  <AuthStack />;
	}
	return (
		<Provider store={store}>
			<HelperUserStack/>
		</Provider>
	);
}

export default App;
