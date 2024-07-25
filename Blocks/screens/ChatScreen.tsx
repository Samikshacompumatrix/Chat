import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import AudioRecord from 'react-native-audio-record';
import EmojiSelector, { Categories } from "react-native-emoji-selector";

import { scale } from './Customstyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
export const SCREEN_HEIGHT = Math.round(Dimensions.get("window").height);
export const SCREEN_WIDTH = Math.round(Dimensions.get("window").width);

Icon.loadFont().then();

const ChatScreen = ({  route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const flatListRef: React.LegacyRef<FlatList> =
  React.useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [replymode, setReplyMode] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [ismore, setismore] = useState(false);
  const [isimge, setIsmge] = useState(false);
  const [isvid, setIsvid] = useState(false);
  const [isdoc, setIsdoc] = useState(false);
  const [isaudio, setIsaudio] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);

  const [isupload, setisupload] = useState(false);
  const [isPosition, setisPosition] = useState('');

  const [isflag, setisflag] = useState(false);


  
  const [bookmarks, setBookmarks] = useState([]);
  const [inputHeight, setInputHeight] = useState(40);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showEmojiBoard, setShowEmojiBoard] = useState(false);
  const [forwordvisible,setforwordvisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [users, setUsers] = useState([]);


  const { uid, userName, userAvatar } = route.params;

  const messagesPerPage = 5;

 
  console.log(isflag,"isflag")
  
  
  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0 && !loading) { // Detect scroll to top
      getAllMessages();
    }
  }, [loading, lastMessageId]);
  
  const getAllMessages = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
  
      const formdata = new FormData();
      formdata.append("access_token", token);
      formdata.append("u_id", userId);
      formdata.append("receiver_id", route.params.uid);
      formdata.append("limit", messagesPerPage);
      formdata.append("message_id",lastMessageId || ''); // Pass lastMessageId to fetch older messages
  
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
  
      const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/get-chat-list", requestOptions);
      const result = await response.json();
  
      if (result.status === "success") {
        if (Array.isArray(result.data) && result.data.length > 0) {
          const lastMessage = result.data[result.data.length - 1];
          setLastMessageId(lastMessage.message_id); // Update lastMessageId


          console.log("hsjksk")
  
          // Prepend messages to the top and avoid duplicates
          setMessages((prevMessages) => {
            const existingMessageIds = new Set(prevMessages.map(msg => msg.message_id));
            const newMessages = result.data.filter(msg => !existingMessageIds.has(msg.message_id));
            return [...newMessages, ...prevMessages];
          });
        } else {
          console.log('No more messages to load.');
        }
      } else {
        console.log("Error:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
getAllMessages()
    

  }, [isflag]);

  // Effect to fetch messages on component mount
  useEffect(() => {

    requestStoragePermission()
    const unsubscribe = navigation.addListener('focus', () => {
     // getAllMessages();
      getCurrentUser()
      
    });
    

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {

    // Configure audio recording settings
    const audioConfig = {
      sampleRate: 16000, // default is 44100
      channels: 1, // 1 or 2, default is 1
      bitsPerSample: 16, // 8 or 16, default is 16
      audioSource: 6, // android only (see below)
      wavFile: 'test.wav', // default is 'audio.wav'
    };

    AudioRecord.init(audioConfig);
    setAudioInitialized(true);

    return () => {
      AudioRecord.stop();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
  
      const formdata = new FormData();
      formdata.append("access_token", token);
      formdata.append("u_id", userId);
      formdata.append("receiver_id", route.params.uid);
      formdata.append("limit", messagesPerPage);
  
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
  
      try {
        const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/get-chat-list", requestOptions);
        const result = await response.json();
        if (result.status === "success") {
          if (Array.isArray(result.data) && result.data.length > 0) {
            const lastMessage = result.data[result.data.length - 1];
            setLastMessageId(lastMessage.message_id); // Update lastMessageId
            console.log(lastMessageId,"latst")
  
            // Set initial messages
            setMessages(result.data);
          } else {
            console.log('No messages fetched.');
          }
        } else {
          console.log("Error:", result);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMessages();
  }, [route.params.uid]);
  
  // Function to scroll to the bottom of the FlatList
  const scrollToBottom = () => {
  
  };


 
  
  const handleBookmarkMessage = async (message) => {
    console.log("bokkmarks")
    // try {
    //   // Check if message is already bookmarked
    //   const bookmarkExists = bookmarks.some(b => b._id === message._id);

    //   if (!bookmarkExists) {
    //     await firestore()
    //       //.collection('Users')
    //       .doc(user.uid)
    //       .collection('Bookmarks')
    //       .add(message);

    //     setBookmarks([...bookmarks, message]);
    //   } else {
    //     // Remove from bookmarks
    //     const updatedBookmarks = bookmarks.filter(b => b._id !== message._id);
    //     setBookmarks(updatedBookmarks);

    //     // Find and delete from Firestore
    //     const bookmarkDoc = await firestore()
    //       .collection('Users')
    //       .doc(user.uid)
    //       .collection('Bookmarks')
    //       .where('messageId', '==', message._id)
    //       .get();

    //     if (!bookmarkDoc.empty) {
    //       bookmarkDoc.forEach(async doc => {
    //         await doc.ref.delete();
    //       });
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error bookmarking message:', error);
    // }
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
 
  };


  const sendMessage = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    const uid = currentUser.uid.toString();
    

    let fileType = 'null';
    if (uploadedFile) {
      if (isimge) {
        fileType = 'image';
      } else if (isvid) {
        fileType = 'video';
      } else if (isaudio) {
        fileType = 'audio';
      } else if (isdoc) {
        fileType = 'document';
      }
    }
  
  
    const newMessage = {
      message_id: Date.now().toString(),
      u_id: userId,
      access_token: token,
      sentBy: userId,
      sentTo: route.params.uid,
      text: text,
      replyTo: replyMessage ? replyMessage.message_id : '',
      uploaded_file: uploadedFile ? uploadedFile.uri.toString(): '',
      createdAt: new Date(),
      date_time: new Date(),
      file_type: uploadedFile ? fileType : 'null',
      is_bookmark: "0",
      is_replay: replyMessage ? 1 : 0,
      message: text,
      position: uid == userId ? "right" : "left",
      receiver_id: route.params.uid,
      receiver_name: route.params.name,
      sender_id: userId,
      sender_name: "ahjs",
    };
  
    // Add the new message to the bottom of the list
    
    setMessages((prevMessages) => [
      {
        ...newMessage,
        uploaded_file: uploadedFile ? uploadedFile.uri.toString() : ''
      },
      ...prevMessages
    ]);
    
    console.log(uid,route.params.uid,"myujjj")

    if(uid ==  route.params.uid)
    {
      console.log("myujjj")

      setMessages((prevMessages) => [
        {
          ...newMessage,
          uploaded_file: uploadedFile ? { uri: uploadedFile.uri.toString(), name: uploadedFile.name, type: uploadedFile.type } : ''
        },
        ...prevMessages
      ]);

    }
  
    setText('');
    setisupload(false);
    setIsmge(false)
    setIsvid(false)

    setIsaudio(false)
setIsdoc(false)
    
    console.log("Optimistically added new message:", newMessage);
  
    const formdata = new FormData();
    formdata.append("u_id", userId);
    formdata.append("access_token", token);
    formdata.append("sentBy", userId);
    formdata.append("sentTo", route.params.uid);
    formdata.append("text", text);
    formdata.append("replyTo", replyMessage ? replyMessage.message_id : '');
  
    if (uploadedFile) {
      formdata.append("uploaded_file", {
        uri: uploadedFile.uri,
        name: uploadedFile.name,
        type: uploadedFile.type,
      });
    } else {
      formdata.append("uploaded_file", '');
    }
  
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
  
    try {
      const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/send-message", requestOptions);
      const result = await response.json();
  
      if (result.status === "success") {
        setText('');
        setReplyMessage(null);
        setisupload(false);
  
        console.log('Message sent successfully:', result);
        setisflag(true)
      
  
        // Update message with server response if needed
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.message_id === newMessage.message_id ? { ...msg, ...result.message } : msg
          )
        );
      } else {
        console.log("Error sending message:", result);
        // Remove the optimistic message if it failed
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.message_id !== newMessage.message_id));
      }
    } catch (error) {
      console.error("Error:", error);
      // Remove the optimistic message if there's an error
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.message_id !== newMessage.message_id));
    }
  };
  
  


  const addBookmarks = async (message) => {
    console.log(message);
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    const formdata = new FormData();
    formdata.append("u_id", userId);
    formdata.append("access_token", token);
    formdata.append("single_chat_message_id", message.message_id);
    formdata.append("grp_chat_message_id", "");
  
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
  
    try {
      const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/add-bookmark", requestOptions);
      const result = await response.json();
  
      if (result.status === "success") {
        console.log('Bookmarks sent successfully:', result);
  
        // Update the message in the local state to reflect the bookmark status
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.message_id === message.message_id
              ? { ...msg, is_bookmark: "1" }
              : msg
          )
        );
      } else {
        console.log("Error sending bookmark:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleForwardMessage = (message) => {
    // Logic to select the recipient and forward the message
    // For example, navigate to a screen where the user can select the recipient
    // and then send the message to the selected recipient.
    console.log('Forwarding message:', message);

    navigation.navigate("ForwordmsgScreen",{forwordmsg:message})
    // Navigate to recipient selection screen
  };


 


  const ForwardModal = () => {
    return (
      <Modal visible={forwordvisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainerf}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Contact</Text>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                // onPress={() => onSelectContact(item)}
                
                >
                  <Text style={styles.contactItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={()=>{setforwordvisible(false)}} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const deleteMessage = async (message) => {
    const docid = user.uid > message.sentTo 
      ? `${message.sentTo}-${user.uid}` 
      : `${user.uid}-${message.sentTo}`;
  
    // try {
    //   const messageCollection = firestore()
    //     .collection('Chats')
    //     .doc(docid)
    //     .collection('messages');
  
    //   // Use the _id of the message to delete it
    //   await messageCollection.doc(message._id).delete();
    //   console.log('Message deleted successfully.');
  
    //   // Update the local messages state to remove the deleted message
    //   setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== message._id));
    // } catch (error) {
    //   console.error('Error deleting message:', error);
    // }
  };
  
  
  
  const messageOptionsModal = () => {
    return (
      <View>
      <Modal
       animationType="slide"
       transparent={true}
       style={{ opacity: 10 }}
       visible={isModalVisible}
       onRequestClose={() => setIsModalVisible(false)}

    >
       <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
      <View style={[styles.modalContainer,]}>
      <TouchableWithoutFeedback>

        <View style={styles.profileDataModel}>
          
          <TouchableOpacity 
          style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,marginTop:20,alignItems:'center'}}
          onPress={()=>{


            setReplyMessage(selectedMessage);
            setIsModalVisible(false);


          }


}>
          <Text style={{fontSize:16,padding:10, fontFamily: 'Poppins-Bold',color:"black"}}>Reply</Text>
          <Image source={require("./Assets/replay1.png")} style={{width:20,height:20,}} />

          </TouchableOpacity>
          <TouchableOpacity 
          style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,alignItems:'center'}}
                         onPress={() =>{ 
                          
                          addBookmarks(selectedMessage)

                          setIsModalVisible(false);
                         }

                         }



>
          <Text style={{fontSize:16,padding:10, fontFamily: 'Poppins-Bold',color:"black"}}>Bookmark Message</Text>
          <Image source={require("./Assets/bookmarks.png")} style={{width:20,height:20,}} />

          </TouchableOpacity>
          <TouchableOpacity 
          style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,alignItems:'center'}}
          onPress={()=>{
            deleteMessage(selectedMessage);
            setIsModalVisible(false);

          }


}>
          <Text style={{fontSize:16,padding:10, fontFamily: 'Poppins-Bold',color:"black"}}>Delete Message</Text>
          <Image source={require("./Assets/delete.png")} style={{width:20,height:20}} />

          </TouchableOpacity>
          <TouchableOpacity 
          style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,alignItems:'center'}}
          onPress={()=>{
          handleForwardMessage(selectedMessage);
          setIsModalVisible(false);

}}
>
          <Text style={{fontSize:16,padding:10, fontFamily: 'Poppins-Bold',color:"black"}}>Forward</Text>
          <Image source={require("./Assets/replay.png")} style={{width:20,height:20,}} />

          </TouchableOpacity>

          {/* <FlatList
              data={this.state.dayCount}
              renderItem={this.renderSearchCountry1}
              showsVerticalScrollIndicator={true}
              testID="SearchCountryFlatList"
            /> */}
          {/* Additional content for your modal */}
        </View>
        </TouchableWithoutFeedback>
      </View>
      
      </TouchableWithoutFeedback>
    </Modal>
    </View>
    );
  };
  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        {
          title: "Storage Permission",
          message: "This app needs access to your storage to upload files.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the storage");
      } else {
        console.log("Storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      return granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  };

  const onStartRecord = async () => {
    requestPermissions()
    if (!audioInitialized) {
      console.warn('AudioRecord not initialized');
      return;
    }
  
    setIsRecording(true);
  
    try {
      AudioRecord.start();
     // Alert.alert("start Record")
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };
  

  const handleEmojiSelected = (emoji) => {
    setText(text + emoji); // Append selected emoji to text input
  }


  const toggleEmojiPicker = () => {
    setShowEmojiBoard(!showEmojiBoard);
  };
  const onStopRecord = async () => {
    if (!isRecording) return;

    let audioFile = await AudioRecord.stop();
    setIsRecording(false);
    setRecordedUri(audioFile);

    setUploadedFile({
      uri: `file://${audioFile}`, // Ensure the file path is correctly formatted
      name: "recording.mp3", // Adjust the name and extension accordingly
        type: "audio/mpeg" // A
    });
    console.log('audioFile:', audioFile);
    setIsaudio(true)
    setisupload(true)


  };

  const sendAudioMessage = async (audioFile) => {
    if (!audioFile) {
      Alert.alert('No audio recorded');
      return;
    }

    const mediaMessage = {
      createdAt: new Date(),
      sentBy: user.uid,
      sentTo: uid,
      audio: audioFile,
      text: '',
    };

    await handleSendMediaMessage(mediaMessage);
  };


  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleSendMediaMessage = async (mediaMessage) => {
    console.log(mediaMessage)
    // try {
    //   // Check if mediaMessage lacks necessary media fields
    //   if (!mediaMessage.image && !mediaMessage.video && !mediaMessage.document && !mediaMessage.audio) {
    //     throw new Error('Required fields (image, video, document, audio) are undefined');
    //   }
  
    //   // Update local messages state
    //   setMessages(prevMessages => [...prevMessages, mediaMessage]);
  
    //   // Construct document ID based on user IDs
    //   const docid = uid > user.uid ? `${user.uid}-${uid}` : `${uid}-${user.uid}`;
  
    //   // Add message to Firestore
    //   await firestore()
    //     .collection('Chats')
    //     .doc(docid)
    //     .collection('messages')
    //     .add({
    //       ...mediaMessage,
    //       createdAt: firestore.FieldValue.serverTimestamp(),
    //     });
  
    //   // Scroll to the end of the message list
    //   flatListRef.current.scrollToEnd({ animated: false });
    //   setShowEmojiBoard(false)

    // } catch (error) {
    //   // Handle the error gracefully
    //   console.error('Error sending media message:', error);
    //   // You can show an alert or take other actions here
    // }
  };
  

  const handlePickImage = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    }).then(images => {
      images.forEach(async image => {
        setUploadedFile({
          uri: image.path,
          name: "image.jpg",
          type: "image/jpeg",
        });


        console.log(image.path)
        setisupload(true)

        // await sendMessage();
      });
    }).catch(error => {
      console.error('Error picking image:', error);
    });
  };

  const handlePickVideo = async () => {
    try {
      const video = await ImagePicker.openPicker({
        mediaType: 'video',
      });
  
      setUploadedFile({
     
        uri: video.path,
        name: "recording.mp4", // Adjust the name and extension accordingly
        type: "video/mp4" // Adjust the MIME type accordingly
      });
  

      setisupload(true)

      // await sendMessage();
  
    } catch (error) {
      console.error('Error picking video:', error);
    }
  };

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      console.log(res, "Document picked");

      setUploadedFile({
        uri: res[0].uri,
        name: res[0].name,
        type: res[0].type,
      });


      setisupload(true)
      setIsdoc(true)


      // Uncomment to automatically send message after picking document
      // sendMessage();
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error picking document:', error);
      }
    }
  };

  


  const handleAttachmentPress = () => {
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
              <View style={styles.profileDataModel2}>
<View 
                  style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 10, marginTop: 20, alignItems: 'center' }}
