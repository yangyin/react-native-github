import Types from './../../action/types'

const defaultState = {}


/**
 * popular: {
 *  java: {
 *      items:[],
 *      isLoading:false
 *  }
 * }
 * @param {*} state 
 * @param {*} action 
 */
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.LOAD_POPULAR_SUCCESS:
            return {
                ...state,
                [action.storename]: {
                    ...state[action.storename],
                    items: action.items,
                    isLoading: false
                }
            }
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storename]:{
                    ...state[action.storename],
                    isLoading:true
                }
            }
        case Types.LOAD_POPULAR_FAIL:
            return {
                ...state,
                [action.storename]:{
                    ...state[action.storename],
                    isLoading:false
                }
            }
        default:
            return state;
    }
}