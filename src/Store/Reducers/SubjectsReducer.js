import Subjects from "../Constants/Subjects";
const initialState = {
	loading:true,
	data:[],
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
	case Subjects.LOAD_SUBJECTS:
		return {
			...state,...action.payload
		};
	default:
		return state;
	}
};
