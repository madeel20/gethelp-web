import React, {useEffect} from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListItemText from "@material-ui/core/ListItemText";
import { useHistory } from "react-router-dom";
import {logOut} from "../firebase/helpers";
import {useDispatch, useSelector} from "react-redux";
import {MappedElement} from "../utils/helpers";
import {Link} from "react-router-dom";
import {helpGigStatus, UserRoles} from "../utils/Constants";
import {auth, database} from "../firebase";
import {getHelpGig} from "../Store/Actions/UsersActions";
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	appBar: {
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		backgroundColor:"#F0826E !important"
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	hide: {
		display: "none",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: "flex-end",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
}));
export default function PersistentDrawerLeft({routes}) {
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const history = useHistory();
	const [open, setOpen] = React.useState(true);
	const stateProps = useSelector(({User})=>{
		return {...User};
	});
	const { data , helpGig} = stateProps;
	useEffect(()=>{
		database.ref("helpGigs").child(auth.currentUser.uid)
			.on("value", (snapshot) => {
				dispatch(getHelpGig(snapshot.val()));
			});
	},[]);
	useEffect(()=> {
		if(helpGig && helpGig.status === helpGigStatus.ACTIVE){

			history.push(data.role === UserRoles.NORMAL_USER?"/":"/get-help");
		}
	},[helpGig]);
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open,
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, open && classes.hide)}
					>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</div>
				<Divider />
				<div className={"drawer-user-info"}>
					<Typography variant="h6" noWrap>
						Hi, {data.fullName}
					</Typography>
					<a href={data.meetLink} target={'_blank'}> <p>{data.meetLink}</p></a>
					<span className={"format-hint"}>Grade: {data.grade}</span>
				</div>
				<Divider />
				<List>
					<MappedElement data={routes} renderElement={(obj,index)=>{
						return <Link to={obj.route} key={obj.route}>
							<ListItem button>
								<ListItemText primary={obj.title} />
							</ListItem>
						</Link>;
					}}/>
				</List>
				<Divider />
				<ListItem button onClick={()=> logOut(()=>{
					history.push('/');
				})} >
					<ListItemIcon>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText primary={"Sign Out"}/>
				</ListItem>
			</Drawer>
		</div>
	);
}