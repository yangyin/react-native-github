import Types from '../types'
import DataStore from './../../expand/dao/DataStore'

export const onLoadPopularData =(storename,url)=> {
    return dispatch => {
        dispatch({type:Types.POPULAR_REFRESH,storename})

        let dataStore = new DataStore();
        dataStore.fetchData(url)
        .then(data =>{
            handleData(dispatch,storename,data)
        })
        .catch(error => {
            console.log(error);
            dispatch({
                type:Types.LOAD_POPULAR_FAIL,
                storename,
                error
            })
        })
    }
}


function handleData(dispatch,storename,data) {
    return dispatch({
        type:Types.LOAD_POPULAR_SUCCESS,
        items:data && data.data && data.data.items,
        storename
    })
}