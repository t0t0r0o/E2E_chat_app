
import * as SecureStore from 'expo-secure-store';



const savePrivateKey = async (keyName, privateKey) => {
  try {
    await SecureStore.setItemAsync(keyName, privateKey);
    console.log(`${keyName} key saved successfully.`);
  } catch (error) {
    console.error(`Error saving ${keyName} key:`, error);
  }
};

const getPrivateKey = async (keyName) => {
  try {
    const privateKey = await SecureStore.getItemAsync(keyName);
    if (privateKey) {
      console.log(`${keyName} key retrieved successfully:`, privateKey);
      return privateKey;
    } else {
      console.log(`No ${keyName} key found.`);
    }
    return;
  } catch (error) {
    console.error(`Error retrieving ${keyName} key:`, error);
  }
};

export { savePrivateKey, getPrivateKey };