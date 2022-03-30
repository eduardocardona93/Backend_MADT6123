import { StyleSheet, Text, Button, KeyboardAvoidingView, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native'
import React, { useContext,useState } from 'react';
import { Ionicons,FontAwesome5,AntDesign,Entypo} from '@expo/vector-icons';
import Logo from '../assets/mango_letter.png';
import MangoStyles from '../styles'
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import Constants from 'expo-constants';


import {  GetUserInfo, LoginUser, resetPassword } from '../services/BackendServices';
import { InputField, ErrorMessage } from '../components';
const SERVICE_URL = Constants.manifest.extra.apiUrl;

const LoginScreen = ({navigation}) => {
  const {height} = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user,setUser } = useContext(AuthenticatedUserContext) ;

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');

  // const onChangeEmail = textValue => emailSetText(textValue);
  // const onChangePass = textValue => passwordSetText(textValue);

  const onPressRegister = () => {
    navigation.navigate('Signup');
  }

  const onPressAccInfoChange = () => {
    if (email === ''){
      Alert.alert("Please type your email first")
    }else {

      GetUserInfo(email)
        .then((response) => {
          if(response != null) {
            const userId = response._id;
            const user_email = response.email;
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
                resetPassResponse = "error while sending the password reset email"
                Alert.alert(resetPassResponse)
              })

            // Alert.alert(resetPassResponse)
          }
          else {
            Alert.alert("User not found");
          }
        })
      
      }
  }
    

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const onLogin = async () => {
    try {
      if (email === '') {
        Alert.alert("Please type an email address")
      } else if  (password === ''){
        Alert.alert("Please type your password")
      } else {
        LoginUser(email,password)
        .then((userResponse) => {
          if(userResponse.loggedUser){
            setUser(userResponse.loggedUser)
          }else{
            alert(userResponse.message)
          }
          
        }).catch(error => {
          alert(error.message);
        })
      }


    } catch (error) {
      alert(error.message);
    }
  };

  return (

    <View style={styles.container} >
      <Image source={Logo}  style={[styles.logo, {height: height*0.3}]} resizeMode="contain" />
      <View style={styles.inputContainer}> 
          
          <View style={styles.inputIcon}>
            <FontAwesome5 name="user-circle" size={20} color="black" />
          </View>

          <InputField 
              placeholder='Enter Email'
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              autoFocus={true}
              value={email}
              onChangeText={text => setEmail(text)} />


      </View>
      <View style={styles.inputContainer}> 
          <View style={styles.inputIcon}>
            <FontAwesome5 name="key" size={20} color="black" />
          </View>

          <InputField 
              placeholder='Enter Password'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={passwordVisibility}
              textContentType='password'
              rightIcon={rightIcon}
              value={password}
              onChangeText={text => setPassword(text)}
              handlePasswordVisibility={handlePasswordVisibility} />


      </View>
      <View style={styles.buttonContainer}> 

 
        <TouchableOpacity
          onPress={onLogin}
          style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressRegister}
          style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressAccInfoChange} style={styles.passButton}>
            <Text style={styles.buttonPassText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
</View>
  )
}



const styles = StyleSheet.create({
      container: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: MangoStyles.mangoPaleOrange,
      },
      logo:{
        width:'90%',
        maxWidth: 500,
        maxHeight:150,
        marginBottom: 50,
      },
      inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        flexDirection:'row',
        width: '90%'
      },
      inputIcon: {
        borderColor: MangoStyles.mangoOrangeYellow,
        borderWidth: 2,
        borderRadius: 5,
        padding: 13,
        marginRight: 10,
        backgroundColor: 'white',
      },
      input: {
        width: '80%',
        backgroundColor: 'white',
        borderColor: MangoStyles.mangoOrangeYellow,
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        
      },
      buttonContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      button: {
        backgroundColor: MangoStyles.mangoOrangeYellow,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
      },
      passButton: {
        width: '100%',
        padding: 15,
        alignItems: 'center',
      },
      buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: MangoStyles.mangoOrangeYellow,
        borderWidth: 2,
      },
      buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
      },
      buttonPassText: {
        color: MangoStyles.mangoOrangeYellow,
        fontWeight: '700',
        fontSize: 16,
      },
      buttonOutlineText: {
        color: MangoStyles.mangoOrangeYellow,
        fontWeight: '700',
        fontSize: 16,
      },
})

export default LoginScreen