import CryptoJS from "crypto-js";
import { decryptKeyWithRSA } from "./generateRSAKey";
// import 'react-native-get-random-values';
import { generateRandomString } from "./supports";

export class MessageSecure {
    constructor(message, key = null) {
      this.message = message;
      this.encryptKey = key || this.createKeyEncryptMessage();
    }
  
    createKeyEncryptMessage = () => {
      const randomString = generateRandomString(64);
      return randomString;
    };
  
    encryptMessage = () => {
        console.log(this.encryptKey)
      const encrypted =  CryptoJS.AES.encrypt(this.message, this.encryptKey);
      return encrypted.toString();
    };
  
    decryptMessage = async () => {
      const decrypted = CryptoJS.AES.decrypt(this.message, this.encryptKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    };
}
