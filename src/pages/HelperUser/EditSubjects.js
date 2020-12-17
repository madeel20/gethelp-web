import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/core/SvgIcon/SvgIcon";
import {MappedElement} from "../../utils/helpers";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import {loadSubjects} from "../../Store/Actions/SubjectActions";
import {useDispatch, useSelector} from "react-redux";
import { updateProfileDetails} from "../../Store/Actions/UsersActions";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Alert from "@material-ui/lab/Alert/Alert";
import {Link} from "react-router-dom";
const EditSubjects = ()=>{
	const dispatch = useDispatch();
	const [error,setError] = useState("");
	const [msg,setMsg] = useState("");
	const [open,setOpen] = useState(false);
	useEffect(()=>{
		dispatch(loadSubjects());
	},[]);
	const stateProps = useSelector(({Subjects,User})=>{
		return {
			Subjects,
			User
		};
	});
	const {data,loading} = stateProps.Subjects;
	const {updatingDetailsLoading} = stateProps.User;
	const [subjects,setSubjects] = useState(stateProps.User.data.subjects || []);
	const handleSubmit = (e)=>{
		e.preventDefault();
		// if(subjects.length===0){
		// 	setMsg("");
		// 	setError("Please select at least one subject.");
		// 	setOpen(true);
		// 	return;
		// }
		dispatch(updateProfileDetails({subjects},()=>{
			setError("");
			setMsg("Subjects Updated!");
			setOpen(true);
		}));
	};
	const handleChange =(e)=>{
		const { name, value } = e.target;
		if (e.target.checked) {
			setSubjects(prevState => [...prevState, {id: value, name: name}]);
		} else {
			setSubjects(prevState => prevState.filter(it => it.id !== value));
		}
	};
	const renderSubjects =()=>{
		return <MappedElement data={data} renderElement={ (obj,index)=>{
			return <FormControlLabel key={index}
				control={<Checkbox onChange={handleChange} checked={subjects && subjects.find(it=>it.id === obj.id)?true:false} value={obj.id} name={obj.name} />}
				label={String(obj.name).toUpperCase()}
			/>;}
		}/>;
	};
	return (
		<div className={"container"}>
			<Paper className={"p-4 d-flex flex-column justify-content-center align-items-center"}>
				{loading || updatingDetailsLoading?
					<CircularProgress  size={30}/>
					:
					<>
						<h2 className={"c-h1"}> Edit Subjects </h2>
						<form className={"p-4 d-flex flex-column justify-content-center align-items-center"} noValidate autoComplete="off" onSubmit={handleSubmit}>
							<FormControl component="fieldset">
								<FormLabel component="legend">Select the subjects you’d like to help in.</FormLabel>
								<FormGroup>
									{renderSubjects()}
								</FormGroup>
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
							<Link to={"/"} className={'mt-4'}>Go back to home</Link>
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

export default EditSubjects;