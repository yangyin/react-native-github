
/**
 * 处理下拉刷新的数据
 * @param {*} dispatch 
 * @param {*} storename 
 * @param {*} data 
 * @param {*} pageSize 
 */

export function handleData(actionType,dispatch,storename,data,pageSize) {
    let fixItems = [];
    if(data && data.data ) {
        if(Array.isArray(data.data)) {
            fixItems = data.data   
        } else if(Array.isArray(data.data.items)) {
            fixItems = data.data.items;
        }
    }
    return dispatch({
        type:actionType,
        items:fixItems,
        projectModes:pageSize > fixItems.length ? fixItems : fixItems.slice(0,pageSize),//第一次要加载的数据
        storename,
        pageIndex:1
    })
}