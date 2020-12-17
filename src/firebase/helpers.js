import {auth,googleProvider,firestore,database} from "./index";
import {convertToArray} from "../utils/helpers";
import {store} from "../Store/index";
import Users from "../Store/Constants/Users";
export const signInWithGoogle = (CB) => {
	auth.signInWithPopup(googleProvider).then((res) => {
		// user object
		CB && CB();
	}).catch((error) => {
		console.log(error.message);
	});
};
export const logOut = (CB) => {
	auth.signOut().then(()=> {
		CB && CB()
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
				store.dispatch({type:Users.GET_USER_DATA,payload:res.docs[0].data()});
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
export const insertToFirestore = async (data, collection, CB) => {
	await firestore
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
export const  updateDataInFireStoreDocumentByFieldName = async (fieldName,fieldValue, collection,data, CB) => {
	await firestore
		.collection(collection)
		.where(fieldName,"==",fieldValue).get().then(res=>{
			if(res.docs.length>0) {
				firestore.collection(collection).doc(res.docs[0].id).update(data).then((res)=>{
					CB && CB();
					return res ;
				});
			}
			else{
				CB && CB();
				return null;
			}
		})
		.catch((err) => {
			CB && CB();
			console.log(err);
			return err;
		});
};

// database helpers
export const insertIntoDatabaseRef = async (ref, data, CB) => {
	await database
		.ref(ref).child()
		.push(data)
		.then((res) => {
			CB && CB(res.key);
		})
		.catch((err) => {
			console.log(err);
			CB && CB();
		});
};