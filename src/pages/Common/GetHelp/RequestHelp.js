import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {loadSubjects} from "../../../Store/Actions/SubjectActions";
import {insertHelp} from "../../../Store/Actions/HelpActions";
import { MappedElement} from "../../../utils/helpers";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Radio from "@material-ui/core/Radio/Radio";
import Paper from "@material-ui/core/Paper/Paper";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Alert from "@material-ui/lab/Alert/Alert";
import { helpGigStatus} from "../../../utils/Constants";

const RequestHelp =({onRequest})=>{
	const dispatch = useDispatch();
	const [error,setError] = useState("");
	const [msg,setMsg] = useState("");
	const [open,setOpen] = useState(false);
	useEffect(()=>{
		dispatch(loadSubjects());
	},[]);
	const stateProps = useSelector(({Subjects,GetHelp,User})=>{
		return {
			Subjects,
			GetHelp,User
		};
	});
	const {data} = stateProps.Subjects;
	const {loading} = stateProps.GetHelp;
	const [subject,setSubject] = useState(  "");
	const handleSubmit = (e)=>{
		e.preventDefault();
		if(subject===""){
			setError("Select a Subject first!");
			setOpen(true);
			return;
		}
		dispatch(insertHelp({
			status: helpGigStatus.ACTIVE,
			subjectId: subject,
			grade:stateProps.User.data.grade,
			subjectName: data.find(it=>it.id === subject).name,
			dateTime: new Date().toUTCString(),
		},async ()=>{
			setError("");
			setMsg("Help Request Successful!");
			setOpen(true);
			onRequest();
		}));
	};
	const handleChange =(e)=>{
		setSubject(e.target.value);
	};
	const renderSubjects =()=>{
		return <MappedElement data={data} renderElement={ (obj,index)=>{
			return  <FormControlLabel key={obj.id} value={obj.id} control={<Radio />} label={obj.name} />;}
		}/>;
	};
	return (
		<div className={"container"}>
			<Paper className={"p-4 d-flex flex-column justify-content-center align-items-center"}>
				{loading || stateProps.Subjects.loading?
					<CircularProgress  size={30}/>
					:
					<>
						<h1 className={"c-h1"}> Ask for help </h1>
						<p className={"link-hint large mt-2"}>Please be ready to share your screen with the problem you try to solve.</p>
				<p className={"link-hint large"}>If your problem is on paper, please take a photo using your phone and<br/> show the photo on your computer screen.</p>
				<p className={"link-hint large"}>Once you are ready, please select subject below.</p>
						<form className={"p-4 d-flex flex-column justify-content-center align-items-center"} noValidate autoComplete="off" onSubmit={handleSubmit} className={"p-4"}>
							<FormControl component="fieldset">
								<FormLabel component="legend">What subject would you like to be helped with?</FormLabel>
								<RadioGroup aria-label="subject" name="subject" value={subject} onChange={handleChange}>
									{renderSubjects()}
								</RadioGroup>
							</FormControl>
							<Button
								fullWidth
								type={"submit"}
								variant="contained"
								className={"c-button"}
								endIcon={<ArrowForwardIcon/>}
							>
                                Find Help
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

export default RequestHelp;