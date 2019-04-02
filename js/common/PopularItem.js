import React,{ Component } from 'react'
import { TouchableOpacity ,View,Text,Image,StyleSheet} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'


export default class PopularItem extends Component {


    render() {
        const { item } = this.props
        console.log('item &&&',item);
        if(!item || !item.owner) return null;
        let favoriteButton = <TouchableOpacity
            style={{padding:6}}
            onPress={() => {

            }}
            underlayColor={'transparent'}
        >
            <FontAwesome name={'star-o'} size={26} style={{color:'red'}} />
        </TouchableOpacity>
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
            >
                <View style={styles.cell}>
                    <Text style={styles.title}>{ item.full_name}</Text>    
                    <Text style={styles.desc}>{ item.description}</Text>    
                    <View style={styles.row }>
                        <View style={styles.row }>
                            <Text>Author:</Text>
                            <Image style={{height:22,width:22}} 
                                source={{uri:item.owner.avatar_url}}
                            />
                        </View>
                        <View style={styles.row }>
                            <Text>Start:</Text>
                            <Text>{item.stargazers_count}</Text>
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