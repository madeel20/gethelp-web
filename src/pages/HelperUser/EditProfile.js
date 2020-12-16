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
		if(parseInt(grade)>10){ setError("Invalid Grade!"); setOpen(true); return;  }
		dispatch(updateProfileDetails({grade,fullName},()=>{
			setError("");
			setMsg("Profile Updated!");
			setOpen(true);
		}));
	};
	return (
		<div className={"container"}>
			<Paper className={"p-4"}>
				{loading || updatingDetailsLoading?
					<CircularProgress  size={30}/>
					:
					<>
						<span className={"c-h1 mt-4 mb-4"}>Edit Profile</span>
						<form noValidate autoComplete="off" className={'mt-4'} onSubmit={handleSubmit}>
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
								InputProps={{ inputProps: { min: 1, max: 10 } }}
								error={error}
							/>
							<Button
								fullWidth
								type={"submit"}
								variant="contained"
								className={"c-button mt-2"}
								endIcon={<ArrowForwardIcon />}
							>
						Submit
							</Button>
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