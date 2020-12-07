import Subjects from "../Constants/Subjects";
import {
	getCollection
} from "../../firebase/helpers";
export const loadSubjects = (CB) => (dispatch) => {
	dispatch({type: Subjects.LOAD_SUBJECTS, payload: {loading: true}});
	getCollection(
		"subjects").then(res=>{
		dispatch({
			type:Subjects.LOAD_SUBJECTS,
			payload: {loading: false, data: res},
		});
	})
		.catch((err) => {
			console.log(err);
			dispatch({type: Subjects.LOAD_SUBJECTS, payload: {loading: false}});
		});
};