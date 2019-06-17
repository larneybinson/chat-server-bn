var _ = require('lodash');

var arrayPick=(list,paths)=>{
    for(let index=0;index<list.length;index++){
        list[index]=_.pick(list[index],paths);
    }

    return list;
}

var objArrayToArray=(list,key)=>{
    let new_array = [];

    for(let index=0;index<list.length;index++){
        new_array.push(list[index][key]);
    }

    return new_array;
}

var randomString = (length)=>{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

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

module.exports={
    arrayPick,
    objArrayToArray,
    randomString,
    customDateTimeStamp
}