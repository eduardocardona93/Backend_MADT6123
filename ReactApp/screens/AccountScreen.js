import React, { useContext, useState, useEffect,useLayoutEffect  } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native'
import MangoStyles from '../styles'
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { IconButton } from '../components';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreAllLogs();
import {  GetUserInfo, LoginUser, resetPassword } from '../services/BackendServices';

import Constants from 'expo-constants';
const SERVICE_URL = Constants.manifest.extra.apiUrl;

const AccountScreen = ({navigation, route}) => {
  const { user , setUser} = useContext(AuthenticatedUserContext);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  const handleSignout = async () => {
    try {
      await setUser(null)
      navigation.navigate('LoginScreen');

    } catch (error) {
      console.log(error);
    }
  };

  const onPressInfoChange = () => {
    navigation.navigate('Account Information');
  }
  
  
  const onPressAccInfoChange = () => {
    if(user != null) {
      const userId = user._id;
      const user_email = user.email;
      const email_subject = "Password Reset Request - The Mango Place"
      const email_body =`${SERVICE_URL}users/recoverPassword/${userId}`
      
      var resetPassResponse = '';
      resetPassword(user_email, email_subject, email_body)
        .then((res) => res.json())
        .then((json) => {
          resetPassResponse = JSON.parse(json).message
          Alert.alert(resetPassResponse)
        })
        .catch( e => {
          console.log(e);
          resetPassResponse = "error while sending the password reset email"
          Alert.alert(resetPassResponse)
        })

      // Alert.alert(resetPassResponse)
    }
  }

  React.useLayoutEffect(() => {
    // console.log(userInfo)
    navigation.setOptions({
      
      headerRight: () =>(
        <View style={styles.logoutBtn}>
          <IconButton name='logout' size={20} onPress={handleSignout} color='#fff' />
        </View>
      ),
      
    });
  })

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>User</Text>
        <Text style={styles.content}>{user ? user.name : ''}</Text>
      </View>
      <View>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.content}>{user ? user.email : ''}</Text>
      </View>
      <View>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.content}>{user ? user.address : ''}</Text>
      </View>
        <View style={styles.section}>

          <TouchableOpacity onPress={onPressInfoChange} style={styles.button}>
            <Text style={styles.buttonText}>Edit Info</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressAccInfoChange} style={styles.button}>
            <Text style={styles.buttonText}>Change password</Text>
          </TouchableOpacity>
        </View>

    </View>
    
      
    
  )
}

export default AccountScreen


const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    flex: 1,
    backgroundColor: MangoStyles.mangoPaleOrange,
    paddingHorizontal: 0,
    paddingTop:10,
    paddingHorizontal:20
  },
  
  label: {
    fontSize: 22,
    fontWeight: '600',
    paddingTop: 10
  },

  content: {
    fontSize:18,
    fontWeight: '300',
    paddingTop: 2,
    paddingBottom: 15
  },

  section: {
    paddingTop: 25,
    flexDirection:'column',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  adminSection: {
    paddingTop: 25,
    flexDirection:'column',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  button: {
    margin:5,
    padding:15,
    width: '80%',
    alignItems: 'center',
    backgroundColor: MangoStyles.mangoOrangeYellow,
    borderRadius: 8
  },

  buttonText: {
    fontSize:25,
    color: 'white',
    fontWeight:'700'
  },

  logoutBtn: {
    marginHorizontal: 10,
    padding:10
  }
})