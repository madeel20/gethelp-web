import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { auth, database } from "../../firebase/index";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import { insertDetails, setNewUserData } from "../../Store/Actions/UsersActions";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { GetHelp } from "../../Store/Constants/GetHelp";
import { helperStatus, UserRoles } from "../../utils/Constants";
const FourthStep = ({ onNext, onFinish }) => {
	const dispatch = useDispatch();
	const [meetLink, setLink] = useState("");
	const [error, setError] = useState(false);
	const [open, setOpen] = useState(false);
	const stateProps = useSelector(({ User }) => {
		return {
			...User
		};
	});
	const { newData, loading } = stateProps;
	const handleSubmit = (e) => {
		e.preventDefault();
		if (meetLink === "") {
			setError("Please insert a link first.");
			setOpen(true);
			return;
		}
		dispatch(insertDetails({
			...newData, id: auth.currentUser.uid,
			email: auth.currentUser.email,
			meetLink, role: UserRoles.HELPER_USER
		}, () => {
			database
				.ref("helpers").child(auth.currentUser.uid)
				.update({ status: helperStatus.NOT_AVAILABLE });
			onFinish();
		}));
	};
	return (
		<div className="d-flex justify-content-center align-items-center c-h-100">
			<div className={"auth-container"}>
				<span className={"c-h1"}>Welcome</span>
				<p> Let's setup your account. </p>
				{loading ?
					<CircularProgress size={50} />
					:
					<form noValidate autoComplete="off" onSubmit={handleSubmit}>
						<p>Now go to <a href="https://meet.google.com" target="_blank">meet.google.com</a>.</p>
						<p><b>Important:</b> Make sure you are using the same personal Google Account you signed up with.
Now click “New meeting” and then “Create a meeting for later”, copy that Google Meet link. This will be the permanent link you use to host help sessions, if or when you choose to help in the future.</p>
						<TextField
							fullWidth
							error={false}
							name={"link"}
							label="Link"
							defaultValue={meetLink}
							className={"mb-2"}
							onChange={e => setLink(e.target.value)}
							variant="outlined"
							required
							value={meetLink}
							error={error}
						/>
						<span className={'link-hint mb-2'}>Format: https:// your meet link</span>
						<Button
							fullWidth
							type={"submit"}
							variant="contained"
							className={"c-button"}
						// endIcon={<ArrowForwardIcon />}
						>
							Finish
						</Button>
					</form>
				}
			</div>
			<Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
				<Alert elevation={6} variant="filled" severity="warning">{error}</Alert>
			</Snackbar>


		</div>
	);
};

export default FourthStep;