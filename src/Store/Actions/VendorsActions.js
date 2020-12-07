import {getCollection, getCollectionByField, updateAFieldInDocment} from "../../firebase/helpers";
import {auth} from '../../firebase/index'
import Vendors from "../Constants/Vendors";
import { convertToArray } from "../../utils/helpers";
export const getVendors = CB => async dispatch => {
  dispatch({ type: Vendors.GET_ALL_VENDORS, payload: { loading: true } });
  getCollection("vendors")
    .then(res => {
      dispatch({
        type: Vendors.GET_ALL_VENDORS,
        payload: { loading: false, data: convertToArray(res) }
      });
      CB && CB();
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: Vendors.GET_ALL_VENDORS, payload: { loading: false }});
    });
};

export const approveVendor = (uid, CB) => async dispatch => {
  dispatch({ type: Vendors.APPROVE_VENDOR, payload: { loading: true } });
  updateAFieldInDocment("vendors", "uid", uid, "approved", true)
    .then(res => {
      CB && CB();
      // dispatch({ type: Vendors.APPROVE_VENDOR, payload: { loading: false } });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: Vendors.APPROVE_VENDOR, payload: { loading: false } });
    });
};
export const getMenuItems = (uid,CB) => (dispatch) => {
    dispatch({type: Vendors.GET_VENDOR_MENU, payload: {loading: true}});
    getCollectionByField('menuItems', 'uid', uid)
        .then((res) => {
            CB && CB();
            dispatch({
                type: Vendors.GET_VENDOR_MENU,
                payload: {loading: false, menuItems: convertToArray(res)},
            });
        })
        .catch((err) => {
            dispatch({type: Vendors.GET_VENDOR_MENU, payload: {loading: false}});
        });
};