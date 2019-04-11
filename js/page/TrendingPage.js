import React from 'react'
import { StyleSheet, View, Text ,FlatList ,RefreshControl,ActivityIndicator,TouchableOpacity,DeviceEventEmitter} from 'react-native'
import { connect } from 'react-redux'
import actions from './../action'
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation'

import TrendingItem from './../common/TrendingItem'
import NavigationBar from './../common/NavigationBar'
import TrendingDialog , { TimeSpans } from './../common/TrendingDialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import NavigationUtil from './../navigator/NavigationUtil'

const URL = 'https://github.com/trending/'
const THEME_COLOR="#678"
const pageSize =10
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'


class TrendingPage extends React.Component {
    constructor(props) {
        super(props)
        this.tabNames = ['All','C','C#','PHP','Javascript']
        this.state = {
            timeSpan:TimeSpans[0]
        }
    }

    _genTabs(){
        const tabs = {}
        this.tabNames.forEach((item,index) => {
            tabs[`tab${index}`] = {
                screen:props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item} />,
                navigationOptions: {
                    title:item
                }
                
            }
        })
        return tabs
    }
    renderTitleView() {
        return (
            <View>
                <TouchableOpacity
                    underlayColor="transparent"
                    onPress={() => this.dialog.show()}
                >
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontSize:18,color:'#fff',fontWeight:'400'}}>
                            趋势 { this.state.timeSpan.showText}
                        </Text>
                        <MaterialIcons 
                            name="arrow-drop-down"
                            size={22}
                            style={{color:'#fff'}}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan:tab
        })
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE,tab)
    }
    renderTrendingDialog() {
        return (
            <TrendingDialog 
                ref={dialog => this.dialog = dialog}
                onSelect={tab => this.onSelectTimeSpan(tab)}
            />
        )
    }
    _tabNav() {
        if(!this.tabNav) {
            this.tabNav = createAppContainer(createMaterialTopTabNavigator(this._genTabs(),{
                tabBarOptions: {
                    tabStyle:styles.tabStyle,
                    upperCaseLabel:false, //是否标签大写
                    scrollEnabled:true,//是否支持选项卡滚动
                    style:{
                        backgroundColor:'#678',
                        height:30
                    },
                    indicatorStyle:styles.indicatorStyle,
                    labelStyle:styles.labelStyle,//文字样式
                }
            }))
        }
        return this.tabNav
    }
    render() {

        let statusBar = {
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        }
        let navigationBar = <NavigationBar 
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor:THEME_COLOR}}
        />
        
        const TabNavigator = this._tabNav();
        return (
            <View style={{flex:1}}>
                {navigationBar}
                <TabNavigator />
                {this.renderTrendingDialog()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabStyle: {
        // minWidth:50
        padding:0
    },
    indicatorStyle: {
        height:2,
        backgroundColor:'white'
    },
    labelStyle:{
        fontSize:13,
        margin:0
    },
    indicatorContainer: {
        alignItems:'center'  
    },
    indicatior: {
       color:'red',
       margin:10 
    }
})


class TrendingTab extends React.Component {

    constructor(props) {
        super(props)
        const { tabLabel,timeSpan } = this.props
        this.storename = tabLabel
        this.timeSpan = timeSpan
    }

    componentDidMount() {
        this.loadData()
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE,timeSpan => {
            this.timeSpan = timeSpan
            this.loadData()
        })
    }
    componentWillUnmount() {
        if(this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
    }


    loadData(loadMore) {
        const store = this._store();
        const url = this.genFetchUrl(this.storename)
        if(loadMore) {
            this.props.onLoadMoreTrending(this.storename,++store.pageIndex,pageSize,store.items,callback=> {
                console.log(' 没有更多')
            })
        } else {
            this.props.onRefeshTrending(this.storename,url,pageSize)
        }
    }

    _store() {
        const { trending } = this.props;
        let store = trending[this.storename]
        if( !store) {
            store = {
                items:[],
                isLoading:false,
                projectModes:[],//要显示的数据
                hideLoadingMore:true, //默认隐藏加载更多
            }
        }
        return store;
    }

    genFetchUrl(key) {
        return URL + key + '?'+this.timeSpan.searchText
    }

    renderItem(data) {
        const item = data.item;
        return <TrendingItem 
                    item={item}
                    onSelect={() => {
                        NavigationUtil.goPage({
                            projectModel:item,
                        },'DetailPage')
                    }}
                />
    }
    genIndicatior() {
        return this._store().hideLoadingMore ? null:
            <View style={styles.indicatorContainer}>
                <ActivityIndicator 
                    style={styles.indicatior}
                />
                <Text>正在加载更多</Text>
            </View>
    }
    render() {
        // const { tabLabel,popular } = this.props;
        let store = this._store()
        console.log('trending page render*****',store.projectModes)
        return (
            <View>
                <FlatList 
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => item.fullName}
                    refreshControl={
                        <RefreshControl 
                            title={"loading"}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                    ListFooterComponent={()=>this.genIndicatior()}
                    onEndReached={() => {
                        setTimeout(() => {
                            if(this.canLoadMore) {
                                this.loadData(true)
                                this.canLoadMore=false
                            }
                        },100)
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true
                    }}
                />
                {/* <Text>{tabLabel}</Text>
                <Text onPress={() => {
                    NavigationUtil.goPage({
                        navigation:this.props.navigation
                    },'DetailPage')
                }}>跳转到详情页</Text> */}
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {trending:state.trending}
}
const mapDispatchToProps = dispatch => ({
    onRefeshTrending:(storename,url,pageSize) => dispatch(actions.onRefeshTrending(storename,url,pageSize)),
    onLoadMoreTrending:(storename,pageIndex,pageSize,items,callback) => dispatch(actions.onLoadMoreTrending(storename,pageIndex,pageSize,items,callback))
})

const TrendingTabPage = connect(mapStateToProps,mapDispatchToProps)(TrendingTab);

export default TrendingPage