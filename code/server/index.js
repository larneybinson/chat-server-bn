var Mongoose=require('../database/mongoose');
var portNumber=process.env.PORT || 4545;
var Config=require('./config.json');

var Configuration=Config[Config.ConfigHost];
var mongoDbUri=Configuration.MongoUri;


Mongoose.Init(mongoDbUri);

const http=require('http');
const socket = require('socket.io');
const ChatService = require('../services/chat');
const AuthService = require('../services/authentication');
const Constant = require('../utility/constant');
const Logger = require('../utility/logger');

var Apis=(app)=>{

    app.get('/heartbeat',(req,res)=>{
        res.send('Alive');
    });

    app.post('/login',async(req,res)=>{
        try
        {
            res.send(await AuthService.login(req));
        }
        catch(err)
        {
            Logger.WriteToLog(err);
            res.status(500).send("Internal server error");
        }
    });

    app.use(async (req,res,next)=>{

        try
        {
            var requestData=`Request:\nUrl:${req.url}\nMethod:${req.method}\nBody:${req.body}\n*******************************`;
            Logger.WriteToLog(`Log in index.js - Middleware , requestData: ${JSON.stringify(requestData)}`);
            let response=await AuthService.verifyToken(req.headers.authorization);
            Logger.WriteToLog(`Log in index.js - Middleware , auth-service verifyToken(): ${JSON.stringify(response)}`);
            if(!Constant.IsGoodResponse(response)){
                res.send(response);
                return;
            }

            req.body.user=response.data;

            next();
        }
        catch(err)
        {
            Logger.WriteToLog(err);
            res.status(500).send("Internal server error");
        }

    });

    app.get('/chats',async(req,res)=>{
        try
        {
            res.send(await ChatService.getUserChats(req));
        }
        catch(err)
        {
            Logger.WriteToLog(err);
            res.status(500).send("Internal server error");
        }
    });

    app.get('/messages/:chat_id',async(req,res)=>{
        try
        {
            res.send(await ChatService.getMessages(req));
        }
        catch(err)
        {
            Logger.WriteToLog(err);
            res.status(500).send("Internal server error");
        }
    });

    app.get('/users',async(req,res)=>{
        try
        {
            res.send(await ChatService.getUsers(req));
        }
        catch(err)
        {
            Logger.WriteToLog(err);
            res.status(500).send("Internal server error");
        }
    });
    
    var server=http.createServer(app);
    const io = socket(server);
    let currentSockets = [];
    let currentUsers = [];

    io.use(async (socket,next)=>{
        //implement authentication layer here
        if (typeof(socket.handshake.query) != "undefined" && typeof(socket.handshake.query.token) != "undefined"){
            let response = await AuthService.verifyToken(socket.handshake.query.token);

            if(!Constant.IsGoodResponse(response)){
                next(new Error(response.data));
            }
            console.log('Authenticated socket connection',response);

            socket.decoded = response.data;
            next();
          } else {
              next(new Error('Authentication error'));
          } 
    });

    io.on('connection',(socket)=>{
        let user_name = socket.decoded.user_name;
        currentSockets.push({id:socket.id,user_name:user_name});
        console.log('New socket connection: ',socket.id);
        console.log('Current sockets: ',currentSockets);
        console.log("Decoded: ",socket.decoded);

        //this event needs to be fired from ui as soon as a user logins from ui
        console.log('Added new user with user_name: ',user_name);
        if(!currentUsers.includes(user_name)){
            currentUsers.push(user_name);
        }
        console.log(currentUsers);
        io.emit('currentusers',{count:currentUsers.length, currentUsers});

        socket.on('message',async (obj,callback)=>{
            obj.user_id=socket.decoded._id;
            obj.user_name=socket.decoded.user_name;
            let response = await ChatService.newMessage(obj);

            if(!Constant.IsGoodResponse(response)){
                return callback(response);
            }

            io.emit('new_message',response);
            callback(response);
        });

        socket.on('chat',async (obj,callback)=>{
            obj.user_id = socket.decoded._id;
            let response = await ChatService.initiateChat(obj);

            if(!Constant.IsGoodResponse(response)){
                return callback(response);
            }

            io.emit('new_chat',response);
            callback(response);

        })
       
        socket.on('disconnect',()=>{
            let toRemoveSocket = currentSockets.filter((socketInfo)=>{return socketInfo.id==socket.id})[0];
            currentSockets = currentSockets.filter((socketInfo)=>{return socketInfo.id!=socket.id});
            currentUsers = currentUsers.filter((user)=>{return user != toRemoveSocket.user_name});
            io.emit('currentusers',{count:currentUsers.length, currentUsers});
        });

    });


    server.listen(portNumber, () => {

        try
        {
            console.log(`Server is up and running on port: ${portNumber}`);
        }
        catch(err)
        {
            Utility.Logger.WriteToLog(err);
            throw Error(err);
        }

    });

}

module.exports={
    Apis
}
