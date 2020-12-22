import React, {useState} from "react";
import { signInWithGoogle } from "../../firebase/helpers";
import {Link,useHistory} from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
export default function SignIn() {
	const [checked, setChecked] = React.useState(false);
	const [open,setOpen] = useState(false);
	const history = useHistory();
	const handleChange = (event) => {
		setChecked(event.target.checked);
	};
	const handleSignIn =()=>{
		if(checked) {
			signInWithGoogle(()=>{
				history.push("/");
			});
		}
		else {
			setOpen(true);
		}
	};
	return (
		<div className="d-flex justify-content-center align-items-center c-h-100">
			<div className={"auth-container"}>
				<span className={"c-h1"}>Sign Up</span>
				<button className="login-provider-button" onClick={handleSignIn}>
					<img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon"/>
					<span> Continue with Google</span>
				</button>
				<div className={"policy"}><Checkbox
					checked={checked}
					onChange={handleChange}
					color="#F0826E"
				/><span>I agree to the <b>Terms of Services</b> and <b>Privacy Policy</b></span></div>
				<div>
					<span className={"c-p"}>Already have an Account? </span><Link to={"/"}>Sign In</Link>
				</div>
			</div>
			<Snackbar open={open} autoHideDuration={3000} onClose={()=>setOpen(false)}>
				<Alert elevation={6} variant="filled" severity="info">Please accept our Terms of Services and Privacy Policy.</Alert>
			</Snackbar>


		</div>
	);
}