
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
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { scale } from './Customstyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

Icon.loadFont().then();

const ForwordmsgScreen = ({ route, navigation }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [isFocus, setIsFocus] = useState(true);
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [iscreateVisible, setIscreateVisible] = useState(false);
  const [ismore, setismore] = useState(false);
  const [SelectedContact, setSelectedContact] = useState([]);


  const [uploadedFile, setUploadedFile] = useState(null);


  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [Selectedgroup, setSelectedgroup] = useState([]);

  const [issend, setissend] = useState(true);


  useEffect(() => {
   

  getuserData()

    

    

  }, []);





 const getuserData = async () => {
  
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
  
    const formdata = new FormData();
formdata.append("access_token", token);
formdata.append("u_id", userId);

const requestOptions = {
  method: "POST",
  body: formdata,
  redirect: "follow"
};






  try {
    const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/get-user-grp-list", requestOptions);
    const result = await response.json();

    if (result.status === "success") {

      setUsers(result.data)
      setSelectedUsers([])
     

      console.log('Message sent successfully:', result);


    } else {
      console.log("Error sending message:", result);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  }

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
  const sendforwordMessage = async () => {
    console.log('Forwarding message:', route.params.forwordmsg, selectedUsers, ); // Logging forwarding details
  
    const forwardMessage = route.params.forwordmsg;

    const formattedMembers = selectedUsers.map(user => ({
      u_id: user?.uid
    }));

    const formattedgroups = Selectedgroup.map(user => ({
      group_id: user?.group_id
    }));


    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
  
    const formdata = new FormData();
    formdata.append("u_id", userId);
    formdata.append("access_token", token);
    formdata.append("sentBy", userId);
    if(selectedUsers.length > 0)
    {


      formdata.append("sentToUser", JSON.stringify(formattedMembers));

    }

    if(Selectedgroup.length > 0)
      {
  
  
        formdata.append("sentToGrp", JSON.stringify(formattedgroups));
  
      }
    formdata.append("text", forwardMessage.message);
    formdata.append("replyTo",'')

  
    // Add the file if it exists
    if (uploadedFile) {
      formdata.append("uploaded_file", {
        uri: uploadedFile?.uri,
        name: uploadedFile?.name,
        type: uploadedFile?.type,
      });
    } else {
      formdata.append("uploaded_file", '');
    }
  
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };


    console.log(formdata)
  
    try {
      const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/send-forward-messages", requestOptions);
      const result = await response.json();
  
      if (result.status === "success") {
       
        if (selectedUsers.length == 1 && Selectedgroup.length == 0) {

          console.log('single:', result);

                navigation.replace('singlechats', {
                  uid: selectedUsers[0]?.uid,
                  name: selectedUsers[0]?.name,
                  img: selectedUsers[0]?.img,
                  // Add other parameters as needed
                });
              }
              
              else {
                console.log('Message sent successfully:', result);

                navigation.goBack();
              }
        

  
      } else {
        console.log("Error sending message:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }


  
    // if ((forwardMessage.text?.trim() || forwardMessage.image || forwardMessage.audio || forwardMessage.video || forwardMessage.document) && selectedUsers.length > 0) {
    //   try {
    //     const newMessage = {
    //       text: forwardMessage.text || '',
    //       image: forwardMessage.image || '',
    //       audio: forwardMessage.audio || '',
    //       video: forwardMessage.video || '',
    //       document: forwardMessage.document || '',
    //       documentName: forwardMessage.documentName || '',
    //       sentBy: user.uid,
    //       createdAt: new Date(),
    //     };
  
    //     const promises = selectedUsers.map(async (SelectedContact) => {
    //       const docid = user.uid > SelectedContact.uid
    //         ? `${SelectedContact.uid}-${user.uid}`
    //         : `${user.uid}-${SelectedContact.uid}`;
  
    //       await firestore()
    //         .collection('Chats')
    //         .doc(docid)
    //         .collection('messages')
    //         .add({
    //           ...newMessage,
    //           createdAt: firestore.FieldValue.serverTimestamp(),
    //         });
  
    //       console.log(`Message sent successfully to ${SelectedContact.name}`);
    //     });
  
    //     await Promise.all(promises); // Wait for all messages to be sent
  
    //     setSelectedContact(null); // Reset selectedContact after sending
  
    //     // Navigate to the chat screen of the first selected user
    //     if (selectedUsers.length <= 1) {
    //       navigation.replace('singlechats', {
    //         uid: selectedUsers[0].uid,
    //         name: selectedUsers[0].name,
    //         // Add other parameters as needed
    //       });
    //     } else {
    //       navigation.goBack();
    //     }
  
    //   } catch (error) {
    //     console.error('Error sending message:', error);
    //   }
    // } else {
    //   console.warn('Cannot send message: Text is empty or no users selected.');
    // }
  };
  
  
  
  const onSelectContact = (contact) => {
    console.log(selectedUsers,"mycontact")
    setSelectedContact(selectedUsers);
   // sendforwordMessage()
  };

  const handlesend = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        style={{ opacity: 10 }}
        visible={issend}

      >
        <TouchableWithoutFeedback >
          <View style={styles.modalContainer3}>
            <TouchableWithoutFeedback>
              <View style={styles.profileDataModel2}>
<View 
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10,  alignItems: 'center' }}
>


<TouchableOpacity

style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, }}

                  onPress={() => {
                    sendforwordMessage();
                    // this.setState({flag:"1",ismore:false})
                  }}>
                 { selectedUsers?.map(user => {
                    <Text>{user?.name}</Text>
                   })}


                </TouchableOpacity>
             
                <TouchableOpacity

style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, }}

                  onPress={() => {
                    sendforwordMessage();
                    // this.setState({flag:"1",ismore:false})
                  }}>
              <Image source={require('./Assets/send.png')} style={{ width: 40, height: 40, alignSelf: 'center' }} resizeMode='contain' />


                </TouchableOpacity>
             
              </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }


 

  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() => {
    // navigation.navigate('singlechats', { name: item.name, uid: item.uid })}
    
     toggleUserSelection(item)
    }}
    
    >
      <View style={[styles.card,( selectedUsers.find(u => u.uid === item.uid) || Selectedgroup.find(u => u.group_id === item.group_id)) && styles.selectedCard]}>
      <Image style={styles.userImageST} source={{uri:item.list_is == "group"?item.group_image:item.profile_image}} resizeMode= 'cover'/>
      <View style={styles.textArea}>
          <Text style={styles.nameText}>{item.list_is == "group"?item.group_name:item.name}</Text>
        </View>
        <View style={styles.msgInfo}>

        {( selectedUsers.find(u => u.uid === item.uid) || Selectedgroup.find(u => u.group_id === item.group_id))  ? 
          <Image style={{...styles.userImageST,width:30,height:30}} source={require('./Assets/checked.png')} />
:<Image style={{...styles.userImageST,width:30,height:30}} source={require('./Assets/unchecked.png')} />
        }
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGroup = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('GroupChatScreen', { name: item?.name, groupId: item?.id, currentUser: currentUser, displayName: user?.name })}>
      <View style={styles.card}>
        <Image style={styles.userImageST} source={require('./Assets/user.png')} />
        <View style={styles.textArea}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.msgContent}>{item.users?.map(user => user.name).join(', ')}</Text>
        </View>
        <View style={styles.msgInfo}>
          <Text style={styles.msgTime}>{item.messageTime || '12:45 PM'}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>5</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const toggleUserSelection = (user) => {

if(user.list_is == "user")
{

    if (selectedUsers.find(u => u.uid === user.uid)) {
      setSelectedUsers(selectedUsers.filter(u => u.uid !== user.uid));
    } else {
      setSelectedUsers([...selectedUsers, { uid: user.uid, name: user.name ,img:user.profile_image}]);
    }

    console.log(selectedUsers,"myyy")
    onSelectContact(user)

  }

  else{


    if (Selectedgroup.find(u => u.uid === user.group_id)) {
      setSelectedgroup(Selectedgroup.filter(u => u.uid !== user.group_id));
    } else {
      setSelectedgroup([...Selectedgroup, { group_id: user.group_id, name: user.group_name }]);
    }

    console.log(Selectedgroup,"myyy")


  }


  };

  const renderSelectableUser = ({ item }) => (
    <TouchableOpacity onPress={() => toggleUserSelection(item)}>
      <View style={[styles.card,( selectedUsers.find(u => u.uid === item.uid) || Selectedgroup.find(u => u.group_id === item.group_id)) && styles.selectedCard]}>
        <Image style={styles.userImageST} source={require('./Assets/user.png')} />
        <View style={styles.textArea}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.msgContent}>{item.email}</Text>
        </View>
      {( selectedUsers.find(u => u.uid === item.uid) || Selectedgroup.find(u => u.group_id === item.group_id))  ? 
<Image style={{...styles.userImageST,width:30,height:30}} source={require('./Assets/checked.png')} />
:<Image style={{...styles.userImageST,width:30,height:30}} source={require('./Assets/unchecked.png')} />
        }

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 30 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Text style={{ ...styles.nameText, marginHorizontal: 20, fontSize: 20, marginTop: 10, color: 'black' }}>Forward to...</Text>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10 }}>
          <Image source={require('./Assets/search.png')} style={{ ...styles.backIcon, marginRight: 20 }} />
          <TouchableOpacity

style={{  marginHorizontal: 10, }}

                  onPress={() => {
                    sendforwordMessage();
                    // this.setState({flag:"1",ismore:false})
                  }}>
              <Image source={require('./Assets/send.png')} style={{ width: 40, height: 40, alignSelf: 'center',marginTop:-10 }} resizeMode='contain' />


                </TouchableOpacity>


          

        </View>

      </View>
    

      <View style={styles.listContainer}>
        <View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}

          />

       
        </View>
        
      </View>
     

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
    fontSize: 16,
    marginRight: 5,
    color: 'black'
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
  modalContainer3: {
    top:0,
    width: "100%",
    height: "100%",
    alignItems:'center',
    justifyContent: 'flex-end'


  },
  profileDataModel2: {
    width: "92%",
    bottom:scale(10),
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


export default ForwordmsgScreen;
