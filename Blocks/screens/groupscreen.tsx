import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, KeyboardAvoidingView,Modal,TouchableWithoutFeedback, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { scale } from './Customstyles';
import DocumentPicker from 'react-native-document-picker';
import AudioRecord from 'react-native-audio-record';
import EmojiSelector ,{ Categories } from 'react-native-emoji-selector';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
Icon.loadFont().then();

const GroupChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [ismore, setismore] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [replymode, setReplyMode] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showEmojiBoard, setShowEmojiBoard] = useState(false);
  const [forwordvisible,setforwordvisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isupload, setisupload] = useState(false);

  const [isimge, setIsmge] = useState(false);
  const [isvid, setIsvid] = useState(false);
  const [isdoc, setIsdoc] = useState(false);
  const [isaudio, setIsaudio] = useState(false);

  const { groupId, currentUser } = route.params;
  const flatListRef: React.LegacyRef<FlatList> =
  React.useRef(null);
  // useEffect(() => {
  //   const unsubscribe = firestore()
  //     .collection('Groups')
  //     .doc(groupId)
  //     .collection('messages')
  //     .orderBy('createdAt', 'asc') // Order messages ascending
  //     .onSnapshot(snapshot => {
  //       const allMessages = snapshot.docs.map(docSnap => ({
  //         ...docSnap.data(),
  //         createdAt: docSnap.data().createdAt?.toDate(),
  //         _id: docSnap.id,
  //       }));
  //       setMessages(allMessages);
  //       setTimeout(() => flatListRef.current.scrollToEnd({ animated: false }), 100);
  //     });

  //   return () => unsubscribe();
  // }, [groupId]);

  useEffect(() => {
    getAllMessages()
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
 
  const addBookmarks = async (message) =>
    {
      console.log(message)
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const formdata = new FormData();
  formdata.append("u_id", userId);
  formdata.append("access_token",token);
  formdata.append("single_chat_message_id",'');
  formdata.append("grp_chat_message_id",message.message_id);
  
  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
  };
  
  
  
  
    try {
      const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/add-bookmark", requestOptions)
  
      const result = await response.json();
  
      if (result.status === "success") {
      
      
  
        console.log('bookamrks sent successfully:', result);
  
        // Update message with server response if needed
       
        
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
    }
  
  const sendMessage = async () => {

    console.log(uploadedFile,"myfile")
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
  
    const formdata = new FormData();
    formdata.append("access_token", token);
    formdata.append("u_id", userId);
    formdata.append("group_id", groupId);
    formdata.append("text",text);
    formdata.append("replyTo", replyMessage ? replyMessage.message_id : '')

  
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
      const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/send-message-to-group", requestOptions);
      const result = await response.json();
  
      if (result.status === "success") {
        setText('');
        setReplyMessage(null);
        getAllMessages();
        setisupload(false)
  
        console.log('Message sent successfully:', result);

  
      } else {
        console.log("Error sending message:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllMessages = async () => {
    console.log(".kskk")
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');

    const formdata = new FormData();
    formdata.append("access_token", token);
    formdata.append("u_id", userId);
    formdata.append("group_id", groupId);    
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    
  
      try {
        const response = await fetch("https://chat-app-backend-laravel.medks-sz.com/api/get-group-chat-list", requestOptions);
        const result = await response.json();
        if (result.status === "success") {
      
          setMessages(result.data);
          // flatListRef.current?.scrollToEnd({ animated: true });

          setTimeout(() => flatListRef.current.scrollToEnd({ animated: false }), 100);

        } else if (result.error_code === "404") {
          console.log("Error 404", result);
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


  // const handleSendMediaMessage = async (mediaMessage) => {
  //   try {
  //     if (!mediaMessage.image && !mediaMessage.video && !mediaMessage.document && !mediaMessage.audio) {
  //       throw new Error('Required fields (image, video, document) are undefined');
  //     }

  //     setMessages(prevMessages => [...prevMessages, mediaMessage]);
    
  //     await firestore().collection('Groups').doc(groupId).collection('messages').add({
  //       ...mediaMessage,
  //       createdAt: firestore.FieldValue.serverTimestamp(),
  //     });

  //     console.log('Media message sent successfully:', mediaMessage);
  //     flatListRef.current.scrollToEnd({ animated: true });
  //     setShowEmojiBoard(false)

  //   } catch (error) {
  //     console.error('Error sending media message:', error);
  //   }
  //   }


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
            console.log(selectedMessage,)


           setReplyMessage(selectedMessage);
            setIsModalVisible(false);


          }


}>
          <Text style={{fontSize:16,padding:10, fontFamily: 'Poppins-Bold',color:"black"}}>Reply</Text>
          <Image source={require("./Assets/replay1.png")} style={{width:20,height:20,}} />

          </TouchableOpacity>
          <TouchableOpacity 
          style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,alignItems:'center'}}
          onPress={()=>{

            addBookmarks(selectedMessage)
            setIsModalVisible(false);


          }


}>
          <Text style={{fontSize:16,padding:10, fontFamily: 'Poppins-Bold',color:"black"}}>Bookmark Message</Text>
          <Image source={require("./Assets/bookmarks.png")} style={{width:20,height:20,}} />

          </TouchableOpacity>
          <TouchableOpacity 
          style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,alignItems:'center'}}
          onPress={()=>{}


}>
          <Text style={{fontSize:16,padding:10, fontFamily: 'Poppins-Bold',color:"black"}}>Delete Message</Text>
          <Image source={require("./Assets/delete.png")} style={{width:20,height:20}} />

          </TouchableOpacity>
          <TouchableOpacity 
          style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,alignItems:'center'}}
          onPress={()=>{
            handleForwardMessage(selectedMessage);
            setIsModalVisible(false)


          }


}>
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

  const onStartRecord = async () => {
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
      sentBy: currentUser[0].uid,
        sentUserName: currentUser[0].name,
        groupId,
      audio: audioFile,
      text: '',
    };

    await handleSendMediaMessage(mediaMessage);
  };


  const renderItem = ({ item }) => {
    console.log(item)
    const isCurrentUser = item.sender_id ===  7;
    const replyMessage = messages.find((msg) => msg.message_id === item.replyTo);

    return (
      <TouchableOpacity
        style={[
          styles.messageContainer,
          item.position == 'right' ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
        onLongPress={() => {
          setIsModalVisible(true);
          setSelectedMessage(item);
        }}
      >
                    <Text style={{fontSize:18,color:'black'}}>{item.sender_name}</Text>

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
          <Text style={ item.position == 'right' ? styles.currentUserText : styles.otherUserText}>
            {item.message}
          </Text>
        ) :  item.file_type == "image" ?  (
          <Image source={{ uri:item.uploaded_file  }} style={styles.messageImage} />
        )  : item.file_type == "video" ? (
          <Video source={{ uri: item.uploaded_file  }} style={styles.messageImage}

          controls={true}
          paused={true}
          
          
          />

          
        ) : item.file_type == "document" ? (
          <View>
            <Text>{item.uploaded_file}</Text>
          </View>
        ) : item.file_type == "audio" ? (
          <View>
            <Text>Audio Message</Text>
            {/* Display audio controls or information as needed */}
            <Text>{item.uploaded_file}</Text> 
          </View>
        ) : null}
  
        {/* Add the timestamp here */}
        {item && (
          <View style={styles.timestampContainer}>
            <Text style={{ ...styles.timestampText, alignSelf:  item.position == 'right'  ? 'flex-end' : 'flex-start' }}>
              {formatTimestamp(item.date_time)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
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
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {renderHeader()}
      <FlatList
   ref={flatListRef}
   testID="flatlistTest"
   data={messages}
   showsVerticalScrollIndicator={false}
  keyExtractor={(item, index) => `${index}_message_list`}
  style={styles.flatlistStyle}
  contentContainerStyle={styles.contentContainer}
  onContentSizeChange={() => flatListRef?.current?.scrollToEnd()}
  bounces={false}
  renderItem={renderItem}
  />

      <View style={{...styles.inputContainer,height: Math.min(inputHeight*2, 100) }}

      >
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
        <View style={{...styles.textInput,height: Math.min(inputHeight*1.5, 100)}}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <TouchableOpacity style={styles.attachmentButton}
                        onPress={()=>{toggleEmojiPicker()}}

            
            >
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
        
<TouchableOpacity   
style={styles.attachmentButton}
      onPress={isRecording ? onStopRecord : onStartRecord}>


                      <Image source={require('./Assets/voice.png')} style={{ width: 20, height: 20, alignSelf: 'center',tintColor: isRecording ? 'red' : 'gray'}} resizeMode='contain' />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{setismore(true)}} style={styles.attachmentButton}>
              <Image source={require('./Assets/attach.png')} style={{ width: 20, height: 20, alignSelf: 'center' ,marginRight:15}} resizeMode='contain' />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Image source={require('./Assets/send.png')} style={{ width: 40, height: 40, alignSelf: 'center'}} resizeMode='contain' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {messageOptionsModal()}

      {handleAttachmentPress()}
      {handleuploadfile()}
      {isModalVisible && <View style={styles.overlay} />}
      {showEmojiBoard && (
        <View style={styles.profileDataModel3}>

          <EmojiSelector onEmojiSelected={handleEmojiSelected} 
          showHistory={true}
          category={Categories.all}
          
          emojiSize={10} // Example: Adjust emoji size to 32 units


          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '70%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B6EDB',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
  },
  currentUserText: {
    color: '#fff',
  },
  otherUserText: {
    color: '#000',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  username: {
    paddingBottom: 5,
    color: '#888',
    fontSize: 12,
  },
  inputContainer: {
    borderTopWidth: 0.4,
    borderTopColor: '#BBBBBB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:scale(20),
  },
  attachmentButton: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: 'black',
    height: 50,
    marginTop: 10,
    width: '90%',
    justifyContent: 'space-between',
  },
  sendButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  userStatus: {
    fontSize: 12,
    color: 'green',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
   bottom:0,
   top:0,
   alignItems:'center',
   justifyContent:'center'
  },
  flatlistStyle: {
    marginTop : Platform.select({ios:10,android:5}),
    marginBottom:5
  },
  containerStyle: {
    flex: 1,
    color: "#fff",
    marginLeft: 12,
    margin: 4,
    padding: 4,
    height:30,
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
  replyingToText: {
    color: 'gray',
  },
  cancelReplyText: {
    color: 'red',
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

export default GroupChatScreen;
