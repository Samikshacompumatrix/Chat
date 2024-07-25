import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import {scale} from './Customstyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';

const ProfileScreen = ({ navigation }) => {

  const [currentUser, setCurrentUser] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [onedit, setOnEdit] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  const textInputRef = useRef(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (onedit && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [onedit]);



  const handleBackButtonClick = async () => {
    navigation.replace("Home")
       return true;
     };
     useEffect(() => {
      // Add event listener when the component mounts
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    
      // Cleanup function to remove event listener when the component unmounts
      return () => {
        console.log('componentWillUnmount');
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
      };
    }, []); // Empty dependency array ensures this effect is only run on mount and unmount
    

  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');

    if (token) {
      const formdata = new FormData();
      formdata.append("u_id", userId);
      formdata.append("access_token", token);

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      try {
        const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/get-user-details", requestOptions);
        const result = await response.json();
        setCurrentUser(result.data);
        setName(result.data.name);
        setProfileImage(result.data.profile_img);
        console.log(result.data, "my");
      } catch (error) {
        console.error(error);
      }
    }
    console.log(user, "gahakj");
  };

  const setProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    const formdata = new FormData();
    formdata.append("u_id", userId);
    formdata.append("access_token", token);
    formdata.append("name", name);
    formdata.append("email", currentUser.email);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://chat-app-backend-laravel.medks-sz.com/api/edit-user-profile", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  async function handleSaveImage(img) {
    console.log(profileImage);
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');

    const formdata = new FormData();
    formdata.append("u_id", userId);
    formdata.append("access_token", token);
    formdata.append("profile_img", {
      uri: img,
      name: "image.jpg",
      type: "image/jpeg",
    });

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/edit-profile-image", requestOptions);
      const result = await response.json();

      if (result.status === "success") {
        console.log('Profile image updated successfully:', result);
        getCurrentUser(); // Re-fetch the user details
      } else {
        console.log("Error updating profile image:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function showCameraPicker() {
    try {
      ImageCropPicker.openPicker({
        mediaType: "photo",
        compressImageQuality: 0.3,
        includeBase64: true,
        cropping: true,
      }).then(async (image) => {
        console.log("@@@ Selected Image Item =============", image);
        setProfileImage(image.path);
        handleSaveImage(image.path);
      });
    } catch (e) {
      console.log("@@@ Error opening camera ==========", e);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { navigation.replace("Home") }}>
            <Image source={require('./Assets/back.png')} style={{ ...styles.cameraIcon, width: 30 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.profileContainer}>
          {profileImage != '' ?
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            /> : <Image
              source={require("./Assets/noimg.png")}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderColor: '#3260CC',
                borderWidth: 5
              }} />
          }
          <TouchableOpacity style={styles.cameraButton}
            onPress={() => { showCameraPicker() }}
          >
            <Image source={require('./Assets/camera.png')} style={{ ...styles.cameraIcon, tintColor: 'white' }} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputLabelContainer}>
            <Image source={{ uri: currentUser.profile_img }} style={styles.inputIcon} />
            <Text style={styles.inputLabel}>Name</Text>
          </View>
          <View style={styles.inputFieldContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.inputField}
              value={name}
              placeholder='Name'
              editable={onedit}
              onChangeText={text => setName(text)}
            />
            <TouchableOpacity onPress={() => {
              setOnEdit(true);
            }}>
              <Image source={require('./Assets/edit.png')} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ flex: 0, bottom: scale(50) }}>
        <TouchableOpacity style={styles.saveButton}
          onPress={() => { setProfile() }}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black'
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#3260CC',
    borderWidth: 5
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: scale(120),
    backgroundColor: '#3A6DDA',
    borderRadius: 20,
    padding: scale(5),
  },
  cameraIcon: {
    width: 20,
    height: 20,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 20
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  inputLabel: {
    fontSize: 16,
    color: '#888',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: scale(10)
  },
  inputField: {
    fontSize: 16,
    color: '#000',
    marginLeft: 20,
    marginTop: -10
  },
  editIcon: {
    width: 30,
    height: 30,
    marginTop: -40
  },
  saveButton: {
    backgroundColor: '#3A6DDA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
