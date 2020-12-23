import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {useDispatch} from "react-redux";
import {setNewUserData} from "../../Store/Actions/UsersActions";
const FirstStep = ({onNext})=>{
	const dispatch = useDispatch();
	const [fullName,setFullName] = useState("");
	const [grade,setGrade] = useState("");
	const [error,setError] = useState(false);
	const [open,setOpen] = useState(false);
	const handleSubmit = (e)=>{
		e.preventDefault();
		if(fullName==="" || grade === ""){
			setError("Please fill all the fields.");
			setOpen(true);
			return;
		}
		if(parseInt(grade)>12){ setError("Invalid Grade!"); setOpen(true); return;  }
		dispatch(setNewUserData({fullName,grade}));
		onNext();
	};
	return (
		<div className="d-flex justify-content-center align-items-center c-h-100">
			<div className={"auth-container"}>
				<span className={"c-h1"}>Welcome</span>
				<p> Let's setup your account. </p>
				<form noValidate autoComplete="off" onSubmit={handleSubmit}>
					<TextField
						fullWidth
						error={false}
						name={"fullname"}
						label="Full Name"
						defaultValue={fullName}
						className={"mb-2"}
						onChange={e=>setFullName(e.target.value)}
						variant="outlined"
						required
						value={fullName}
						error={error}
					/>
					<TextField
						fullWidth
						error={false}
						id="outlined-error-helper-text"
						label="Grade"
						name={"grade"}
						value={grade}
						onChange={e=>setGrade(e.target.value)}
						defaultValue={grade}
						variant="outlined"
						required
						className={"mb-2"}
						type="number"
						InputProps={{ inputProps: { min: 1, max: 12 } }}
						error={error}
					/>
					<Button
						fullWidth
						type={"submit"}
						variant="contained"
						className={"c-button"}
						endIcon={<ArrowForwardIcon />}
					>
						Next
					</Button>
				</form>
			</div>
			<Snackbar open={open} autoHideDuration={3000} onClose={()=>setOpen(false)}>
				<Alert elevation={6} variant="filled" severity="warning">{error}</Alert>
			</Snackbar>


		</div>
	);
};

export default FirstStep;