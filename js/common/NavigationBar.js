import React,{Component } from 'react'
import { View,Text,StatusBar,StyleSheet, Platform,ViewPropTypes} from 'react-native'
import PropTypes from 'prop-types'

const NAV_BAR_HEIGHT_IOS = 44 //导航栏在ios中的高度
const NAV_BAR_HEIGHT_ANDROID = 50 //导航栏在android中的高度
const STATUS_BAR_HEIGHT = 20 //状态栏的高度



const StatusBarShape = { //设置状态栏所接受的属性
    barStyle:PropTypes.oneOf(['light-content','defalut']),
    hidden:PropTypes.bool,
    backgroundColor:PropTypes.string
}

class NavigationBar extends Component {
    static propTypes = {
        style:ViewPropTypes.style,
        title:PropTypes.string,
        titleView:PropTypes.element,
        titleLayoutStyled:ViewPropTypes.style,
        hide:PropTypes.bool,
        statusBar:PropTypes.shape(StatusBarShape),
        rightButton:PropTypes.element,
        leftButton:PropTypes.element
    }

    static defaultProps = {
        statusBar: {
            barStyle:'light-content',
            hidden:false
        }
    }

    getButtonElement(data) {
        return (
            <View style={styles.navBarButton}>
                { data ? data : null}
            </View>
        )
    }


    render() {
        let statusBar = !this.props.statusBar.hidden ? 
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar} />
            </View> : null;
        let titleView = this.props.titleView ? 
            this.props.titleView : 
            <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{ this.props.title}</Text>
        let content = this.props.hide ? 
            null:
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton)}
                <View style={[styles.navBarTitleContainer,this.props.titleLayoutStyled]}>
                    { titleView }
                </View>
                { this.getButtonElement(this.props.rightButton)}
            </View> 


        return (
            <View style={[styles.container,this.props.style]}>
                { statusBar }
                { content }
            </View>
        )
    }
}




const styles = StyleSheet.create({
    container: {
        backgroundColor:'#2196f3'
    },
    navBarButton: {
        alignItems:'center'
    },
    navBar :{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        height:Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID
    },
    navBarTitleContainer: {
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        left:40,
        right:40,
        top:0,
        bottom:0
    },
    title: {
        fontSize:20,
        color:'#fff',
    },
    statusBar : {
        height:Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0
    }
})

export default NavigationBar