import { createNavigationReducer} from 'react-navigation-redux-helpers'
import { combineReducers } from 'redux'

import { RootNavigator ,rootCom} from './../navigator/AppNavigator'
import theme from './theme'
import popular from './popular'
import trending from './trending'

// const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom))

// const navReducer = (state = navState, action) => {
//     const nextState = RootNavigator.router.getStateForAction(action, state);
//     //若 nextState 为null 或未定义，只需返回原始 state
//     return nextState || state;
// }

const navReducer = createNavigationReducer(RootNavigator);

const index = combineReducers({
    nav:navReducer,
    theme,
    popular,
    trending
})

export default index