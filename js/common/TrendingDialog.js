import React from 'react'
import { View,Text,Modal,StyleSheet ,TouchableOpacity} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import TimeSpan from './../modal/TimeSpan'

export const TimeSpans = [new TimeSpan('今 天','since=daily'),new TimeSpan('本 周','since=weekly'),new TimeSpan('本 月','since=monthly')]

export default class TrendingDialog extends React.Component {
    state = {
        visible:false
    }

    close() {
        this.setState({
            visible:false
        })
    }

    dismiss() {
        this.setState({
            visible:true
        })
    }

    render() {
        const { onClose,onSelect } = this.props;
        return (
            <Modal
                transparent={true}
                visible={this.state.visible}
                onRequestClose={()=> onClose}
            >
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => this.dismiss()}
                >
                    <MaterialIcons 
                        name="all-drop-up"
                        size={36}
                        style={styles.arrow}
                    />
                    <View style={styles.content}>
                        { TimeSpans.map((result,i) => (
                            <TouchableOpacity
                                onPress={()=>onSelect(result)}
                                underlayColor="transparent"
                            >
                                <View style={styles.text_container}>
                                    <Text style={styles.text}>{result.showText}</Text>
                                    {
                                        i !== TimeSpans.length-1 ? <View style={styles.line} />:null
                                    }
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
} 


const styles = StyleSheet.create({
    container: {
        backgroundColor:'rgba(0,0,0,.6)',
        flex:1,
        alignItems:'center'
    },
    arrow: {
        marginTop:40,
        color:'white',
        padding:0,
        margin:-15
    },
    content :{
        backgroundColor:'#fff',
        borderRadius:3,
        paddingTop:3,
        paddingBottom:3,
        marginRight:3
    },
    text_container: {
        alignItems:'center',
        flexDirection:'row'
    },
    text: {
        fontSize:16,
        color:'#000',
        fontWeight:400,
        padding:8,
        paddingLeft:26,
        paddingRight:26
    },
    line: {
        height:.3,
        backgroundColor:'darkgray'
    }
})