import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {BGImage} from "../assets"
import { Logo } from "../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { Provider } from "react-redux";
import axios from "axios";
import { saveToken } from "../utils/storeToken";
import { API_BASE } from "../utils/supports";
import {generateKeyPair} from '../utils/generateRSAKey';


const LoginScreen = () => {
    const screenWidth = Math.round(Dimensions.get("window").width);

    const [email, setEmail] = useState("");
    const [password, setPassword] =useState("");
    const [getEmailValidationStatus, setGetEmailValidationSatus] =useState(false);
    const [errorMessage, setErrorMessage] =useState("");
    const navigation = useNavigation();

    const sendPublicKey = async () => {
        try {
            console.log('123456789')
            const {publicKey, privateKey} = await generateKeyPair()
            console.log(publicKey)
            
        } catch (err) {
            console.error('Error sending POST request:', err);
        }
    }

    const handleSubmit = async () => {
        try {
            if(!email || !password) {
                setErrorMessage("Missing information") 
                return;
            }
            if(!getEmailValidationStatus) {
                setErrorMessage("Email is in wrong format") 
                return;
            }
          const response = await axios.post(API_BASE + '/auth', {email,password});
          console.log("click")
          console.log(response.data)
          if(response.data.isSuccess) {
            await saveToken('token',response.data.data.token)
            await saveToken('user',JSON.stringify(response.data.data.user))
            // await sendPublicKey()
            navigation.navigate('HomeScreen')
          } 
        } catch (error) {
          // Xử lý lỗi ở đây
          console.error('Error sending POST request:', error);
        }
    };

    return(
        <View className="flex-1 items-center justify-start">
            <Image 
            source={BGImage} 
            resizeMode="cover" 
            className="h-96"
            style={{width: screenWidth }} 
            />
            {/* Main View */}
            <View className="
            w-full 
            h-full 
            bg-white 
            rounded-tl-[90px] -mt-44 
            flex
            items-center
            justify-start 
            py-6 
            px-6 
            space-y-6">
                {/* Logo */}
                <Image 
                    source={Logo}
                    className="
                        w-20
                        h-20
                        top-5
                        backgroundColor-transparent
                        opacity: 10"
                    resizeMode="cover"
                    
                />
                
                <Text className="py-2 
                text-primaryText
                text-xl
                font-semibold">
                    Welcome App!
                </Text>
                {errorMessage && <Text className="py-1 
                text-[#ed4337]
                text-base
                font-semibold">
                    {errorMessage}
                </Text>}
                <View className="w-full flex items-center justify-center">
                    {/* alert */}

                    {/* email */}
                    <UserTextInput 
                    placeholder="Email" 
                    isPass={false} 
                    setStateValue={setEmail}
                    setGetEmailValidationSatus={setGetEmailValidationSatus}
                    />

                    {/* password */}
                    <UserTextInput 
                    placeholder="Password" 
                    isPass={true} 
                    setStateValue={setPassword}
                    />

                    {/* login button */}
                    <TouchableOpacity
                    onPress={ handleSubmit} 
                    className="
                        w-60
                        px-4
                        py-2
                        rounded-xl
                        bg-primary
                        my-3
                        flex
                        items-center
                        justify-center">
                        <Text className="
                            py-2
                            text-white
                            text-xl
                            font-semibold
                        ">
                            Sign In
                        </Text>
                    </TouchableOpacity>

                    <View className="
                        w-full
                        p-12
                        flex-row
                        items-center
                        justify-center
                        space-x-2
                    ">
                        <Text className="
                            text-base
                            text-primaryText
                        ">
                            Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
                            <Text className="
                                text-base
                                font-semibold
                                text-primaryBold
                            ">
                                Creat Here
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default LoginScreen