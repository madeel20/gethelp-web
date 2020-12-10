import Home from "./HelperUser/Home";
import UserHome from "./User/Home";
import UserHelperRecords from "./User/HelperUser";
import EditSubjects from "./HelperUser/EditSubjects";
import HelperRecords from "./HelperUser/HelperRecords";
import EditMeetingLink from "./HelperUser/EditMeetingLink";
import GetHelp from "./Common/GetHelp/GetHelp";

export const HelperUserRoutes =[
	{route:"/", component: Home,exact:true,title:"Home"},
	{route:"/edit-subjects",component:EditSubjects,title:"Edit Subjects"},
	{route:"/helper-records",component:HelperRecords,title:"Helper Records"},
	{route:"/edit-meeting-link",component:EditMeetingLink,title: "Edit Meetling Link"},
	{route:"/get-help",component:GetHelp,title: "Get Help"}
];

export const NormalUserRoutes = [
	{route:"/", component: UserHome},
	{route:"/helper-records",component:UserHelperRecords},
];