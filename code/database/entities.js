var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CreateObjectId=(_id)=>{
    return new mongoose.Types.ObjectId(_id);
}

var CreateNewObjectId=()=>{
    return new mongoose.Types.ObjectId();
}

var ValidateMongoId=(_id)=>{
    return mongoose.Types.ObjectId.isValid(_id);
}

var appendZeroIfRequired=(val)=>{

    if(val.length==1)
        return `0${val}`;

    return val;
}

var customDateTimeStamp=()=>{
    var date=new Date();
    var dateNumber=`${date.getFullYear()}${appendZeroIfRequired(date.getMonth()+1)}${appendZeroIfRequired(date.getDate())}${appendZeroIfRequired(date.getHours())}${appendZeroIfRequired(date.getMinutes())}${appendZeroIfRequired(date.getSeconds())}`;

    return parseInt(dateNumber);
}

var UserSchema=new Schema({
    user_name:{
        type:String,
        trim:true,
        required:true
    },
    created:{
        type:Number,
        default:customDateTimeStamp()
    }
});

var SessionSchema=new Schema({
    token:{
        type:String,
        required:true,
        index:true
    },
    user:{
        type:Schema.ObjectId,
        ref:'user'
    },
    created:{
        type:Number,
        default:customDateTimeStamp()
    }
});

var ChatSchema=new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    chat_id:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    members:[{
        type:Schema.ObjectId,
        ref:'user'
    }],
    created:{
        type:Number,
        default:customDateTimeStamp()
    },
    modified:{
        type:Number,
        default:customDateTimeStamp()
    }
});

var MessageSchema=new Schema({
    text:{
        type:String,
        required:true,
        trimg:true
    },
    chat:{
        type:Schema.ObjectId,
        ref:'chat'
    },
    user:{
        type:Schema.ObjectId,
        ref:'user'
    },
    created:{
        type:Number,
        default:customDateTimeStamp()
    }
});

ChatSchema.index({chat_id:1,modified:1});

var Chat=mongoose.model("chat",ChatSchema);
var Session=mongoose.model("session",SessionSchema);
var User=mongoose.model("user",UserSchema);
var Message=mongoose.model("message",MessageSchema);

module.exports={
    Chat,
    Session,
    User,
    Message,
    CreateNewObjectId,
    CreateObjectId,
    ValidateMongoId
};