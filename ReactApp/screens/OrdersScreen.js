import { StyleSheet, View, FlatList,  Text,StatusBar,Button,TouchableOpacity } from 'react-native';
import { Ionicons,FontAwesome5,AntDesign,Entypo,Fontisto,MaterialIcons} from '@expo/vector-icons';
import React, {useState,useContext} from 'react'
import MangoStyles from '../styles'
import OrderListitem from '../components/OrderListitem'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { getUserOrders, getAllOrders } from '../services/BackendServices';
import moment from 'moment';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';


const OrdersScreen = ({navigation}) => {
  const selectOrder = (order) => {
    navigation.navigate('OrderDetailsScreen', {
      order : order
    })     
  }
  const { user} = useContext(AuthenticatedUserContext) ;

  const [userOrders, userOrdersSet] = useState([]);
  const [visible, setVisible] = useState(false);

  const [filterOrders, filterOrdersSet] = useState('all');

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      try {
        updateOrders('all')
      } catch (error) {
        console.log(error)

      }

    });

    return unsubscribe;
  }, [navigation]);

  const updateOrders = async (filterOrders) => {
    console.log(filterOrders)
    if(user && user.isAdmin){
      userOrdersSet([])
      getAllOrders(filterOrders).then(async(orders)=>{
        await userOrdersSet(orders)
      })
    }else{
       getUserOrders(user._id,filterOrders).then(async(orders)=>{
        await userOrdersSet(orders)
      })
    }

  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      
      headerRight: () => {
        return (
          <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Menu
              visible={visible}
              anchor={<Text style={styles.searchBtn} onPress={showMenu}><Ionicons name='ellipsis-vertical' size={24} color='white' /></Text>}
              onRequestClose={hideMenu}
              style={{width: 200}}
            >
              <MenuItem style={[{backgroundColor : filterOrders === 'all' ? MangoStyles.mangoOrangeYellow : 'white'}]} 
              textStyle={[{color : filterOrders === 'all' ? 'white' : 'black'}]} onPress={ () => {updateOrders('all');filterOrdersSet('all'); hideMenu();}}>All</MenuItem>
              <MenuItem style={[{backgroundColor : filterOrders === 'pending' ? MangoStyles.mangoOrangeYellow : 'white'}]}
                textStyle={[{color : filterOrders === 'pending' ? 'white' : 'black'}]} onPress={ () => {updateOrders('pending');filterOrdersSet('pending'); hideMenu();}}>Pending</MenuItem>
              <MenuItem style={[{backgroundColor : filterOrders === 'ready-for-shipment' ? MangoStyles.mangoOrangeYellow : 'white'}]} 
              textStyle={[{color : filterOrders === 'ready-for-shipment' ? 'white' : 'black'}]}
              onPress={ () => {updateOrders('ready-for-shipment');filterOrdersSet('ready-for-shipment'); hideMenu();}}>Ready for shippment</MenuItem>
              <MenuItem style={[{backgroundColor : filterOrders === 'shipped' ? MangoStyles.mangoOrangeYellow : 'white'}]} 
              textStyle={[{color : filterOrders === 'shipped' ? 'white' : 'black'}]}
              onPress={ () => {updateOrders('shipped');filterOrdersSet('shipped'); hideMenu();}}>Shipped</MenuItem>
              <MenuItem style={[{backgroundColor : filterOrders === 'completed' ? MangoStyles.mangoOrangeYellow : 'white'}]} 
              textStyle={[{color : filterOrders === 'completed' ? 'white' : 'black'}]}
              onPress={ () => {updateOrders('completed');filterOrdersSet('completed'); hideMenu();}}>Completed</MenuItem>
              <MenuItem style={[{backgroundColor : filterOrders === 'canceled' ? MangoStyles.mangoOrangeYellow : 'white'}]} 
              textStyle={[{color : filterOrders === 'canceled' ? 'white' : 'black'}]}
              onPress={ () => {updateOrders('canceled');filterOrdersSet('canceled'); hideMenu();}}>Canceled
              </MenuItem>
            </Menu>
          </View>
      )},
    })
  })
  const renderItem = ({ item }) => (
    <OrderListitem item={item} onPress={() => {selectOrder(item)}}></OrderListitem>
  );
     return (
      
        <View style ={styles.container}>
          <FlatList
            data={userOrders}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
        </View>
        
    );
    
}

export default OrdersScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MangoStyles.mangoPaleOrange,
    paddingHorizontal: 0,
    paddingTop:10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    bottom: 0
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000'
  },
  searchBtn: {
    marginRight: 10,
    padding: 5
  }
});
