import { StyleSheet, Text, View ,FlatList,TouchableOpacity,Alert} from 'react-native'
import React, {useState,useContext} from 'react'
import { updateOrderState,removeItemShoppingCart,getShopListDoc } from '../services/BackendServices';
import moment from 'moment';
import { Ionicons} from '@expo/vector-icons';
import MangoStyles from '../styles'
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';


const ShoppingCartScreen = ({navigation}) => {
  const { user , setUser} = useContext(AuthenticatedUserContext);
    const [shoppingCartObj, shoppingCartObjSet] = useState(null);

    const removeItem = (index) =>{
        removeItemShoppingCart(index,user._id)
        .then((response) => response.json())
        .then((resultObj)=>{
           
            console.log(resultObj)
            if(resultObj === null){
              shoppingCartObjSet(null)
              alert("Your shopping cart is empty")
            }else{
              shoppingCartObjSet(resultObj)
            }
        }).catch(e=>{
          console.log(e)
        })
        
    }

    const showAlert = () =>
    {  Alert.alert( "Place order?", "Do you want to checkout?",
      [
        {
          text: "Cancel",onPress: () => {},style: "destructive",},
        {
          text: "Place Order",
          onPress: () => {
            updateOrderState(shoppingCartObj._id,'pending').then(()=>{
              shoppingCartObjSet(null)
              navigation.navigate('OrdersScreen')
            }).catch((e)=>{
              console.log(e)
            })
          },
          style: "default",
        },
      ],
      {
        cancelable: true,
      }
    )};



      
  React.useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () =>shoppingCartObj ? (
          <TouchableOpacity onPress={showAlert}>
            <Text style={styles.searchBtn}>
              <Ionicons name='checkmark' size={24} color='white' />
            </Text>
          </TouchableOpacity> 
        ) : <></>,
    })
  })
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

            try {
                if(user){
                  findShoppingCart();

                }
            } catch (error) {
                console.log(error)    
            }
            
        });
    
        return unsubscribe;
      }, [navigation]);

      
const findShoppingCart = ()=> {
    
      getShopListDoc(user._id).then((order)=>{         
          if(order && order._id){
              shoppingCartObjSet(order)
          }
        }).catch(e => {
          console.log(e)
            shoppingCartObjSet(null)
        })
}
  return (
    <View style ={styles.container}>
        {shoppingCartObj !== null ? (

            <View styles={styles.orderHeader}>
                <View style={styles.row}>
                    <Text style={styles.label}>Date Created: </Text>
                    <Text style={styles.value}>{shoppingCartObj.dateString}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Subtotal: </Text>
                    <Text style={styles.value}>${shoppingCartObj.total.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Taxes (13%): </Text>
                    <Text style={styles.value}>${shoppingCartObj.taxes.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Shipping Cost (10%): </Text>
                    <Text style={styles.value}>${shoppingCartObj.shipping.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Total: </Text>
                    <Text style={styles.value}>${shoppingCartObj.net.toFixed(2)}</Text>
                </View>
                <View style={[styles.row,{marginTop: 10} ]}>
                    <Text style={styles.label}>Your Items: </Text>
                </View>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                        width:'100%',
                        marginBottom: 10
                    }}
                    />
                <FlatList
                    data={shoppingCartObj.items}
                    renderItem={({x,item,index}) => {
                        return (
                            <View style={styles.listItem}>
                                <View style={{width:'60%'}}>
                                    <Text style={styles.name}>{item.name} </Text>
                                    <Text style={styles.values}>${parseFloat(item.price).toFixed(2)}  (x{parseInt(item.quantity)}) </Text>
                                </View>
                                <View style={{width:'30%'}}>
                                    <Text style={styles.total}>${parseFloat(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}  </Text>
                                </View>
                                <TouchableOpacity style={{width:'10%'}} onPress={() => {removeItem(index)}}>
                                    <Text><Ionicons name='close' size={30} color={MangoStyles.mangoNegativeAction} /></Text>
                                </TouchableOpacity> 
                            </View> 
                        )}}
                    keyExtractor={(item,index) => index}
                /> 
            </View>

        ) :
        (<Text style={styles.noList}>There are no items added to the shopping cart</Text>)
        }
    </View>
  )
}

export default ShoppingCartScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MangoStyles.mangoPaleOrange,
        paddingHorizontal: 10,
        paddingTop:10
      },
      noList:{
          width: '100%',
          height:'100%',
          textAlign: 'center',
          textAlignVertical: 'center',
          fontStyle: 'italic'
          
        },
      orderHeader:{
          width: '100%',

      },
      row:{
        paddingVertical: 5,
        flexDirection:'row',
        justifyContent: 'space-between'
      },
      label:{
        fontSize: 16,
        fontWeight: '700',
        width: '50%',
      },
      value:{
        fontSize: 16,
        width: '50%',
        textAlignVertical: 'center',
        textAlign: 'right'
      },
      listItem:{
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection:'row',
        alignItems: 'stretch',
        justifyContent: 'space-between'
      },
      name:{
        fontSize: 18,
      },
    values:{
        fontSize: 16,
        
    },
    total:{
        fontSize: 25,
        textAlignVertical: 'center',
        textAlign:'right'
    },
    searchBtn:{
        marginHorizontal: 10,
        padding: 5
    }
})