import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {loadSubjects} from "../../../Store/Actions/SubjectActions";
import Paper from "@material-ui/core/Paper/Paper";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Alert from "@material-ui/lab/Alert/Alert";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import {updateHelpStatus} from "../../../Store/Actions/HelpActions";
import {helpGigStatus} from "../../../utils/Constants";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const WaitingForHelp =({onCancel})=>{
	const dispatch = useDispatch();
	const [error,setError] = useState("");
	const [msg,setMsg] = useState("");
	const [open,setOpen] = useState(false);
	useEffect(()=>{
		dispatch(loadSubjects());
	},[]);
	const stateProps = useSelector(({GetHelp})=>{
		return {
			...GetHelp
		};
	});
	const {loading} = stateProps;
	const handleCancel = ()=>{
		dispatch(updateHelpStatus({status: helpGigStatus.CANCELLED},()=>{
			onCancel();
		}));

	};
	return (
		<div className={"container "} style={{height:"400px"}}>
			<Paper className={"p-4 text-center"}>
				<h1> Searching For Helpers…</h1>
				<p>	Please wait </p>
				<LinearProgress className={"mt-4 mb-4"} />
				{loading ?
					<CircularProgress size={30}/>
					:
					<Button color={"secondary"} className={"mt-4"} onClick={handleCancel}> Cancel </Button>
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

export default WaitingForHelp;