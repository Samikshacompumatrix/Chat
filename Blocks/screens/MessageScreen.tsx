import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  View,
  Modal,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { height, scale } from './Customstyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';

Icon.loadFont().then();

const MessageScreen = ({ user, navigation }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [isFocus, setIsFocus] = useState(true);
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [iscreateVisible, setIscreateVisible] = useState(false);
  const [ismore, setismore] = useState(false);

  const [profileimg,setprofileImage] = useState('');



  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);




  useEffect(() => {
    console.log(user,"gahakj")

    const getUsers = async () => {

      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
  
      const formdata = new FormData();
formdata.append("access_token", token);
formdata.append("u_id", userId);

const requestOptions = {
  method: "POST",
  body: formdata,
  redirect: "follow"
};

fetch("https://chat-app-backend-laravel.medks-sz.com/api/get-user-list", requestOptions)
.then(async(res)=> {
  let response=await res.json()
  console.log("response>>add",response)
  if(response.status == "success")
  {
    setUsers(response.data);


     // navigation.navigate("SatsangLogin")
 console.log("Register success",response)



  }

  // if (response.status === 'error') { // Adjust according to your actual response structure
  //     console.log('response.data.data', response);
  //     response.message?.email &&   showMessageAlert(response.message?.email[0])||
    
  //     response.message?.mobile_no &&   showMessageAlert(response.message?.mobile_no[0]) ||

  //     response.message?.password &&   showMessageAlert(response.message?.password[0]);

      
      


  //   }
  else if(response.error_code == "404")
  {
    console.log("490 imge",response)

   

  }

  
 })
.catch(error => {
  console.log("erroradd>>",error)

})
      
    };

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
          console.log(result.data,"my")

        } catch (error) {
          console.error(error);
        }
      }
      console.log(user,"gahakj")
    };
  
    // const getGroups = async () => {
    //   const querySnap = await firestore().collection('groups').get();
    //   const allGroups = await Promise.all(querySnap.docs.map(async docSnap => {
    //     const groupData = docSnap.data();
    //     const messagesSnap = await firestore().collection('messages')
    //       .where('groupId', '==', docSnap.id)
    //       .where('isRead', '==', false)
    //       .get();
    //     groupData.unreadCount = messagesSnap.size;
    //     return { id: docSnap.id, ...groupData };
    //   }));
    //   setGroups(allGroups);
    // };

    getUsers();
   getGroups();
    getCurrentUser();

  }, []);

  const getGroups = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append("access_token", token);
    formdata.append("u_id",userId);
    
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    
    fetch("https://chat-app-backend-laravel.medks-sz.com/api/get-group-list", requestOptions)
    .then(async(res)=> {
      let response=await res.json()
      console.log("response>>add",response)
      if(response.status == "success")
      {
        setGroups(response.data);

      
         // navigation.navigate("SatsangLogin")
      console.log("Register success",response)
      
      
      
      }
      
      // if (response.status === 'error') { // Adjust according to your actual response structure
      //     console.log('response.data.data', response);
      //     response.message?.email &&   showMessageAlert(response.message?.email[0])||
        
      //     response.message?.mobile_no &&   showMessageAlert(response.message?.mobile_no[0]) ||
      
      //     response.message?.password &&   showMessageAlert(response.message?.password[0]);
      
          
          
      
      
      //   }
      else if(response.error_code == "404")
      {
        console.log("490 imge",response)
      
       
      
      }
      
      
      })
      .catch(error => {
      console.log("erroradd>>",error)
      
      })
  };
  const createGroup = async () => {
    console.log(selectedUsers, profileimg);
    
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
  
    // Map selectedUsers to the required format
    const formattedMembers = selectedUsers.map(user => ({
      u_id: user.uid
    }));
  
    const formdata = new FormData();
    formdata.append("access_token", token);
    formdata.append("u_id", userId);
    formdata.append("group_name", newGroupName);
    formdata.append("members", JSON.stringify(formattedMembers));
    formdata.append("group_image", {
      uri: profileimg,
      name: "image.jpg",
      type: "image/jpeg",
    });
  
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
  
    console.log(formdata);
    fetch("https://chat-app-backend-laravel.medks-sz.com/api/create-group", requestOptions)
      .then(async (res) => {
        const responseText = await res.text();
        console.log("responseText>>", responseText);
        try {
          const response = JSON.parse(responseText);
          console.log("response>>add", response);
  
          if (response.status === "success") {
            setNewGroupName('');
            setSelectedUsers([]);
            setIsModalVisible(false);
            setIscreateVisible(false);
            navigation.replace("Home");
            getGroups(); // refresh groups
          } else if (response.error_code === "404") {
            console.log("490 image", response);
          } else {
            console.error("Unexpected response format", response);
          }
        } catch (error) {
          console.error("JSON Parse Error:", error, "Response Text:", responseText);
        }
      })
      .catch(error => {
        console.log("erroradd>>", error);
      });
  };


  const unreadcount = async (id:any) => {
    console.log(selectedUsers, profileimg);
    
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
  
 
    const formdata = new FormData();
    formdata.append("access_token", token);
    formdata.append("u_id", userId);
    formdata.append("sentTo", id);
    formdata.append("sentBy", userId);
  
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
  
    console.log(formdata);
    fetch("https://chat-app-backend-laravel.medks-sz.com/api/change-unread-msg-count", requestOptions)
      .then(async (res) => {
        const responseText = await res.text();
        console.log("responseText>>", responseText);
        try {
          const response = JSON.parse(responseText);
          console.log("response>>add", response);
  
          if (response.status === "success") {
            setNewGroupName('');
         
          } else if (response.error_code === "404") {
            console.log("490 image", response);
          } else {
            console.error("Unexpected response format", response);
          }
        } catch (error) {
          console.error("JSON Parse Error:", error, "Response Text:", responseText);
        }
      })
      .catch(error => {
        console.log("erroradd>>", error);
      });
  };

  const handelday1 = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        style={{ opacity: 10 }}
        visible={ismore}
        onRequestClose={() => setismore(false)}

      >
        <TouchableWithoutFeedback onPress={() => setismore(false)}>
          <View style={styles.modalContainer2}>
            <TouchableWithoutFeedback>
              <View style={styles.profileDataModel}>

                <TouchableOpacity

                  style={{ flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 20,  alignItems: 'center' }}

                  onPress={() => {
                    navigation.navigate("ProfileScreen")
                    setismore(false)
                    // this.setState({flag:"1",ismore:false})
                  }}>
                  <Image source={require("./Assets/info.png")} style={{ width: 20, height: 20, }} />


                  <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: "black",paddingHorizontal:10 }}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 20, marginTop: 20, alignItems: 'center' }}




                  onPress={() => {
                    setIsModalVisible(true)
                    setismore(false)
                    setSelectedUsers([])
                    setprofileImage('')

                    // this.setState({flag:"2",isnotification:false})
                  }}>


                  <Image source={require("./Assets/group.png")} style={{ width: 20, height: 20, }} />



                  <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: "black" ,paddingHorizontal:10}}>New Group</Text>
                </TouchableOpacity>
                <TouchableOpacity

                  style={{ flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 20, marginTop: 20, alignItems: 'center' }}

                  onPress={() => {
                    navigation.navigate("BookmarkMessageScreen")
                    setismore(false)

                    // this.setState({flag:"3",isnotification:false})
                  }}>
                  <Image source={require("./Assets/bookmark.png")} style={{ width: 20, height: 20, }} />



                  <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: "black" ,paddingHorizontal:10}}>Bookmark Message</Text>
                </TouchableOpacity>
                <TouchableOpacity

                  style={{ flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 20, marginTop: 20, alignItems: 'center' }}

                  onPress={() => {

                    navigation.navigate("OtpVerification")
                    setismore(false)

                    // this.setState({flag:"3",isnotification:false})
                  }}>
                  <Image source={require("./Assets/verifi.png")} style={{ width: 20, height: 20, }} />

                  <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: "black" ,paddingHorizontal:10}}>Set Verification Pin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 20, marginTop: 20, alignItems: 'center' }}
                  onPress={() => {

                    // this.setState({flag:"3",isnotification:false})
                  }}>
                  <Image source={require("./Assets/clear.png")} style={{ width: 20, height: 20, }} />

                  <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: "black",paddingHorizontal:10 }}>Clear All Message</Text>

                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() =>{
      unreadcount(item.uid)
      
      navigation.navigate('singlechats', { name: item.name, uid: item.uid ,img:item.image})}
    }
    
    >
      <View style={styles.card}>
        
        <Image style={styles.userImageST} source={{uri:item.image}} resizeMode='contain'/>
        <View style={styles.textArea}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.msgContent}>{item.last_msg}</Text>
        </View>
        <View style={styles.msgInfo}>
          <Text style={styles.msgTime}>{item.time || '12:45 PM'}</Text>
          {item.unread_msg_count > 0 ?
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{ item.unread_msg_count}</Text>
          </View>:null}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGroup = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('GroupChatScreen', { name: item.group_name, groupId: item.group_id, currentUser: currentUser,img:item.group_img })}>
      <View style={styles.card}>
      <Image style={styles.userImageST} source={{uri:item.group_img}} resizeMode='contain'/>
      <View style={styles.textArea}>
          <Text style={styles.nameText}>{item.group_name}</Text>
        </View>
        {/* <View style={styles.msgInfo}>
          <Text style={styles.msgTime}>{item.date_time || '12:45 PM'}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>5</Text>
          </View>
        </View> */}
      </View>
    </TouchableOpacity>
  );
  async function  showCameraPicker  () 
    {
        try {
          ImageCropPicker.openPicker({
            mediaType: "photo",
            compressImageQuality: 0.3,
            includeBase64: true,
            cropping: true,
          }).then(async (image) => {
            console.log("@@@ Selected Image Item =============", image);
          
            setprofileImage(image.path)
    
    
            
          });
        } catch (e) {
          console.log("@@@ Error opening camera ==========", e);
        }
      };
  const toggleUserSelection = (user) => {
    if (selectedUsers.find(u => u.uid === user.uid)) {
      setSelectedUsers(selectedUsers.filter(u => u.uid !== user.uid));
    } else {
      setSelectedUsers([...selectedUsers, { uid: user.uid, name: user.name }]);
    }
  };

  const renderSelectableUser = ({ item }) => (
    <TouchableOpacity onPress={() => toggleUserSelection(item)}>
      <View style={[styles.card, selectedUsers.find(u => u.uid === item.uid) && styles.selectedCard]}>
      <Image style={styles.userImageST} source={{uri:item.image}} resizeMode='contain'/>
      <View style={styles.textArea}>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
      {selectedUsers.find(u => u.uid === item.uid) ? 
<Image style={{...styles.userImageST,width:30,height:30}} source={require('./Assets/checked.png')} />
:<Image style={{...styles.userImageST,width:30,height:30}} source={require('./Assets/unchecked.png')} />
        }

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
            <StatusBar backgroundColor={'white'} barStyle="dark-content" />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 30 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Image source={{uri:currentUser?.profile_img}} style={{   width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth:5}} resizeMode='cover' />
          <Text style={{ ...styles.nameText, marginHorizontal: 20, fontSize: 20, marginTop: 10, color: 'black' }}>Chat</Text>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10 }}>
          <Image source={require('./Assets/search.png')} style={{ ...styles.backIcon, marginRight: 20 }} />
          <TouchableOpacity onPress={() => { setismore(!ismore) }}>
            <Image source={require('./Assets/more.png')} resizeMode='contain' style={styles.backIcon} />
          </TouchableOpacity>

        </View>

      </View>
      <View style={styles.header}>



        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setIsFocus(true)}
            style={[styles.tab, isFocus && styles.activeTab]}
          >
            <Text style={[styles.tabText, isFocus && styles.activeTabText]}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFocus(false)}
            style={[styles.tab, !isFocus && styles.activeTab]}
          >
            <Text style={[styles.tabText, !isFocus && styles.activeTabText]}>Group</Text>
          </TouchableOpacity>
        </View>

      </View>

      <View style={styles.listContainer}>
        {isFocus ?
          <FlatList
            data={users}
            keyExtractor={(item) => item.uid}
            renderItem={renderUser}
          />
          :
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={renderGroup}
          />
        }
      </View>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 30 }}>

            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.backButton}>
              <Image source={require('./Assets/back.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={{ ...styles.title, color: 'black' }}>Create Group</Text>
          </View>
          <View style={{ ...styles.input, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 30, alignItems: 'center', backgroundColor: '#D5E3FF', borderRadius: 25, width: "100%", borderColor: '#D5E3FF' }}>
            <Image source={require('./Assets/search.png')} style={styles.backIcon} />


            <TextInput

              placeholder="Search Member"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
          </View>
              
          <View style={styles.tagContainer}>
      {selectedUsers?.map(user => (
        <View key={user.uid} style={styles.tag}>
          <Text style={styles.tagText}>{user.name}</Text>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('./Assets/remove.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />
          </TouchableOpacity>
        </View>
      ))}
    </View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.uid}
            renderItem={renderSelectableUser}
          />
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30, bottom: 20 }}>

            <TouchableOpacity style={styles.createButton} onPress={() => { setIscreateVisible(true); setIsModalVisible(false) }}>
              <Text style={styles.createButtonText}>Create Groupchat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={iscreateVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 30 }}>

            <TouchableOpacity onPress={() => setIscreateVisible(false)} style={styles.backButton}>
              <Image source={require('./Assets/back.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={{ ...styles.title, color: 'black' }}>Create Group</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
          <TouchableOpacity style={styles.imageUpload}  onPress={() =>{showCameraPicker()}}>
              {profileimg != '' ?
                            <Image source={{uri:profileimg}} style={{width:90,height:90}} resizeMode='contain'/>:

              <Image source={require('./Assets/camera.png')} style={styles.cameraIcon} />
}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              placeholderTextColor="#A9A9A9"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            
            <View style={styles.tagContainer}>
      {selectedUsers.map(user => (
        <View key={user.uid} style={styles.tag}>
          <Text style={styles.tagText}>{user.name}</Text>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('./Assets/remove.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />
          </TouchableOpacity>
        </View>
      ))}
    </View>
          </View>

        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30, bottom: scale(30) }}>

        <TouchableOpacity style={{...styles.createButton,backgroundColor:profileimg == '' || newGroupName == ''?'gray':'#3B6EDB'}} onPress={() => { createGroup() }}
          
          disabled={profileimg == '' ||  newGroupName == ""}
          >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
            </View>
      </Modal>

      {handelday1()}
      {ismore && <View style={styles.overlay} />}

    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    width: "100%",
    backgroundColor: '#D5E3FF',
    borderRadius: 25,
    height: 50,
  },
  tab: {
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#3A6DDA',
    width: '50%',
  },
  selectionIndicator: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  selectedIcon: {
    fontSize: 16,
    color: 'white',
  },

  tabText: {
    paddingHorizontal: 20,
    color: '#636060',
  },
  activeTabText: {
    color: 'white',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 30
  },
  createGroupButton: {
    marginTop: 10,
    backgroundColor: '#3A6DDA',
    padding: 10,
    borderRadius: 20,
  },
  createGroupButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 30,
   // elevation: 1,
  },
  selectedCard: {
    backgroundColor: '#D3E3FF',
  },
  userImageST: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textArea: {
    flex: 1,
    paddingHorizontal: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  msgContent: {
    color: '#888',
  },
  msgInfo: {
    alignItems: 'flex-end',
  },
  msgTime: {
    fontSize: 12,
    color: '#888',
  },
  badge: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  onlineStatus: {
    fontSize: 12,
    color: '#007BFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 20

  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: "100%"
  },
  backButton: {

  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 60
  },
  imageUpload: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cameraIcon: {
    width: 50,
    height: 50,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#E6E6E6',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for the desired transparency
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    marginRight: 5,
    color: 'black',
  },
  removeTag: {
    fontSize: 16,
    color: 'black',
  },
  createButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#3B6EDB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    height: 200,  // Adjust the height as needed
    backgroundColor: 'white',
    padding: 10,
    marginRight: 20

  },
  modalContainer2: {
    top: 80,
    bottom: 0,
    right: scale(20),
    width: "100%",
    height: "100%",
    alignItems: 'flex-end',
    justifyContent: 'flex-start'

  },
  profileDataModel: {
    width: 250,
    borderRadius: 20,
    // borderTopLeftRadius: Scale(20),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    paddingVertical:30

    // maxHeight: Scale(500),
    // paddingBottom:20
  },

});

export default MessageScreen;
