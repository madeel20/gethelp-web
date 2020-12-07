import {getCollection, updateAFieldInDocment} from "../../firebase/helpers";
import Riders from "../Constants/Riders";
import {convertToArray} from "../../utils/helpers";
import Vendors from "../Constants/Vendors";
export const getRiders = (CB) => async (dispatch) => {
    dispatch({type:Riders.GET_ALL_RIDERS,payload:{ loading:true }})
    getCollection('riders').then(res=>{
        console.log('action',res)
        dispatch({type:Riders.GET_ALL_RIDERS,payload:{loading:false, data:convertToArray(res) }});
        CB && CB();
    })
        .catch((error) => {
            console.log(error);
            dispatch({ type: Riders.GET_ALL_RIDERS, loading: false });
        });
};

export const approveRider = (uid, CB) => async dispatch => {
    dispatch({ type: Riders.APPROVE_RIDER, payload: { loading: true } });
    updateAFieldInDocment("riders", "uid", uid, "approved", true)
        .then(res => {
            CB && CB();
            // dispatch({ type: Vendors.APPROVE_VENDOR, payload: { loading: false } });
        })
        .catch(err => {
            console.log(err);
            dispatch({ type: Riders.APPROVE_RIDER, payload: { loading: false } });
        });
};
