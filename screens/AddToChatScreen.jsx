import { View, Text, TouchableOpacity, Image, TextInput, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { avatars, API_BASE } from "../utils/supports";
import axios from "axios";
import UserInfo from "../components/UserInfo";
import { getToken } from "../utils/storeToken";
import {generateKeyPairAsync} from '../utils/generateRSAKey';

const AddToChatScreen = () => {
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const navigation = useNavigation();
  const [addChat, setAtChat] = useState("");
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState([]);


  const filteredData = users.filter(item =>
    item.username.toLowerCase().includes(addChat.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
        const token = await getToken('token');
        const user = JSON.parse(await getToken('user'));
        setUserInfo(user)
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': "JWT " + token || null, // Adjust content type as needed
                // Add any other headers you need
              };
          const response = await axios.get(API_BASE+'/users', {headers:headers});
          if(response.data.data.status) {
            const usersList = response.data.data.data.filter(user => user.id !== userInfo.id)
            setUsers(usersList)
          }
        } catch (error) {
          // Xử lý lỗi ở đây
          console.error('Error sending POST request:', error);
        }
    };
    fetchData()
  }, [])


  // useEffect(() => {
  //   const sendPublicKey = async () => {
  //     try {
  //         // console.log('123456789')
  //       const key = await generateKeyPairAsync()
  //       console.log(key);
  //     } catch (err) {
  //         console.error('Error sending POST request:', err);
  //     }
  // }

  // sendPublicKey()
  // },[users])

  const createNewChat = async () => {
    //     let id = `${Date.now()}`
    //     // // const data tu server = {
    //     //     _id: id,
    //     //     user: user,
    //     //     chatName: addChat
    //     }
  };

  return (
    <View className="flex-1">
      <View
        className="
                w-full
                bg-primary
                px-4
                py-6
                flex-[0.2]
            "
      >
        <View
          className="
                    flex-row
                    items-center
                    justify-between
                    w-full
                    px-4
                    py-12
                "
        >
          {/* go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>
          {/* middle */}

          {/* last section */}
          <View
            className="
                        flex-row
                        items-center
                        justify-center
                        space-x-3
                    "
          >
            <Image
              source={{ uri: userInfo?.image || avatar }}
              className="w-12 h-12 rounded-full "
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* bottom section */}
      <View
        className="
                w-full
                bg-white
                px-4
                py-6
                rounded-3xl
                flex-1
                rounded-t-[50px]
                -mt-10
            "
      >
        <View
          className="
                    w-full px-4 py-4
                "
        >
          <View
            className="
                        w-full
                        px-4
                        flex-row
                        items-center
                        justify-between
                        py-3
                        rounded-xl
                        border
                        border-gray-200
                        space-x-3
                    "
          >
            {/* icons */}
            <Ionicons name="chatbubbles" size={24} color={"#777"} />
            {/* text input */}
            <TextInput
              className="flex-1 text-lg text-primaryText -mt-2 h-12 w-full"
              placeholder="Find user"
              placeholderTextColor={"#999"}
              value={addChat}
              onChangeText={(text) => setAtChat(text)}
            />
            {/* icon */}
            <TouchableOpacity onPress={createNewChat}>
              <FontAwesome name="search" size={24} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
      { filteredData && <FlatList
      className="w-full px-4 py-4"
        data={filteredData}
        renderItem={({ item }) => (
            <UserInfo receiverId={item.id} username={item.username} image={item.image} />
            // Adjust YourComponent as needed based on your data structure
        )}
        keyExtractor={(item) => item.id}
      /> }
      </View>
    </View>
  );
};

export default AddToChatScreen;
