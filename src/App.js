import React, { useEffect, useState } from "react";
import "./pages/index.scss";
import { Provider } from "react-redux";
import { auth } from "./firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import AuthStack from "./stacks/AuthStack";
import { store } from "./Store";
import { checkIfItsNewUser } from "./firebase/helpers";
import NewUserStack from "./stacks/NewUserStack";
import MainStack from "./stacks/MainStack";
function App() {
	const [user, setuser] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isNewUser, setIsNewUser] = useState(null);
	useEffect(() => {
		// ask permission to show notifications
		if ("Notification" in window) {
			if (Notification.permission !== "granted") {
				Notification.requestPermission();
			}
		}
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				const { displayName, email } = user;
				setuser({
					displayName,
					email,
				});
				checkIfItsNewUser().then(isNewUser => {
					if (isNewUser === null) {
						setIsNewUser(null);
					}
					else if (isNewUser === true) {
						setIsNewUser(true);
					}
					else {
						setIsNewUser(false);
					}
					setLoading(false);
				}).catch((err) => {
					console.log(err);
				});

			}
			else {
				setuser(null);
				// eslint-disable-next-line no-mixed-spaces-and-tabs
				setLoading(false);
			}
		});
	}, [isNewUser]);
	if (isLoading) {
		return <div className="d-flex justify-content-center align-items-center c-h-100"> <CircularProgress /></div>;
	}
	if (!user) {
		return <AuthStack />;
	}
	if (user && !isNewUser) {
		return (
			<Provider store={store}>
				<MainStack />
			</Provider>
		);
	}
	if (user && isNewUser) {
		return <Provider store={store}>
			<NewUserStack onFinish={() => setIsNewUser(false)} />
		</Provider>;
	}

	return null;

}

export default App;
