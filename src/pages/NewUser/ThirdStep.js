import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {useDispatch, useSelector} from "react-redux";
import {setNewUserData} from "../../Store/Actions/UsersActions";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {MappedElement} from "../../utils/helpers";
import {loadSubjects} from "../../Store/Actions/SubjectActions";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
const ThirdStep = ({onNext})=>{
	const dispatch = useDispatch();
	const [subjects,setSubjects] = useState([]);
	const [error,setError] = useState(false);
	const [open,setOpen] = useState(false);
	useEffect(()=>{
		dispatch(loadSubjects());
	},[]);
	const stateProps = useSelector(({Subjects})=>{
		return {
			...Subjects
		}
	});
	const {data,loading} = stateProps;
	const handleSubmit = (e)=>{
		e.preventDefault();
		// if(subjects.length===0){
		// 	setError("Please select atleast one subject.");
		// 	setOpen(true);
		// 	return;
		// }
		dispatch(setNewUserData({subjects}));
		onNext();
	};
	const handleChange =(e)=>{
		if(e.target.checked){
			setSubjects(prevState=> [...prevState,{id:e.target.value,name:e.target.name}]);
		}
		else {
			setSubjects(prevState=>prevState.filter(it=>it.id !== e.target.value ));
		}
	};
	const renderSubjects =()=>{
	    return <MappedElement data={data} renderElement={ (obj,index)=>{
			return <FormControlLabel
				control={<Checkbox onChange={handleChange} value={obj.id} name={obj.name} />}
				label={String(obj.name).toUpperCase()}
			/>;}
		}/>;
	};
	return (
		<div className="d-flex justify-content-center align-items-center c-h-100">
			<div className={"auth-container"}>
				<span className={"c-h1"}>Welcome</span>
				<p> Let's setup your account. </p>
				{loading ?
					<CircularProgress  size={50}/>
					:
					<form noValidate autoComplete="off" onSubmit={handleSubmit}>
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
							Next
						</Button>
						<span className={' mt-4'}>Simply click “NEXT” if you just want to get help at this moment.</span>
					</form>
				}
			</div>
			<Snackbar open={open} autoHideDuration={3000} onClose={()=>setOpen(false)}>
				<Alert elevation={6} variant="filled" severity="warning">{error}</Alert>
			</Snackbar>


		</div>
	);
};

export default ThirdStep;