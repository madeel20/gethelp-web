import Home from "./HelperUser/Home";
import EditSubjects from "./HelperUser/EditSubjects";
import HelperRecords from "./Common/HelperRecords";
import EditMeetingLink from "./HelperUser/EditMeetingLink";
import GetHelp from "./Common/GetHelp/GetHelp";
import EditProfile from "./HelperUser/EditProfile";

export const HelperUserRoutes =[
	{route:"/", component: Home,exact:true,title:"Home"},
	{route:"/edit-meeting-link",component:EditMeetingLink,title: "Edit Meetling Link"},
	{route:"/get-help",component:GetHelp,title: "Get Help"},
	{route:"/helper-records",component:HelperRecords,title:"Helper Records"},
	{route:"/edit-subjects",component:EditSubjects,title:"Edit Subjects"},
	{route:"/edit-profile",component:EditProfile,title:"Edit Profile"},
];

export const NormalUserRoutes = [
	{route:"/", component:GetHelp,exact: true,title:"Home"},
	{route:"/helper-records",component: HelperRecords,title:"Helper Records"},
];