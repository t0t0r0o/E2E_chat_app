import * as SecureStore from 'expo-secure-store';

// Save token
export const saveToken = async (key,value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Retrieve token
export const getToken = async (key) => {
  try {
    const token = await SecureStore.getItemAsync(key);
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
  }
};

// Clear token
export const clearToken = async () => {
  try {
    await SecureStore.deleteItemAsync('token');
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

