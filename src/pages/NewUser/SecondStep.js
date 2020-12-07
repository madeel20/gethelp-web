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
import {useDispatch} from "react-redux";
import {setNewUserData} from "../../Store/Actions/UsersActions";
import {UserRoles} from "../../utils/Constants";
const SecondStep = ({onNext})=>{
	const dispatch = useDispatch();
	const [role,setRole] = useState(UserRoles.NORMAL_USER);
	const handleSubmit = (e)=>{
		e.preventDefault();
		dispatch(setNewUserData({role}));
		onNext();
	};
	const handleChange = (event) => {
		setRole(event.target.value);
	};
	return (
		<div className="d-flex justify-content-center align-items-center c-h-100">
			<div className={"auth-container"}>
				<span className={"c-h1"}>Welcome</span>
				<p> Let's setup you account. </p>
				<form noValidate autoComplete="off" onSubmit={handleSubmit}>
					<FormControl component="fieldset">
						<FormLabel component="legend">Would you like to help others in subjects of your choice?
						</FormLabel>
						<RadioGroup aria-label="gender" name="gender1" value={role} onChange={handleChange}>
							<FormControlLabel value={UserRoles.HELPER_USER} control={<Radio />} label="Yes, Please!" />
							<FormControlLabel value={UserRoles.NORMAL_USER} control={<Radio />} label="I'd rather only receive help." />
						</RadioGroup>
					</FormControl>
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

		</div>
	);
};

export default SecondStep;