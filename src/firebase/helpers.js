import {auth,googleProvider} from "./index";

export const signInWithGoogle = () => {
	auth.signInWithPopup(googleProvider).then((res) => {
		// user object
		console.log(res.user);
	}).catch((error) => {
		console.log(error.message);
	});
};
export const logOut = () => {
	auth.signOut().then(()=> {
		
	}).catch((error) => {
		console.log(error.message);
	});
};