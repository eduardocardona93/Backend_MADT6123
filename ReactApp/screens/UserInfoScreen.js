import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, {useState} from 'react'
import { getUserOrders } from '../services/BackendServices';
import OrderListitem from '../components/OrderListitem';

const UserInfoScreen = ({navigation, route}) => {
    const [userInfo, userInfoSet] = useState(null);
    const [userOrders, userOrdersSet] = useState([]);
    const selectOrder = (order) => {
      navigation.navigate('OrderDetailsScreen', {
        order : order
      })     
    }
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if(route.params && route.params.user ){
                userInfoSet(route.params.user )
                getUserOrders(route.params.user._id,'all').then(userOrdersResponse => {
                  console.log(userOrdersResponse)
                  userOrdersSet(userOrdersResponse)
                })
            }

        })
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => (
      <OrderListitem item={item}  onPress={() => {selectOrder(item)}}></OrderListitem>
    );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>User</Text>
        <Text style={styles.content}>{userInfo? userInfo.name:""}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.content}>{userInfo? userInfo.email:""}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.content}>{userInfo? userInfo.address:""}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.content}>{userInfo? userInfo.phoneNumber:""}</Text>
      </View>
      <View >
          <View style={[styles.row,{} ]}>
              <Text style={styles.label}>User Orders: </Text>
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
        data={userOrders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      </View>
    </View>
  )  
}

export default UserInfoScreen

const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    flex: 1,
    backgroundColor: MangoStyles.mangoPaleOrange,
    paddingHorizontal: 10,
    paddingTop:20,
  },
  
  label: {
    fontSize: 18,
    fontWeight: '700',
    width: '50%',
  },

  content: {
    fontSize: 16,
    width: '50%',
    textAlignVertical: 'center',
    textAlign: 'right'
  },

  row:{
    paddingVertical: 10,
    flexDirection:'row',
    justifyContent: 'space-between'
  },

})