>
                <TouchableOpacity

style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, }}

                  onPress={() => {
                    handlePickImage();
                    setIsmge(true)
                    setIsvid(false)
                    setIsdoc(false)
                    setismore(false)
                    // this.setState({flag:"1",ismore:false})
                  }}>
                  <Image source={require("./Assets/aphoto.png")}resizeMode='contain' style={{ width: 50, height: 50, }} />


                  <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: "black",paddingHorizontal:10 }}>Image</Text>
                </TouchableOpacity>
                <TouchableOpacity



style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, }}



                  onPress={() => {
                    handlePickDocument()
                    setismore(false)
                    setIsmge(false)
                    setIsvid(false)
                    setIsdoc(true)
                    // this.setState({flag:"2",isnotification:false})
                  }}>


                  <Image source={require("./Assets/adocument.png")} resizeMode='contain' style={{ width: 50, height: 50, }} />



                  <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: "black" ,paddingHorizontal:10}}>Document</Text>
                </TouchableOpacity>
                <TouchableOpacity

style={{ justifyContent: 'center', alignItems: 'center' , marginHorizontal: 10,}}

                  onPress={() => {
                    handlePickVideo()
                    setismore(false)
                    setIsmge(false)
                    setIsvid(true)
                    setIsdoc(false)

                    // this.setState({flag:"3",isnotification:false})
                  }}>
                  <Image source={require("./Assets/avideo.png")} resizeMode='contain' style={{ width: 50, height: 50, }}/>



                  <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: "black" ,}}>Video</Text>
                </TouchableOpacity>
              </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }


  const handleuploadfile = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        style={{ opacity: 10 }}
        visible={isupload}
        onRequestClose={() => setisupload(false)}

      >
        <TouchableWithoutFeedback onPress={() => setisupload(false)}>
          <View style={styles.modalContainer2}>
            <TouchableWithoutFeedback>
              <View style={styles.profileDataModel4}>
