import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  BackHandler,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SCREEN_HEIGHT } from "../../Components/StyleConstant";
// import { isEmpty, showMessageAlert } from '../../Components/styles/Utils';
// import Strings from '../screens/strings';
// import { ChangePassword, CheckEmail } from './APiConatiner';
import { scale } from './Customstyles';

const  ChangePasswordScreen= (props) => {
  const [email, setEmail] = useState('');
  const [errortext, setErrortext] = useState('');
  const [errortext1, setErrortext1] = useState('');
  const [errorViewModal, setErrorViewModal] = useState(false);
  const [erroremailModal, setErroremailModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [Confirmpassword, setConfirmpassword] = React.useState("")


  const [visiblePassword, setVisiblePassword] = React.useState(true)
  const [passwordvisible1, setPasswordvisible1] = React.useState(true)
  const handleBackButtonClick = useCallback(() => {
    props.navigation.goBack();
    return true;
  }, [props.navigation]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, [handleBackButtonClick]);

  const sendVerificationApi = () => {
    // Implement your API call logic here
  };

  const errorViewModalContent = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          style={{ opacity: 10 }}
          visible={errorViewModal}
          onRequestClose={() => setErrorViewModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Verified!</Text>
              <Text style={styles.modalMessage}>You have successfully verified</Text>
              <Text style={styles.modalMessage}>the account.</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>{
                  setErrorViewModal(false)

                  props.navigation.navigate("OtpVerification")
                }
                
                }
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  async function onmailClick() {

    console.log('onRegisterClick');
    
    const userId = await AsyncStorage.getItem('userId');

    const formdata = new FormData();
    formdata.append("u_id", userId);
    formdata.append("new_password", password);
    formdata.append("confirm_password", Confirmpassword);
  
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    
    try {
      const response = await  fetch("https://chat-app-backend-laravel.medks-sz.com/api/reset-password", requestOptions)
    
      const result = await response.json();
      if (result.status === "success") {
       
        props.navigation.navigate("error")
      } else if (result.status === "404") {
        console.log("Error 404", result);
      }
    } 
    catch (error) {
      console.error("Error:", error);
    
    
        // Implement your API call logic here
      };
    
//     if (isEmpty(password)) {
//         showMessageAlert(Strings.please_enter_password);
//     } 
//     if (isEmpty(Confirmpassword)) {
//       showMessageAlert(Strings.please_enter_c_password);
//   }
//   if (Confirmpassword != password) {
//     showMessageAlert(Strings.please_enter_M_password);
// }
//     else{
//        handlePassword()
//     }
    
    
    
}

  async function handlePassword() {
    // try {
    //   setLoading(true); // Show loading indicator
    //   const response = await ChangePassword(password,Confirmpassword);
    //   setLoading(false); // Hide loading indicator
    //   console.log('response', JSON.stringify(response));
  
    //   if (response.status === 'success') { // Adjust according to your actual response structure
    //     console.log('response.data.data', response);
    //     showMessageAlert(response.message);
    //     const timer = setTimeout(() => {
    //       props.navigation.navigate('SatsangLogin');

    //       // props.navigation.replace("Onboarding2");
    //     }, 3000);
    

    // }

    //   if (response.status === 'error') 
    //     { // Adjust according to your actual response structure
    //     console.log('response.data.data', response);
    //     showMessageAlert(response.message);

    //   }
    //    else {
    //     showMessageAlert(response.message || 'verification failed');
    //   }
    // } catch (error) {
    //   setLoading(false); // Hide loading indicator
    //   console.error('error', error);
    //   showMessageAlert('An error occurred');
    // }
  }
  return (
    <ScrollView
      style={{ flexGrow: 1, backgroundColor: 'white' }}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
    >
          <TouchableOpacity style={{ marginHorizontal: 20, marginTop: 50 }}
       onPress={()=>{props.navigation.goBack()}}
       >
        <Image source={require('./Assets/back.png')} style={{ width: 30, height: 20, resizeMode: 'contain' }} />
      </TouchableOpacity>

      <View style={{ alignItems:'center',justifyContent:'center', marginTop: 50,marginHorizontal:20 }}>
        
<TouchableOpacity style={{marginHorizontal:10,marginTop: 40 }}
          onPress={()=>{props.navigation.goBack()}}
          >

          </TouchableOpacity>
        <Text  style={{ color: "black", fontSize: 22, fontFamily: 'Poppins-Bold',marginBottom:10}}>New Password</Text>
        <Text style={{ color: "#979797", fontSize: 14, fontFamily: 'Poppins-SemiBold',textAlign:'center'}}>
        Lorem ipsum dolor sit amet consectetur. Etiam aliquet et morbi dolor ut nibh lobortis nulla sed.Mattis tempus
        </Text>
       
      </View>

      <View style={{ alignItems: 'center', marginTop: 35 }}>
    
      <View style={styles.inputView2}>
                        <TextInput
                            style={styles.inputText}
                            placeholder='New Password'

                            secureTextEntry={visiblePassword}
                            value={password}

                            onChangeText={text => setPassword(text)} />
                        {visiblePassword == false ?
                            <TouchableOpacity
                                onPress={() => {
                                    setVisiblePassword(true)


                                }}
                            >
                                <Image source={require("./Assets/password.png")}
                                    style={styles.imgehideshow} />
                            </TouchableOpacity> : <TouchableOpacity
                                onPress={() => {
                                    setVisiblePassword(false)


                                }}>

                                <Image source={require("./Assets/password.png")}
                                    style={styles.imgehideshow} />
                            </TouchableOpacity>}
                    </View>
                  
        <View style={styles.inputView2}>
                        <TextInput
                            style={styles.inputText}
                            placeholder='Confirm Password'

                            secureTextEntry={passwordvisible1}
                            value={Confirmpassword}

                            onChangeText={text => setConfirmpassword(text)} />
                        {passwordvisible1 == false ?
                            <TouchableOpacity
                                onPress={() => {
                                    setPasswordvisible1(true)


                                }}
                            >
                                <Image source={require("./Assets/password.png")}
                                    style={styles.imgehideshow} />
                            </TouchableOpacity> : <TouchableOpacity
                                onPress={() => {
                                  setPasswordvisible1(false)


                                }}>

                                <Image source={require("./Assets/password.png")}
                                    style={styles.imgehideshow} />
                            </TouchableOpacity>}
                    </View>
                  
        {erroremailModal && (
          <View style={{ width: "85%" }}>
            <Text style={styles.errorText}>{errortext1}</Text>
          </View>
        )}
      </View>

      <View style={{ alignItems: 'center' ,marginBottom:scale(435)}}>
        <TouchableOpacity
          onPress={()=>{onmailClick()}}
          style={styles.loginBtn}
        >
          <Text style={styles.loginText}>Submit</Text>
        </TouchableOpacity>
     
      </View>
       
      {errorViewModalContent()}
      {errorViewModal && <View style={styles.overlay} />}

 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputView1: {
    width: "85%",
    padding: 5,
    paddingLeft: 0
  },
  imgehideshow:{
    width: 20,
    height: 20, 
    resizeMode:'contain' ,
    tintColor:'gray'               
},
  inputView2: {
    borderColor: '#C2C2C2',
    flexDirection: 'row',
    width: "85%",
    borderRadius: 10,
    borderWidth: 1,
    height: 50,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: 15
  },
  inputText: {
    height: 50,
    width: "85%",
    color: "black"
  },
  loginBtn: {
    width: "85%",
    backgroundColor: "#3E73E1",
    borderRadius: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    color: "white",
    fontFamily: 'Poppins-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    width: "80%",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    paddingTop: 20,
    color: 'black',
    fontSize: 25,
    marginBottom:10
  },
  modalMessage: {
    paddingBottom: 5,
    color: '#939393',
    fontSize: 18,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  modalButton: {
    width: 200,
    height: 50,
    backgroundColor: '#CEFF04',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  modalButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700'
  },
  errorText: {
    color: "red",
    fontFamily: 'Poppins-Medium',
    fontSize: 12
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for the desired transparency
  },
  emailIcon: {
    width: 16,
    height: 20,
    resizeMode: 'contain'
  }
});

export default ChangePasswordScreen;
