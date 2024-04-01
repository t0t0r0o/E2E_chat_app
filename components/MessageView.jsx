import React, { useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { getToken } from "../utils/storeToken";
import { avatars, API_BASE } from "../utils/supports";
const MessageView = ( props ) => {
  const { message,receiverId, image } = props;
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  console.log(image)
  
//   const users = JSON.parse(await getToken("user"));
  return (
    <ScrollView>
        <>

          {message.senderId !== receiverId ? <View className="m-1">
            <View
              style={{ alignSelf: "flex-end" }}
              className="
             px-4 
             py-2 
             rounded-tl-2xl 
             rounded-tr-2xl 
             rounded-bl-2xl
             bg-primary
             w-auto
             relative
         "
            >
              <Text className="text-base font-semibold text-white">
                {message?.messageDec || '<---Có lỗi xảy ra--->'}
              </Text>
            </View>
            {/* Time */}
            <View style={{ alignSelf: "flex-end" }}>
              <Text className="text-[12px] text-black font-semibold">
                {message.createdAt}
              </Text>
            </View>
          </View>
          : <View
            style={{ alignSelf: "flex-start" }}
            className="
         flex
         items-center
         justify-start
         space-x-2
     "
          >
            <View
              className="
             flex-row
             items-center
             justify-center
             space-x-2
         "
            >
              {/* avatar */}
              <Image
                className="w-12 h-12 rounded-full"
                resizeMode="cover"
                source={{ uri: image || avatar }}
              />
              {/* text */}
              <View className="m-1">
                <View
                  className="
                     px-4 
                     py-2 
                     rounded-tl-2xl 
                     rounded-tr-2xl 
                     rounded-bl-2xl
                     bg-gray-200
                     w-auto
                     relative
                 "
                >
                  <Text className="text-base font-semibold text-black">{message.messageDec || '<---Có lỗi xảy ra--->'}</Text>
                </View>
                {/* Time */}
                <View style={{ alignSelf: "flex-start" }}>
                  <Text className="text-[12px] text-black font-semibold">
                    {message.createdAt}
                  </Text>
                </View>
              </View>
            </View>
          </View>}
        </>
    </ScrollView>
  );
};

export default MessageView;
