import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
const UserInfo = (props) => {
  const navigation = useNavigation();
  const { receiverId, username, image } = props;
  return (
    <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", {receiverId: receiverId, username: username, image: image})}>
      <View className="flex-row space-x-3 items-center py-3">
        <Image
          className="rounded-full"
          source={{ uri: image }}
          style={{ width: 60, height: 60 }}
        />
        <Text
          className="text-[#333]
                    text-xl
                    font-semibold
                    capitalize"
        >
          {username}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserInfo;
