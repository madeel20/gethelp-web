import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {loadSubjects} from "../../../Store/Actions/SubjectActions";
import {insertHelp, updateHelpStatus} from "../../../Store/Actions/HelpActions";
import {convertDBSnapshoptToArrayOfObject, convertToArray, MappedElement} from "../../../utils/helpers";
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
import {helperStatus, helpGigStatus, UserRoles} from "../../../utils/Constants";
import {auth, database, firestore} from "../../../firebase";

const RequestHelp =({onRequest})=>{
	const dispatch = useDispatch();
	const [error,setError] = useState("");
	const [msg,setMsg] = useState("");
	const [open,setOpen] = useState(false);
	useEffect(()=>{
		dispatch(loadSubjects());
		findHelper();
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
			subjectName: data.find(it=>it.id === subject).name,
			dateTime: new Date().toUTCString(),
		},()=>{
			findHelper();
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
	const findHelper=async ()=>{
		//get all the helpers data
		let helpers = await firestore.collection("users").where("role","==",UserRoles.HELPER_USER).get();

		// get all the helpers status and last Active related data
		let getHelperStatus = await database.ref("helpers").once("value");

		//convert into javascript array of objects
		helpers = convertToArray(helpers.docs,false);
		getHelperStatus = await convertDBSnapshoptToArrayOfObject(getHelperStatus).filter(t=>t.status === helperStatus.AVAILABLE);

		// combine both firestore and
		let finalHelpersData =[]; getHelperStatus.map(it=> {finalHelpersData.push({...it, ...helpers.find(item=>item.id===it.id)});});

		let userGrade = stateProps.User.data.grade;

		// filter those helpers whose last seen was 30 seconds ago and also match grade
		finalHelpersData = await finalHelpersData.filter(it=> ((new Date().getTime() -  new Date(it.lastActive).getTime()) / 1000 )<30);
		// filter by grade --> equal or greater then user grade
		finalHelpersData = await finalHelpersData.filter(it=> parseInt(it.grade) === parseInt(userGrade) ||  parseInt(it.grade) > parseInt(userGrade));

		// if the find a match then assign him user help gig
		if(finalHelpersData.length>0){
			let finalHelperUser = finalHelpersData[0];
			await database.ref("helpGigs").child(auth.currentUser.uid).update({status: helpGigStatus.REQUESTED_TO_ASSIGN, helpersAsked:[finalHelperUser.id],lastHelperAssigned:finalHelperUser.id})
			await database.ref("helpers").child(finalHelperUser.id).update({status: helperStatus.NOT_AVAILABLE, assignedUser: auth.currentUser.uid})
		}
		else {
			setMsg("We will notify you if a helper accept your request!");
			setOpen(true);
		}
	};
	return (
		<div className={"container"}>
			<Paper className={"p-4"}>
				{loading || stateProps.Subjects.loading?
					<CircularProgress  size={30}/>
					:
					<>
						<h1> Ask for help </h1>
						<form noValidate autoComplete="off" onSubmit={handleSubmit} className={"p-4"}>
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