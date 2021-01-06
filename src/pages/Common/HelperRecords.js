import React, { useEffect, useState } from "react";
import { database, auth, firestore } from "../../firebase";
import { convertDBSnapshoptToArrayOfObject, convertToArray, MappedElement } from "../../utils/helpers";
import Paper from "@material-ui/core/Paper/Paper";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { useSelector } from "react-redux";
import { UserRoles } from "../../utils/Constants";
const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const HelperRecords = () => {
	const classes = useStyles();
	const stateProps = useSelector(({ User }) => {
		return { ...User };
	});
	const { data } = stateProps;
	const [records, setRecords] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		// get accepted gigs data from firebase
		database.ref("acceptedGigs").orderByChild('dateTime').once("value").then((snap) => {
			// convert it to javascript array of object
			let res = convertDBSnapshoptToArrayOfObject(snap);
			// sort the data by dateTime property in desc order
			res.sort((a, b) => {
				var c = new Date(b?.dateTime);
				var d = new Date(a?.dateTime);
				return c - d;
			});
			if (data.role === UserRoles.HELPER_USER) { setRecords(res.filter(it => it.helperId === auth.currentUser.uid)); }
			else { setRecords(res.filter(it => it.userId === auth.currentUser.uid)); }
			// get all the user from firebase
			firestore.collection("users").get().then((res) => {
				// convert it to javascript array of object
				setUsers(convertToArray(res.docs, false));
				setLoading(false);
			});
		});

	}, []);
	if (data.role === UserRoles.HELPER_USER) {
		return (
			<div className={"container"}>
				<Paper className={"p-4"}>
					{loading ?
						<CircularProgress size={30} />
						:
						<>
							<h1 className={"c-h1"}> Helping Records </h1>
							<div className={"p-4 d-flex justify-content-between"}>
								<span> Thumbs-up: {records.filter(it => it.thumbsUp && it.thumbsUp === true).length} </span>
								<span> Total Count: {records.length} </span></div>
							<TableContainer component={Paper}>
								<Table className={classes.table} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell align="center">Date</TableCell>
											<TableCell align="center">Time</TableCell>
											<TableCell align="center">Person</TableCell>
											<TableCell align="center">Subject</TableCell>
											<TableCell align="center">Thumbs Up</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<MappedElement data={records} renderElement={(obj, index) => {
											return (
												<TableRow key={obj.id}>

													<TableCell
														align="center">{new Date(obj.acceptedTime).toDateString()}</TableCell>
													<TableCell
														align="center">{new Date(obj.acceptedTime).toTimeString().slice(0, 8)}</TableCell>
													<TableCell
														align="center">{users.find(it => it.id === obj.userId) && users.find(it => it.id === obj.userId).fullName}</TableCell>
													<TableCell align="center">{obj.subjectName}</TableCell>
													<TableCell align="center">{obj.hasOwnProperty("thumbsUp") ? <>
														{obj.thumbsUp && obj.thumbsUp === true ?
															<ThumbUpAltIcon className={"thumbsup-icon"} /> : "--"}</> : "--"}</TableCell>
												</TableRow>
											);
										}} />
									</TableBody>
								</Table>
							</TableContainer>
						</>
					}
				</Paper>
			</div>
		);
	}
	else {
		return (
			<div className={"container"}>
				<Paper className={"p-4"}>
					{loading ?
						<CircularProgress size={30} />
						:
						<>
							<h1> Helping Records </h1>
							<div className={"p-4 d-flex justify-content-between"}>
								<span> Total Count: {records.length} </span></div>
							<TableContainer component={Paper}>
								<Table className={classes.table} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell align="center">Date</TableCell>
											<TableCell align="center">Time</TableCell>
											<TableCell align="center">Helper Name</TableCell>
											<TableCell align="center">Subject</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<MappedElement data={records} renderElement={(obj, index) => {
											return (
												<TableRow key={obj.id}>

													<TableCell
														align="center">{new Date(obj.acceptedTime).toDateString()}</TableCell>
													<TableCell
														align="center">{new Date(obj.acceptedTime).toTimeString().slice(0, 8)}</TableCell>
													<TableCell
														align="center">{users.find(it => it.id === obj.helperId) && users.find(it => it.id === obj.helperId).fullName}</TableCell>
													<TableCell align="center">{obj.subjectName}</TableCell>
												</TableRow>
											);
										}} />
									</TableBody>
								</Table>
							</TableContainer>
						</>
					}
				</Paper>
			</div>
		);
	}
};

export default HelperRecords;