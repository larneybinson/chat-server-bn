const Constant = require('../utility/constant');
const Entities = require('../database/entities');
const DbCrud = require('../database/functions');
const Logger = require('../utility/logger');
const Functions = require('../utility/functions');

var initiateChat = async (model)=>{

    let response = Constant.Response();

    //expecting name, user_names, user_id
    Logger.WriteToLog(`Log in /service/chat.js - initiateChat() model: ${JSON.stringify(model)}`);

    if(model.user_names.length==1){
        Logger.WriteToLog(`Log in /service/chat.js - initiateChat() creating chat with single user`);
        //if only a single chat is being created then  we will check if there exist a chat or not
        let user = await DbCrud.getOne(Entities.User,{user_name:model.user_names[0]});

        Logger.WriteToLog(`Log in /service/chat.js - initiateChat() user: ${JSON.stringify(user)}`);

        let chats  = await DbCrud.getMany(Entities.Chat,{
            members:{
                $elemMatch:{
                    $eq:Entities.CreateObjectId(user._id)
                }
            }
        });

        Logger.WriteToLog(`Log in /service/chat.js - initiateChat() chats: ${JSON.stringify(chats)}`);

        let oldChat=null;
        for(let index=0;index<chats.length;index++){

            if(chats[index].members.length==2 && chats[index].members.includes(Entities.CreateObjectId(user._id)) && chats[index].members.includes(model.user_id)){
                oldChat=chats[index];
                oldChat.modified = Functions.customDateTimeStamp();
                await oldChat.save();
                break;
            }

        }

        Logger.WriteToLog(`Log in /service/chat.js - initiateChat() oldChat: ${JSON.stringify(oldChat)}`);

        if(oldChat!=null){
            response.data = {
                members:oldChat.members,
                chat_id:oldChat.chat_id
            }

            return response;
        }

    }

    let query=[{
            $match:{
                'user_name':{
                    $in:model.user_names
                }
            }
        },{
            $project:{
                "_id":1
            }
        }];

    let users = await DbCrud.getAggregate(Entities.User,query);
    let ids =  Functions.objArrayToArray(users,'_id');
    ids.push(model.user_id);
    let chat_id = Functions.randomString(7);

    let new_chat = {
        name:model.name,
        chat_id:chat_id,
        members:ids
    };

    let status = await DbCrud.saveOne(new Entities.Chat(new_chat));

    Logger.WriteToLog(`Log in /service/chat.js - initiateChat() status: ${JSON.stringify(status)}`);

    response.data = {
        chat_id,
        members:ids
    };
    return response;
}

var newMessage = async (model)=>{

    let response = Constant.Response();

    //expecting text,chat_id,user_id

    let chat = await DbCrud.getOne(Entities.Chat, {chat_id:model.chat_id});

    Logger.WriteToLog(`Log in /service/chat.js - newMessage() chat: ${JSON.stringify(chat)}`);

    if(chat==null){

        response.meta.code=Constant.StandardCodes.CLIENT_ERRORS.BAD_REQUEST.Code;
        response.meta.error_message=Constant.StandardCodes.CLIENT_ERRORS.BAD_REQUEST.Description;
        response.meta.error_type=Constant.StandardCodes.Types.CLIENT_ERRORS;
        response.data=["Chat does not exist"];

        return response;
    }

    let new_message={
        text:model.text,
        chat:chat._id,
        user:model.user_id
    };

    chat.modified = Functions.customDateTimeStamp();
    await chat.save();
    let status = await DbCrud.saveOne(new Entities.Message(new_message));
    Logger.WriteToLog(`Log in /service/chat.js - newMessage() status: ${JSON.stringify(status)}`);
    
    response.data = _newData(model.text,model.user_name,model.chat_id);

    Logger.WriteToLog(`Log in /service/chat.js - newMessage() response: ${JSON.stringify(response)}`);
    return response;

}

var _newData=(text,user_name,chat_id)=>{
    console.log(text,user_name,chat_id);
    return {
        user_name:user_name,
        text:text,
        chat_id:chat_id,
        user:{
            user_name:user_name
        }
    }
};

var getUserChats = async(req)=>{

    let user_id = req.body.user._id;
    Logger.WriteToLog(`Log in /service/chat.js - getUserChats() user_id: ${JSON.stringify(user_id)}`);

    let chats  = await DbCrud.getManySorted(Entities.Chat,{
        members:{
            $elemMatch:{
                $eq:Entities.CreateObjectId(user_id)
            }
        }
    },{
        modified:-1
    });

    let response = Constant.Response();
    Logger.WriteToLog(`Log in /service/chat.js - getUserChats() chats: ${JSON.stringify(chats)}`);
    response.data = chats;
    return response;

}

var getMessages = async (req)=>{

    let response = Constant.Response();
    let chat_id = req.params.chat_id;
    Logger.WriteToLog(`Log in /service/chat.js - getUserChats() chat_id: ${JSON.stringify(chat_id)}`);

    let chat = await DbCrud.getOne(Entities.Chat,{chat_id:chat_id});
    let messages = await DbCrud.getManyPopulated(Entities.Message,{chat:chat._id},['user']);
    messages.reverse();
    response.data=messages;
    return response;
}

var getUsers = async (req)=>{

    let response = Constant.Response();

    let users = await DbCrud.getMany(Entities.User,{});

    users = users.filter((user)=>{return user.user_name!=req.body.user.user_name});

    response.data=users;
    return response;

}

module.exports={
    newMessage,
    initiateChat,
    getUserChats,
    getMessages,
    getUsers
}