import React from "react";
import { signInWithGoogle } from "../../firebase/helpers";
import {Link,useHistory} from "react-router-dom";
export default function SignIn() {
	const history = useHistory();
	return (
		<div className="d-flex justify-content-center align-items-center c-h-100">
			<div className={"auth-container"}>
				<span className={"c-h1"}>Sign In</span>
				<button className="login-provider-button" onClick={()=> signInWithGoogle(()=>{
					history.push("/")})
				}>
					<img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon"/>
					<span> Continue with Google</span>
				</button>
					<div>
				<span className={"c-p"}>Create an Account: </span> <Link to={"/sign-up"}> Sign Up</Link>
					</div>
			</div>
		</div>
	);
}