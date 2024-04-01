import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ServerContainer, useNavigation } from "@react-navigation/native";
import {
  Entypo,
  FontAwesome5,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { avatars, API_BASE } from "../utils/supports";
import HomeScreen from "./HomeScreen";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native";
import { getToken, saveToken } from "../utils/storeToken";
import axios from "axios";
import { MessageSecure } from "../utils/MessageSecure";
import { decryptKeyWithRSA, encryptKeyWithRSA } from "../utils/generateRSAKey";
import MessageView from "../components/MessageView";

const ChatScreen = ({ route }) => {
  const { receiverId, username, image } = route.params;
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [keyHashPass, setKeyHashPass] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [messageDec, setMessageDec] = useState([]);

  const TextInputRef = useRef(null);

  const handKeyboardOpen = () => {
    if (TextInputRef.current) {
      TextInputRef.current.focus();
    }
  };

  useEffect(() => {
    const getMessage = async () => {
        const token = await getToken('token');
        const user = JSON.parse(await getToken('user'));

        if(!user || ! token || !receiverId){
            return;
        }
        try {
            console.log(API_BASE + '/message/'+user?.id+'/'+receiverId)
            const response = await axios.get(API_BASE + '/message/'+user?.id+'/'+receiverId, {headers: {
                "Content-Type": "application/json",
                Authorization: "JWT " + token || null,
              },});
              if(response.data.isSuccess) {
                // console.log(response.data?.data.data[0].hashpass)
                setMessageList(response.data?.data.data)
              }
        } catch(err) {
            console.log(err)
        }
    }
    getMessage()
  }, [handleSendMessage])

  useEffect(() => {
    if(messageList && messageDec) {
        (async () => {
            await decryptMessage();
          })();
    }
  },[messageList])

  const decryptMessage = async () => {
    const user = JSON.parse(await getToken("user"));
    if (!messageList) {
      return;
    }
    const decryptedMessages = [];

    for (const message of messageList) {
      console.log(user?.username + user?.id);
      console.log('keyhashpass' , keyHashPass);
      let pass = await getToken('receiver'+receiverId)
      
      if(!pass) {
        pass = await decryptKeyWithRSA(user?.username + user?.id, message?.hashpass);
        await saveToken('receiver'+receiverId,pass)
      }
      setKeyHashPass(pass)
      const messageSecure = new MessageSecure(message?.message, pass);
      const messageDec = await messageSecure.decryptMessage();

      decryptedMessages.push({ messageDec, ...message });
      console.log({ messageDec, ...message })
    }
    console.log(decryptedMessages)
    setMessageDec(decryptedMessages)
  };

  const getPublicKey = async () => {
    const token = await getToken("token");
    try {
      const response = await axios.get(
        API_BASE + "/keys/" + username + receiverId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "JWT " + token || null,
          },
        }
      );
      if (response.data.isSuccess) {
        // console.log("Key: " + response.data?.data?.key )
        return response.data?.data?.key;
      }
      return;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendMessage = async () => {
    // await decryptMessage();
    const token = await getToken("token");
    const users = JSON.parse(await getToken("user"));
    console.log({ users });
    const publicKey = await getPublicKey();
    if (!message || !users) {
      return;
    }
    let encryptMessage = "";
    let keyEncryptMessage = "";
    let messageEncrypted = "";
    if (!keyHashPass) {
      // trong trường hợp là người mới, chưa có khóa đối xứng để mã hóa
      const messageSecure = new MessageSecure(message);
      //   console.log(messageSecure);
      encryptMessage = messageSecure.encryptMessage;
      keyEncryptMessage = messageSecure.encryptKey;
      setKeyHashPass(keyEncryptMessage);
      await saveToken('receiver'+receiverId, keyEncryptMessage);
      messageEncrypted = encryptMessage();
      //   console.log({ keyEncryptMessage, messageEncrypted });
    } else {
      // đã có khóa đối xứng
      const keyToHash =  await getToken('receiver'+receiverId);
      const messageSecure = new MessageSecure(message, keyToHash);
      encryptMessage = messageSecure.encryptMessage;
      keyEncryptMessage = messageSecure.encryptKey;
      messageEncrypted = encryptMessage();
      //   console.log({ keyEncryptMessage, messageEncrypted });
    }
    const encryptedKey = await encryptKeyWithRSA(keyEncryptMessage, publicKey);
    // const decrpytedKey = await decryptKeyWithRSA(users?.username+ users?.id,encryptedKey)
    // console.log({decrpytedKey})
    const userid = users?.id;
    try {
      //   console.log({ messageEncrypted, encryptedKey, userid, receiverId });
      const response = await axios.post(
        API_BASE + "/message",
        {
          message: messageEncrypted,
          hashpass: encryptedKey,
          sender: userid,
          receiver: receiverId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "JWT " + token || null,
          },
        }
      );

      if (response.data.isSuccess) {
        const senderData = {...response.data.data.data, messageDec: message}
        console.log(senderData);
        setMessageDec((prevMessages) => [...prevMessages, senderData])
        console.log('messs')
        console.log(messageDec)
        setMessage("")
      }
    } catch (error) {
      // Xử lý lỗi ở đây
      console.error("Error handle send message request:", error);
    }
  };


  return (
    <View className="flex-1">
      <View className="w-full bg-primary px-4 py-6 flex-[0.2] ">
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
          <View
            className="
                        flex-row
                        items-center
                        justify-center
                        space-x-3
                    "
          >
            <View
              className="
                            w-12
                            h-12
                            rounded-full
                            border
                            border-white
                            flex
                            items-center
                            justify-center
                        "
            >
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>
            <View>
              <Text
                className="
                                text-gray-50
                                text-base
                                font-semibold
                                capitalize
                            "
              >
                {username}
              </Text>
              <Text
                className="
                                text-gray-100
                                text-sm
                                font-semibold
                                capitalize
                            "
              >
                {/* Status */} Online
              </Text>
            </View>
          </View>
          {/* last section */}
          <View
            className="
                        flex-row
                        items-center
                        justify-center
                        space-x-3
                    "
          >
            <TouchableOpacity>
              <FontAwesome5 name="video" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome5 name="phone" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={24} color="#fbfbfb" />
            </TouchableOpacity>
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
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          {messageDec && (
            <FlatList
              className="w-full py-4"
              data={messageDec}
              renderItem={({ item }) => (
                <MessageView message={item} receiverId={receiverId} image={image}/>
                // Adjust YourComponent as needed based on your data structure
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
          <View className="w-full flex-row items-center justify-center px-8">
            <View
              className="
                            bg-gray-200 
                            rounded-2xl 
                            px-4 
                            space-x-4 
                            py-2 
                            flex-row 
                            items-center 
                            justify-center
                        "
            >
              <TouchableOpacity onPress={handKeyboardOpen}>
                <Entypo name="emoji-happy" size={24} color="#555" />
              </TouchableOpacity>
              <TextInput
                className="flex-1 h-8 text-base text-primaryText font-semibold"
                placeholder="Type here..."
                placeholderTextColor={"#999"}
                value={message}
                onChangeText={(text) => setMessage(text)}
              />
              <TouchableOpacity>
                <Entypo name="mic" size={24} color="#43C651" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="pl-4" onPress={handleSendMessage}>
              <FontAwesome name="send" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
