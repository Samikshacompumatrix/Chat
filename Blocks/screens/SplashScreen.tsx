import React, { useEffect, useRef, useState } from 'react';
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
  Modal,
  Animated,
  ImageBackground,
  StatusBar,
  Image
} from 'react-native';
import * as Progress from 'react-native-progress';
import { scale } from './Customstyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = (props: any) => {
  const [initialRouteName, setInitialRouteName] = useState(null);



    useEffect(() => {
        setTimeout(() => {
        //  props.navigation.navigate("Signin")
        }, 3000);
       
      },);
 



      const handlePress = async (number) => {
        const token = await AsyncStorage.getItem('token');
        console.log(token)

        if(token)
        {
          props.navigation.navigate("Home")

        }
        else{
          props.navigation.navigate("Signin")


        }

        console.log(`Pressed number: ${number}`);
      };
    
      const renderButton = (number) => (
        <TouchableOpacity key={number} style={styles.button} onPress={() => handlePress(number)}>
          <Text style={styles.buttonText}>{number}</Text>
        </TouchableOpacity>
      );
    

  return (
    <TouchableOpacity onPress={async ()=>{       
      const token = await AsyncStorage.getItem('token');
      console.log(token)

      if(token)
      {
        props.navigation.navigate("Home")

      }
      else{
        props.navigation.navigate("Signin")


      }
  }}>
                <StatusBar backgroundColor="#3E73E1" barStyle="dark-content" />


                

        <ImageBackground
        
        style={{width:"100%",height:"100%",alignItems:'center',justifyContent:'center'}}
        source={require("./Assets/Splash.png")}
        >


<Image
        
        style={{width:100,height:100,marginTop:scale(80)}}
        source={require("./Assets/login.png")}
        />
        <Progress.Bar progress={0.6} width={300} unfilledColor='#3E73E1' color='white' style={{marginTop:20}} borderColor='#3E73E1'height={10}/>

            <Text style={{paddingVertical:scale(10),color:'white',fontSize:20}}>40%</Text>


            <View style={styles.container2}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderButton)}
    </View>

  
        </ImageBackground>
     
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container1: {
    marginTop: (80),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: scale(10),
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
    marginBottom: scale(20),
  },
  codeInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  container2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
marginHorizontal:20,    
opacity:0.0,
    backgroundColor: '#3665d1', // Background color similar to the image
  },
  button: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    backgroundColor: '#3665d1', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Rounded corners
  },
  buttonText: {
    color: '#3665d1',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
