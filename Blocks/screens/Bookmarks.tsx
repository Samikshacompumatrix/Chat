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

const BookmarkMessageScreen = ({  navigation }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [isFocus, setIsFocus] = useState(true);
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [iscreateVisible, setIscreateVisible] = useState(false);
  const [ismore, setismore] = useState(false);

  

  
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  useEffect(() => {

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

fetch("https://chat-app-backend-laravel.medks-sz.com/api/get-bookmark-list", requestOptions)
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
    getCurrentUser();

  }, []);
  

 
  const handelday1 = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={ismore}
        onRequestClose={() => setismore(false)} // For Android back button
      >
        <TouchableWithoutFeedback onPress={()=>{setismore(false)}}>
          <View style={styles.modalContainer2}>
            <View style={styles.profileDataModel}>

           
              
              <TouchableOpacity 
                                style={{ flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 10, alignItems: 'center' }}

              
              onPress={() => {
                
                // this.setState({flag:"3",isnotification:false})
              }}>

<Image source={require("./Assets/clear.png")} style={{ width: 20, height: 20, }} />

                <Text style={{ fontSize: 16, padding: 10, fontFamily: 'Poppins-Bold', color: "black" ,paddingVertical:10}}>Remove  all bookmark</Text>
              
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  
  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() =>{
    //  navigation.navigate('singlechats', { name: item.name, uid: item.uid })
    
    }}
     >
      <View style={styles.card}>
      <Image style={styles.userImageST} source={{uri:item.bookmark_type == "single_chat"?item.sender_image:item.group_u_image}} resizeMode='cover'/>
<View style={styles.textArea}>
          <Text style={styles.nameText}>{item.message}</Text>
          <Text style={styles.nameText}>{item.bookmark_type == "single_chat"? item.sender_name:item.group_name}</Text>

        </View>
        <View style={styles.msgInfo}>
          <Text style={styles.msgTime}>{item.messageTime || '12:45 PM'}</Text>
          
        </View>
      </View>
      <Text style={{...styles.msgTime,textAlign:'right',fontWeight:'700'}}>{item.user_name || 'me'}</Text>

      <View style={{width:"100%",height:1,backgroundColor:'#C3C3C3',marginTop:10}}></View>
    </TouchableOpacity>
  );

  const renderGroup = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('GroupChatScreen', { name: item.name, groupId: item.id, currentUser: currentUser, displayName: user.name })}>
      <View style={styles.card}>
      <Image style={styles.userImageST} source={require('./Assets/user.png')} />
      <View style={styles.textArea}>
          <Text style={styles.nameText}>{item.bookmark_type == "single_chat" ?item.name:item.group_name}</Text>
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
    if (selectedUsers.find(u => u.uid === user.uid)) {
      setSelectedUsers(selectedUsers.filter(u => u.uid !== user.uid));
    } else {
      setSelectedUsers([...selectedUsers, { uid: user.uid, name: user.name }]);
    }
  };

  const renderSelectableUser = ({ item }) => (
    <TouchableOpacity onPress={() => toggleUserSelection(item)}>
      <View style={[styles.card, selectedUsers.find(u => u.uid === item.uid) && styles.selectedCard]}>
      <Image style={styles.userImageST} source={require('./Assets/user.png')} />
      <View style={styles.textArea}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.msgContent}>{item.email}</Text>
        </View>
        <View style={{...styles.selectionIndicator,backgroundColor:selectedUsers.find(u => u.uid === item.uid) ?'#3E73E1':'#f7f7f7'}}>
          {selectedUsers.find(u => u.uid === item.uid) ? <Text style={styles.selectedIcon}>✔️</Text> : <View style={styles.unselectedCircle} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:10,marginTop:30}}>

<View style={{flexDirection:'row',justifyContent:'flex-start'}}>
    <TouchableOpacity onPress={()=>{navigation.goBack()}}>
<Image source={require('./Assets/back.png')} style={{width:25,height:25}} resizeMode='contain'/>
</TouchableOpacity>
<Text style={{...styles.nameText,marginHorizontal:50,fontSize:20,color:'black'}}>Bookmark Message</Text>

