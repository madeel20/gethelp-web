import {GetHelp} from "../Constants/GetHelp";
const initialState = {
	loading:false,
	data:[],
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
	case  GetHelp.INSERTING_HELP :
	case GetHelp.UPDATE_HELP_GIG:
	case GetHelp.INSERT_ACCEPTED_GIG:
	case GetHelp.CANCEL_HELP:
		return {
			...state,...action.payload
		};
	default:
		return state;
	}
};
