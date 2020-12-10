import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/core/SvgIcon/SvgIcon";
import {useDispatch, useSelector} from "react-redux";
import {updateMeetingLink} from "../../Store/Actions/UsersActions";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Alert from "@material-ui/lab/Alert/Alert";
import TextField from "@material-ui/core/TextField/TextField";

const EditMeetingLink = ()=>{
	const dispatch = useDispatch();
	const [error,setError] = useState(false);
	const [open,setOpen] = useState(false);
	const [msg,setMsg] = useState("");
	const stateProps = useSelector(({User})=>{
		return {
			...User
		};
	});
	const {data,meetingLoading} = stateProps;
	const [meetLink,setMeetLink] = useState(data.meetLink || "");
	const handleSubmit = (e)=>{
		e.preventDefault();
		if(meetLink ===""){
			setMsg("");
			setError("Meeting link cannot be empty!");
			setOpen(true);
			return;
		}
		dispatch(updateMeetingLink({meetLink},()=>{
			setError("");
			setMsg("Meeting link updated!");
			setOpen(true);
		}));
	};
	return (
		<div className={"container"}>
			<Paper className={"p-4"}>
				{meetingLoading ?
					<CircularProgress  size={30}/>
					:
					<>
						<h1 className={"mb-4"}> Edit Meeting Link </h1>
						<form noValidate autoComplete="off" onSubmit={handleSubmit}>
							<FormControl className={"mb-4"}  component="fieldset">
								<FormLabel component="legend">Your Google Meet Link.</FormLabel>
								<FormGroup>
									<TextField
										fullWidth
										error={false}
										name={"link"}
										label="Link"
										defaultValue={meetLink}
										className={"mb-2"}
										onChange={e => setMeetLink(e.target.value)}
										variant="outlined"
										required
										value={meetLink}
										error={error}
									/>
								</FormGroup>
								<span className={'link-hint'}>Format: https:// your meet link</span>
							</FormControl>

							<Button
								fullWidth
								type={"submit"}
								variant="contained"
								className={"c-button"}
								endIcon={<ArrowForwardIcon/>}
							>
								Save
							</Button>
						</form>
					</>
				}
				<Snackbar open={open} autoHideDuration={3000} onClose={()=>setOpen(false)}>
					<>
						{error !=="" && <Alert elevation={6} variant="filled" severity="warning">{error}</Alert>}
						{msg !=="" && <Alert elevation={6} variant="filled" severity="success">{msg}</Alert>}
					</>
				</Snackbar>
			</Paper>
		</div>
	);
};

export default EditMeetingLink;