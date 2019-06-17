var Logger=require('./logger');

var Values={
    "BadRequestErrors":{
    },
    "StatusCodes":{
        "BadRequest":400,
        "OK":200,
        "InternalServerError":500,
        "NotFound":404,
        "Conflict":409,
        "Unauthorized":401
    },
    "InvalidRequestErrors":{
    },
    "ServerErrors":{
        "CouldNotCreate":"Could not be created",
        "InternalServerError":"Server error occured"
    },
    "SuccessMessages":{
    }
};

var StandardCodes={
    "Types":{
        "DATABASE_ERRORS":"DATABASE_ERRORS",
        "CLIENT_ERRORS":"CLIENT_ERRORS",
        "SUCCESS":"SUCCESS",
        "FTP":"FTP",
        "SERVER_ERRORS":"SERVER_ERRORS",
        "INFORMATIONAL_ERRORS":"INFORMATIONAL_ERRORS"
    },
    "DATABASE_ERRORS":{
        "MONGOOSE_FAILED":{
            "Code":"1001",
            "Description":"Mongoose failed while executing"
        },
        "MONGOOSE_CONNECTION_ERROR":{
            "Code":"1002",
            "Description":"Connection failed with mongo db"
        },
        "SQL_FAILED":{
            "Code":"1011",
            "Description":"SQL failed while executing"
        },
        "SQL_CONNECTION_ERROR":{
            "Code":1012,
            "Description":"Connection failed with SQL db"
        },
        "REDIS_FAILED":{
            "Code":"1021",
            "Description":"Redis failed while executing"
        },
        "REDIS_CONNECTION_FAILED":{
            "Code":1022,
            "Description":"Connection failed with redis"
        }
    },
    "CLIENT_ERRORS":{
        "BAD_REQUEST":{
            "Code":"2000",
            "Description":"Validation failed for request"
        },
        "AUTHENTICATION_FAILED":{
            "Code":2001,
            "Description":"Authentication failed"
        },
        "AUTHORIZATION_FAILED":{
            "Code":2002,
            "Description":"Authorization failed"
        },
        "NOT_FOUND":{
            "Code":2003,
            "Description":"Url not found"
        },
        "UNSUPPORTED_MEDIA":{
            "Code":2004,
            "Description":"Media format not supported"
        },
        "UNIQUENESS_VIOLATION":{
            "Code":2005,
            "Description":"Same entity already exists"
        }
    },
    "SUCCESS":{
        "OK":{
            "Code":3000,
            "Description":"Everything went well"
        },
        "PROGRESS":{
            "Code":3001,
            "Description":"Request still in progress at server, check back later"
        }
    },
    "FTP":{

    },
    "SERVER_ERRORS":{
        "INTERNAL_SERVER_ERROR":{
            "Code":5000,
            "Description":"Internal server error occurred"
        },
        "GATEWAY_FAILED":{
            "Code":5001,
            "Description":"Bad gateway"
        },
        "JWT_PARSE_ERROR":{
            "Code":5002,
            "Description":"Error occurred while JWT signing"
        },
        "FILE_UPLOAD_ERROR":{
            "Code":5003,
            "Description":"Error in uploading file"
        }
    },
    "INFORMATIONAL_ERRORS":{
        "SERVER_NOT_AVAILABLE":{
            "Code":6001,
            "Description":"Server is not available yet"
        },
        "VERIFICATION_NOT_POSSIBLE":{
            "Code":6002,
            "Description":"Verification not done"
        }
    }
};

var response=()=>{

    return {
        "meta": {
            "error_type": "",
            "code": 3000,
            "error_message": ""
        },
        "data": null,
        "pagination": {
            "next_url": null,
            "next_max_id": null
        }
    };

}

var isGoodResponse=(response)=>{
    Logger.WriteToLog(`Log in constant.js -> isGoodResponse() - response: ${JSON.stringify(response)}`);
    return response.meta.code == StandardCodes.SUCCESS.OK.Code;

}

var userTypes=()=>{
    return ["Regular","Manager","Admin"];
}


module.exports={
    Values,
    StandardCodes,
    Response:response,
    UserTypes:userTypes,
    IsGoodResponse:isGoodResponse
};