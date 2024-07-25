import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Button,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TextInput,
    ScrollView,
    ImageBackground,
    StatusBar,
    Image,
    Alert
} from 'react-native';
import { scale } from './Customstyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/userSlice';
// import auth from '@react-native-firebase/auth';
const SigninScreen = ({navigation}) => {
  const dispatch = useDispatch();

    const [isFocus, setisFocus] = useState(false);
    const [isFocus2, setisFocus2] = useState(false);

    const [email, setEmail] = useState('tittu08@yopmail.com');
    const [password, setPassword] = useState('Admin@1234');
    const [data, setData] = React.useState({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true
    });
    const textInputChange = (val) => {
        if( val.length >= 10){
            setData ({
                ... data,
                email: val,
                check_textInputChange: true
            });
        } else {
               setData ({
                ... data,
                email: val,
                check_textInputChange: false
            });
        }
    }

    const handlePassword = (val) => {
        setData({
            ... data,
            password: val
        });
    }

    const updateSecureText = () => {
        setData({
           secureTextEntry: !data.secureTextEntry 
        });
    }
    
     //User Login
     const userSignin = async () => {
      if (!email || !password) {
        Alert.alert("Please fill out the empty fields");
        return;
      }
  
      const formdata = new FormData();
      formdata.append("email", email);
      formdata.append("password", password);
  
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };
  
      try {
        const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/user-login", requestOptions);
        const result = await response.json();
        if (result.status === "success") {
          console.log(result)
          await AsyncStorage.setItem('userId', result.data.uid.toString());
          await AsyncStorage.setItem('token', result.data.access_token);
          dispatch(setUser({  token: result.data.access_token }));
          navigation.navigate("Home");
        } else if (result.status === "error") {
          console.log("Error 404", result);
          Alert.alert(result.message)
        }
        else{
          console.log(result)

        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert('Email or Password incorrect');
      }
    }

   

    return (
        <ScrollView style={[styles.container, {
            // paddingTop: scale(35)
        }]}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

<ImageBackground
        
      style={{width:"100%",height:scale(250)}}
        source={require("./Assets/loginback.png")}
        resizeMode='contain'
        >
            
        </ImageBackground>
          
            <View style={styles.header}>
                <Text style={styles.text_header}>Sign in to Chat App </Text>
            </View>
            <View style={styles.footer}>
       
                <Text style={[styles.text_footer, {
                    marginTop: scale(25)
                }]}>Email</Text>
                <TouchableOpacity style={{...styles.action,borderColor:isFocus == true?'#3A6DDA':'#f2f2f2'}}
                onPress={()=>{setisFocus(true)}}
                >
                    <TextInput
                        placeholder="Enter Email ID"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={()=>{setisFocus(true)}}
                    />
                     <TouchableOpacity
                      onPress={updateSecureText}
                  >
                     <Image       
                      style={{width:20,height:20,marginRight:20,tintColor:isFocus == false ?'gray':'#3E73E1'}}
                      source={require("./Assets/email.png")}
                        resizeMode='contain'
                        >
                            </Image>
                  </TouchableOpacity>
                </TouchableOpacity>
                <Text style={[styles.text_footer, {
                  marginTop: scale(25)
                }]}>Password</Text>
                <View style={{...styles.action,borderColor:isFocus2 == true?'#3A6DDA':'#f2f2f2'}}>
                  <TextInput
                      placeholder="Password"
                      secureTextEntry={data.secureTextEntry ? true : false}
                      style={styles.textInput}
                      autoCapitalize="none"
                      value={password}
                      onChangeText={setPassword}
                      onFocus={()=>{setisFocus2(true)}}

                  />
                  <TouchableOpacity
                      onPress={updateSecureText}
                  >
                      {data.secureTextEntry ? 

                      <Image       
                      style={{width:20,height:20,marginRight:20,tintColor:isFocus2 && '#3E73E1'}}
                        source={require("./Assets/password.png")}
                        resizeMode='contain'
                        >
                            </Image>
                      :
                      <Image       
                      style={{width:20,height:20,marginRight:20}}
                        source={require("./Assets/password.png")}
                        resizeMode='contain'
                        />
                      } 
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: scale(10), alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('ForgotPasswordScreen')}><Text style={styles.text_footer}>Forgot Password?</Text></TouchableOpacity>
                    </View> 
               
                    <TouchableOpacity
                        onPress={()=>userSignin()}
                        style={[styles.signIn, {
                            borderColor: '#3463CF',
                            borderWidth: 1,
                            marginTop: 15,
                            backgroundColor:'#3463CF'
                        }]}
                    >

                        <Text style={[styles.textSign, {
                            color: 'white'
                        }]}>Login</Text>

                    </TouchableOpacity>
                  
                </View>

            </ScrollView>
    );
};

export default SigninScreen;


 const {height} = Dimensions.get("screen");
 const height_logo = height * 0.28;

 const styles = StyleSheet.create({ 
container: {
     flexGrow: 1,
     backgroundColor: 'white'
   },
   header: {
     justifyContent: 'center',
     alignItems:'center',
     marginTop:scale(10)

    // paddingBottom: 50
     },
   footer: {
     backgroundColor: '#fff',
     borderTopLeftRadius: 30,
     borderTopRightRadius: 30,
     paddingHorizontal: 30
   },
   text_header: {
     color: 'black',
     fontWeight: 'bold',
     fontSize: 30
   },
   text_footer: {
     color: '#3B6EDC',
     fontSize: 14
   },
   title: {
     color: '#05375a',
     fontSize: 14,
     fontWeight: 'bold'
   },
   headerTitle: {
     color: '#fff',
     fontSize: 14,
     fontWeight: 'bold'
   },
   action: {
     flexDirection: 'row',
     marginTop: scale(10),
     borderWidth: 1,
     borderColor: '#f2f2f2',
     alignItems:'center',
     justifyContent:'center',
     height:50,
     borderRadius:15
   },
   textInput: { 
    flex:1,
     paddingLeft: 10,
     color: '#05375a',
   },
   button: {
     alignItems: 'center',
     marginTop: 50
   },
   signIn: {
     width: '100%',
     height: 50,
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 10,
   },
   textSign: {
     fontSize: 18,
     fontWeight: 'bold'
   }

 })