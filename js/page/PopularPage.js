import React from 'react'
import { StyleSheet, View, Text ,FlatList ,RefreshControl,ActivityIndicator} from 'react-native'
import { connect } from 'react-redux'
import actions from './../action'
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation'
import NavigationUtil from './../navigator/NavigationUtil'
import PopularItem from './../common/PopularItem'

import NavigationBar from './../common/NavigationBar'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR="#678"
const pageSize =10


class PopularPage extends React.Component {
    constructor(props) {
        super(props)
        this.tabNames = ['Java','JS','ios','android','PHP']
    }

    _genTabs(){
        const tabs = {}
        this.tabNames.forEach((item,index) => {
            tabs[`tab${index}`] = {
                screen:props => <PoplarTabPage {...props} tabLabel={item} />,
                // screen:props => <PopularTab {...props} tabLabel={item} />,
                navigationOptions: {
                    title:item
                }
                
            }
        })
        return tabs
    }

    render() {

        let statusBar = {
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        }
        let navigationBar = <NavigationBar 
            title={'最热'}
            statusBar={statusBar}
            style={{backgroundColor:THEME_COLOR}}
        />
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(this._genTabs(),{
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
        
        return (
            <View style={{flex:1}}>
                {navigationBar}
                <TabNavigator />
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


class PopularTab extends React.Component {

    constructor(props) {
        super(props)
        const { tabLabel } = this.props
        this.storename = tabLabel
    }

    componentDidMount() {
        this.loadData(false)
    }

    loadData(loadMore) {
        const store = this._store();
        const url = this.genFetchUrl(this.storename)
        if(loadMore) {
            this.props.onLoadMorePopular(this.storename,++store.pageIndex,pageSize,store.items,callback=> {
                console.log(' 没有更多')
            })
        } else {
            this.props.onRefreshPopular(this.storename,url,pageSize)
        }
    }

    _store() {
        const { popular } = this.props;
        let store = popular[this.storename]
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
        return URL + key + QUERY_STR
    }

    renderItem(data) {
        const item = data.item;
        return <PopularItem 
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
        console.log('*****',store.projectModes)
        return (
            <View>
                <FlatList 
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.id}
                    refreshControl={
                        <RefreshControl 
                            title={"loading"}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(false)}
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
    return {popular:state.popular}
}
const mapDispatchToProps = dispatch => ({
    onRefreshPopular:(storename,url,pageSize) => dispatch(actions.onLoadPopularData(storename,url,pageSize)),
    onLoadMorePopular:(storename,pageIndex,pageSize,items,callback) => dispatch(actions.onLoadMorePopular(storename,pageIndex,pageSize,items,callback))
})

const PoplarTabPage = connect(mapStateToProps,mapDispatchToProps)(PopularTab);

export default PopularPage