import React,{ Component } from 'react'
import { TouchableOpacity ,View,Text,Image,StyleSheet} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview'


export default class TrendingItem extends Component {


    render() {
        const { item } = this.props
        if(!item ) return null;
        let favoriteButton = <TouchableOpacity
            style={{padding:6}}
            onPress={() => {

            }}
            underlayColor={'transparent'}
        >
            <FontAwesome name={'star-o'} size={26} style={{color:'red'}} />
        </TouchableOpacity>
        let description = `<p>${item.description}</p>`
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
            >
                <View style={styles.cell}>
                    <Text style={styles.title}>{ item.full_name}</Text>    
                    {/* <Text style={styles.desc}>{ item.description}</Text>     */}
                    <HTMLView 
                        value={description}
                        onLinkPress={url => {}}
                        stylesheet={{
                            p:styles.desc,
                            a:styles.desc
                        }}
                    />
                    <Text style={styles.desc}>{ item.meta}</Text>    
                    <View style={styles.row }>
                        <View style={styles.row }>
                            <Text>Built by: </Text>
                            {
                                item['contributors'].map((result,i,arr) => (
                                    <Image key={i} style={{height:22,width:22,margin:2}} 
                                        source={{uri:result}}
                                    />
                                ))
                            }
                            
                        </View>
                        <View style={styles.row }>
                            <Text>Start:</Text>
                            <Text>{item.starCount}</Text>
                        </View>
                        {favoriteButton}
                    </View>
                </View>    
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    cell: {
        backgroundColor:'#fff',
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:3,
        borderColor:'#ddd',
        borderWidth:.5,
        borderRadius:2,
        shadowColor:'gray',
        shadowOffset:{ width:.5,height:.5},
        shadowOpacity:.4,
        elevation:2
    },
    row:{
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center'
    },
    title:{
        fontSize:16,
        marginBottom:2,
        color:'#212121'
    },
    desc:{
        fontSize:14,
        marginBottom:2,
        color:'#757575'
    }
})