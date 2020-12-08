import React, {useState} from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {useDispatch, useSelector} from "react-redux";
import {insertDetails, setNewUserData} from "../../Store/Actions/UsersActions";
import {UserRoles} from "../../utils/Constants";
import {auth} from "../../firebase";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
const SecondStep = ({onNext,onFinish})=>{
	const dispatch = useDispatch();
	const [role,setRole] = useState(UserRoles.NORMAL_USER);
	const stateProps = useSelector(({User})=>{
		return {
			...User
		};
	});
	const {newData,loading} = stateProps;
	const handleSubmit = (e)=>{
		e.preventDefault();
		if(role === UserRoles.HELPER_USER) {
			dispatch(setNewUserData({role}));
			onNext();
		}
		else {
			dispatch(insertDetails({...newData,id: auth.currentUser.uid, email: auth.currentUser.email,role},()=>{
				onFinish();
			}));
		}
	};
	const handleChange = (event) => {
		setRole(event.target.value);
	};
	return (
		<div className="d-flex justify-content-center align-items-center c-h-100">
			<div className={"auth-container"}>
				<span className={"c-h1"}>Welcome</span>
				<p> Let's setup you account. </p>
				{loading ?
					<CircularProgress size={50}/>
					:
					<form noValidate autoComplete="off" onSubmit={handleSubmit}>
						<FormControl component="fieldset">
							<FormLabel component="legend">Would you like to help others in subjects of your choice?
							</FormLabel>
							<RadioGroup aria-label="gender" name="gender1" value={role} onChange={handleChange}>
								<FormControlLabel value={UserRoles.HELPER_USER} control={<Radio/>}
												  label="Yes, Please!"/>
								<FormControlLabel value={UserRoles.NORMAL_USER} control={<Radio/>}
												  label="I'd rather only receive help."/>
							</RadioGroup>
						</FormControl>
						<Button
							fullWidth
							type={"submit"}
							variant="contained"
							className={"c-button"}
							endIcon={role === UserRoles.HELPER_USER ? <ArrowForwardIcon/> : null}
						>
							{role === UserRoles.HELPER_USER ? "Next" : "Finish"}
						</Button>
					</form>
				}
			</div>

		</div>
	);
};

export default SecondStep;