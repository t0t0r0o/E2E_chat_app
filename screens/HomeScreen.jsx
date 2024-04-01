import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Logo } from "../assets";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE, avatars } from "../utils/supports";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { getToken } from "../utils/storeToken";
import axios from "axios";

const HomeScreen = () => {
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [listUser, setListUser] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const getUserInfo = async () => {
      const user = JSON.parse(await getToken("user"));
      setAvatar(user.image);
      setUserInfo(user);
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      const getRecentMessage = async () => {
        const token = await getToken("token");

        if (!userInfo || !token) {
          return;
        }
        try {
          console.log(API_BASE + "/recents/" + userInfo?.id);
          const response = await axios.get(
            API_BASE + "/recents/" + userInfo?.id,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "JWT " + token || null,
              },
            }
          );
          if (response.data.isSuccess) {
            console.log(response.data?.data);
            setListUser(response.data?.data.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      getRecentMessage();
    }
  }, [userInfo]);

  return (
    <View
      className="
            flex-1
        "
    >
      <SafeAreaView>
        {/* set logo & avatar */}
        <View
          className="
                    w-full
                    flex-row
                    items-center
                    justijy-between
                    px-6
                    py-2
                    
                "
        >
          <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
          <View className="w-60" />
          <TouchableOpacity
            className="
                        w-12
                        h-12
                        rounded-full
                        border
                        border-primary
                        flex
                        items-center
                        justify-center
                    "
          >
            <Image
              source={{ uri: userInfo?.image || avatar }}
              className="w-full h-full rounded-full "
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* scrolling area */}
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            {/* messages title */}
            <View
              className="
                            w-full
                            flex-row
                            items-center
                            justify-between
                            px-2
                        "
            >
              <Text
                className="
                                text-primaryText
                                text-base
                                font-extrabold
                                pb-2
                            "
              >
                Messages
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("AddToChatScreen")}
              >
                <Ionicons name="search" size={28} color="#555" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <>
                <View
                  className="
                                    w-full
                                    flex
                                    items-center
                                    justify-center
                                "
                >
                  <ActivityIndicator size={"large"} color={"#43C651"} />
                </View>
              </>
            ) : (
              <>
                {listUser && (
                  <FlatList
                    className="w-full px-4 py-4"
                    data={listUser}
                    renderItem={({ item }) => (
                      <MessageCard
                        user={item}
                      />
                      // Adjust YourComponent as needed based on your data structure
                    )}
                    keyExtractor={(item) => item.id}
                  />
                )}
                {/* <MessageCard />
                <MessageCard />
                <MessageCard />
                <MessageCard />
                <MessageCard />
                <MessageCard />
                <MessageCard />
                <MessageCard />
                <MessageCard />
                <MessageCard /> */}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
const MessageCard = (props) => {
    const {user} = props;
    const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatScreen", {receiverId: user?.id, username: user?.username})}
      className="
            w-full
            flex-row
            items-center
            justify-start
            py-2
        "
    >
      {/* images */}
      <View
        className="
                w-16
                h-16
                rounded-full
                flex
                items-center
                border-2
                border-primary
                p-1
                justify-center
            "
      >
        <Image
          className="rounded-full"
          source={{ uri: user?.image || avatar }}
          style={{ width: 60, height: 60 }}
        />
      </View>

      {/* content */}
      <View
        className="
                flex-1
                flex
                items-start
                justify-center
                ml-4
            "
      >
        <Text
          className="
                    text-[#333]
                    text-base
                    font-semibold
                    capitalize
                "
        >
          {user?.username || 'undefined'}
        </Text>
        <Text
          className="
                    text-primaryText
                    text-sm
                "
        >
          {/* {user?.createdAt || 'undefined'} */}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default HomeScreen;
