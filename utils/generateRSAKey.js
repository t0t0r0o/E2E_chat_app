// import CryptoJS from 'react-native-crypto';
// const crypto = require('crypto');

import { savePrivateKey, getPrivateKey } from './keystore';
import {Crypt, RSA} from 'hybrid-crypto-js';
// import crypto from "crypto";

// export const  generateKeyPair = async () => {
//     const keus = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 2048,
//     publicKeyEncoding: {
//       type: 'spki',
//       format: 'pem',
//     },
//     privateKeyEncoding: {
//       type: 'pkcs8',
//       format: 'pem',
//     },
//   });
//     console.log(keus)
//     // let keys = await RSA.generate();
//     // return keys.public;
// }
export const generateKeyPairAsync = async () => {
  const rsa = new RSA();
  console.log(rsa)
  return new Promise((resolve, reject) => {
    console.log(rsa.generateKeyPair)
    rsa.generateKeyPair(function (keyPair) {
      if (keyPair) {
        resolve({
          privateKey: keyPair.privateKey,
          publicKey: keyPair.publicKey,
        });
      } else {
        reject(new Error('Failed to generate private key.'));
      }
    },
    1024);
  });
};
const crypt = new Crypt();
export const encryptKeyWithRSA = async (message, publicKey) => {
    const encrypted = crypt.encrypt(publicKey, message)
      
      console.log('Encrypted:', encrypted.toString('base64'));
    return  encrypted;
};

export const decryptKeyWithRSA = async (privateKeyName,message) => {
    const privateKey = await getPrivateKey(privateKeyName);
    // console.log(privateKey)
    const decrypted = crypt.decrypt(privateKey, message);

    // console.log('Khoa user la ', decrypted.message)
    return decrypted?.message || null;
};

// export {generateKeyPair}