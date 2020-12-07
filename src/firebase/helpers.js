import {auth,googleProvider,firestore} from "./index";
import {convertToArray} from "../utils/helpers";

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
export const checkIfItsNewUser = async () => {
	return await firestore
		.collection("users")
		.where("email", "==", auth.currentUser.email)
		.get()
		.then(async (res) => {
			if(res.docs.length >0){
				return false;
			}
			else {
				return true;
			}
		})
		.catch((err) => {
			console.log(err);
			return null;
		});
};

// firestore helpers
export const getCollection = async (collection) => {
	return await firestore
		.collection(collection)
		.get()
		.then((res) => {
			return convertToArray(res.docs);
		})
		.catch((err) => {
			console.log(err);
			return [];
		});
};
export const insertToFirestore = (data, collection, CB) => {
	firestore
		.collection(collection)
		.add(data)
		.then((res) => {
			CB && CB();
		})
		.catch((err) => {
			CB && CB();
			console.log(err);
		});
};