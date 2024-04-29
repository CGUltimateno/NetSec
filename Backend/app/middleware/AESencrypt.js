import CryptoJS from 'crypto-js';

const secretKey = 'aelwfhlaef';
const secretIV = 'aifjaoeifjo';
const encMethod = 'aes-256-cbc';

const key = crypto.createHash('sha512').update(secretKey).digest('hex').substring(0,32)
const encIv = crypto.createHash('sha512').update(secretIV).digest('hex').substring(0,16)

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(encMethod, key, encIv)
    const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    return Buffer.from(encrypted).toString('base64')
}