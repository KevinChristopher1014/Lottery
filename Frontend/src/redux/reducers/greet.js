


import ActionTypes from "../actions/actionType";

const INITIAL_STATE = {
    greetingStr : ''
}

export const greet = ( state=INITIAL_STATE , action={} ) => {
    switch(action.type){
        case ActionTypes.GetGreetString:
            return({
                ...state,
                greetingStr : action.payload
            });
        default:
            return state ;
    }
}
