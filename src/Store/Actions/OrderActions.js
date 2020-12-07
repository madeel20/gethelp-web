import Orders from '../Constants/Orders';
import {
  readFromDBRef,
} from '../../firebase/helpers';
import {convertToArray} from '../../utils/helpers';
export const loadOrders = (CB) => (dispatch) => {
    dispatch({type: Orders.LOAD_ORDERS, payload: {loading: true}});
    readFromDBRef(
        'orders',
        (res) => {
            dispatch({
                type: Orders.LOAD_ORDERS,
                payload: {loading: false, data: res},
            });
        },
    ).catch((err) => {
        console.log(err)
        dispatch({type: Orders.LOAD_ORDERS, payload: {loading: false}});
    });
};