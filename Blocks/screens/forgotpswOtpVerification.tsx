import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal, Animated, Easing } from 'react-native';
// import { CheckEmail, CheckOtp } from './APiConatiner';
import { showMessageAlert } from '../../Components/styles/Utils';
import { scale } from './Customstyles';

const forgotpswOtpVerification = (props: any) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = React.useState(false);
  const [successViewModal, setSuccessViewModal] = React.useState(false);

  const inputRefs = useRef([]);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (successViewModal) {
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => setAnimationDone(true));
    }
  }, [rotateAnim, successViewModal]);

  const handleInputChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendCode = () => {
    handelResend();
  };

  async function handelResend() {
    // try {
    //   setLoading(true);
    //   const response = await CheckEmail(props.route.params.email);
    //   setLoading(false);
    //   console.log('response', JSON.stringify(response));
  
    //   if (response.status === 'success') {
    //     Alert.alert('Code Resent', 'A new code has been sent to your number.');
    //     setTimer(30);
    //   } else {
    //     showMessageAlert(response.message || 'verification failed');
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   console.error('error', error);
    //   showMessageAlert('An error occurred');
    // }
  }

  const errorViewModalContent = () => {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const translateX = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0], // Keep this value the same as we are rotating
    });

    const translateY = rotateAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -50, 0], // Circular motion
    });

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          style={{ opacity: 10 }}
          visible={successViewModal}
          onRequestClose={() => setSuccessViewModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Animated.Image
                source={require('./Assets/verifi.png')}
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'contain',
                  marginTop: 20,
                  transform: [
                    { rotate: spin },
                    { translateX: translateX },
                    { translateY: translateY },
                  ],
                }}
              />
              <Text style={styles.modalTitle}>Verified!</Text>
              <Text style={styles.modalMessage}>You have successfully verified</Text>
              <Text style={styles.modalMessage}>the account.</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>{ setSuccessViewModal(false)

                  props.navigation.navigate("ChangePasswordScreen")
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

  async function handelOtpVerify(email ,otp) {




      const formdata = new FormData();
  formdata.append("email", email);
  formdata.append("otp", otp);

  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
  };
  
  try {
    const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/get-email-verification", requestOptions)
  
    const result = await response.json();
    if (result.status === "success") {
     
      props.navigation.navigate("ChangePasswordScreen")
    } else if (result.error_code === "404") {
      console.log("Error 404", result);
    }
  } catch (error) {
    console.error("Error:", error);
    Alert.alert('Email or Password incorrect');
  
  
      // Implement your API call logic here
    };
  
  }

  const sendVerificationApi = async () => {


    const formdata = new FormData();
formdata.append("email", props?.route?.params?.email,);

const requestOptions = {
  method: "POST",
  body: formdata,
  redirect: "follow"
};

try {
  const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/check-email-id", requestOptions)

  const result = await response.json();
  if (result.status === "success") {
   
    console.log(result)
    Alert.alert("Otp send successfully")
    // props.navigation.navigate("forgotpswOtpVerification",{email:email})
  } else if (result.error_code === "404") {
    console.log("Error 404", result);
  }
} catch (error) {
  console.error("Error:", error);
  Alert.alert('Error...!');
}

    // Implement your API call logic here
  };






  const handleKeyPress = ({ nativeEvent: { key: keyValue } }, index) => {
    if (keyValue === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    console.log('Verification Code:', verificationCode);

    handelOtpVerify(props?.route?.params?.email, verificationCode);
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ marginHorizontal: 20, marginTop: 50 }}
       onPress={()=>{props.navigation.goBack()}}
       >
        <Image source={require('./Assets/back.png')} style={{ width: 30, height: 20, resizeMode: 'contain' }} />
      </TouchableOpacity>
      <View style={styles.container1}>
        <Text style={styles.title}>Email Verification</Text>
        <Text style={styles.instructions}>Please enter the 4 digit code sent to your email</Text>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              value={digit}
              onChangeText={(value) => handleInputChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          ))}
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
          {timer > 0 ? (
            <Text style={styles.timerText}>You can resend the code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={sendVerificationApi} style={styles.resendContainer}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.verifyButton, { backgroundColor: isCodeComplete ? '#3E73E1' : '#D3D3D3' }]}
          onPress={handleVerify}
          disabled={!isCodeComplete}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
      {errorViewModalContent()}
      {successViewModal && <View style={styles.overlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container1: {
    marginTop: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 5,
  },
  resendCode: {
    color: '#1E90FF',
    marginBottom: 20,
  },
  verifyButton: {
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  timerText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  resendContainer: {
    height: 50,
    width: 140,
    borderWidth: 1,
    borderColor: '#3E73E1',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 16,
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: "80%",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    paddingTop: 20,
    color: 'black',
    fontSize: 25,
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  modalMessage: {
    paddingBottom: 5,
    color: '#939393',
    fontSize: 16,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  modalButton: {
    width: 200,
    height: 50,
    backgroundColor: '#FF9D86',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default forgotpswOtpVerification;
