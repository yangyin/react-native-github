import React from 'react'
import { StyleSheet, View,Text,TouchableOpacity ,WebView} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import NavigationBar from './../common/NavigationBar'
import ViewUtil from "./../util/ViewUtil"
import NavigationUtil from './../navigator/NavigationUtil'
import BackPressComponent from '../common/BackPressComponent'

const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'

class DetailsPage extends React.Component {
    constructor(props) {
        super(props)

        this.params = this.props.navigation.state.params
        const { projectModel } = this.params
        this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName
        const title = projectModel.full_name || projectModel.fullName
        this.state = {
            title,
            url:this.url,
            canGoBack:false
        }

        this.backPress = new BackPressComponent({backPress:() =>this.onBackPress()})
    }

    componentDidMount() {
        this.backPress.componentDidMount()
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }

    onBackPress = () => {
        this.onBack()
        return true
    }

    onBack() {
        if( this.state.canGoBack) {
            this.webview.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack:navState.canGoBack,
            url:navState.url
        })
    }

    renderRightBtn() {
        return (
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={ () => {

                    }}
                >
                    <FontAwesome 
                        name={'star-o'}
                        size={20}
                        style={{color:'#fff',marginRight:10}}
                    />
                </TouchableOpacity>
                {
                    ViewUtil.getShareButton(() => {

                    })
                }
            </View>
        )
    }

   render() {
        const titleLayoutStyle = this.state.title.length >20 ? { paddingRight:30} : null
        let navigationBar = <NavigationBar 
                            leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
                            rightButton={this.renderRightBtn()}
                            title={this.state.title}
                            titleLayoutStyle={titleLayoutStyle}
                            style={{backgroundColor:THEME_COLOR}}
                        />
       return (
           <View style={styles.container}>
               {navigationBar}
               <WebView 
                    ref={webview => this.webview = webview}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{uri:this.state.url}}
               />
           </View>
       )
   }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})

export default DetailsPage