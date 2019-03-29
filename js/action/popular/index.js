import Types from '../types'
import DataStore from './../../expand/dao/DataStore'

export const onLoadPopularData =(storename,url,pageSize)=> {
    return dispatch => {
        dispatch({type:Types.POPULAR_REFRESH,storename})

        let dataStore = new DataStore();
        dataStore.fetchData(url)
        .then(data =>{
            handleData(dispatch,storename,data,pageSize)
        })
        .catch(error => {
            console.log(error);
            dispatch({
                type:Types.POPULAR_REFRESH_FAIL,
                storename,
                error
            })
        })
    }
}


function handleData(dispatch,storename,data,pageSize) {
    let fixItems = [];
    if(data && data.data && data.data.items) {
        fixItems = data.data.items;
    }
    return dispatch({
        type:Types.POPULAR_REFRESH_SUCCESS,
        items:fixItems,
        projectModes:pageSize > fixItems.length ? fixItems : fixItems.slice(0,pageSize),//第一次要加载的数据
        storename,
        pageIndex:1
    })
}

/**
 * 加载更多
 * @param {*} storename 
 * @param {*} pageIndex 第几页
 * @param {*} pageSize 每页数据
 * @param {*} dataArray 原始数据
 * @param {*} callback 通过回调向调用页面通信：比如异常展示，没有更多等待
 */
export function onLoadMorePopular(storename,pageIndex,pageSize,dataArray=[],callback) {
    return dispatch => {
        setTimeout(() => {
            if( (pageIndex -1)*pageSize >= dataArray.length) { //已加载完全部数据
                if(typeof callback === 'function') {
                    callback('no more')
                }
                dispatch({
                    type:Types.POPULAR_LOAD_MORE_FAIL,
                    error:'no more',
                    storename,
                    pageIndex:--pageIndex,
                    projectModes:dataArray
                })
            } else {
                //本次和载入的最大数量
                let max = pageSize*pageIndex > dataArray.length ? dataArray.length : pageSize*pageIndex;
                dispatch({
                    type:Types.POPULAR_LOAD_MORE_SUCCESS,
                    storename,
                    pageIndex,
                    projectModes: dataArray.slice(0,max)
                })
            }
        }, 500);
    }
}