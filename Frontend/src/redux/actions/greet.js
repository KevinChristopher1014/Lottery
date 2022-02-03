
import ActionTypes from "./actionType"

export const GetGreetString = () => async dispatch => {
    return dispatch({
        type : ActionTypes.GetGreetString ,
        payload : "Hello HardHat"
    })
}