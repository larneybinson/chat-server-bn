var fs=require('fs');
var Config = require('../server/config.json');

var Configuration=Config[Config.ConfigHost];

var writeToLog=(text)=>{

    text=`${new Date().toUTCString()} - ${text}`;

    console.log(text);

    fs.appendFileSync(Configuration.LogFilePath,text+'\n*****\n',(err)=>{

        if(err){
            console.log(`Error while logging ${err}`);
            return;
        }

    });
}

module.exports={
    WriteToLog:writeToLog
}

