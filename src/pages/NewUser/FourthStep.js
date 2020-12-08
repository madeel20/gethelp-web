import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {auth} from '../../firebase/index'
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {useDispatch, useSelector} from "react-redux";
import {insertDetails, setNewUserData} from "../../Store/Actions/UsersActions";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
const FourthStep = ({onNext,onFinish})=>{
	const dispatch = useDispatch();
	const [meetLink,setLink] = useState("");
	const [error,setError] = useState(false);
	const [open,setOpen] = useState(false);
	const stateProps = useSelector(({User})=>{
		return {
			...User
		};
	});
	const {newData,loading} = stateProps;
	const handleSubmit = (e)=>{
		e.preventDefault();
		if(meetLink===""){
			setError("Please insert a link first.");
			setOpen(true);
			return;
		}
		 dispatch(insertDetails({...newData,id: auth.currentUser.uid, email: auth.currentUser.email,  meetLink},()=>{
		        onFinish();
         }));
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
                        <p>Go to meet.google.com using the same Google Account you signed up with and get a Google Meet
                            link. This will be the permanent link you use to host help sessions.</p>
                        <p>Paste your Google Meet link.</p>
                        <TextField
                            fullWidth
                            error={false}
                            name={"link"}
                            label="Link"
                            defaultValue={meetLink}
                            className={"mb-2"}
                            onChange={e => setLink(e.target.value)}
                            variant="outlined"
                            required
                            value={meetLink}
                            error={error}
                        />
                        <Button
                            fullWidth
                            type={"submit"}
                            variant="contained"
                            className={"c-button"}
                            // endIcon={<ArrowForwardIcon />}
                        >
                            Finish
                        </Button>
                    </form>
                }
			</div>
			<Snackbar open={open} autoHideDuration={3000} onClose={()=>setOpen(false)}>
				<Alert elevation={6} variant="filled" severity="warning">{error}</Alert>
			</Snackbar>


		</div>
	);
};

export default FourthStep;