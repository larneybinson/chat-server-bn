const crypto=require('crypto');
const cryptoJs=require('crypto-js');
const jwt=require('jsonwebtoken');

var Config=require('../server/config.json');

var Configuration=Config[Config.ConfigHost];

var createHash=function(value){
    var hash=cryptoJs.SHA256(value);
    return hash.toString();
}

var createToken=function(data,serverSecret){
    var token=jwt.sign(data,serverSecret);
    return token;
}

var getTokenDataSync=async function(token,serverSecret){
    try{
        return jwt.verify(token,serverSecret);
    }catch(err){
        throw Error(err);
    }
}

var getTokenData=function(token,serverSecret){

    return new Promise((resolve,reject)=>{
        jwt.verify(token,serverSecret,(err,data)=>{
            if(err){
                reject(false);
                return;
            }
            resolve(data);
        });
    });
}

var encryptValue=(value)=> {
    var cipher=crypto.createCipher('aes-128-cbc',Configuration["KeyEncryptionPassword"]);
    var encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

var decryptKey=(key)=>{

    try
    {
        var cipher=crypto.createDecipher('aes-128-cbc',Configuration["KeyEncryptionPassword"]);
        var decrypted=cipher.update(key,'hex','utf8');
        decrypted+=cipher.final('utf8');

        return decrypted;
    }
    catch(err)
    {
        return "";
    }
}

module.exports={
    CreateHash:createHash,
    CreateToken:createToken,
    GetTokenData:getTokenData,
    GetTokenDataSync:getTokenDataSync,
    EncryptValue:encryptValue,
    DecryptKey:decryptKey
}