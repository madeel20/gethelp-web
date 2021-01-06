import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/core/SvgIcon/SvgIcon";
import {loadSubjects} from "../../Store/Actions/SubjectActions";
import {useDispatch, useSelector} from "react-redux";
import {updateProfileDetails,} from "../../Store/Actions/UsersActions";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Alert from "@material-ui/lab/Alert/Alert";
import TextField from "@material-ui/core/TextField/TextField";
import {Link} from "react-router-dom";
const EditProfile = ()=>{
	const dispatch = useDispatch();
	const [error,setError] = useState(false);
	const [open,setOpen] = useState(false);
	const [msg,setMsg] = useState("");

	useEffect(()=>{
		dispatch(loadSubjects());
	},[]);
	const stateProps = useSelector(({User})=>{
		return {
			...User
		};
	});
	const {data,loading,updatingDetailsLoading} = stateProps;
	const [fullName,setFullName] = useState(data.fullName||"");
	const [grade,setGrade] = useState(data.grade||"");
	const handleSubmit = (e)=>{
		e.preventDefault();
		if(fullName==="" || grade === ""){
			setError("Please fill all the fields.");
			setOpen(true);
			return;
		}
		if(parseInt(grade)>12){ setError("Invalid Grade!"); setOpen(true); return;  }
		dispatch(updateProfileDetails({grade,fullName},()=>{
			setError("");
			setMsg("Profile Updated!");
			setOpen(true);
		}));
	};
	return (
		<div className={"container "}>
			<Paper className={"p-4 d-flex flex-column justify-content-center align-items-center"}>
				{loading || updatingDetailsLoading?
					<CircularProgress  size={30}/>
					:
					<>
						<span className={"c-h1"}>Edit Profile</span>
						<form className={"p-4 d-flex flex-column justify-content-center align-items-center"} noValidate autoComplete="off" onSubmit={handleSubmit}>

						<TextField
								fullWidth
								name={"email"}
								label="Email"
								defaultValue={data?.email}
								className={"c-input"}
								variant="outlined"
								disabled={true}
							/>
							<TextField
								fullWidth
								error={false}
								name={"fullname"}
								label="Full Name"
								className={"c-input"}
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
								variant="outlined"
								required
								className={"c-input"}
								type="number"
								InputProps={{ inputProps: { min: 1, max: 12 } }}
								error={error}
							/>
							<Button
								fullWidth
								type={"submit"}
								variant="contained"
								className={"c-button mt-2 text-center"}
								endIcon={<ArrowForwardIcon />}
							>
						Submit
							</Button>
							<Link to={"/"} className={'mt-4'}>Go back to home</Link>
						</form>
					</>}
			</Paper>
			<Snackbar open={open} autoHideDuration={3000} onClose={()=>setOpen(false)}>
				<>
					{error !=="" && <Alert elevation={6} variant="filled" severity="warning">{error}</Alert>}
					{msg !=="" && <Alert elevation={6} variant="filled" severity="success">{msg}</Alert>}
				</>
			</Snackbar>
		</div>
	);
};

export default EditProfile;