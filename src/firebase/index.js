import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
const firebaseConfig = {
	apiKey: "AIzaSyA1ei3rPtBsWBp4yYwUbyExZeyhwSSd9TQ",
	authDomain: "gethelp-41219.firebaseapp.com",
	projectId: "gethelp-41219",
	storageBucket: "gethelp-41219.appspot.com",
	messagingSenderId: "1081308066793",
	appId: "1:1081308066793:web:60f86dc2fad90ecbc85178",
	measurementId: "G-E7GEH67BEL"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage().ref();
export const database = firebase.database();