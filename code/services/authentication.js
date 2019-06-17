const DbCrud = require('../database/functions');
const Entities = require('../database/entities');
const Constant = require('../utility/constant');
const Crypto = require('../utility/crypto');
const Logger = require('../utility/logger');
const _ = require('lodash');

var verifyToken = async (token)=>{

    Logger.WriteToLog(`Log in /service/chat.js - verifyToken() token: ${JSON.stringify(token)}`);
    let response = Constant.Response();

    let session = await DbCrud.getOnePopulated(Entities.Session,{token:token},['user']);

    Logger.WriteToLog(`Log in /service/chat.js - verifyToken() session: ${JSON.stringify(session)}`);

    if((session==null)){

        response.meta.code=Constant.StandardCodes.CLIENT_ERRORS.AUTHENTICATION_FAILED.Code;
        response.meta.error_message=Constant.StandardCodes.CLIENT_ERRORS.AUTHENTICATION_FAILED.Description;
        response.meta.error_type=Constant.StandardCodes.Types.CLIENT_ERRORS;
        response.data=["Token does not exist"];

        return response;

    }

    response.data = session.user;
    return response;

}

var login = async (req)=>{

    let response = Constant.Response();
    let model = req.body;

    Logger.WriteToLog(`Log in /service/chat.js - login() model: ${JSON.stringify(model)}`);

    let user = await DbCrud.getOne(Entities.User,{user_name:model.user_name});

    if(user==null){
        //if user does not exist then create user
        let new_user = {
            user_name:model.user_name
        };

        user = await DbCrud.saveOne(new Entities.User(new_user));
    }

    Logger.WriteToLog(`Log in /service/chat.js - login() user: ${JSON.stringify(user)}`);

    let jwttoken = Crypto.CreateToken(_.pick(user,['_id','user_name']),'serversecret');
    let token = Crypto.EncryptValue(jwttoken);
    let new_session={
        user:user._id,
        token:token
    };

    let session = await DbCrud.saveOne(new Entities.Session(new_session));
    session.user_id = user._id;
    session.user_name = model.user_name;
    Logger.WriteToLog(`Log in /service/chat.js - login() session: ${JSON.stringify(session)}`);
    response.data=_.pick(session,['token','created','user_id','user_name']);
    return response;
}

module.exports={
    verifyToken,
    login
}