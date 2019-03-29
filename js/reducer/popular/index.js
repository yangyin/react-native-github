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
        case Types.POPULAR_REFRESH_SUCCESS: //下拉刷新成功
            return {
                ...state,
                [action.storename]: {
                    ...state[action.storename],
                    items:action.items,//原始数据
                    projectModes: action.projectModes, //此次展示数据
                    isLoading: false,
                    pageIndex:action.pageIndex,
                    hideLoadingMore:false
                }
            }
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storename]:{
                    ...state[action.storename],
                    isLoading:true,
                    hideLoadingMore:true
                }
            }
        case Types.POPULAR_REFRESH_FAIL: //下拉刷新失败
            return {
                ...state,
                [action.storename]:{
                    ...state[action.storename],
                    isLoading:false
                }
            }
        case Types.POPULAR_LOAD_MORE_SUCCESS: //上拉加载成功
            return { 
                ...state,
                [action.storename]: {
                    ...state[action.storename],
                    projectModes:action.projectModes,
                    hideLoadingMore:false,
                    pageIndex:action.pageIndex
                }
            }
        case Types.POPULAR_LOAD_MORE_FAIL: //上拉加载失败
            return { 
                ...state,
                [action.storename]: {
                    ...state[action.storename],
                    hideLoadingMore:true,
                    pageIndex:action.pageIndex
                }
            }
        default:
            return state;
    }
}