<View 
                  style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 10, marginTop: 20, alignItems: 'center' }}
>
                <TouchableOpacity

style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, }}

                  onPress={() => {
                    // handlePickImage();
                    sendMessage()
                    setisupload(false)
                    // this.setState({flag:"1",ismore:false})
                  }}>

                    {isimge == true &&
                    <View>
                  <Image source={{uri:uploadedFile?.uri}}resizeMode='contain' style={{ width: 200, height: 200, }} />


                  <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Image source={require('./Assets/send.png')} style={{ width: 40, height: 40, alignSelf: 'flex-end',marginRight:-50}} resizeMode='contain' />
            </TouchableOpacity>
                              </View>

                    }


{isvid == true &&
                    <View>
                  <Video source={{uri:uploadedFile?.uri}}resizeMode='contain' style={{ width: 200, height: 200, }}  controls={true} />


                  <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Image source={require('./Assets/send.png')} style={{ width: 40, height: 40, alignSelf: 'flex-end',marginRight:-50}} resizeMode='contain' />
            </TouchableOpacity>
                              </View>

                    }



{ isaudio == true &&
                    <View>
                  <View style={{ width: "100%", height: 100, }} >

                      <Text style={{color:'black',fontSize:20}}>{uploadedFile?.uri}</Text>

</View>
                  <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Image source={require('./Assets/send.png')} style={{ width: 40, height: 40, alignSelf: 'flex-end',marginRight:-30}} resizeMode='contain' />
            </TouchableOpacity>
                              </View>

                    }
                    


                    
{ isdoc == true &&
                    <View>
                  <View style={{ width: "100%", height: 100, }} >

                      <Text style={{color:'black',fontSize:20}}>{uploadedFile?.uri}</Text>

</View>
                  <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Image source={require('./Assets/send.png')} style={{ width: 40, height: 40, alignSelf: 'flex-end',marginRight:-30}} resizeMode='contain' />
            </TouchableOpacity>
                              </View>

                    }
                    
                </TouchableOpacity>
          
              </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }



  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const renderItem = ({ item }) => {
    const replyMessage = messages.find((msg) => msg.message_id === item.replyTo);
  
    // Example status: 'sent', 'delivered', 'read'
    const getStatusIcon = (status) => {
      switch (status) {
        case 'delivered':
          return '✓✓'; // Example for double tick, you can replace with icons
        case 'read':
          return '✓✓'; // Could be styled differently
        default:
          return '✓'; // Single tick for sent
      }
    };
  
    return (
      <TouchableOpacity
        style={[
          styles.messageContainer,
          item.position === 'right' ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
        onLongPress={() => {
          setIsModalVisible(true);
          setSelectedMessage(item);
        }}
      >
        {item.is_bookmark == "1" &&
                <Image source={require('./Assets/bookmark.png')} style={{width:10,height:10,alignSelf:'flex-end',resizeMode:'contain'}} />
        }


        {item.is_replay === 1 && replyMessage && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyText}>Replying to:</Text>
            {replyMessage.uploaded_file ? (
              replyMessage.file_type === 'image' ? (
                <Image source={{ uri: replyMessage.uploaded_file }} style={styles.replyImage} />
              ) : replyMessage.file_type === 'video' ? (
                <Video
                  source={{ uri: replyMessage.uploaded_file }}
                  style={styles.replyVideo}
                  controls={true}
                  paused={true}
                />
              ) : null
            ) : (
              <Text style={styles.replyText1}>{replyMessage.message}</Text>
            )}
          </View>
        )}
  
        {item.message ? (
          <Text style={item.position === 'right' ? styles.currentUserText : styles.otherUserText}>
            {item.message}
          </Text>
        ) : item.file_type === "image" ? (
          <Image source={{ uri:item.uploaded_file }} style={styles.messageImage} />
          // <Image source={{ uri: item?.uploaded_file.uri?.toString() }} style={styles.messageImage} />

        ) : item.file_type === "video" ? (
          <Video
            source={{  uri: item.uploaded_file }}
            style={styles.messageImage}
            controls={true}
            paused={true}
          />
        ) : item.file_type === "document" ? (
          <View>
            <Text>{item.uploaded_file}</Text>
          </View>
        ) : item.file_type === "audio" ? (
          <View>
            <Text>Audio Message</Text>
            {/* Display audio controls or information as needed */}
            <Text>{item.uploaded_file}</Text>
          </View>
        ) : null}
  
        {/* Add the timestamp and double ticks here */}
        {item && (
          <View style={styles.timestampContainer}>
            <Text
              style={{
                ...styles.timestampText,
                alignSelf: item.position === 'right' ? 'flex-end' : 'flex-start',
              }}
            >
              {formatTimestamp(item.date_time)} {getStatusIcon(item.status)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require('./Assets/back.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
      </TouchableOpacity>
      <Image source={{uri:route.params.img}} style={styles.avatar} />
      <View style={styles.headerInfo}>
        <Text style={styles.userName}>{route.params.name}</Text>
        <Text style={styles.userStatus}>Online <Image source={require('./Assets/online.png')} style={{width:10,height:10}} />
        </Text>
      </View>
    </View>
  );
 


  const handleContentSizeChange = () => {
    if (isAutoScroll) {
      scrollToBottom();
    }
  };

  // const handleScroll = (event) => {
  //   const offsetY = event.nativeEvent.contentOffset.y;
  //   const contentHeight = event.nativeEvent.contentSize.height;
  //   const viewHeight = event.nativeEvent.layoutMeasurement.height;

  //   // If scrolled to the top and not at the bottom, don't auto scroll
  //   if (offsetY + viewHeight < contentHeight) {
  //     setIsAutoScroll(false);
  //   } else {
  //     setIsAutoScroll(true);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle="dark-content" />
      {renderHeader()}
      <FlatList
  ref={flatListRef}
  data={messages}
  keyExtractor={(item) => item.message_id.toString()}
  style={styles.flatlistStyle}
  contentContainerStyle={styles.contentContainer}
  renderItem={renderItem}
  onScroll={handleScroll}
  scrollEventThrottle={1000} // Adjust as needed
  inverted
/>


      <KeyboardAvoidingView style={styles.inputContainer}>
      {replyMessage && (

<View style={styles.replyingToContainer}>
  <View>
<Text style={styles.replyText}>Replying to:</Text>
{replyMessage.uploaded_file ? (
  replyMessage.file_type === 'image' ? (
    <Image source={{ uri: replyMessage.uploaded_file }} style={styles.replyImage} />
  ) : replyMessage.file_type === 'video' ? (
    <Video
      source={{ uri: replyMessage.uploaded_file }}
      style={styles.replyVideo}
      controls={true}
      paused={true}

    />
  ) : null
) : (
  <Text style={styles.replyingToText}>{replyMessage.message}</Text>
  
)}
</View>
 <TouchableOpacity onPress={() => setReplyMessage(null)}>
            <Text style={styles.cancelReplyText}>Cancel</Text>
            </TouchableOpacity>
</View>
          // <View style={styles.replyingToContainer}>
          //   <Text style={styles.replyingToText}>Replying to: {replyMessage.text}</Text>
          //   <TouchableOpacity onPress={() => setReplyMessage(null)}>
          //     <Text style={styles.cancelReplyText}>Cancel</Text>
          //   </TouchableOpacity>
          // </View>
        )}
        <View style={{ ...styles.textInput, height: Math.min(inputHeight * 1.5, 100) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <TouchableOpacity style={styles.attachmentButton} onPress={() => setShowEmojiBoard(!showEmojiBoard)}>
              <Image source={require('./Assets/emoji.png')} style={{ width: 20, height: 20, alignSelf: 'center' }} resizeMode='contain' />
            </TouchableOpacity>
            <TextInput
              placeholder="Type a message"
              value={text}
              onChangeText={setText}
              multiline={true}
              numberOfLines={4}
              onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
              style={[styles.input, { height: Math.min(inputHeight, 100) }]}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.attachmentButton} onPress={isRecording ? onStopRecord : onStartRecord}>
              <Image source={require('./Assets/voice.png')} style={{ width: 20, height: 20, alignSelf: 'center', tintColor: isRecording ? 'red' : 'gray' }} resizeMode='contain' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>{ setismore(true)}} style={styles.attachmentButton}>
              <Image source={require('./Assets/attach.png')} style={{ width: 20, height: 20, alignSelf: 'center' }} resizeMode='contain' />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Image source={require('./Assets/send.png')} style={{ width: 40, height: 40, alignSelf: 'center' }} resizeMode='contain' />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      {showEmojiBoard && (
        <View style={styles.profileDataModel3}>
          <EmojiSelector
            onEmojiSelected={(emoji) => setText(text + emoji)}
            showHistory={true}
            category={Categories.all}
            emojiSize={10} // Example: Adjust emoji size to 32 units
          />
        </View>
      )}
  {messageOptionsModal()}

{handleAttachmentPress()}
{handleuploadfile()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
   bottom:0,
   top:0,
   alignItems:'center',
   justifyContent:'center'
  },
  profileDataModel:{
    width: 250,
    height:220,
    // borderTopRightRadius: Scale(20),
    // borderTopLeftRadius: Scale(20),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 2,
    shadowRadius: 3,
    elevation: 5,
    borderRadius:10
  
  
    // maxHeight: Scale(500),
    
  },
  profileDataModel3:{
    width: "100%",
    height:320,
    // borderTopRightRadius: Scale(20),
    // borderTopLeftRadius: Scale(20),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 2,
    shadowRadius: 3,
    elevation: 5,
    borderRadius:10
  
  
    // maxHeight: Scale(500),
    
  },
  cancelButton: {
    resizeMode: "contain",
    height: 23,
    width:23,
    alignSelf: "flex-end",
  },

  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  userStatus: {
    fontSize: 12,
    color: 'green',
  },
  inputContainer: {
    borderTopWidth: 0.4,
    borderTopColor: '#BBBBBB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:scale(20),
  },
  attachmentButton: {
    marginRight: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: scale(10),
    paddingVertical: 6,
    color: 'black',
    height: 50,
    marginTop: 10,
    width: '90%',
    justifyContent: 'space-between',
  },
  sendButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
  

    maxWidth: '75%',
    alignSelf: 'flex-start',
    marginRight: 10,
    marginLeft: 10,
  },
  currentUserMessage: {
    backgroundColor: '#3A6DDA',
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 15,
    borderTopLeftRadius:15,
    borderTopRightRadius:2,
    borderBottomRightRadius:15,
  },
  otherUserMessage: {
    backgroundColor: '#ECECEC',
    borderBottomLeftRadius: 15,
    borderTopLeftRadius:2,
    borderTopRightRadius:15,
    borderBottomRightRadius:15,
  },
  currentUserTimestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  otherUserTimestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'left',
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: '#000',
  },
  modalContainer2: {
    top:0,
    width: "100%",
    height: "100%",
    alignItems:'center',
    justifyContent: 'flex-end'


  },
  profileDataModel2: {
    width: "92%",
    bottom:scale(100),
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

  profileDataModel4: {
    width: "92%",
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
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  flatlistStyle: {
    marginTop : Platform.select({ios:10,android:5}),
    marginBottom:5
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for the desired transparency
  },
  replyingToContainer: {
    marginBottom: -scale(30),
    paddingVertical: 20,
    paddingHorizontal:10,
    width:"90%",
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  modalContainerf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  contactItem: {
    fontSize: 18,
    paddingVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  replyingToText: {
    color: 'gray',
  },
  cancelReplyText: {
    color: 'red',
  },
  contentContainer: {
    flexGrow:1,
    justifyContent:"flex-end",
    width:'100%'
  },
  input: {
    marginRight: 5,
    borderRadius: 20,
    width: scale(150),
  },
  replyContainer:{
    backgroundColor:'#5b86e0',
   padding:20,
   borderRadius:20
  },
  replyText:{
    color:'#FFE000',
    fontSize:14
  },
  replyText1:{
    color:'white',
    fontSize:14
  },
  replyImage: {
    width: 50,
    height:50,
    borderRadius: 8,
  },
  replyVideo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

});

export default ChatScreen;



