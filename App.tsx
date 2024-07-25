// App.js
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './Blocks/screens/SplashScreen';
import OtpVerification from './Blocks/screens/OtpVerification';
import SigninScreen from './Blocks/screens/SigninScreen';
import MessageScreen from './Blocks/screens/MessageScreen';
import ContactsScreen from './Blocks/screens/Contacts';
import store from './Blocks/Redux/store'
import { setUser } from './Blocks/Redux/userSlice';
import { Image, Text, View } from 'react-native';
import ChatScreen from './Blocks/screens/ChatScreen';
import GroupChatScreen from './Blocks/screens/groupscreen';
import ProfileScreen from './Blocks/screens/ProfileScreen';
import BookmarkMessageScreen from './Blocks/screens/Bookmarks';
import ForwordmsgScreen from './Blocks/screens/ForwordMsg'
import ForgotPasswordScreen from './Blocks/screens/ForgotPasswordScreen';
import ChangePasswordScreen from './Blocks/screens/ChangePasswordScreen';
import forgotpswOtpVerification from './Blocks/screens/forgotpswOtpVerification';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TheTab() {

  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let tabbarname;
          let rn = route.name;
          if (rn === "Chats") {
            tabbarname = "Chat"
            iconName = focused ? require("./Blocks/screens/Assets/msgblue.png") : require("./Blocks/screens/Assets/msgblue.png");
          } else if (rn === "Contacts") {
            tabbarname = "Contacts"
            iconName = focused ? require("./Blocks/screens/Assets/contacts.png") : require("./Blocks/screens/Assets/contacts.png");
          }
          return <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
            <Image
              source={iconName}
              resizeMode='contain'
              style={{ width: 20, height: 20, tintColor: focused ? '#3B6EDC' : '#717171', alignSelf: 'center' }}
            />
            <Text style={{ fontSize: 16, paddingHorizontal: 10, color: focused ? '#3B6EDC' : '#717171' }}>{tabbarname}</Text>
          </View>
        },
        headerStyle: {
          backgroundColor: '#3B6EDB',
        },
        headerShown: false,
        headerTintColor: '#3B6EDB',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#3B6EDB',
        tabBarInactiveTintColor: 'grey',
        tabBarShowLabel: false,
        tabBarLabelStyle: { paddingBottom: 5, fontSize: 10, fontWeight: '900' },
      })}
    >
      <Tab.Screen name="Chats" component={MessageScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
    </Tab.Navigator>
  );
}

 function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  

 
  return (
    <NavigationContainer>
      
      <Stack.Navigator
       screenOptions={{
        headerStyle: {
          backgroundColor: '#3B6EDB',
        },
        
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      
      >


<Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerBackVisible: false, headerShown: false }} />
            <Stack.Screen name="Signin" component={SigninScreen} options={{ headerBackVisible: false, headerShown: false }} />
         

        
            <Stack.Screen name="OtpVerification" component={OtpVerification} options={{ headerBackVisible: false, headerShown: false }} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerBackVisible: false, headerShown: false }} />
            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerBackVisible: false, headerShown: false }} />
            <Stack.Screen name="forgotpswOtpVerification" component={forgotpswOtpVerification} options={{ headerBackVisible: false, headerShown: false }} />

            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
              component={TheTab}
            />

<Stack.Screen name="singlechats"  options={({route}) => ({headerShown:false,
          headerBackTitleVisible: false })}>
        {props => <ChatScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="GroupChatScreen" options={({route}) => ({ headerShown:false,
          headerBackTitleVisible: false })}>
        {props => <GroupChatScreen {...props}/>}
        </Stack.Screen>

        <Stack.Screen name="ProfileScreen" options={({route}) => ({headerShown:false,
          headerBackTitleVisible: false })}>
        {props => <ProfileScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="ForwordmsgScreen" options={({route}) => ({headerShown:false,
          headerBackTitleVisible: false })}>
        {props => <ForwordmsgScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen
          name="BookmarkMessageScreen"
          options={{ headerShown: false }}
        >

{props => <BookmarkMessageScreen {...props} />}

        </Stack.Screen>
    
         
          
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
