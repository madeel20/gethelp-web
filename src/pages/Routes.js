import Home from "./HelperUser/Home";
import UserHelperRecords from "./User/HelperUser";
import EditSubjects from "./HelperUser/EditSubjects";
import HelperRecords from "./HelperUser/HelperRecords";
import EditMeetingLink from "./HelperUser/EditMeetingLink";
import GetHelp from "./Common/GetHelp/GetHelp";

export const HelperUserRoutes =[
	{route:"/", component: Home,exact:true,title:"Home"},
	{route:"/edit-subjects",component:EditSubjects,title:"Edit Subjects"},
	{route:"/edit-meeting-link",component:EditMeetingLink,title: "Edit Meetling Link"},
	{route:"/get-help",component:GetHelp,title: "Get Help"},
	{route:"/helper-records",component:HelperRecords,title:"Helper Records"},
];

export const NormalUserRoutes = [
	{route:"/", component:GetHelp,exact: true,title:'Home'},
	{route:"/helper-records",component:UserHelperRecords,title:'Helper Records'},
];