</View>
<View style={{flexDirection:'row',justifyContent:'flex-start',marginTop:10}}>
<TouchableOpacity onPress={()=>{setismore(!ismore)}}>
<Image source={require('./Assets/more.png')} resizeMode='contain' style={styles.backIcon} />
</TouchableOpacity>

</View>

</View>
      <View style={styles.header}>


      
       
      </View>
      <View style={{width:"100%",height:1,backgroundColor:'#E3E3E3',marginTop:20}}>

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
        <View style={{flexDirection:'row' ,  alignItems:'center',justifyContent:'flex-start',marginTop:30}}>

<TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.backButton}>
  <Image source={require('./Assets/back.png')} style={styles.backIcon} />
</TouchableOpacity>
<Text style={{...styles.title,color:'black'}}>Create Group</Text>
</View>
<View style={{...styles.input,flexDirection:'row',justifyContent:'flex-start',marginTop:30,alignItems:'center',backgroundColor:'#D5E3FF',borderRadius:25,width:"100%",borderColor:'#D5E3FF'}}>
<Image source={require('./Assets/search.png')} style={styles.backIcon} />


          <TextInput
            
            placeholder="Search Member"
            value={newGroupName}
            onChangeText={setNewGroupName}
          />
                      </View>
                      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Somia David</Text>
          <TouchableOpacity>
            <Text style={styles.removeTag}>✖</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Olivia Smith</Text>
          <TouchableOpacity>
            <Text style={styles.removeTag}>✖</Text>
          </TouchableOpacity>
        </View>
      </View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.uid}
            renderItem={renderSelectableUser}
          />
          <View style={{alignItems:'center',justifyContent:'center',marginTop:30,bottom:20}}>

             <TouchableOpacity style={styles.createButton}onPress={()=>{setIscreateVisible(true) ;setIsModalVisible(false)}}>
        <Text style={styles.createButtonText}>Create Groupchat</Text>
      </TouchableOpacity>
      </View>
        </View>
      </Modal>

      <Modal visible={iscreateVisible} animationType="slide">
        <View style={styles.modalContainer}>
        <View style={{flexDirection:'row' ,  alignItems:'center',justifyContent:'flex-start',marginTop:30}}>

      <TouchableOpacity onPress={() => setIscreateVisible(false)} style={styles.backButton}>
        <Image source={require('./Assets/back.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={{...styles.title,color:'black'}}>Create Group</Text>
      </View>
      <View style={{alignItems:'center',justifyContent:'center',marginTop:30}}>
      <TouchableOpacity style={styles.imageUpload}>
        <Image source={require('./Assets/camera.png')} style={styles.cameraIcon} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        placeholderTextColor="#A9A9A9"
      />
      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Somia David</Text>
          <TouchableOpacity>
            <Text style={styles.removeTag}>✖</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Olivia Smith</Text>
          <TouchableOpacity>
            <Text style={styles.removeTag}>✖</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
      </View>

        </View>
      </Modal>
      {handelday1()}
      {ismore && <View style={styles.overlay} />}

    </SafeAreaView>
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
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    width: 200,
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
    width: '60%',
  },
  selectionIndicator: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20
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
    marginTop:20
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
    color:'black'
  },
  msgContent: {
    color: '#888',
  },
  msgInfo: {
    alignItems: 'flex-end',
  },
  msgTime: {
    fontSize: 12,
    color: 'black',
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
    marginHorizontal:20
    
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
    width:"100%"
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
    marginLeft:60
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
    color:'black'
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
    height:200,  // Adjust the height as needed
    backgroundColor: 'white',
    padding: 10,
    marginRight:20,

  },
  modalContainer2: {
    top: 80,
  bottom: 0,
  width:"100%",
  height:"100%",
  alignItems:'flex-end',
  right:scale(20)

  },
  profileDataModel:{
    width: 230,
    borderRadius:20,
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

  
    // maxHeight: Scale(500),
    // paddingBottom:20
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for the desired transparency
  },

});


export default BookmarkMessageScreen;
