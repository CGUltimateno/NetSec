import CryptoJS from 'crypto-js';

const secretKey = 'YWGbHGpyfKZflZ2vy9gQn1+e2Rdqbx3aRVjsomaOum/FQA1m0KKDCyhi0sZPtrQ0';
const secretIV = 'aifjaoeifjo';
const encMethod = 'aes-256-cbc';

const key = CryptoJS.SHA512(secretKey).toString().substring(0, 32);
const encIv = CryptoJS.SHA512(secretIV).toString().substring(0, 16)


const encrypt = (text) => {
    const cipherText = CryptoJS.AES.encrypt(text, key, { iv: encIv });
    return cipherText.toString();
}